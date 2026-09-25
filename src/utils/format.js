export const nf = new Intl.NumberFormat('fr-FR');
export const nf1 = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });

export function formatBytes(bytes) {
  if (bytes == null) return 'N/A';
  const units = ['o', 'Ko', 'Mo', 'Go'];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i += 1; }
  return `${nf1.format(v)} ${units[i]}`;
}

export function pct(part, total) {
  return total ? Math.round((part / total) * 100) : 0;
}

export function initials(name = '') {
  return name
    .replace(/[^\p{L}\s.-]/gu, '')
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

export function normalize(text = '') {
  return String(text).normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

export function countBy(items, key) {
  return items.reduce((acc, it) => {
    const k = typeof key === 'function' ? key(it) : it[key];
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
}

// 338 → « 5 h 39 » ; 50 → « 50 min » ; 1686 → « 28 h 06 »
export function formatDuration(minutes) {
  if (minutes == null) return 'N/A';
  const m = Math.round(minutes);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return `${h} h ${String(m % 60).padStart(2, '0')}`;
}
