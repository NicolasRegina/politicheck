export type OutletCategory = 'nacional' | 'internacional';

export type BaselineLeaning = 'oficialismo' | 'centro_datos' | 'oposicion';

export interface Outlet {
  id: string;
  name: string;
  slug: string;
  category: OutletCategory;
  baselineLeaning: BaselineLeaning;
  logoUrl?: string;
  websiteUrl: string;
}

export interface Article {
  id: string;
  storyId?: string;
  outletId: string;
  outletName: string;
  title: string;
  snippet: string;
  url: string;
  publishedAt: string;
  framingSummary?: string; // Análisis del encuadre por IA
  specificFocus?: string; // En qué hace hincapié (ej. "Costo fiscal", "Alivio al agro")
}

export interface SpectrumBreakdown {
  oficialismoPct: number;
  centroDatosPct: number;
  oposicionPct: number;
  totalOutlets: number;
}

export interface StoryCluster {
  id: string;
  neutralHeadline: string;
  category: string; // 'Economía', 'Política', 'Justicia', 'Elecciones'
  summary: string;
  updatedAt: string;
  spectrum: SpectrumBreakdown;
  articles: Article[];
  aiComparisonNotice?: string; // Breve síntesis del contraste entre medios
}
