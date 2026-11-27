/**
 * Image optimization helper for Politicheck.
 * Routes external third-party news photos through an ultra-fast global CDN proxy (wsrv.nl)
 * to resize, strip heavy EXIF metadata, and transcode into lightweight modern WebP format.
 *
 * Example: Reduces a 3.8MB uncompressed Infobae/Clarín image to ~25KB WebP, 
 * slashing LCP download times by over 90% on mobile 4G networks.
 */
export function getOptimizedImageUrl(
  url: string | null | undefined,
  width: number = 800,
  quality: number = 75
): string {
  if (!url) return '';

  // Clean HTML-encoded ampersands left over from XML RSS feeds (e.g. &amp;height=1080)
  const cleanUrl = url.replace(/&amp;/g, '&').trim();

  // If it's already a relative path, SVG, or data URI, keep as-is
  if (cleanUrl.startsWith('/') || cleanUrl.endsWith('.svg') || cleanUrl.includes('data:image/')) {
    return cleanUrl;
  }

  // Prevent double wrapping
  if (cleanUrl.includes('wsrv.nl')) {
    return cleanUrl;
  }

  // Bypass wsrv.nl for already-optimized Arc/media CDNs that serve native AVIF/WebP and block server-side proxies
  const DIRECT_CDN_PATTERNS = [
    'resizer.glanacion.com',
    'infobae.com/resizer',
  ];
  if (DIRECT_CDN_PATTERNS.some((host) => cleanUrl.includes(host))) {
    return cleanUrl;
  }

  // Encode origin url and apply compression parameters
  return `https://wsrv.nl/?url=${encodeURIComponent(cleanUrl)}&w=${width}&q=${quality}&output=webp`;
}
