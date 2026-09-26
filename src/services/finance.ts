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
  lastUpdated: string;
}

export interface WeatherData {
  temperature: number;
  conditionText: string;
}

export async function fetchLiveFinancialData(): Promise<FinancialTickerData | null> {
  try {
    const res = await fetch('https://dolarapi.com/v1/dolares', {
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: ExchangeRate[] = await res.json();

    const blue = data.find(d => d.casa === 'blue')?.venta ?? 1340;
    const oficial = data.find(d => d.casa === 'oficial')?.venta ?? 1020;
    const mep = data.find(d => d.casa === 'bolsa')?.venta ?? 1285;
    const ccl = data.find(d => d.casa === 'contadoconliqui')?.venta ?? 1310;
    const lastUpdated = data[0]?.fechaActualizacion || new Date().toISOString();

    return { blue, oficial, mep, ccl, lastUpdated };
  } catch (err) {
    console.warn('[FinanceService] Could not fetch live dollar rates, using fallback:', err);
    return null;
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
