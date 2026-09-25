import { readStore } from '../utils/storage';

// Point d'entrée unique des données. Si VITE_API_URL est défini, chaque appel
// part vers le backend (`GET ${VITE_API_URL}${path}`) ; sinon le résolveur local
// renvoie les données issues de src/data, avec une latence simulée.
// Les pages n'ont pas à changer le jour où le backend est branché.

const API_BASE = import.meta.env.VITE_API_URL || '';

export const SETTINGS_KEY = 'kasbah.settings';
export const defaultSettings = { latency: 350, simulateErrors: false, density: 'comfortable' };

function settings() {
  return { ...defaultSettings, ...readStore(SETTINGS_KEY, {}) };
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function request(path, mockResolver) {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}${path}`, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new ApiError(`Erreur ${res.status} sur ${path}`, res.status);
    return res.json();
  }
  const { latency, simulateErrors } = settings();
  await new Promise((r) => setTimeout(r, latency));
  if (simulateErrors && Math.random() < 0.35) {
    throw new ApiError(`Service indisponible (${path}) — erreur simulée`, 503);
  }
  // structuredClone : les pages ne peuvent pas muter les données sources
  return structuredClone(mockResolver());
}
