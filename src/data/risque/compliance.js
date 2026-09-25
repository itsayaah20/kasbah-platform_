// Tableau_de_risques_RisqueConformite.pdf (situation J2 ~10:30) et
// Retour_Risque_Conformite_DC-2026-01_v3.pdf (J2 16:45, Amina Essafi).
// Criticité = P × I : ≥ 12 critique · 8–11 élevé · 4–7 moyen · ≤ 3 faible.

export const riskScale = [
  { level: 'critique', label: 'Critique', min: 12, tone: 'critical' },
  { level: 'eleve', label: 'Élevé', min: 8, tone: 'serious' },
  { level: 'moyen', label: 'Moyen', min: 4, tone: 'warning' },
  { level: 'faible', label: 'Faible', min: 0, tone: 'good' },
];

export const riskLevel = (score) => riskScale.find((s) => score >= s.min);

export const risks = [
  { id: 'R1', title: 'Divulgation des données personnelles exfiltrées', facts: '~118 Go sortis la nuit (A-03), C2 depuis FIN-112 ~10 j (A-09), note SIROCCO « données copiées » (menace de mise aux enchères).', exposed: 'Clients, salariés (paie/RH), fournisseurs', p: 4, i: 4, legal: 'Loi 09-08 : obligation de sécurité (art. 23) ; CNDP', treatment: 'Qualifier nature et volume des données ; informer la CNDP ; préparer l’info des personnes ; veille des sites de fuite.', owner: 'RSSI + DPO', evidence: ['A-03', 'A-09'] },
  { id: 'R2', title: 'Arrêt des processus vitaux (paie, facturation, ERP)', facts: '23/40 serveurs chiffrés (A-13) : PAIE-01, FACT-02, ERP-APP/DB-01, FILER.', exposed: 'Salariés (salaire du mois), clients, trésorerie', p: 4, i: 4, legal: 'Code du travail (paiement des salaires) ; SLA 99,5 % Chérifienne des Mines', treatment: 'PCA : paie de secours (virement N-1 reconduit), facturation manuelle ; priorités de restauration.', owner: 'Continuité + DAF', evidence: ['A-13'] },
  { id: 'R3', title: 'Incident de sécurité non déclaré à l’autorité', facts: 'Incident avéré et majeur depuis J2 matin.', exposed: 'AtlasGrid (sanction, responsabilité des dirigeants)', p: 3, i: 4, legal: 'Loi 05-20 + décret 2-21-406 : déclaration à la DGSSI dès connaissance ; renforcé si IIV', treatment: 'Déclarer aujourd’hui à la DGSSI / maCERT ; tracer l’heure de connaissance.', owner: 'Direction + RSSI', evidence: [] },
  { id: 'R4', title: 'Impossibilité de restaurer (sauvegardes détruites)', facts: 'Suppression des backups J1 03:15 depuis FIN-112, AV désactivé (A-05).', exposed: 'Toutes les données métier', p: 4, i: 4, legal: 'Loi 09-08 art. 23 (intégrité/disponibilité) ; obligations contractuelles OasisNet', treatment: 'Rechercher copies hors ligne / immuables ; ne pas « déchiffrer » avec l’outil de l’attaquant sans avis forensic.', owner: 'Continuité', evidence: ['A-05'] },
  { id: 'R5', title: 'Persistance de l’attaquant via le compte prestataire et l’AD', facts: 'VPN OasisNet sans MFA (A-02), DC-01 authentification dégradée.', exposed: 'SI entier, comptes à privilèges', p: 4, i: 3, legal: 'Loi 09-08 art. 24 (sous-traitant) ; contrat d’infogérance', treatment: 'Désactiver le compte OasisNet ; reset des comptes privilégiés (krbtgt ×2) ; MFA ; mise en demeure et demande de journaux.', owner: 'SOC + Juridique', evidence: ['A-02'] },
  { id: 'R6', title: 'Propagation vers l’OT / SCADA', facts: 'SCADA-HMI intact, réseau isolé (A-13).', exposed: 'Supervision réseau, sécurité des personnes', p: 1, i: 4, legal: 'Loi 05-20 (SI sensibles des IIV)', treatment: 'Maintenir l’air-gap ; interdire tout média / lien IT→OT ; surveillance renforcée.', owner: 'Continuité + OT', evidence: ['A-13'] },
  { id: 'R7', title: 'Fraude au président / BEC', facts: 'A-23 : 480 000 MAD, IBAN ES jamais utilisé, domaine sosie atlasgrid-finance.co.', exposed: 'Trésorerie, comptables', p: 3, i: 3, legal: 'Code pénal (escroquerie, loi 07-03) ; procédure de paiement interne', treatment: 'Ne pas payer ; alerte banque ; double validation + contre-appel ; bloquer le domaine ; plainte.', owner: 'DAF + SOC', evidence: ['A-23'] },
  { id: 'R8', title: 'Paiement de la rançon', facts: 'Demande 20 BTC, délai 48 h, doublement annoncé.', exposed: 'AtlasGrid, dirigeants', p: 2, i: 4, legal: 'Aucune garantie ; financement d’activité criminelle ; réglementation des changes (crypto)', treatment: 'Recommandation : ne pas payer ; ne pas négocier seul ; décision tracée de la Direction.', owner: 'Direction', evidence: ['A-04'] },
  { id: 'R9', title: 'Perte ou altération des preuves', facts: 'FIN-112 isolé sous tension (bon geste) ; horodatages suspects de la note (A-04).', exposed: 'Action pénale, assurance', p: 2, i: 3, legal: 'Loi 07-03 (plainte) ; chaîne de custody', treatment: 'Images disque/RAM, hash, main courante horodatée ; plainte auprès de la police judiciaire (BNLCC).', owner: 'Forensic', evidence: ['A-04'] },
  { id: 'R10', title: 'Atteinte à la réputation et contentieux clients', facts: 'Chérifienne des Mines exige une explication écrite sous 24 h ; presse ; rumeurs internes.', exposed: 'Image, clients grands comptes', p: 4, i: 3, legal: 'Contrats clients (SLA, pénalités, force majeure à étudier)', treatment: 'Réponse écrite factuelle sous 24 h validée Juridique ; message interne avant ce soir.', owner: 'Communication', evidence: ['A-16'] },
  { id: 'R11', title: 'Mise en cause injustifiée de salariés', facts: 'Stagiaire (badge, FP-2), paie PAIE-SAUVE (FP-6), salarié qui a cliqué.', exposed: 'Salariés concernés', p: 2, i: 2, legal: 'Loi 09-08 (finalité, proportionnalité) ; code du travail', treatment: 'Confidentialité ; pas de sanction pour le signalement ; données d’enquête limitées au besoin.', owner: 'RH + DPO', evidence: ['A-14', 'A-17'] },
].map((r) => ({ ...r, score: r.p * r.i }));

export const riskSynthesis = 'Rançongiciel avec double extorsion. Entrée par le compte VPN du prestataire OasisNet (sans MFA, 3 semaines, nuit, étranger) et hameçonnage ; patient zéro FIN-112 ; C2 actif ~10 j ; ~118 Go exfiltrés ; 23 serveurs sur 40 chiffrés ; AD dégradé ; OT/SCADA intact. Conséquence juridique : violation de données personnelles et incident de sécurité notifiable.';

export const NOTIF_STATUS = {
  'a-faire': { label: 'À faire', tone: 'warning' },
  'a-preparer': { label: 'À préparer', tone: 'warning' },
  'a-verifier': { label: 'À vérifier', tone: 'neutral' },
  fait: { label: 'Fait', tone: 'good' },
  'en-cours': { label: 'En cours', tone: 'info' },
};

// Obligations (Tableau de risques, section 2). `update` : évolution tracée dans
// le Plan de containment (actions M1–M9), sans modifier le statut d'origine.
export const notificationObligations = [
  { id: 'dgssi', recipient: 'DGSSI / maCERT', basis: 'Loi 05-20 et décret 2-21-406', trigger: 'Incident affectant la sécurité ou le fonctionnement du SI', deadline: 'Sans délai, dès connaissance → aujourd’hui (J2)', content: 'Nature, périmètre (23/40), vecteur (VPN prestataire), mesures prises', status: 'a-faire', owner: 'Direction + RSSI', update: { status: 'fait', note: 'Notification reçue J2 16:42 (M1) ; compléments sous 72 h en cours (M2)' } },
  { id: 'cndp', recipient: 'CNDP', basis: 'Loi 09-08 (art. 23-24)', trigger: 'Exfiltration probable de données personnelles', deadline: 'Pas de délai légal chiffré ; cible interne ≤ 72 h', content: 'Catégories de données et de personnes, volume, risques, mesures', status: 'a-faire', owner: 'DPO', update: { status: 'a-faire', note: 'M6 : à évaluer si données personnelles confirmées' } },
  { id: 'personnes', recipient: 'Personnes concernées', basis: 'Loi 09-08 (loyauté, sécurité) ; recommandations CNDP', trigger: 'Risque élevé : données publiées ou identifiants exposés', deadline: 'Dès que les catégories exposées sont connues', content: 'Ce qui s’est passé, risques, gestes à faire, contact DPO', status: 'a-preparer', owner: 'Com + DPO', update: { status: 'a-faire', note: 'M5 : clients de l’extrait A-07 avant J3 11h00' } },
  { id: 'police', recipient: 'Police judiciaire / parquet', basis: 'Code pénal art. 607-3 s. (loi 07-03), extorsion', trigger: 'Intrusion STAD, rançon, tentative d’escroquerie A-23', deadline: 'Au plus tôt', content: 'Plainte + main courante, IOC, preuves hachées', status: 'a-faire', owner: 'Juridique', update: null },
  { id: 'banque', recipient: 'Banque', basis: 'Procédures bancaires anti-fraude', trigger: 'Ordre frauduleux A-23 (IBAN ES)', deadline: 'Immédiat', content: 'Signalement, blocage de tout paiement vers cet IBAN', status: 'a-faire', owner: 'DAF', update: { status: 'fait', note: 'Courriel transmis à la banque, virement bloqué (DSI, J2 13:16)' } },
  { id: 'clients', recipient: 'Clients (Chérifienne des Mines…)', basis: 'Contrat : SLA 99,5 %', trigger: 'Portail de facturation indisponible', deadline: 'Réponse écrite < 24 h', content: 'Faits établis, délai estimé, pas de spéculation sur les données', status: 'a-faire', owner: 'Com + Juridique', update: { status: 'fait', note: 'M4 : réponse prudente notée J2 16:03 ; relation sauvée J3 13:01' } },
  { id: 'assureur', recipient: 'Assureur cyber', basis: 'Contrat d’assurance', trigger: 'Sinistre cyber', deadline: 'Selon police (souvent 24–72 h)', content: 'Déclaration de sinistre, avant toute décision sur la rançon', status: 'a-verifier', owner: 'DAF', update: { status: 'fait', note: 'Décision « dossier solide puis déclarer » ; couverture confortée J2 16:42' } },
  { id: 'salaries', recipient: 'Salariés / représentants', basis: 'Dialogue social', trigger: 'Rumeurs, paie bloquée', deadline: 'Avant ce soir (J2)', content: 'Message court, factuel, consignes (vigilance BEC/phishing)', status: 'a-faire', owner: 'Com + RH', update: { status: 'a-confirmer', note: 'Décision « rassurer sans détailler » : ton jugé vague (J2 15:58), apaisé après l’article (16:01)' } },
];

// Retour v3, rubrique 01 — analyse juridique détaillée
export const legalAnalysis = [
  { authority: 'DGSSI / maCERT', basis: 'Loi 05-20, art. 8 (déclarer « dès qu’elle prend connaissance »), art. 14 (IIV), art. 50 (amende 100 000 à 200 000 DH).', condition: 'Incident avéré (rempli). AtlasGrid doit être entité publique ou IIV : statut non confirmé.', delay: 'Sans délai, dès connaissance (T0 = J1 11:52).', missing: 'Acte de désignation IIV ; interlocuteur DGSSI ; référentiel de déclaration. Même en cas de doute, déclarer.' },
  { authority: 'CNDP', basis: 'Loi 09-08, art. 23 ; art. 58 (3 mois à 1 an et/ou 20 000–200 000 DH) ; art. 64 (amendes doublées pour une personne morale).', condition: 'Données personnelles effectivement consultées ou extraites.', delay: 'Pas de délai légal. Cible : 72 h depuis J1 14:27, soit avant J4 14:27.', missing: 'Liste des fichiers sortis ; catégories et nombre de personnes ; traitements déclarés (art. 12).' },
  { authority: 'Personnes concernées', basis: 'Loi 09-08, art. 3 (traitement loyal). Pas d’obligation explicite d’information.', condition: 'Risque réel : RIB, CIN, salaires, contacts ; menace de publication.', delay: 'Dès que les catégories exposées sont confirmées.', missing: 'Périmètre confirmé ; canal hors messagerie compromise.' },
  { authority: 'Assureur', basis: 'Code des assurances (loi 17-99), art. 20 : aviser « au plus tard dans les cinq jours ».', condition: 'Existence d’une police couvrant le cyber.', delay: '5 jours max ; survenance possible dès J-1, voire J-21 → déclarer aujourd’hui.', missing: 'Numéro de police ; garanties et exclusions ; accord préalable avant tout paiement.' },
  { authority: 'Autorité sectorielle énergie', basis: 'Réglementation sectorielle éventuelle.', condition: 'Atteinte à l’exploitation énergétique.', delay: 'À vérifier.', missing: 'Existence d’une obligation de signalement sectorielle.' },
];

export const clientCommitments = [
  { element: 'Disponibilité de 99,5 %', accepted: 'Invoqué par le client, non vérifié.', known: 'Portail inaccessible depuis J2 matin selon le client (possiblement plus tôt).', todo: 'Lire la clause : service couvert, période de mesure, exclusions, remède, plafond.' },
  { element: 'Rétablissement sous 24 heures', accepted: 'Non : demande nouvelle. L’accepter créerait un engagement (DOC, art. 230).', known: 'Continuité n’a pas encore donné de délai réaliste.', todo: 'Ne promettre aucun délai sans validation de Continuité et de la Direction.' },
  { element: 'Explication écrite de l’incident', accepted: 'Demandée ; obligation à vérifier au contrat.', known: 'Incident en cours, facturation touchée, cellule de crise mobilisée.', todo: 'Réponse factuelle, sans aveu de faute ni spéculation.' },
  { element: 'Force majeure', accepted: 'À ne pas invoquer à ce stade.', known: 'DOC, art. 269 ; l’absence de MFA affaiblit fortement l’argument.', todo: 'Réserver la question pour l’analyse juridique après la crise.' },
];

export const slaAllowance = { target: 99.5, month: 3.6, quarter: 10.9, year: 43.8 };

export const oasisnetResponsibilities = [
  { point: 'Sécurité du compte', finding: 'svc_oasisnet utilisé sans MFA alors que le profil l’exige ; connexions de nuit, depuis l’étranger (A-02).', basis: 'Loi 09-08, art. 23 al. 2 ; loi 05-20, art. 10.', action: 'Contrat d’infogérance : clauses de sécurité, MFA, comptes nominatifs, journalisation.' },
  { point: 'Sauvegardes', finding: 'Même compte modifie la rétention Veeam à J-3 (A-05).', basis: 'Contrat (obligation de moyens ou de résultat) ; DOC, art. 263.', action: 'Périmètre de service, tests de restauration, localisation des sauvegardes.' },
  { point: 'Information et coopération', finding: 'Deux messages minimisent ; renvoi aux « canaux contractuels ».', basis: 'DOC, art. 231 (bonne foi) ; loi 09-08, art. 23 al. 3.', action: 'Clause de notification d’incident, droit d’audit, remise des journaux.' },
  { point: 'Responsabilité et assurance', finding: 'Préjudice important (arrêt, rançon, notifications, clients).', basis: 'Contrat : plafond, exclusions, RC du prestataire.', action: 'Courrier de réserve de droits ; conservation des preuves ; pas de résiliation pendant la crise.' },
];

export const dataExposure = [
  { source: 'PAIE-01, partage paie', categories: 'Salaires, RIB, CIN, n° CNSS, adresses', people: 'Tous les salariés', risk: 'Fraude bancaire, usurpation d’identité, hameçonnage ciblé', sensitive: false },
  { source: 'Dossiers RH', categories: 'Contrats, évaluations, arrêts de travail', people: 'Salariés', risk: 'Atteinte à la vie privée ; données de santé sensibles (loi 09-08, art. 1)', sensitive: true },
  { source: 'Finance, ERP, facturation', categories: 'IBAN fournisseurs, factures, contacts grands comptes', people: 'Fournisseurs, clients', risk: 'Fraude au virement (déjà observée, A-23), hameçonnage', sensitive: false },
  { source: 'Messagerie (MSG-01), compte finance (A-11)', categories: 'Échanges internes et externes', people: 'Salariés, partenaires', risk: 'Fraude au président, divulgation', sensitive: false },
];

export const attackerClaims = [
  { claim: '« Vos fichiers sont chiffrés »', check: '23 / 40 serveurs chiffrés (A-13), extension .mirage', status: 'Confirmé' },
  { claim: '« Vos données ont été copiées »', check: 'Volumes sortants avérés (A-02, A-03) ; contenu non identifié', status: 'À confirmer' },
  { claim: '« Vos sauvegardes ont été détruites »', check: 'Sauvegardes en ligne neutralisées (A-05) ; copie hors ligne LTO-9 de Settat intacte (A-06, RSSI J3 12:12)', status: 'Réfuté' },
  { claim: '« Nous le saurons si vous prévenez les autorités »', check: 'Pression psychologique, aucun élément', status: 'Non étayé' },
];

export const ransomCriteria = [
  { criterion: 'Capacité de reprise sans payer', available: 'Copie LTO-9 de Settat intacte (J-42, 38 To), restauration estimée 5 à 10 jours (A-06) ; SCADA intact ; outil public (No More Ransom).', missing: 'Aucun test de restauration jamais réalisé ; pertes sur les six dernières semaines.' },
  { criterion: 'Cadre juridique du paiement', available: 'Aucun texte interdisant expressément de payer. Office des changes (2017) : transactions en monnaies virtuelles contraires à la réglementation. Projet de loi n° 42-25.', missing: 'Avis juridique sur le paiement en BTC ; position de la police.' },
  { criterion: 'Assurance', available: '—', missing: 'Couverture « extorsion » ; accord préalable de l’assureur ; prestataires imposés.' },
  { criterion: 'Effet d’un paiement', available: 'Ne supprime aucune obligation ; aucune garantie de suppression ni de non-récidive.', missing: '—' },
  { criterion: 'Échéance', available: '« 48:00:00 » à partir de la note (J2 11:01) ; après temporisation : 40 BTC avant J3 minuit, deux lots publiés.', missing: 'Heure exacte de départ du compte à rebours (A-04).' },
];

export const legalSources = [
  { label: 'Loi 05-20 relative à la cybersécurité', url: 'https://bwcimplementation.org/sites/default/files/resource/loi%2005-20.pdf' },
  { label: 'Décret 2-21-406 (art. 42)', url: 'https://static.lematin.ma/files/lematin/fichiers/articles/2021/08/cba35cb12f5e1a10edb4d6339fb28623.pdf' },
  { label: 'Loi 09-08 (CNDP)', url: 'https://www.cndp.ma/wp-content/uploads/2023/11/Loi-09-08-Fr.pdf' },
  { label: 'CNDP, infractions et sanctions', url: 'https://www.cndp.ma/wp-content/uploads/2024/03/CNDP-loi-09-08-Liste-des-infractions-sanctions-fr.pdf' },
  { label: 'Code pénal, art. 607-3 et s. (UNODC)', url: 'https://www.unodc.org/cld/fr/legislation/mar/code_penal/chapitre_x/articles_607-3_607-4/articles_607-3_607-4.html' },
  { label: 'Office des changes et monnaies virtuelles (2017)', url: 'https://telquel.ma/2017/11/21/loffice-changes-interdit-lutilisation-du-bitcoin_1569648' },
  { label: 'DOC art. 230, 231, 263, 269', url: 'https://www.village-justice.com/articles/execution-contrat-epreuve-covid,36114.html' },
];
