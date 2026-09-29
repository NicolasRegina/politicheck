import fs from 'node:fs';
import path from 'node:path';

export interface ExchangeRate {
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion: string;
}

export interface FinancialTickerData {
  blue: number;
  oficial: number;
  mep: number;
  ccl: number;
  riesgoPais: number;
  ipc: number;
  lastUpdated: string;
}

export interface WeatherData {
  temperature: number;
  conditionText: string;
}

const CACHE_FILE = path.resolve(process.cwd(), 'src/data/latest_finance.json');

function getCachedFinance(): FinancialTickerData | null {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch {}
  return null;
}

function saveCachedFinance(data: FinancialTickerData): void {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch {}
}

export async function fetchLiveFinancialData(): Promise<FinancialTickerData | null> {
  const cached = getCachedFinance();

  try {
    const res = await fetch('https://dolarapi.com/v1/dolares', {
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: ExchangeRate[] = await res.json();

    const blue = data.find(d => d.casa === 'blue')?.venta ?? cached?.blue ?? 1555;
    const oficial = data.find(d => d.casa === 'oficial')?.venta ?? cached?.oficial ?? 1545;
    const mep = Math.round(data.find(d => d.casa === 'bolsa')?.venta ?? cached?.mep ?? 1548);
    const ccl = Math.round(data.find(d => d.casa === 'contadoconliqui')?.venta ?? cached?.ccl ?? 1615);
    const lastUpdated = data[0]?.fechaActualizacion || new Date().toISOString();

    // 1. Live Riesgo País
    let riesgoPais = cached?.riesgoPais ?? 628;
    try {
      const rpRes = await fetch('https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais/ultimo');
      if (rpRes.ok) {
        const rpData = await rpRes.json();
        if (typeof rpData.valor === 'number') riesgoPais = rpData.valor;
      }
    } catch {}

    // 2. Live INDEC Monthly Inflation (IPC)
    let ipc = cached?.ipc ?? 1.7;
    try {
      const ipcRes = await fetch('https://api.argentinadatos.com/v1/finanzas/indices/inflacion');
      if (ipcRes.ok) {
        const ipcData = await ipcRes.json();
        if (Array.isArray(ipcData) && ipcData.length > 0) {
          const latest = ipcData[ipcData.length - 1];
          if (typeof latest.valor === 'number') ipc = latest.valor;
        }
      }
    } catch {}

    const result: FinancialTickerData = { blue, oficial, mep, ccl, riesgoPais, ipc, lastUpdated };
    saveCachedFinance(result);
    return result;
  } catch (err) {
    console.warn('[FinanceService] Could not fetch live dollar rates, using cached/fallback:', err);
    return cached ?? {
      blue: 1555,
      oficial: 1545,
      mep: 1548,
      ccl: 1615,
      riesgoPais: 628,
      ipc: 1.7,
      lastUpdated: new Date().toISOString()
    };
  }
}

export async function fetchLiveWeather(): Promise<WeatherData | null> {
  try {
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-34.6132&longitude=-58.3772&current_weather=true');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const temp = Math.round(data.current_weather.temperature);
    return { temperature: temp, conditionText: 'Buenos Aires' };
  } catch (err) {
    console.warn('[WeatherService] Could not fetch live weather, using fallback:', err);
    return null;
  }
}
