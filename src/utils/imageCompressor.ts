/**
 * Browser-side image compression utility for WebP optimization
 * Protects Supabase Storage 500 MB quota by compressing banner uploads to compact WebP format.
 */

export interface CompressionResult {
  blob: Blob;
  dataUrl: string;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  reductionPercent: number;
  width: number;
  height: number;
}

export async function compressImageToWebP(
  file: File | Blob,
  maxWidth = 1200,
  maxHeight = 600,
  quality = 0.82
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const originalSizeBytes = file.size;
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio constrained dimensions
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo inicializar el contexto 2D de Canvas.'));
          return;
        }

        // Draw image with smooth filtering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP format
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Fallo al exportar el canvas a formato WebP.'));
              return;
            }

            const dataUrl = canvas.toDataURL('image/webp', quality);
            const compressedSizeBytes = blob.size;
            const reductionPercent = Math.max(
              0,
              Math.round(((originalSizeBytes - compressedSizeBytes) / originalSizeBytes) * 100)
            );

            resolve({
              blob,
              dataUrl,
              originalSizeBytes,
              compressedSizeBytes,
              reductionPercent,
              width,
              height
            });
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => reject(new Error('No se pudo cargar la imagen para compresión.'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Error al leer el archivo de imagen.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Format bytes to readable string (e.g. 45.2 KB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
