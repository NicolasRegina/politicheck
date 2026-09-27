import fs from 'node:fs';
import path from 'node:path';
import type { CampaignPromise } from '../types';
import { MOCK_PROMISES } from '../data/mockData';

const PROMISES_FILE = path.resolve(process.cwd(), 'src/data/promises.json');

export function getPromises(): CampaignPromise[] {
  try {
    if (fs.existsSync(PROMISES_FILE)) {
      const data = fs.readFileSync(PROMISES_FILE, 'utf-8');
      const parsed = JSON.parse(data) as CampaignPromise[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('[Promises Service] Error reading promises file:', error);
  }
  return MOCK_PROMISES;
}

export function votePromise(
  promiseId: string,
  voteType: 'fulfilled' | 'inProgress' | 'broken'
): { success: boolean; promise?: CampaignPromise; error?: string } {
  try {
    const promises = getPromises();
    const index = promises.findIndex((p) => p.id === promiseId);

    if (index === -1) {
      return { success: false, error: 'Promesa no encontrada' };
    }

    const currentPromise = promises[index];
    if (!currentPromise.votes) {
      currentPromise.votes = { fulfilled: 0, inProgress: 0, broken: 0 };
    }

    if (voteType in currentPromise.votes) {
      currentPromise.votes[voteType] += 1;
    }

    // Persist to JSON file
    fs.writeFileSync(PROMISES_FILE, JSON.stringify(promises, null, 2), 'utf-8');

    return { success: true, promise: currentPromise };
  } catch (error: any) {
    console.error('[Promises Service] Error recording vote:', error);
    return { success: false, error: error.message };
  }
}

export function getPromisesStats(promises: CampaignPromise[]) {
  const total = promises.length;
  const fulfilled = promises.filter((p) => p.status === 'cumplida').length;
  const inProgress = promises.filter((p) => p.status === 'en_progreso').length;
  const paused = promises.filter((p) => p.status === 'en_pausa').length;
  const broken = promises.filter((p) => p.status === 'incumplida').length;

  const totalCitizenVotes = promises.reduce((acc, p) => {
    if (!p.votes) return acc;
    return acc + (p.votes.fulfilled || 0) + (p.votes.inProgress || 0) + (p.votes.broken || 0);
  }, 0);

  return {
    total,
    fulfilled,
    inProgress,
    paused,
    broken,
    fulfilledPct: total > 0 ? Math.round((fulfilled / total) * 100) : 0,
    inProgressPct: total > 0 ? Math.round((inProgress / total) * 100) : 0,
    totalCitizenVotes
  };
}
