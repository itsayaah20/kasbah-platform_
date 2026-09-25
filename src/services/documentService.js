import { request } from './api';
import { documents } from '../data/common/documents';

export const documentUrl = (doc) => `/sources/${encodeURIComponent(doc.file)}`;

export const documentService = {
  list: () => request('/documents', () => documents),
};
