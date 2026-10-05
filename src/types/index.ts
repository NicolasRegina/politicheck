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
  timestamp?: number;
  imageUrl?: string;
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
  kicker?: string; // Volanta periodística (ej: "TENSIÓN DIPLOMÁTICA • SOBERANÍA")
  neutralHeadline: string;
  category: string; // 'Economía', 'Política', 'Justicia', 'Internacional'
  summary: string;
  updatedAt: string;
  timestamp?: number; // Epoch timestamp en milisegundos para ordenamiento determinístico
  imageUrl?: string; // Fotografía periodística real de portada
  imageCaption?: string; // Pie de foto periodístico y créditos de agencia
  spectrum: SpectrumBreakdown;
  articles: Article[];
  aiComparisonNotice?: string; // Síntesis del contraste de encuadres por IA
  isLeadStory?: boolean; // Para apertura de portada de gran diario
}

export type PromiseStatus = 'cumplida' | 'en_progreso' | 'incumplida' | 'en_pausa';

export interface CitizenVotes {
  fulfilled: number;
  inProgress: number;
  broken: number;
}

export interface CitizenVoteRecord {
  promiseId: string;
  voterHash: string; // Hash anónimo SHA-256 (IP + User-Agent + Salt)
  voteType: 'fulfilled' | 'inProgress' | 'broken';
  votedAt: string;
}

export interface CampaignPromise {
  id: string;
  candidate: string;
  coalition: string;
  role: string;
  category: string;
  promiseText: string;
  status: PromiseStatus;
  statusLabel: string;
  statedAt: string;
  sourceUrl: string;
  auditNotes: string;
  officialProof?: string;
  votes?: CitizenVotes;
}

