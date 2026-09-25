// Les horodatages de l'exercice sont relatifs (« J-21 02:04 », « J2 11:14 »).
// sortKey les ordonne : jour relatif puis minutes. J0 n'existe pas dans les sources.

const DAY_RE = /J\s*([+-]?\d+)/;
const TIME_RE = /(\d{1,2})[:h](\d{2})/;

export function dayIndex(label = '') {
  const m = String(label).match(DAY_RE);
  return m ? Number(m[1]) : null;
}

export function minutesOf(label = '') {
  const m = String(label).match(TIME_RE);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
}

export function sortKey(day, time) {
  const d = dayIndex(day) ?? 0;
  const t = minutesOf(time) ?? (String(time).includes('Fin') ? 24 * 60 : 0);
  return d * 1440 + t;
}

export function formatStamp(day, time) {
  return [day, time].filter(Boolean).join(' · ');
}
