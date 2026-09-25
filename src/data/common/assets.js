// Inventaire des actifs croisant trois sources :
//  - criticity (C1–C4) : cartographie Direction / Coordination
//  - bia (niveau, DMIA, PDMA) : PCA / PRA, cellule Continuité
//  - state : inventaire SCCM A-13 et diapositive « Assets » du dossier SOC
// Un champ absent des sources vaut null (affiché « N/A »).

export const ASSET_STATES = {
  chiffre: { label: 'Chiffré', tone: 'critical' },
  compromis: { label: 'Compromis', tone: 'critical' },
  partiel: { label: 'Partiel', tone: 'serious' },
  sabote: { label: 'Neutralisé', tone: 'critical' },
  injoignable: { label: 'Injoignable', tone: 'serious' },
  intact: { label: 'Intact', tone: 'good' },
  ecarte: { label: 'Légitime, écarté', tone: 'neutral' },
  inconnu: { label: 'Non vérifié', tone: 'warning' },
};

export const CRITICITY_LEVELS = {
  C1: { label: 'C1 — Vital', desc: 'Conduite de l’exploitation' },
  C2: { label: 'C2 — Critique', desc: 'Services communs, sécurité ou reprise' },
  C3: { label: 'C3 — Important', desc: 'Services internes et relation client' },
  C4: { label: 'C4 — Secondaire', desc: 'Impact limité sur la continuité immédiate' },
};

export const assets = [
  { id: 'scada', name: 'SCADA-HMI-*', label: 'Supervision industrielle (SCADA / IHM)', zone: 'Exploitation industrielle (OT)', criticity: 'C1', bia: { level: 'Vital (mission)', dmia: '0 (ne doit pas s’arrêter)', pdma: 'N/A' }, state: 'intact', stateNote: 'Réseau OT isolé (air-gap)', justification: 'Pilote la production et la distribution ; sécurité des personnes ; régulateur.' },
  { id: 'dc01', name: 'DC-01', label: 'Annuaire Active Directory', zone: 'Identités et droits', criticity: 'C2', bia: { level: 'Vital (socle)', dmia: '24 h (après reconstruction)', pdma: '24 h' }, state: 'partiel', stateNote: 'Authentification dégradée', justification: 'Tout s’y authentifie ; sa compromission donne le contrôle du SI.' },
  { id: 'dc02', name: 'DC-02', label: 'Annuaire Active Directory', zone: 'Identités et droits', criticity: 'C2', bia: { level: 'Vital (socle)', dmia: '24 h (après reconstruction)', pdma: '24 h' }, state: 'intact', stateNote: 'Réplication OK — à auditer', justification: 'Peut avoir répliqué les modifications de l’attaquant.' },
  { id: 'vbr01', name: 'VBR-01', label: 'Sauvegardes en ligne (Veeam)', zone: 'Reprise des données', criticity: 'C2', bia: { level: 'Vital (reprise)', dmia: 'À préserver', pdma: '—' }, state: 'sabote', stateNote: 'Rétention sabotée à J-3', justification: 'Seul moyen de restaurer sans payer.' },
  { id: 'bkp01', name: 'BKP-01', label: 'Dépôt de sauvegarde', zone: 'Reprise des données', criticity: 'C2', bia: { level: 'Vital (reprise)', dmia: 'À préserver', pdma: '—' }, state: 'injoignable', stateNote: 'Injoignable depuis J1 15:28', justification: 'Dépôt Veeam.' },
  { id: 'bkp02', name: 'BKP-02', label: 'Dépôt de sauvegarde', zone: 'Reprise des données', criticity: 'C2', bia: { level: 'Vital (reprise)', dmia: 'À préserver', pdma: '—' }, state: 'injoignable', stateNote: 'Injoignable depuis J1 15:28', justification: 'Dépôt Veeam.' },
  { id: 'lto9', name: 'LTO-9', label: 'Copie hors ligne (bandes trimestrielles)', zone: 'Reprise des données', criticity: 'C2', bia: { level: 'Vital (reprise)', dmia: 'À préserver', pdma: 'Jusqu’à 3 mois' }, state: 'intact', stateNote: 'Site de Settat, air-gap : intacte, dernière copie J-42, jamais testée (A-06, RSSI J3 12:12)', justification: 'Dernier recours ; fréquence trimestrielle. Source de restauration retenue par la cellule.' },
  { id: 'vpngw', name: 'VPN-GW', label: 'VPN d’administration (FortiGate)', zone: 'Administration distante', criticity: 'C2', bia: { level: 'Critique', dmia: 'Restreint', pdma: '—' }, state: 'compromis', stateNote: 'Vecteur d’entrée via svc_oasisnet', justification: 'Nécessaire à OasisNet mais vecteur d’entrée.' },
  { id: 'fgt', name: 'FGT-RBT-01', label: 'Pare-feu FortiGate', zone: 'Administration distante', criticity: null, bia: null, state: 'compromis', stateNote: 'Règle C2 OUT-TEMP-443 ajoutée', justification: 'Source : diapositive « Assets » SOC.' },
  { id: 'edr', name: 'Console Defender', label: 'Antivirus / EDR', zone: 'Protection des systèmes', criticity: 'C2', bia: { level: 'Critique', dmia: '4 h', pdma: '—' }, state: null, stateNote: 'Désactivé sur FIN-112', justification: 'Seule visibilité sur la propagation.' },
  { id: 'erpapp', name: 'ERP-APP-01', label: 'ERP (applicatif)', zone: 'Applications métiers', criticity: 'C2', bia: { level: 'Important', dmia: '3 à 5 jours', pdma: '24 h' }, state: 'chiffre', stateNote: 'ERP hors service', justification: 'Achats, stocks, compta ; procédure papier possible.' },
  { id: 'erpdb', name: 'ERP-DB-01', label: 'ERP (base de données)', zone: 'Applications métiers', criticity: 'C2', bia: { level: 'Important', dmia: '3 à 5 jours', pdma: '24 h' }, state: 'chiffre', stateNote: 'Base ERP chiffrée', justification: 'ERP-APP-01 dépend de ERP-DB-01.' },
  { id: 'fact02', name: 'FACT-02', label: 'Facturation clients', zone: 'Applications métiers', criticity: 'C3', bia: { level: 'Critique', dmia: '48 h', pdma: '24 h' }, state: 'chiffre', stateNote: 'Clôture impossible', justification: 'Chaîne de revenu ; trésorerie ; relation grands comptes.' },
  { id: 'paie01', name: 'PAIE-01', label: 'Paie', zone: 'Applications métiers', criticity: 'C3', bia: { level: 'Important*', dmia: 'Selon échéance', pdma: '1 mois' }, state: 'chiffre', stateNote: 'Paie du mois bloquée', justification: 'Devient critique à J-5 du versement des salaires.' },
  { id: 'filerrbt', name: 'FILER-RBT-02', label: 'Partages de fichiers (Rabat)', zone: 'Postes et collaboration', criticity: 'C3', bia: { level: 'Important', dmia: '3 jours', pdma: '24 h' }, state: 'chiffre', stateNote: 'Note de rançon ici ; source d’exfiltration', justification: 'Cible du chiffrement ; documents métiers.' },
  { id: 'filercasa', name: 'FILER-CASA-01', label: 'Partages de fichiers (Casablanca)', zone: 'Postes et collaboration', criticity: 'C3', bia: { level: 'Important', dmia: '3 jours', pdma: '24 h' }, state: 'chiffre', stateNote: 'Partages chiffrés', justification: 'Documents métiers.' },
  { id: 'msg01', name: 'MSG-01', label: 'Messagerie', zone: 'Postes et collaboration', criticity: 'C3', bia: { level: 'Critique en crise', dmia: 'Palliatif immédiat', pdma: '24 h' }, state: 'partiel', stateNote: 'Fichiers dégradés', justification: 'Coordination et communication externe ; remplaçable par mobiles.' },
  { id: 'webcli', name: 'WEB-CLI-01', label: 'Portail client (facturation)', zone: 'Service client exposé', criticity: 'C3', bia: { level: 'Critique', dmia: '48 h', pdma: '24 h' }, state: null, stateNote: 'Indisponible selon le client (Chérifienne des Mines)', justification: 'Raccordement exact à FACT-02 à préciser.' },
  { id: 'intra', name: 'INTRA-01', label: 'Intranet', zone: 'Postes et collaboration', criticity: 'C3', bia: { level: 'Secondaire', dmia: 'Plusieurs jours', pdma: '1 semaine' }, state: null, stateNote: null, justification: 'Pas d’impact sur la mission.' },
  { id: 'ipbx', name: 'IPBX-01', label: 'Téléphonie', zone: 'Postes et collaboration', criticity: 'C3', bia: { level: 'Critique en crise', dmia: 'Palliatif immédiat', pdma: '24 h' }, state: null, stateNote: null, justification: 'Remplaçable par mobiles.' },
  { id: 'webpub', name: 'WEB-PUB-01', label: 'Site public WordPress', zone: 'Hébergement externe', criticity: 'C4', bia: { level: 'Secondaire', dmia: 'Plusieurs jours', pdma: '1 semaine' }, state: 'intact', stateNote: 'Hors domaine — canal d’information externe', justification: 'Son arrêt touche surtout l’image.' },
  { id: 'fin112', name: 'FIN-112', label: 'Poste — direction financière', zone: 'Postes utilisateurs', criticity: 'C3', bia: null, state: 'compromis', stateNote: 'Patient zéro, isolé sous tension', justification: 'Premier poste touché (A-01).' },
  { id: 'rh031', name: 'RH-031', label: 'Poste RH', zone: 'Postes utilisateurs', criticity: 'C3', bia: null, state: 'ecarte', stateNote: 'Adware ancien, bénin', justification: 'A-01.' },
  { id: 'paiesta3', name: 'PAIE-STA-3', label: 'Poste paie', zone: 'Postes utilisateurs', criticity: 'C3', bia: null, state: 'ecarte', stateNote: 'Ticket #4471', justification: 'A-17.' },
  { id: 'pccompta14', name: 'PC-COMPTA-14', label: 'Poste comptabilité', zone: 'Postes utilisateurs', criticity: 'C3', bia: null, state: 'ecarte', stateNote: 'Support N1 (HELP-3391)', justification: 'A-41.' },
  { id: 'itadmin02', name: 'IT-ADMIN-02', label: 'Poste d’administration', zone: 'Postes utilisateurs', criticity: 'C3', bia: null, state: 'ecarte', stateNote: 'PsExec, ticket #4502', justification: 'A-25.' },
  { id: 'srvbuild02', name: 'SRV-BUILD-02', label: 'Serveur de build', zone: 'Applications métiers', criticity: null, bia: null, state: 'ecarte', stateNote: '7-Zip, faux positif', justification: 'A-22.' },
];

// Répartition des 40 serveurs selon A-13 (SCCM, J2 10:00) et la diapositive 3 SOC.
export const serverInventory = {
  total: 40,
  encrypted: 23,
  partial: 2,
  intactCited: 3,
  notDetailed: 12,
  encryptedNamed: ['PAIE-01', 'FACT-02', 'FILER-RBT-02', 'FILER-CASA-01', 'ERP-APP-01', 'ERP-DB-01'],
  encryptedUnnamed: 17,
  note: '« Intacts cités » compte SCADA-HMI-* comme un seul groupe. Les 17 autres serveurs chiffrés ne sont pas nommés dans les sources.',
  source: 'A-13 · CyberShield SOC (diapositive 3)',
};
