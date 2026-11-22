import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { MemoryTtlCache } from '../src/services/cache.ts';
import {
  getNewsClustersFromSupabase,
  getLastSyncTimestampFromSupabase,
  getActiveCivicBanner,
  upsertCivicBanner,
  invalidateNewsCache,
  invalidateBannersCache,
  supabaseReadCache,
} from '../src/services/supabase.ts';

function createMockSupabaseClient(handler: (call: { table: string; selectCols: string; limit?: number; op: string }) => any) {
  const calls: Array<{ table: string; selectCols: string; limit?: number; op: string }> = [];

  const client = {
    from(table: string) {
      const state: { table: string; selectCols: string; limit?: number; op: string } = {
        table,
        selectCols: '',
        op: 'select',
      };

      const chain: any = {
        select(cols: string) {
          state.selectCols = cols;
          return chain;
        },
        upsert() {
          state.op = 'upsert';
          return chain;
        },
        neq() { return chain; },
        eq() { return chain; },
        gt() { return chain; },
        order() { return chain; },
        limit(n: number) {
          state.limit = n;
          return chain;
        },
        maybeSingle() {
          calls.push({ ...state });
          return Promise.resolve(handler(state));
        },
        single() {
          calls.push({ ...state });
          return Promise.resolve(handler(state));
        },
        then(resolve: any, reject: any) {
          calls.push({ ...state });
          return Promise.resolve(handler(state)).then(resolve, reject);
        },
      };

      return chain;
    },
  };

  return { client: client as any, calls };
}

test('MemoryTtlCache deduplicates concurrent in-flight requests and caches within TTL', async () => {
  const cache = new MemoryTtlCache();
  let loads = 0;

  const loader = async () => {
    loads++;
    await new Promise((r) => setTimeout(r, 15));
    return { value: loads };
  };

  const results = await Promise.all([
    cache.getOrLoad('k1', 5000, loader),
    cache.getOrLoad('k1', 5000, loader),
    cache.getOrLoad('k1', 5000, loader),
  ]);

  assert.equal(loads, 1);
  assert.deepEqual(results[0], { value: 1 });
  assert.deepEqual(results[2], { value: 1 });

  const cachedAgain = await cache.getOrLoad('k1', 5000, loader);
  assert.equal(loads, 1);
  assert.deepEqual(cachedAgain, { value: 1 });

  cache.invalidate('k');
  const afterInvalidate = await cache.getOrLoad('k1', 5000, loader);
  assert.equal(loads, 2);
  assert.deepEqual(afterInvalidate, { value: 2 });
});

test('getLastSyncTimestampFromSupabase selects ONLY updated_at and caches consecutive calls', async () => {
  supabaseReadCache.invalidate();
  const { client, calls } = createMockSupabaseClient(() => ({
    data: { updated_at: '2026-11-22T18:00:00.000Z' },
    error: null,
  }));

  const ts1 = await getLastSyncTimestampFromSupabase(client);
  const ts2 = await getLastSyncTimestampFromSupabase(client);

  assert.equal(ts1, '2026-11-22T18:00:00.000Z');
  assert.equal(ts2, '2026-11-22T18:00:00.000Z');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].selectCols, 'updated_at');
});

test('getNewsClustersFromSupabase enforces bounded limit, caches reads, and refreshes after invalidation', async () => {
  supabaseReadCache.invalidate();
  let version = 1;
  const { client, calls } = createMockSupabaseClient(() => ({
    data: [
      {
        id: `story-v${version}`,
        lead_title: 'Título',
        neutral_headline: `Titular neutral v${version}`,
        summary: 'Resumen',
        category: 'Política',
        spectrum: { oficialismoPct: 33, centroDatosPct: 34, oposicionPct: 33, totalOutlets: 3 },
        articles: [{ outletName: 'Infobae', timestamp: Date.now() }],
        key_quotes: { timestamp: Date.now() },
        updated_at: new Date().toISOString(),
      },
    ],
    error: null,
  }));

  const first = await getNewsClustersFromSupabase({ maxAgeDays: 2, limit: 15 }, 7, client);
  const second = await getNewsClustersFromSupabase({ maxAgeDays: 2, limit: 15 }, 7, client);

  assert.equal(calls.length, 1);
  assert.equal(calls[0].limit, 15);
  assert.equal(first?.[0].id, 'story-v1');
  assert.equal(second?.[0].id, 'story-v1');

  version = 2;
  invalidateNewsCache();
  const third = await getNewsClustersFromSupabase({ maxAgeDays: 2, limit: 15 }, 7, client);

  assert.equal(calls.length, 2);
  assert.equal(third?.[0].id, 'story-v2');
});

test('getActiveCivicBanner caches reads and upsertCivicBanner invalidates banner cache', async () => {
  supabaseReadCache.invalidate();
  let bannerTitle = 'Banner v1';
  const { client, calls } = createMockSupabaseClient((call) => {
    if (call.op === 'upsert') {
      bannerTitle = 'Banner v2';
      return { data: { id: 'b1', title: bannerTitle, is_active: true }, error: null };
    }
    return {
      data: {
        id: 'b1',
        title: bannerTitle,
        image_url: 'https://example.com/b.webp',
        destination_url: 'https://example.com',
        position: 'home_top',
        is_active: true,
        updated_at: new Date().toISOString(),
      },
      error: null,
    };
  });

  const b1 = await getActiveCivicBanner('home_top', client);
  const b2 = await getActiveCivicBanner('home_top', client);
  assert.equal(b1?.title, 'Banner v1');
  assert.equal(b2?.title, 'Banner v1');
  assert.equal(calls.length, 1);

  await upsertCivicBanner({ id: 'b1', title: 'Banner v2' }, client);
  const b3 = await getActiveCivicBanner('home_top', client);
  assert.equal(b3?.title, 'Banner v2');
  assert.equal(calls.length, 3); // 1 select + 1 upsert + 1 refreshed select

  invalidateBannersCache();
});

test('Public SSR pages and polling APIs expose CDN Cache-Control headers', () => {
  const root = process.cwd();
  const checks = [
    { file: 'src/pages/api/news/latest.ts', expect: 's-maxage=120' },
    { file: 'src/pages/api/chat/messages.ts', expect: 's-maxage=5' },
    { file: 'src/pages/index.astro', expect: 's-maxage=300' },
    { file: 'src/pages/historia/[id].astro', expect: 's-maxage=3600' },
    { file: 'src/pages/promesa/[id].astro', expect: 's-maxage=600' },
  ];

  for (const c of checks) {
    const content = fs.readFileSync(path.join(root, c.file), 'utf-8');
    assert.ok(content.includes(c.expect), `Expected ${c.file} to include ${c.expect}`);
  }
});
