export interface PoliticianConfig {
  name: string;
  avatar: string;
  coalition: string;
  role: string;
  partyColor: {
    badgeBg: string;
    border: string;
    accentBar: string;
    lightRing: string;
  };
}

export const POLITICIANS: Record<string, PoliticianConfig> = {
  'Javier Milei': {
    name: 'Javier Milei',
    avatar: '/images/politicians/javier-milei.jpg',
    coalition: 'La Libertad Avanza',
    role: 'Presidente de la Nación',
    partyColor: {
      badgeBg: 'bg-violet-100 text-violet-900 border-violet-300 dark:bg-violet-950/80 dark:text-violet-200 dark:border-violet-800',
      border: 'border-violet-500',
      accentBar: 'border-l-violet-600',
      lightRing: 'ring-violet-400'
    }
  },
  'Axel Kicillof': {
    name: 'Axel Kicillof',
    avatar: '/images/politicians/axel-kicillof.jpg',
    coalition: 'Unión por la Patria',
    role: 'Gobernador de Buenos Aires',
    partyColor: {
      badgeBg: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/80 dark:text-sky-200 dark:border-sky-800',
      border: 'border-sky-500',
      accentBar: 'border-l-sky-600',
      lightRing: 'ring-sky-400'
    }
  },
  'Mauricio Macri': {
    name: 'Mauricio Macri',
    avatar: '/images/politicians/mauricio-macri.jpg',
    coalition: 'Propuesta Republicana (PRO)',
    role: 'Presidente del PRO',
    partyColor: {
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-800',
      border: 'border-amber-500',
      accentBar: 'border-l-amber-500',
      lightRing: 'ring-amber-400'
    }
  },
  'Victoria Villarruel': {
    name: 'Victoria Villarruel',
    avatar: '/images/politicians/victoria-villarruel.jpg',
    coalition: 'La Libertad Avanza',
    role: 'Vicepresidenta de la Nación',
    partyColor: {
      badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950/80 dark:text-indigo-200 dark:border-indigo-800',
      border: 'border-indigo-500',
      accentBar: 'border-l-indigo-600',
      lightRing: 'ring-indigo-400'
    }
  },
  'Patricia Bullrich': {
    name: 'Patricia Bullrich',
    avatar: '/images/politicians/patricia-bullrich.jpg',
    coalition: 'La Libertad Avanza / PRO',
    role: 'Ministra de Seguridad Nacional',
    partyColor: {
      badgeBg: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-800',
      border: 'border-rose-500',
      accentBar: 'border-l-rose-600',
      lightRing: 'ring-rose-400'
    }
  },
  'Jorge Macri': {
    name: 'Jorge Macri',
    avatar: '/images/politicians/jorge-macri.jpg',
    coalition: 'Juntos por el Cambio / PRO',
    role: 'Jefe de Gobierno CABA',
    partyColor: {
      badgeBg: 'bg-yellow-100 text-yellow-900 border-yellow-300 dark:bg-yellow-950/80 dark:text-yellow-200 dark:border-yellow-800',
      border: 'border-yellow-500',
      accentBar: 'border-l-yellow-500',
      lightRing: 'ring-yellow-400'
    }
  },
  'Juan Schiaretti': {
    name: 'Juan Schiaretti',
    avatar: '/images/politicians/juan-schiaretti.jpg',
    coalition: 'Hacemos por Nuestro País',
    role: 'Referente Federal',
    partyColor: {
      badgeBg: 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950/80 dark:text-teal-200 dark:border-teal-800',
      border: 'border-teal-500',
      accentBar: 'border-l-teal-600',
      lightRing: 'ring-teal-400'
    }
  },
  'Horacio Rodríguez Larreta': {
    name: 'Horacio Rodríguez Larreta',
    avatar: '/images/politicians/horacio-rodriguez-larreta.jpg',
    coalition: 'Movimiento al Desarrollo (MAD)',
    role: 'Referente de Centro',
    partyColor: {
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-800',
      border: 'border-emerald-500',
      accentBar: 'border-l-emerald-600',
      lightRing: 'ring-emerald-400'
    }
  },
  'Leandro Santoro': {
    name: 'Leandro Santoro',
    avatar: '/images/politicians/leandro-santoro.jpg',
    coalition: 'Unión por la Patria',
    role: 'Diputado Nacional',
    partyColor: {
      badgeBg: 'bg-red-100 text-red-900 border-red-300 dark:bg-red-950/80 dark:text-red-200 dark:border-red-800',
      border: 'border-red-500',
      accentBar: 'border-l-red-600',
      lightRing: 'ring-red-400'
    }
  },
  'Sergio Massa': {
    name: 'Sergio Massa',
    avatar: '/images/politicians/sergio-massa.jpg',
    coalition: 'Frente Renovador / UP',
    role: 'Referente Opositor',
    partyColor: {
      badgeBg: 'bg-cyan-100 text-cyan-900 border-cyan-300 dark:bg-cyan-950/80 dark:text-cyan-200 dark:border-cyan-800',
      border: 'border-cyan-500',
      accentBar: 'border-l-cyan-600',
      lightRing: 'ring-cyan-400'
    }
  }
};

export function getPolitician(name: string): PoliticianConfig {
  if (POLITICIANS[name]) return POLITICIANS[name];

  return {
    name,
    avatar: '',
    coalition: 'Sector Político',
    role: 'Figura Pública',
    partyColor: {
      badgeBg: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
      border: 'border-slate-400',
      accentBar: 'border-l-slate-500',
      lightRing: 'ring-slate-300'
    }
  };
}
