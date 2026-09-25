import { request } from './api';
import { cellDecisions } from '../data/common/cellDecisions';
import { platformFeed, closedLeads, deliverables, ACTS } from '../data/common/platformFeed';

export const decisionService = {
  list: () => request('/decisions', () => cellDecisions),
};

export const platformService = {
  feed: () => request('/platform/feed', () => ({ feed: platformFeed, acts: ACTS, closedLeads, deliverables })),
};
