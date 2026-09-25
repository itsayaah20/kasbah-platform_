// Séries chiffrées lues dans les captures des pièces A-02, A-03, A-05, A-10, A-12.

// A-02 — FortiGate SSL-VPN, 8 sessions de svc_oasisnet (export J1 13:10)
export const vpnSessions = [
  { day: 'J-21', window: '02:04–04:52', srcIp: '196.200.114.41', mfa: false, outGb: 1.2 },
  { day: 'J-19', window: '02:11–03:58', srcIp: '196.200.114.41', mfa: false, outGb: 0.8 },
  { day: 'J-16', window: '02:22–04:39', srcIp: '102.118.53.17', mfa: false, outGb: 1.4 },
  { day: 'J-14', window: '01:57–04:20', srcIp: '102.118.53.17', mfa: false, outGb: 1.6 },
  { day: 'J-11', window: '02:03–04:41', srcIp: '102.118.53.17', mfa: false, outGb: 1.7 },
  { day: 'J-9', window: '02:30–05:01', srcIp: '102.118.53.17', mfa: false, outGb: 2.1 },
  { day: 'J-4', window: '02:12–04:44', srcIp: '102.118.53.17', mfa: false, outGb: 1.9 },
  { day: 'J-1', window: '02:15–04:35', srcIp: '102.118.53.17', mfa: false, outGb: 1.8 },
];

// A-03 — Zscaler, transferts sortants nocturnes > 1 Go (export J2 09:30)
export const exfiltrationNights = [
  { day: 'J-10', window: '02:10–04:40', source: 'FIN-112', gb: 11.2 },
  { day: 'J-9', window: '02:20–04:35', source: 'FIN-112', gb: 12.8 },
  { day: 'J-8', window: '02:05–04:50', source: 'FILER-RBT', gb: 9.7 },
  { day: 'J-7', window: '02:15–04:30', source: 'FILER-RBT', gb: 13.4 },
  { day: 'J-6', window: '02:00–04:45', source: 'FILER-RBT', gb: 12.1 },
  { day: 'J-5', window: '02:25–04:20', source: 'FILER-RBT', gb: 10.9 },
  { day: 'J-4', window: '02:10–04:55', source: 'FILER-RBT', gb: 14.0 },
  { day: 'J-3', window: '02:05–04:25', source: 'FILER-RBT', gb: 12.6 },
  { day: 'J-2', window: '02:30–04:40', source: 'FILER-RBT', gb: 11.8 },
  { day: 'J-1', window: '02:15–04:35', source: 'FILER-RBT', gb: 9.3 },
];

export const exfiltrationMeta = {
  destination: '45.137.184.62:443',
  sni: 'cdn-sync-eu.storage-blob[.]net',
  ja3: 'a0e9f5d2b3c1e847f6…',
  category: 'Non classée',
  threatClass: 'exfiltration de données (suspectée)',
  totalGb: 117.8,
};

// Comparaison des volumes selon la source (diapositive 7 du dossier SOC)
export const volumeBySource = [
  { source: 'Proxy vers 45.137.184.62 (A-03)', gb: 117.8 },
  { source: 'Tunnel VPN svc_oasisnet (A-02)', gb: 12.5 },
  { source: 'Copie USB paie, légitime (A-17)', gb: 0.044 },
];

// A-05 — Veeam VBR-01, historique des travaux (export J1 15:15)
export const backupJobs = [
  { day: 'J-7', time: '01:00', job: 'Daily-Backup-Job', status: 'Succès', operator: 'système' },
  { day: 'J-6', time: '01:00', job: 'Daily-Backup-Job', status: 'Succès', operator: 'système' },
  { day: 'J-5', time: '01:00', job: 'Daily-Backup-Job', status: 'Succès', operator: 'système' },
  { day: 'J-4', time: '01:00', job: 'Daily-Backup-Job', status: 'Succès', operator: 'système' },
  { day: 'J-3', time: '01:12', job: 'Politique de rétention MODIFIÉE (GFS)', status: 'Modifié', operator: 'svc_oasisnet' },
  { day: 'J-3', time: '01:15', job: 'Daily-Backup-Job', status: 'Ignoré', operator: 'exclu par la nouvelle politique' },
  { day: 'J-2', time: '01:15', job: 'Daily-Backup-Job', status: 'Ignoré', operator: 'exclu par la nouvelle politique' },
  { day: 'J-1', time: '01:15', job: 'Daily-Backup-Job', status: 'Ignoré', operator: 'exclu par la nouvelle politique' },
  { day: 'J1', time: '03:15', job: 'Hôte FIN-112 : vssadmin delete shadows /all', status: 'T1490', operator: '—' },
  { day: 'J1', time: '15:28', job: 'Dépôt BKP-01 : injoignable', status: 'Injoignable', operator: '—' },
  { day: 'J1', time: '15:28', job: 'Dépôt BKP-02 : injoignable', status: 'Injoignable', operator: '—' },
];

// Recherche SIEM, J-1 de 03:11 à 03:16 (diapositive 6, A-10 + A-12)
export const attackSequence = [
  { time: '03:11', source: 'Splunk · 4672', event: 'Privilèges spéciaux attribués à svc_oasisnet', technique: null, step: 'Privilèges' },
  { time: '03:12:09', source: 'Defender', event: 'svhost32.exe lancé par services.exe, non signé', technique: 'T1036.005', step: 'Exécution' },
  { time: '03:12:41', source: 'Defender', event: 'DisableRealtimeMonitoring = 1', technique: 'T1562.001', step: 'Défense coupée' },
  { time: '03:13:02', source: 'Defender', event: 'Lecture de 9 412 fichiers (docx, xlsx, pdf, dwg, dbf)', technique: null, step: 'Reconnaissance' },
  { time: '03:14:31', source: 'Defender', event: 'Connexion à 45.137.184.62:443', technique: 'T1071.001', step: 'C2' },
  { time: '03:15:03', source: 'Defender', event: 'Fichiers renommés en *.mirage sur 14 partages', technique: 'T1486', step: 'Chiffrement' },
  { time: '03:15:07', source: 'Defender', event: 'vssadmin, bcdedit et wbadmin en 2 secondes', technique: 'T1490', step: 'Restauration bloquée' },
  { time: '03:15:22', source: 'Defender', event: 'Arrêt forcé du service WinDefend', technique: 'T1562.001', step: 'Antivirus arrêté' },
  { time: '03:15:40', source: 'Defender', event: 'LISEZMOI_MIRAGE.txt déposé 14 fois', technique: 'T1486', step: 'Note de rançon' },
  { time: '03:16', source: 'Splunk · 1102', event: 'Journal de sécurité Windows effacé', technique: 'T1070.001', step: 'Traces effacées' },
];

// Profil attendu vs observé de svc_oasisnet (diapositive 7)
export const accountProfile = [
  { criterion: 'Horaires', expected: '09:00 – 18:00', observed: '01:57 – 05:01' },
  { criterion: 'MFA', expected: 'Requis', observed: 'Absent, 8 sessions sur 8' },
  { criterion: 'Source', expected: 'Plages OasisNet', observed: '2 IP hors du pays habituel' },
  { criterion: 'RDP nocturnes', expected: 'Aucun', observed: 'Plus de 90 en 21 jours' },
];

export const c2Stats = { sessions: 2118, period: 'J-3 → J-1', beacon: '60 s ± 10 %', rule: 'OUT-TEMP-443', createdAt: 'J-11 02:03' };
