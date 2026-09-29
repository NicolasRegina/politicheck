import type { StoryCluster, Article } from '../types';

export interface BreakingAlert {
  id: string;
  storyId: string;
  headline: string;
  category: string;
  summary: string;
  outletsCount: number;
  outlets: string[];
  publishedAt: string;
  urgencyScore: number;
  url: string;
}

const URGENT_KEYWORDS = [
  'urgente', 'alerta', 'ultimo momento', 'último momento',
  'fallo', 'veto', 'renuncia', 'crisis', 'dolar', 'dólar',
  'inflacion', 'inflación', 'decreto', 'sesion', 'sesión',
  'corte', 'piquete', 'paro', 'fmi', 'medidas', 'superavit', 'superávit',
  'fallece', 'muere', 'tragedia', 'comunicado', 'oficial'
];

/**
 * Detects whether there is an active breaking news story based on:
 * 1. Multi-outlet concurrency (at least 3 distinct editorial desks reporting on the same event).
 * 2. Urgency heuristics (lead story status, urgent keywords, recency of publication).
 */
export function detectBreakingNews(
  stories: StoryCluster[], 
  _articles?: Article[]
): BreakingAlert | null {
  if (!stories || stories.length === 0) return null;

  let bestAlert: BreakingAlert | null = null;
  let highestScore = 0;

  for (const story of stories) {
    if (!story.articles || story.articles.length === 0) continue;

    // Distinct reporting outlets
    const uniqueOutlets = Array.from(new Set(story.articles.map(a => a.outletName)));
    const outletsCount = uniqueOutlets.length;

    // Minimum requirement: at least 3 outlets reporting on this cluster
    if (outletsCount < 3) continue;

    let score = outletsCount * 12; // Base score proportional to breadth of coverage

    if (story.isLeadStory) {
      score += 40; // Lead story on homepage has high editorial priority
    }

    const lowerHeadline = (story.neutralHeadline || '').toLowerCase();
    const lowerSummary = (story.summary || '').toLowerCase();
    const kicker = (story.kicker || '').toLowerCase();

    for (const kw of URGENT_KEYWORDS) {
      if (lowerHeadline.includes(kw) || kicker.includes(kw) || lowerSummary.includes(kw)) {
        score += 15;
      }
    }

    // Publication age factor if dates are present
    const timestamps = story.articles
      .map(a => new Date(a.publishedAt).getTime())
      .filter(t => !isNaN(t));

    if (timestamps.length > 0) {
      const newestTime = Math.max(...timestamps);
      const ageInMinutes = (Date.now() - newestTime) / (1000 * 60);

      if (ageInMinutes < 60) {
        score += 30; // Very fresh (within the hour)
      } else if (ageInMinutes < 180) {
        score += 15; // Within 3 hours
      }
    }

    if (score > highestScore && score >= 35) {
      highestScore = score;
      bestAlert = {
        id: `breaking-${story.id}`,
        storyId: story.id,
        headline: story.neutralHeadline,
        category: story.category,
        summary: story.summary,
        outletsCount,
        outlets: uniqueOutlets.slice(0, 4),
        publishedAt: story.updatedAt,
        urgencyScore: score,
        url: `/historia/${story.id}`
      };
    }
  }

  return bestAlert;
}
