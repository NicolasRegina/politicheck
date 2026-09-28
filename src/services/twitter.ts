import { TwitterApi } from 'twitter-api-v2';
import type { StoryCluster } from '../types';
import { getCachedClusteredStories } from './ai/clustering';
import { detectBreakingNews } from './breaking';
import { getCachedArticles } from './rss/sync';
import fs from 'node:fs';
import path from 'node:path';

export interface TweetResult {
  success: boolean;
  skipped?: boolean;
  reason?: string;
  tweetId?: string;
  tweetUrl?: string;
  tweetText: string;
  storyId?: string;
}

const LAST_TWEETED_PATH = path.join(process.cwd(), 'src', 'data', 'last_tweeted.json');

interface LastTweetedData {
  lastStoryId: string | null;
  lastTweetId: string | null;
  lastTweetedAt: string | null;
}

function getLastTweetedData(): LastTweetedData {
  try {
    if (fs.existsSync(LAST_TWEETED_PATH)) {
      const raw = fs.readFileSync(LAST_TWEETED_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('[Twitter Bot] Error reading last_tweeted.json:', err);
  }
  return { lastStoryId: null, lastTweetId: null, lastTweetedAt: null };
}

function saveLastTweetedData(data: LastTweetedData): void {
  try {
    fs.writeFileSync(LAST_TWEETED_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Twitter Bot] Error saving last_tweeted.json:', err);
  }
}

/**
 * Returns TwitterApi client instance if environment credentials exist
 */
export function getTwitterClient(): TwitterApi | null {
  const appKey = process.env.TWITTER_API_KEY || process.env.TWITTER_CONSUMER_KEY;
  const appSecret = process.env.TWITTER_API_SECRET || process.env.TWITTER_CONSUMER_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

  if (!appKey || !appSecret || !accessToken || !accessSecret) {
    return null;
  }

  return new TwitterApi({
    appKey,
    appSecret,
    accessToken,
    accessSecret,
  });
}

/**
 * Calculates Twitter-weighted character length (URLs count as 23 chars)
 */
export function getTwitterLength(text: string): number {
  // Replace URLs with 23-char placeholder for t.co estimation
  const urlRegex = /https?:\/\/\S+/g;
  const withoutUrls = text.replace(urlRegex, '12345678901234567890123');
  return Array.from(withoutUrls).length;
}

/**
 * Formats a high-engagement, viral tweet optimized for 280 characters
 */
export function formatViralStoryTweet(story: StoryCluster, isBreaking = false, baseUrl = 'https://politicheck.com.ar'): string {
  const storyUrl = `${baseUrl}/historia/${story.id}`;
  const headline = story.neutralHeadline || (story as any).title || 'Cobertura periodística del día';
  const ofi = Math.round(story.spectrum?.oficialismoPct ?? (story.spectrum as any)?.proGovernment ?? 0);
  const cen = Math.round(story.spectrum?.centroDatosPct ?? (story.spectrum as any)?.center ?? 0);
  const opo = Math.round(story.spectrum?.oposicionPct ?? (story.spectrum as any)?.opposition ?? 0);

  // Get distinct outlet names from articles
  const outlets = Array.from(new Set((story.articles || []).map(a => a.outletName || (a as any).outlet || 'Medios'))).slice(0, 3);
  const outletsStr = outlets.length > 0 ? outlets.join(', ') : 'los principales medios';

  const prefix = isBreaking ? '🚨 ÚLTIMO MOMENTO' : '🗞️ TAPA DEL DÍA';
  
  // Format options with decreasing length if needed
  let tweet = `${prefix} | ${headline}\n\n`;
  tweet += `Mirá cómo titulan ${outletsStr}:\n`;
  tweet += `📊 Espectro: 🟣 ${ofi}% | 🟢 ${cen}% | 🟠 ${opo}%\n\n`;
  tweet += `👉 Leé la comparativa sin sesgo en vivo:\n${storyUrl}`;

  // If over 270 chars, trim the headline cleanly
  if (getTwitterLength(tweet) > 270) {
    const availableTitleLength = Math.max(40, headline.length - (getTwitterLength(tweet) - 270));
    const trimmedTitle = headline.slice(0, availableTitleLength).trim() + '...';
    
    tweet = `${prefix} | ${trimmedTitle}\n\n`;
    tweet += `📊 Espectro: 🟣 ${ofi}% | 🟢 ${cen}% | 🟠 ${opo}%\n\n`;
    tweet += `👉 Comparativa en vivo:\n${storyUrl}`;
  }

  return tweet;
}

/**
 * Publishes a story to X (@politicheck_ok)
 */
export async function publishStoryTweet(
  story: StoryCluster, 
  isBreaking = false,
  options: { force?: boolean; baseUrl?: string } = {}
): Promise<TweetResult> {
  const baseUrl = options.baseUrl || 'https://politicheck.com.ar';
  const tweetText = formatViralStoryTweet(story, isBreaking, baseUrl);
  const lastTweeted = getLastTweetedData();

  // Deduplication check: do not tweet the same story unless forced
  if (!options.force && lastTweeted.lastStoryId === story.id) {
    console.log(`[Twitter Bot] Story ${story.id} was already tweeted at ${lastTweeted.lastTweetedAt}. Skipping.`);
    return {
      success: true,
      skipped: true,
      reason: `Story ${story.id} already tweeted on ${lastTweeted.lastTweetedAt}`,
      tweetText,
      storyId: story.id,
      tweetId: lastTweeted.lastTweetId || undefined
    };
  }

  const client = getTwitterClient();

  if (!client) {
    console.warn('[Twitter Bot] Twitter API credentials not configured in environment. Post simulated.');
    return {
      success: true,
      skipped: true,
      reason: 'Faltan variables de entorno TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET.',
      tweetText,
      storyId: story.id
    };
  }

  try {
    const rwClient = client.readWrite;
    const response = await rwClient.v2.tweet(tweetText);

    const tweetId = response.data.id;
    const tweetUrl = `https://x.com/politicheck_ok/status/${tweetId}`;

    // Update last tweeted tracker
    saveLastTweetedData({
      lastStoryId: story.id,
      lastTweetId: tweetId,
      lastTweetedAt: new Date().toISOString()
    });

    console.log(`[Twitter Bot] Tweet successfully published! ID: ${tweetId} -> ${tweetUrl}`);

    return {
      success: true,
      tweetId,
      tweetUrl,
      tweetText,
      storyId: story.id
    };
  } catch (err: any) {
    console.error('[Twitter Bot] Failed to post tweet to X API:', err?.data || err?.message || err);
    return {
      success: false,
      reason: err?.data?.detail || err?.message || 'Error al conectar con la API de X',
      tweetText,
      storyId: story.id
    };
  }
}

/**
 * Automates finding the latest top story / breaking news and tweeting it
 */
export async function autoTweetLatestStory(options: { force?: boolean; baseUrl?: string } = {}): Promise<TweetResult> {
  const stories = getCachedClusteredStories();
  const articles = getCachedArticles();

  if (!stories || stories.length === 0) {
    return {
      success: false,
      reason: 'No hay historias clusterizadas disponibles para tuitear',
      tweetText: ''
    };
  }

  // Check if there is an active breaking alert
  const breakingAlert = detectBreakingNews(stories, articles);
  if (breakingAlert && breakingAlert.story) {
    console.log(`[Twitter Bot] Detected breaking alert for story ${breakingAlert.story.id}. Priority tweeting.`);
    return publishStoryTweet(breakingAlert.story, true, options);
  }

  // Otherwise, tweet the grand lead story (Tapa del Día)
  const leadStory = stories.find(s => s.isLeadStory || (s as any).isLead) || stories[0];
  return publishStoryTweet(leadStory, false, options);
}
