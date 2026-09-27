const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env manually
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        process.env[key] = val;
      }
    }
  });
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

console.log('--- TEST DE CONEXION A SUPABASE ---');
console.log('URL:', supabaseUrl);
console.log('Clave Anon provista:', supabaseKey ? `${supabaseKey.slice(0, 12)}... (longitud: ${supabaseKey.length})` : 'NO ENCONTRADA');

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: Falta SUPABASE_URL o SUPABASE_ANON_KEY en el archivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTest() {
  try {
    console.log('\n1. Probando consulta a tabla `citizen_votes`...');
    const { data: readData, error: readError } = await supabase
      .from('citizen_votes')
      .select('*')
      .limit(5);

    if (readError) {
      console.error('Error al leer citizen_votes:', readError.message);
      return;
    }
    console.log(' Lectura exitosa. Filas encontradas:', readData.length);

    console.log('\n2. Probando insercion de prueba en `citizen_votes`...');
    const testRecord = {
      promise_id: 'test-promise-001',
      voter_hash: 'test-voter-hash-abc',
      vote_type: 'cumple'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('citizen_votes')
      .upsert(testRecord)
      .select();

    if (insertError) {
      console.error('Error al insertar registro de prueba:', insertError.message);
      return;
    }
    console.log(' Insercion exitosa:', insertData);

    console.log('\n3. Limpiando registro de prueba...');
    const { error: deleteError } = await supabase
      .from('citizen_votes')
      .delete()
      .eq('promise_id', 'test-promise-001')
      .eq('voter_hash', 'test-voter-hash-abc');

    if (deleteError) {
      console.error('Error al limpiar registro de prueba:', deleteError.message);
      return;
    }
    console.log(' Limpieza exitosa.');

    console.log('\n4. Probando lectura a tabla `news_clusters`...');
    const { data: clusterData, error: clusterError } = await supabase
      .from('news_clusters')
      .select('id, lead_title')
      .limit(5);

    if (clusterError) {
      console.error('Error al leer news_clusters:', clusterError.message);
      return;
    }
    console.log(' Lectura exitosa en news_clusters. Filas:', clusterData.length);

    console.log('\n CONEXION Y PERMISOS DE SUPABASE FUNCIONANDO AL 100%!');
  } catch (err) {
    console.error('Excepcion durante el test:', err);
  }
}

runTest();
