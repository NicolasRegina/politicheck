import { createServiceRoleClient, getNewsClustersFromSupabase, supabase, supabaseReadCache } from './supabase';
import { getOutletMeta } from '../utils/outlets';
import { getCachedClusteredStories } from './ai/clustering';
import {
  POLITICIANS_LIST,
  normalizePoliticianText,
  slugifyPolitician,
  type CareerEntry,
  type PolicyAxis,
  type PoliticianConfig,
  type PoliticianPartyColor,
  type PoliticianScopeGroup,
  type PoliticianSpaceGroup,
} from '../data/politicians';
import type { StoryCluster } from '../types';

const POLITICIANS_CACHE_KEY = 'politicians:active:all';
const POLITICIANS_TTL_MS = 5 * 60 * 1000;

const FALLBACK_PARTY_COLOR: PoliticianPartyColor = {
  badgeBg: 'bg-surface-muted text-ink border-rule',
  border: 'border-rule',
  accentBar: 'border-l-ink',
  lightRing: 'ring-rule',
};

export interface PoliticianMediaStats {
  mentions: number;
  stories: StoryCluster[];
  spectrum: {
    oficialismo: number;
    centro_datos: number;
    oposicion: number;
    totalArticles: number;
  };
}

export interface PoliticianAlert {
  id: string;
  politician_slug: string;
  politician_name: string;
  story_id: string;
  story_headline: string;
  story_url?: string | null;
  trigger_keyword: string;
  detected_snippet: string;
  suggested_role?: string | null;
  status: 'pending' | 'approved' | 'dismissed';
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at: string;
}

export interface DetectedRoleAlert {
  politician_slug: string;
  politician_name: string;
  story_id: string;
  story_headline: string;
  story_url: string;
  trigger_keyword: string;
  detected_snippet: string;
  suggested_role: string | null;
  status: 'pending';
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getStaticPoliticiansSorted(): PoliticianConfig[] {
  return [...POLITICIANS_LIST].sort((a, b) => a.name.localeCompare(b.name, 'es'));
}

function mapDbRowToPolitician(row: any): PoliticianConfig {
  const staticFallback = POLITICIANS_LIST.find((p) => p.slug === row.slug);
  return {
    slug: row.slug,
    name: row.name,
    fullName: row.full_name || row.name,
    avatar: row.avatar || staticFallback?.avatar || '',
    avatarCredit: row.avatar_credit || staticFallback?.avatarCredit || '',
    coalition: row.coalition || staticFallback?.coalition || 'Sector Político',
    spaceGroup: (row.space_group || staticFallback?.spaceGroup || 'Otros') as PoliticianSpaceGroup,
    scopeGroup: (row.scope_group || staticFallback?.scopeGroup || 'Referentes') as PoliticianScopeGroup,
    role: row.role || staticFallback?.role || 'Figura Pública',
    district: row.district || staticFallback?.district || 'Nación Argentina',
    birthDate: row.birth_date || staticFallback?.birthDate || '',
    birthPlace: row.birth_place || staticFallback?.birthPlace || '',
    education: row.education || staticFallback?.education || '',
    summary: row.summary || staticFallback?.summary || '',
    pastAffiliations: Array.isArray(row.past_affiliations)
      ? row.past_affiliations
      : staticFallback?.pastAffiliations || [],
    careerTimeline: Array.isArray(row.career_timeline)
      ? (row.career_timeline as CareerEntry[])
      : staticFallback?.careerTimeline || [],
    policyAxes: Array.isArray(row.policy_axes)
      ? (row.policy_axes as PolicyAxis[])
      : staticFallback?.policyAxes || [],
    sources: Array.isArray(row.sources) ? row.sources : staticFallback?.sources || [],
    partyColor: (row.party_color && row.party_color.badgeBg
      ? row.party_color
      : staticFallback?.partyColor || FALLBACK_PARTY_COLOR) as PoliticianPartyColor,
    matchAliases: staticFallback?.matchAliases,
    updatedAt: row.updated_at,
  };
}

export function invalidatePoliticiansCache(): void {
  supabaseReadCache.invalidate('politicians:');
}

/**
 * Loads all active politicians from Supabase (with 5-min TTL cache) and falls back
 * transparently to the verified static seed in src/data/politicians.ts.
 */
export async function getAllPoliticians(): Promise<PoliticianConfig[]> {
  const cached = supabaseReadCache.get<PoliticianConfig[]>(POLITICIANS_CACHE_KEY);
  if (cached && cached.length > 0) return cached;

  if (!supabase) return getStaticPoliticiansSorted();

  try {
    const { data, error } = await supabase
      .from('politicians')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      return getStaticPoliticiansSorted();
    }

    const mapped = data.map(mapDbRowToPolitician).sort((a, b) => a.name.localeCompare(b.name, 'es'));
    supabaseReadCache.set(POLITICIANS_CACHE_KEY, mapped, POLITICIANS_TTL_MS);
    return mapped;
  } catch {
    return getStaticPoliticiansSorted();
  }
}

export async function getPoliticianBySlugAsync(rawSlug: string): Promise<PoliticianConfig | null> {
  const normalized = slugifyPolitician(rawSlug);
  const all = await getAllPoliticians();
  return all.find((p) => p.slug === normalized) || null;
}

/**
 * Shared loader for recent 14-day StoryClusters with local fallback.
 */
export async function getRecentStoryClustersWithFallback(
  maxAgeDays = 14,
  limit = 60
): Promise<StoryCluster[]> {
  const cloudClusters = await getNewsClustersFromSupabase({ maxAgeDays, limit }).catch(() => null);
  return Array.isArray(cloudClusters) && cloudClusters.length > 0
    ? (cloudClusters as StoryCluster[])
    : getCachedClusteredStories();
}

/**
 * Builds unambiguous match regexes for a politician so shared surnames
 * (Milei, Macri, Kirchner) are never cross-attributed to the wrong person.
 */
export function buildPoliticianMatchPatterns(politician: PoliticianConfig): RegExp[] {
  const terms =
    politician.matchAliases && politician.matchAliases.length > 0
      ? politician.matchAliases
      : [normalizePoliticianText(politician.name)];

  return Array.from(new Set(terms.map(normalizePoliticianText)))
    .filter((t) => t.length >= 3)
    .map((term) => new RegExp(`\\b${escapeRegExp(term)}\\b`, 'i'));
}

export function storyMentionsPolitician(story: StoryCluster, patterns: RegExp[]): boolean {
  const articleTitles = Array.isArray(story.articles)
    ? story.articles.map((a) => a.title || '').join(' ')
    : '';
  const haystack = normalizePoliticianText(
    `${story.neutralHeadline || ''} ${story.summary || ''} ${articleTitles}`
  );
  return patterns.some((rx) => rx.test(haystack));
}

/**
 * Computes mention counts, matched stories, and an automatic media spectrum breakdown
 * ("Cómo lo cubren los medios hoy") over the supplied StoryClusters.
 */
export function computePoliticianMediaStats(
  politician: PoliticianConfig,
  clusters: StoryCluster[]
): PoliticianMediaStats {
  const patterns = buildPoliticianMatchPatterns(politician);
  const matched: StoryCluster[] = [];

  let oficialismoCount = 0;
  let centroCount = 0;
  let oposicionCount = 0;

  for (const story of clusters) {
    if (!storyMentionsPolitician(story, patterns)) continue;
    matched.push({ ...story, isLeadStory: false });

    const articles = Array.isArray(story.articles) ? story.articles : [];
    for (const art of articles) {
      const leaning = getOutletMeta(art.outletId)?.baselineLeaning || 'centro_datos';
      if (leaning === 'oficialismo') oficialismoCount += 1;
      else if (leaning === 'oposicion') oposicionCount += 1;
      else centroCount += 1;
    }
  }

  const totalArticles = oficialismoCount + centroCount + oposicionCount;
  const spectrum =
    totalArticles > 0
      ? {
          oficialismo: Math.round((oficialismoCount / totalArticles) * 100),
          centro_datos: Math.round((centroCount / totalArticles) * 100),
          oposicion: Math.round((oposicionCount / totalArticles) * 100),
          totalArticles,
        }
      : { oficialismo: 0, centro_datos: 0, oposicion: 0, totalArticles: 0 };

  if (totalArticles > 0) {
    const sum = spectrum.oficialismo + spectrum.centro_datos + spectrum.oposicion;
    if (sum !== 100) {
      spectrum.centro_datos = Math.max(0, spectrum.centro_datos + (100 - sum));
    }
  }

  return {
    mentions: matched.length,
    stories: matched,
    spectrum,
  };
}

interface RoleTriggerRule {
  keyword: string;
  kind: 'resignation' | 'appointment' | 'disqualification';
  regex: RegExp;
}

const ROLE_CHANGE_TRIGGERS: RoleTriggerRule[] = [
  { keyword: 'renunció', kind: 'resignation', regex: /\b(renuncio|presento su renuncia|renuncia de)\b/i },
  { keyword: 'dimitió', kind: 'resignation', regex: /\b(dimitio|presento su dimision|dimision de)\b/i },
  { keyword: 'dejó el cargo', kind: 'resignation', regex: /\b(dejo el cargo|deja el cargo|dejo el ministerio|deja el ministerio)\b/i },
  { keyword: 'destituido', kind: 'resignation', regex: /\b(destituid[oa]|desplazad[oa] del cargo|removido del cargo|removida del cargo)\b/i },
  { keyword: 'asumió', kind: 'appointment', regex: /\b(asumio como|asume como|asumio al frente de)\b/i },
  { keyword: 'juró', kind: 'appointment', regex: /\b(juro como|jura como)\b/i },
  { keyword: 'designado', kind: 'appointment', regex: /\b(fue designad[oa]|designaron a|nombro como|fue nombrad[oa])\b/i },
  { keyword: 'inhabilitación', kind: 'disqualification', regex: /\b(inhabilitacion perpetua|inhabilitacion absoluta|condena firme)\b/i },
];

function extractSuggestedRole(rawSentence: string, rule: RoleTriggerRule): string | null {
  if (rule.kind === 'resignation') {
    return 'Sin cargo público estatal (verificar renuncia)';
  }
  if (rule.kind === 'disqualification') {
    return 'Sin cargo estatal · inhabilitado/a (verificar fallo)';
  }
  // Appointment: extract role right after "como" / "al frente de"
  const match = rawSentence.match(
    /\b(?:asumi[oó]|asume|jur[oó]|jura|designad[oa]|nombrad[oa]|nombr[oó])\s+(?:como|al frente de)\s+([^.,;:()]{4,85})/i
  );
  if (match && match[1]) {
    const cleaned = match[1].trim().replace(/\s+(y|en medio|tras|luego|despu[eé]s)\b.*$/i, '').trim();
    if (cleaned.length >= 4) {
      return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }
  }
  return null;
}

/**
 * Pure, testable institutional role-change detector (ADR-0009).
 * Matches a Politician ONLY when their unambiguous alias and a genuine transition verb
 * co-occur in the same sentence (headline or summary), avoiding multi-person false positives.
 */
export function extractPoliticianRoleAlerts(
  clusters: Array<{ id: string; neutralHeadline?: string; neutral_headline?: string; summary?: string }>,
  politicians: PoliticianConfig[]
): DetectedRoleAlert[] {
  const alerts: DetectedRoleAlert[] = [];
  const seenKeys = new Set<string>();

  for (const story of clusters) {
    const storyId = String(story.id || '').trim();
    const headline = String(story.neutralHeadline || story.neutral_headline || '').trim();
    const summary = String(story.summary || '').trim();
    if (!storyId || !headline) continue;

    // Split into individual sentences so politician + transition verb must co-occur locally
    const sentences = [headline, ...summary.split(/(?<=[.!?])\s+/)].filter(Boolean);

    for (const rawSentence of sentences) {
      const normalizedSentence = normalizePoliticianText(rawSentence);
      const matchedRule = ROLE_CHANGE_TRIGGERS.find((r) => r.regex.test(normalizedSentence));
      if (!matchedRule) continue;

      for (const pol of politicians) {
        const dedupKey = `${pol.slug}::${storyId}`;
        if (seenKeys.has(dedupKey)) continue;

        const patterns = buildPoliticianMatchPatterns(pol);
        if (patterns.some((rx) => rx.test(normalizedSentence))) {
          seenKeys.add(dedupKey);
          alerts.push({
            politician_slug: pol.slug,
            politician_name: pol.name,
            story_id: storyId,
            story_headline: headline.slice(0, 280),
            story_url: `/historia/${storyId}`,
            trigger_keyword: matchedRule.keyword,
            detected_snippet: rawSentence.slice(0, 400),
            suggested_role: extractSuggestedRole(rawSentence, matchedRule),
            status: 'pending',
          });
        }
      }
    }
  }

  return alerts;
}

/**
 * Persists detected institutional role-change alerts into `politician_alerts`.
 * Requires a service-role or authenticated admin Supabase client (anon INSERT is blocked by RLS).
 */
export async function detectAndRecordPoliticianRoleAlerts(
  clusters: Array<{ id: string; neutralHeadline?: string; neutral_headline?: string; summary?: string }>,
  explicitClient?: any
): Promise<number> {
  const writerClient = explicitClient || createServiceRoleClient();
  if (!writerClient || !Array.isArray(clusters) || clusters.length === 0) return 0;

  const politicians = await getAllPoliticians();
  const candidatesToInsert = extractPoliticianRoleAlerts(clusters, politicians);
  if (candidatesToInsert.length === 0) return 0;

  try {
    const { error } = await writerClient
      .from('politician_alerts')
      .upsert(candidatesToInsert, {
        onConflict: 'politician_slug,story_id',
        ignoreDuplicates: true,
      });

    if (error) {
      console.warn('[Politicians] Error inserting role-change alerts:', error.message);
      return 0;
    }
    return candidatesToInsert.length;
  } catch (err: any) {
    console.warn('[Politicians] Exception inserting role-change alerts:', err?.message || err);
    return 0;
  }
}
