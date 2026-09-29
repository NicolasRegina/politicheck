import { getCachedForeignArticles } from '../src/services/rss/sync';
import { clusterForeignArticlesWithGemini } from '../src/services/ai/clustering';

async function main() {
  const articles = getCachedForeignArticles();
  console.log(`Starting clustering for ${articles.length} foreign articles...`);
  const clusters = await clusterForeignArticlesWithGemini(articles);
  console.log(`Successfully generated ${clusters.length} foreign clusters:`);
  for (const c of clusters) {
    console.log(`- [${c.kicker}] ${c.neutralHeadline} (${c.articles.length} articles)`);
    console.log(`  Medios: ${c.articles.map(a => a.outletName).join(', ')}`);
  }
}

main().catch(err => {
  console.error('Error running foreign clustering:', err);
  process.exit(1);
});
