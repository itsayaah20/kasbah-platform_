import { request } from './api';
import { cellMembers, stakeholders } from '../data/common/people';

export const userService = {
  list: () => request('/users', () => ({ members: cellMembers, stakeholders })),
};

export const allMembers = cellMembers;
