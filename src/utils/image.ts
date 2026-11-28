/**
 * Image validation and optimization helpers for Politicheck.
 *
 * 1. Filters out non-image URLs that newsrooms frequently put inside RSS
 *    <media:content> / <enclosure> tags (video players like vodgc.net, YouTube/Vimeo
 *    embeds, .mp4/.m3u8 streams, tracking pixels).
 * 2. Routes valid third-party news photos through wsrv.nl to transcode to WebP,
 *    while bypassing resizer CDNs (e.g. Arc Publishing signed resizers) that already
 *    serve native AVIF/WebP and block proxy fetches.
 */

const NON_IMAGE_URL_PATTERNS = [
  'vodgc.net',
  '/player/',
  '/embed/',
  'youtube.com',
  'youtu.be',
  'vimeo.com',
  'dailymotion.com',
  'jwplatform.com',
  'brightcove',
  'rudo.video',
  'mdstrm.com',
  'twitch.tv',
  'spotify.com',
  'soundcloud.com',
  'doubleclick.net',
  'googlesyndication.com',
  'tracking',
  'pixel.',
];

const NON_IMAGE_EXTENSIONS = /\.(mp4|m3u8|webm|mov|avi|mp3|wav|ogg|m4a|pdf|html?|php|js|css|gif)(\?|#|$)/i;

/**
 * Returns true if the URL is a valid candidate image URL (not a video player, embed, stream, or tracker).
 */
export function isValidNewsImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const clean = url.replace(/&amp;/g, '&').trim();
  if (!clean) return false;

  if (clean.startsWith('/') || clean.startsWith('data:image/')) {
    return true;
  }

  if (!/^https?:\/\//i.test(clean)) {
    return false;
  }

  const lower = clean.toLowerCase();
  if (NON_IMAGE_EXTENSIONS.test(lower)) {
    return false;
  }

  if (NON_IMAGE_URL_PATTERNS.some((pattern) => lower.includes(pattern))) {
    return false;
  }

  return true;
}

export function getOptimizedImageUrl(
  url: string | null | undefined,
  width: number = 800,
  quality: number = 75
): string {
  if (!url) return '';

  // Clean HTML-encoded ampersands left over from XML RSS feeds (e.g. &amp;height=1080)
  const cleanUrl = url.replace(/&amp;/g, '&').trim();

  // Reject video embeds, streams, players, and trackers globally so neither wsrv.nl nor <img> fails
  if (!isValidNewsImageUrl(cleanUrl)) {
    return '';
  }

  // If it's already a relative path, SVG, or data URI, keep as-is
  if (cleanUrl.startsWith('/') || cleanUrl.endsWith('.svg') || cleanUrl.includes('data:image/')) {
    return cleanUrl;
  }

  // Prevent double wrapping
  if (cleanUrl.includes('wsrv.nl')) {
    return cleanUrl;
  }

  // Global bypass for signed/native-AVIF Arc Publishing & similar resizer CDNs that block server-side proxies
  const lower = cleanUrl.toLowerCase();
  const isNativeSignedResizer =
    (lower.includes('/resizer/') && lower.includes('auth=')) ||
    lower.includes('resizer.glanacion.com') ||
    lower.includes('infobae.com/resizer');

  if (isNativeSignedResizer) {
    return cleanUrl;
  }

  // Encode origin url and apply compression parameters
  return `https://wsrv.nl/?url=${encodeURIComponent(cleanUrl)}&w=${width}&q=${quality}&output=webp`;
}
