import { request } from './api';
import { evidence, evidenceStats, VERDICTS } from '../data/common/evidence';

export const evidenceService = {
  list: () => request('/evidence', () => ({ items: evidence, stats: evidenceStats, verdicts: VERDICTS })),
  get: (ref) => request(`/evidence/${ref}`, () => evidence.find((e) => e.ref === ref) || null),
};

export const findEvidence = (ref) => evidence.find((e) => e.ref === ref);
