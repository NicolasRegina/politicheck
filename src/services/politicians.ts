import { supabase, supabaseReadCache } from './supabase';
import { getOutletMeta } from '../utils/outlets';
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

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
      : staticFallback?.partyColor || {
          badgeBg: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
          border: 'border-slate-400',
          accentBar: 'border-l-slate-500',
          lightRing: 'ring-slate-300',
        }) as PoliticianPartyColor,
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

  if (!supabase) {
    return [...POLITICIANS_LIST].sort((a, b) => a.name.localeCompare(b.name, 'es'));
  }

  try {
    const { data, error } = await supabase
      .from('politicians')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      return [...POLITICIANS_LIST].sort((a, b) => a.name.localeCompare(b.name, 'es'));
    }

    const mapped = data.map(mapDbRowToPolitician).sort((a, b) => a.name.localeCompare(b.name, 'es'));
    supabaseReadCache.set(POLITICIANS_CACHE_KEY, mapped, POLITICIANS_TTL_MS);
    return mapped;
  } catch {
    return [...POLITICIANS_LIST].sort((a, b) => a.name.localeCompare(b.name, 'es'));
  }
}

export async function getPoliticianBySlugAsync(rawSlug: string): Promise<PoliticianConfig | null> {
  const normalized = slugifyPolitician(rawSlug);
  const all = await getAllPoliticians();
  return all.find((p) => p.slug === normalized) || null;
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

const ROLE_CHANGE_TRIGGERS: Array<{ keyword: string; regex: RegExp }> = [
  { keyword: 'renunció', regex: /\b(renuncio|renuncia|presento su renuncia)\b/i },
  { keyword: 'dimitió', regex: /\b(dimitio|dimision)\b/i },
  { keyword: 'asumió', regex: /\b(asumio como|asume como|asuncion de)\b/i },
  { keyword: 'juró', regex: /\b(juro como|jura como)\b/i },
  { keyword: 'designado', regex: /\b(fue designad[oa]|designaron a|nuevo ministro|nueva ministra|jefe de gabinete)\b/i },
  { keyword: 'destituido', regex: /\b(destituid[oa]|desplazad[oa] del cargo|echo a|despidio a)\b/i },
  { keyword: 'inhabilitación', regex: /\b(inhabilitacion perpetua|condena firme|fallo firme)\b/i },
  { keyword: 'dejó el cargo', regex: /\b(dejo el cargo|deja el cargo|dejo el ministerio|deja el ministerio)\b/i },
];

/**
 * Scans incoming StoryClusters for verifiable institutional role-change signals
 * (resignations, appointments, swearing-in, disqualifications) and inserts pending
 * human-in-the-loop alerts into `politician_alerts`. Never overwrites live profiles.
 */
export async function detectAndRecordPoliticianRoleAlerts(
  clusters: StoryCluster[]
): Promise<number> {
  if (!supabase || !Array.isArray(clusters) || clusters.length === 0) return 0;

  const politicians = await getAllPoliticians();
  const candidatesToInsert: Array<{
    politician_slug: string;
    politician_name: string;
    story_id: string;
    story_headline: string;
    story_url: string;
    trigger_keyword: string;
    detected_snippet: string;
    status: 'pending';
  }> = [];

  for (const story of clusters) {
    const headline = String(story.neutralHeadline || '').trim();
    const summary = String(story.summary || '').trim();
    if (!headline || !story.id) continue;

    const normalizedLead = normalizePoliticianText(`${headline} ${summary}`);
    const matchedTrigger = ROLE_CHANGE_TRIGGERS.find((t) => t.regex.test(normalizedLead));
    if (!matchedTrigger) continue;

    for (const pol of politicians) {
      const patterns = buildPoliticianMatchPatterns(pol);
      if (patterns.some((rx) => rx.test(normalizedLead))) {
        candidatesToInsert.push({
          politician_slug: pol.slug,
          politician_name: pol.name,
          story_id: String(story.id),
          story_headline: headline.slice(0, 280),
          story_url: `/historia/${story.id}`,
          trigger_keyword: matchedTrigger.keyword,
          detected_snippet: summary.slice(0, 400),
          status: 'pending',
        });
      }
    }
  }

  if (candidatesToInsert.length === 0) return 0;

  try {
    const { error } = await supabase
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
