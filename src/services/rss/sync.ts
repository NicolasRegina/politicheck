import fs from 'node:fs';
import path from 'node:path';
import type { Article } from '../../types';
import { RSS_FEEDS } from './sources';
import { parseFeed } from './parser';
import { isRelevantToArgentina } from './filters';

export interface SyncResult {
  timestamp: string;
  totalFetched: number;
  uniqueArticles: number;
  newArticlesCount?: number;
  foreignArticlesCount?: number;
  outletsCoverage: Record<string, number>;
  articles: Article[];
  foreignArticles: Article[];
}

const CACHE_FILE_PATH = path.resolve(process.cwd(), 'src/data/live_articles.json');
const FOREIGN_CACHE_FILE_PATH = path.resolve(process.cwd(), 'src/data/foreign_articles.json');

export async function syncAllRssFeeds(): Promise<SyncResult> {
  console.log(`[RSS Sync] Starting parallel fetch of ${RSS_FEEDS.length} official feeds (national and international)...`);
  const startTime = Date.now();

  const results = await Promise.allSettled(
    RSS_FEEDS.map(feed => parseFeed(feed))
  );

  const nationalArticles: Article[] = [];
  const foreignArticles: Article[] = [];
  const outletsCoverage: Record<string, number> = {};

  results.forEach((res, idx) => {
    const feed = RSS_FEEDS[idx];
    if (res.status === 'fulfilled') {
      const articles = res.value;
      outletsCoverage[feed.outletId] = (outletsCoverage[feed.outletId] || 0) + articles.length;

      if (feed.category === 'internacional') {
        // Filter international articles to retain only those covering Argentina, its leaders, and economy
        const relevant = articles.filter(art => isRelevantToArgentina(art));
        foreignArticles.push(...relevant);
      } else {
        nationalArticles.push(...articles);
      }
    } else {
      console.warn(`[RSS Sync] Failed feed ${feed.id}:`, res.reason);
    }
  });

  // De-duplicate by URL or normalized Title
  function deduplicate(list: Article[]): Article[] {
    const seenUrls = new Set<string>();
    const seenTitles = new Set<string>();
    const unique: Article[] = [];

    for (const art of list) {
      const cleanUrl = art.url.split('?')[0].toLowerCase();
      const normalizedTitle = art.title.toLowerCase().replace(/[^a-z0-9]/gi, '').slice(0, 40);

      if (!seenUrls.has(cleanUrl) && !seenTitles.has(normalizedTitle)) {
        seenUrls.add(cleanUrl);
        seenTitles.add(normalizedTitle);
        unique.push(art);
      }
    }
    return unique;
  }

  const uniqueNational = deduplicate(nationalArticles);
  const uniqueForeign = deduplicate(foreignArticles);
  const combinedArticles = [...uniqueNational, ...uniqueForeign];

  // Check how many are genuinely new compared to existing cache
  const existingArticles = getCachedArticles();
  const existingUrls = new Set(existingArticles.map(a => a.url.split('?')[0].toLowerCase()));
  const newArticlesCount = combinedArticles.filter(a => !existingUrls.has(a.url.split('?')[0].toLowerCase())).length;

  const syncResult: SyncResult = {
    timestamp: new Date().toISOString(),
    totalFetched: nationalArticles.length + foreignArticles.length,
    uniqueArticles: combinedArticles.length,
    newArticlesCount,
    foreignArticlesCount: uniqueForeign.length,
    outletsCoverage,
    articles: combinedArticles,
    foreignArticles: uniqueForeign
  };

  try {
    const dir = path.dirname(CACHE_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(syncResult, null, 2), 'utf-8');
    fs.writeFileSync(FOREIGN_CACHE_FILE_PATH, JSON.stringify(uniqueForeign, null, 2), 'utf-8');
    console.log(`[RSS Sync] Saved ${combinedArticles.length} unique articles (${uniqueForeign.length} foreign on Argentina) in ${Date.now() - startTime}ms`);
  } catch (err) {
    console.error('[RSS Sync] Failed to write cache files:', err);
  }

  return syncResult;
}

export function getCachedArticles(): Article[] {
  try {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const content = fs.readFileSync(CACHE_FILE_PATH, 'utf-8');
      const data: SyncResult = JSON.parse(content);
      return data.articles || [];
    }
  } catch (err) {
    console.warn('[RSS Sync] Could not read cache file, fallback to empty:', err);
  }
  return [];
}

export function getCachedForeignArticles(): Article[] {
  try {
    if (fs.existsSync(FOREIGN_CACHE_FILE_PATH)) {
      const content = fs.readFileSync(FOREIGN_CACHE_FILE_PATH, 'utf-8');
      return JSON.parse(content) || [];
    }
  } catch (err) {
    console.warn('[RSS Sync] Could not read foreign cache file, fallback to empty:', err);
  }
  return [];
}
