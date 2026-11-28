import type { APIRoute } from 'astro';
import { GUIAS_ARTICLES } from '../data/guias';
import { POLITICIANS_LIST } from '../data/politicians';
import rawPromises from '../data/promises.json';
import rawStories from '../data/clustered_stories.json';
import { brazilElectionClusters } from '../data/brasil_election';

export const prerender = true;

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: string;
}

export const GET: APIRoute = async () => {
  const baseUrl = 'https://www.politicheck.com.ar';
  const today = new Date().toISOString().split('T')[0];

  const urls: SitemapUrl[] = [
    // Core Hub & Section Pages
    {
      loc: `${baseUrl}/`,
      lastmod: today,
      changefreq: 'hourly',
      priority: '1.0'
    },
    {
      loc: `${baseUrl}/guias`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.9'
    },
    {
      loc: `${baseUrl}/politicos`,
      lastmod: today,
      changefreq: 'daily',
      priority: '0.95'
    },
    {
      loc: `${baseUrl}/promesas`,
      lastmod: today,
      changefreq: 'daily',
      priority: '0.9'
    },
    {
      loc: `${baseUrl}/mirada-exterior`,
      lastmod: today,
      changefreq: 'hourly',
      priority: '0.9'
    },
    {
      loc: `${baseUrl}/metodologia`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      loc: `${baseUrl}/terminos`,
      lastmod: '2026-09-27',
      changefreq: 'monthly',
      priority: '0.4'
    },
    {
      loc: `${baseUrl}/elecciones-brasil`,
      lastmod: today,
      changefreq: 'hourly',
      priority: '0.9'
    }
  ];

  // Civic Research Guides (Cluster de Medios)
  const publishedGuides = GUIAS_ARTICLES.filter(g => g.status === 'publicado');
  for (const guide of publishedGuides) {
    const modDate = guide.isoUpdatedAt ? guide.isoUpdatedAt.split('T')[0] : today;
    urls.push({
      loc: `${baseUrl}/guias/${guide.slug}`,
      lastmod: modDate,
      changefreq: 'weekly',
      priority: '0.9'
    });
  }

  // Verified Politician Profiles (/politico/[slug])
  for (const pol of POLITICIANS_LIST) {
    urls.push({
      loc: `${baseUrl}/politico/${pol.slug}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.85'
    });
  }

  // Verified Candidate Campaign Promises (Promesómetro 2027)
  if (Array.isArray(rawPromises)) {
    for (const promise of rawPromises) {
      if (promise && promise.id) {
        urls.push({
          loc: `${baseUrl}/promesa/${promise.id}`,
          lastmod: today,
          changefreq: 'weekly',
          priority: '0.7'
        });
      }
    }
  }

  // Active Story Clusters (Desglose de Noticias del Día)
  if (Array.isArray(rawStories)) {
    for (const story of rawStories) {
      if (story && story.id) {
        urls.push({
          loc: `${baseUrl}/historia/${story.id}`,
          lastmod: today,
          changefreq: 'daily',
          priority: '0.8'
        });
      }
    }
  }

  // Special Election Module Clusters (Elecciones Brasil 2026)
  for (const story of brazilElectionClusters) {
    if (story && story.id) {
      urls.push({
        loc: `${baseUrl}/historia/${story.id}`,
        lastmod: today,
        changefreq: 'daily',
        priority: '0.9'
      });
    }
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemapXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  });
};
