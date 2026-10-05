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
  
  // If it's already a relative path, SVG, or data URI, keep as-is
  if (url.startsWith('/') || url.endsWith('.svg') || url.includes('data:image/')) {
    return url;
  }
  
  // Prevent double wrapping
  if (url.includes('wsrv.nl')) {
    return url;
  }

  // Encode origin url and apply compression parameters
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&q=${quality}&output=webp`;
}
