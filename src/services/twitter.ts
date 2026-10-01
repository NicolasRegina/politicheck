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

function getEnvVar(key: string): string {
  if (process.env[key]) return process.env[key]!;
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.[key]) {
    return (import.meta as any).env[key];
  }
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const regex = new RegExp(`^${key}=(.+)$`, 'm');
      const match = content.match(regex);
      if (match && match[1]) return match[1].trim();
    }
  } catch (e) {}
  return '';
}

/**
 * Returns TwitterApi client instance if environment credentials exist
 */
export function getTwitterClient(): TwitterApi | null {
  const appKey = getEnvVar('TWITTER_API_KEY') || getEnvVar('TWITTER_CONSUMER_KEY');
  const appSecret = getEnvVar('TWITTER_API_SECRET') || getEnvVar('TWITTER_CONSUMER_SECRET');
  const accessToken = getEnvVar('TWITTER_ACCESS_TOKEN');
  const accessSecret = getEnvVar('TWITTER_ACCESS_TOKEN_SECRET');

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

  // If over 265 chars, trim the headline cleanly at word boundary
  if (getTwitterLength(tweet) > 265) {
    const availableTitleLength = Math.max(40, headline.length - (getTwitterLength(tweet) - 258));
    let sliced = headline.slice(0, availableTitleLength);
    const lastSpace = sliced.lastIndexOf(' ');
    if (lastSpace > 35) sliced = sliced.slice(0, lastSpace);
    const trimmedTitle = sliced.trim().replace(/[,.:;]+$/, '') + '...';
    
    tweet = `${prefix} | "${trimmedTitle}"\n\n`;
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
 * Post custom tweet text from Editorial Control Center
 */
export async function postCustomTweet(tweetText: string): Promise<TweetResult> {
  const client = getTwitterClient();
  if (!client) {
    console.warn('[Twitter Bot] Twitter credentials not configured. Simulating tweet post.');
    return {
      success: false,
      reason: 'Credenciales de Twitter no configuradas en entorno. Modo simulación.',
      tweetText
    };
  }

  try {
    const { data: createdTweet } = await client.v2.tweet(tweetText);
    const tweetId = createdTweet.id;
    const tweetUrl = `https://x.com/politicheck_ok/status/${tweetId}`;

    saveLastTweetedData({
      lastStoryId: 'custom_editorial_post',
      lastTweetId: tweetId,
      lastTweetedAt: new Date().toISOString()
    });

    return {
      success: true,
      tweetId,
      tweetUrl,
      tweetText
    };
  } catch (err: any) {
    console.error('[Twitter Bot] Custom tweet error:', err?.data || err?.message);
    return {
      success: false,
      reason: err?.data?.detail || err?.message || 'Error al conectar con Twitter API v2',
      tweetText
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
  if (breakingAlert && breakingAlert.storyId) {
    const breakingStory = stories.find(s => s.id === breakingAlert.storyId);
    if (breakingStory) {
      console.log(`[Twitter Bot] Detected breaking alert for story ${breakingStory.id}. Priority tweeting.`);
      return publishStoryTweet(breakingStory, true, options);
    }
  }

  // Otherwise, tweet the grand lead story (Tapa del Día)
  const leadStory = stories.find(s => s.isLeadStory || (s as any).isLead) || stories[0];
  return publishStoryTweet(leadStory, false, options);
}

