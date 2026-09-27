const fs = require('fs');
const path = require('path');
const https = require('https');

// Load .env manually if exists
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey || apiKey === 'tu_clave_aqui') {
  console.error('\n❌ ERROR: No se encontró GEMINI_API_KEY en el archivo .env');
  console.error('👉 Por favor creá el archivo .env en la raíz del proyecto y colocá:');
  console.error('   GEMINI_API_KEY=AIzaSy...\n');
  process.exit(1);
}

console.log('🔑 GEMINI_API_KEY detectada: ' + apiKey.substring(0, 8) + '...' + apiKey.slice(-4));
console.log('🤖 Probando conexión con Gemini 1.5 Flash...\n');

const sampleArticles = [
  {
    id: 'art-1',
    medio: 'Clarín',
    titulo: 'El secretario de Defensa británico dijo que están listos para defender las islas Malvinas por la fuerza',
    bajada: 'Wes Streeting advirtió sobre el riesgo de conflicto y la preparación militar del Reino Unido.'
  },
  {
    id: 'art-2',
    medio: 'La Nación',
    titulo: 'El secretario de Defensa británico aseguró que Reino Unido está armada y preparada para proteger a las islas Malvinas',
    bajada: 'Sostuvo que la controversia se zanjó en 1982 y remarcó la capacidad disuasoria británica.'
  },
  {
    id: 'art-3',
    medio: 'Ámbito Financiero',
    titulo: 'Malvinas: impulsan una reunión del Parlasur en Tierra del Fuego como gesto de respaldo regional',
    bajada: 'Legisladores de la región buscan unificar el reclamo soberano tras los dichos de Londres.'
  }
];

const prompt = `
Eres el motor de análisis editorial de Politicheck.
Analiza las siguientes noticias argentinas y agrúpalas en una sola "Historia":
Genera un JSON estricto con:
{
  "clusters": [
    {
      "kicker": "VOLANTA EN MAYUSCULAS",
      "neutralHeadline": "Titular neutral objetivo",
      "category": "Política",
      "summary": "Resumen objetivo en dos oraciones.",
      "aiComparisonNotice": "Síntesis del contraste de enfoques entre los medios (qué priorizó cada uno y qué omitió).",
      "spectrum": {
        "oficialismoPct": 35,
        "centroDatosPct": 40,
        "oposicionPct": 25
      }
    }
  ]
}

Noticias:
${JSON.stringify(sampleArticles, null, 2)}
`;

const postData = JSON.stringify({
  contents: [{ parts: [{ text: prompt }] }],
  generationConfig: {
    responseMimeType: 'application/json',
    temperature: 0.2
  }
});

const CANDIDATE_MODELS = [
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
  'gemini-3.5-flash-lite'
];

async function callGemini(model) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      },
      (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve({ model, data });
          } else {
            reject({ statusCode: res.statusCode, data });
          }
        });
      }
    );

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

(async () => {
  let success = false;
  for (const model of CANDIDATE_MODELS) {
    try {
      console.log(`📡 Consultando modelo: ${model}...`);
      const { data } = await callGemini(model);
      const parsed = JSON.parse(data);
      const resultText = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log(`\n✅ ¡Conexión exitosa con Google Gemini (${model})!\n`);
      console.log('📋 Resultado del análisis estructurado de prueba:');
      console.log('--------------------------------------------------');
      console.log(JSON.stringify(JSON.parse(resultText), null, 2));
      console.log('--------------------------------------------------\n');
      console.log('🎉 Todo listo para que el pipeline de Politicheck funcione en vivo.');
      success = true;
      break;
    } catch (err) {
      console.warn(`⚠️ Modelo ${model} respondió con error ${err.statusCode || err.message}. Probando siguiente modelo...`);
    }
  }

  if (!success) {
    console.error('❌ No se pudo conectar con ningún modelo de Gemini disponible.');
    process.exit(1);
  }
})();

