import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import node from '@astrojs/node';

// Vercel sets process.env.VERCEL = '1' automatically in deployment environments
const isVercel = Boolean(process.env.VERCEL);

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: isVercel
    ? vercel({
        webAnalytics: {
          enabled: true,
        },
      })
    : node({
        mode: 'standalone',
      }),
  vite: {
    plugins: [tailwindcss()],
  },
});
