import { request } from './api';
import { cells, cellRelations, coordinationRhythm } from '../data/common/cells';
import { cellMembers } from '../data/common/people';
import { documents } from '../data/common/documents';
import { containmentActions } from '../data/continuite/plans';
import { cellContributions } from '../data/direction/coordination';

// Progression d'une cellule = part des actions du plan de containment dont elle
// est porteuse et qui sont « Fait ». Indicateur dérivé, affiché comme tel.
export function cellProgress(cellId) {
  const owned = containmentActions.filter((a) => a.cells.includes(cellId));
  const done = owned.filter((a) => a.status === 'fait').length;
  const open = owned.filter((a) => a.status !== 'fait').length;
  return { total: owned.length, done, open, blocked: owned.filter((a) => a.status === 'bloque').length, pct: owned.length ? Math.round((done / owned.length) * 100) : null };
}

function enrich(cell) {
  const members = cellMembers.filter((m) => m.cellId === cell.id);
  return {
    ...cell,
    responsible: members.find((m) => m.id === cell.responsibleId) || null,
    members,
    documents: documents.filter((d) => d.cellId === cell.id),
    progress: cellProgress(cell.id),
    contribution: cellContributions[cell.id] || null,
    relations: cellRelations.filter((r) => r.from === cell.id || r.to === cell.id),
  };
}

export const cellService = {
  list: () => request('/cells', () => cells.map(enrich)),
  get: (id) => request(`/cells/${id}`, () => {
    const cell = cells.find((c) => c.id === id);
    if (!cell) throw new Error(`Cellule inconnue : ${id}`);
    return enrich(cell);
  }),
  relations: () => request('/cells/relations', () => ({ relations: cellRelations, rhythm: coordinationRhythm })),
};

export const getCellMeta = (id) => cells.find((c) => c.id === id);
export const allCells = cells;
