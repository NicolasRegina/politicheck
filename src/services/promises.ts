import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type { CampaignPromise, CitizenVoteRecord } from '../types';
import rawPromises from '../data/promises.json';
import { recordSupabaseVote, getSupabaseVotesAggregated } from './supabase';

const defaultPromises: CampaignPromise[] = rawPromises as CampaignPromise[];
const PROMISES_FILE = path.resolve(process.cwd(), 'src/data/promises.json');
const VOTES_FILE = path.resolve(process.cwd(), 'src/data/citizen_votes.json');
const SALT = process.env.VOTE_SALT || 'politicheck-civic-secret-salt-2027';

function getVoterHash(ip: string, userAgent: string): string {
  return crypto
    .createHash('sha256')
    .update(`${ip}::${userAgent}::${SALT}`)
    .digest('hex');
}

export function getCitizenVotes(): CitizenVoteRecord[] {
  try {
    if (fs.existsSync(VOTES_FILE)) {
      const data = fs.readFileSync(VOTES_FILE, 'utf-8');
      const parsed = JSON.parse(data) as CitizenVoteRecord[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error('[Promises Service] Error reading votes log:', error);
  }
  return [];
}

export function saveCitizenVotes(votes: CitizenVoteRecord[]): void {
  try {
    fs.writeFileSync(VOTES_FILE, JSON.stringify(votes, null, 2), 'utf-8');
  } catch (error) {
    console.error('[Promises Service] Error saving votes log:', error);
  }
}

export function getPromises(): CampaignPromise[] {
  try {
    let list = defaultPromises;
    if (fs.existsSync(PROMISES_FILE)) {
      const data = fs.readFileSync(PROMISES_FILE, 'utf-8');
      const parsed = JSON.parse(data) as CampaignPromise[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    }

    // Aggregate real votes strictly from votes log
    const votesLog = getCitizenVotes();
    list.forEach(p => {
      const promiseVotes = votesLog.filter(v => v.promiseId === p.id);
      p.votes = {
        fulfilled: promiseVotes.filter(v => v.voteType === 'fulfilled').length,
        inProgress: promiseVotes.filter(v => v.voteType === 'inProgress').length,
        broken: promiseVotes.filter(v => v.voteType === 'broken').length
      };
    });
    return list;
  } catch (error) {
    console.error('[Promises Service] Error reading promises file:', error);
  }
  return defaultPromises;
}

export async function getPromisesWithLiveVotes(): Promise<CampaignPromise[]> {
  const list = getPromises();
  try {
    const supabaseVotes = await getSupabaseVotesAggregated();
    if (supabaseVotes && Object.keys(supabaseVotes).length > 0) {
      list.forEach(p => {
        const cloud = supabaseVotes[p.id];
        if (cloud) {
          p.votes = {
            fulfilled: Math.max(p.votes?.fulfilled || 0, cloud.fulfilled),
            inProgress: Math.max(p.votes?.inProgress || 0, cloud.inProgress),
            broken: Math.max(p.votes?.broken || 0, cloud.broken)
          };
        }
      });
    }
  } catch (err) {
    console.warn('[Promises Service] Cloud votes merge notice:', err);
  }
  return list;
}

export function getPromiseById(id: string): CampaignPromise | undefined {
  const promises = getPromises();
  return promises.find((p) => p.id === id);
}


export async function votePromise(
  promiseId: string,
  voteType: 'fulfilled' | 'inProgress' | 'broken',
  clientIp = '127.0.0.1',
  userAgent = 'unknown'
): Promise<{ 
  success: boolean; 
  promise?: CampaignPromise; 
  error?: string; 
  message?: string;
  isNewVote?: boolean;
  switched?: boolean;
}> {
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

    const voterHash = getVoterHash(clientIp, userAgent);
    const votesLog = getCitizenVotes();

    const existingVoteIndex = votesLog.findIndex(
      (v) => v.promiseId === promiseId && v.voterHash === voterHash
    );

    let isNewVote = false;
    let switched = false;

    if (existingVoteIndex !== -1) {
      const existingVote = votesLog[existingVoteIndex];
      if (existingVote.voteType === voteType) {
        // Idempotent: already voted this exact option, no duplicate count
        return {
          success: true,
          promise: currentPromise,
          message: 'Tu voto ya estaba registrado.',
          isNewVote: false,
          switched: false
        };
      } else {
        // Voter switched position (e.g. from inProgress to broken)
        const oldType = existingVote.voteType;
        currentPromise.votes[oldType] = Math.max(0, (currentPromise.votes[oldType] || 1) - 1);
        currentPromise.votes[voteType] = (currentPromise.votes[voteType] || 0) + 1;

        existingVote.voteType = voteType;
        existingVote.votedAt = new Date().toISOString();
        switched = true;
      }
    } else {
      // First-time vote from this voter
      currentPromise.votes[voteType] = (currentPromise.votes[voteType] || 0) + 1;
      votesLog.push({
        promiseId,
        voterHash,
        voteType,
        votedAt: new Date().toISOString()
      });
      isNewVote = true;
    }

    // Persist changes locally if writable (ignore EROFS in serverless environments)
    try {
      saveCitizenVotes(votesLog);
      fs.writeFileSync(PROMISES_FILE, JSON.stringify(promises, null, 2), 'utf-8');
    } catch (fsErr: any) {
      if (fsErr?.code !== 'EROFS') {
        console.warn('[Promises] Local file persist notice:', fsErr?.message);
      }
    }

    // Sync to Supabase cloud database
    try {
      await recordSupabaseVote(promiseId, voterHash, voteType);
    } catch (err: any) {
      console.warn('[Promises] Supabase vote sync error:', err?.message);
    }

    return { 
      success: true, 
      promise: currentPromise, 
      isNewVote, 
      switched,
      message: switched ? 'Tu voto fue actualizado con éxito.' : 'Voto registrado con éxito.'
    };
  } catch (error: any) {
    console.error('[Promises Service] Error recording vote:', error);
    return { success: false, error: 'Error al registrar el voto.' };
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
