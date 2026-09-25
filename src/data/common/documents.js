// Registre des 27 fichiers présents dans Data/. `file` pointe vers la copie
// servie depuis public/sources ; `size` est la taille réelle en octets.

export const documents = [
  // Communication
  { id: 'com-badge', cellId: 'communication', title: 'Alerte — Anomalie de contrôle d’accès', original: 'Badge.docx', file: 'Badge.docx', type: 'docx', size: 11852, kind: 'Message interne', day: 'J1' },
  { id: 'com-badge2', cellId: 'communication', title: 'Point de situation — Mise hors de cause du stagiaire IT', original: 'Badge2.docx', file: 'Badge2.docx', type: 'docx', size: 5846, kind: 'Message interne', day: 'J2' },
  { id: 'com-chefdesmines', cellId: 'communication', title: 'RE: Exigence de garanties — Chérifienne des Mines', original: 'Chefdesmines.docx', file: 'Chefdesmines.docx', type: 'docx', size: 6450, kind: 'Réponse client', day: 'J2' },
  { id: 'com-communique-crise', cellId: 'communication', title: 'Communiqué officiel — Incident de cybersécurité (version sourcée)', original: 'communique_crise.pdf', file: 'communique_crise.pdf', type: 'pdf', size: 59572, kind: 'Communiqué', day: 'J2' },
  { id: 'com-facturation', cellId: 'communication', title: 'Réponse — Indisponibilité du portail de facturation', original: 'Emailfacturation.docx', file: 'Emailfacturation.docx', type: 'docx', size: 13357, kind: 'Réponse client', day: 'J1' },
  { id: 'com-paiement', cellId: 'communication', title: 'Point d’information interne — Versement des salaires', original: 'EmailPleintesPaiement.docx', file: 'EmailPleintesPaiement.docx', type: 'docx', size: 4934, kind: 'Message salariés', day: 'J2' },
  { id: 'com-suspect', cellId: 'communication', title: 'Signalement — Courriel financier suspect (Réf. A-23)', original: 'Emailsuspecte.docx', file: 'Emailsuspecte.docx', type: 'docx', size: 5914, kind: 'Message interne', day: 'J2' },
  { id: 'com-rendu', cellId: 'communication', title: 'Communiqué officiel — Incident technique maîtrisé', original: 'Rendu_communication.pdf', file: 'Rendu_communication.pdf', type: 'pdf', size: 104223, kind: 'Communiqué', day: 'J2' },
  { id: 'com-article', cellId: 'communication', title: 'RE: Demande d’information — Droit de réponse presse', original: 'REPONCEARTICLE.docx', file: 'REPONCEARTICLE.docx', type: 'docx', size: 5176, kind: 'Réponse presse', day: 'J2' },
  { id: 'com-usb', cellId: 'communication', title: 'Point de situation — Écart de la piste « PAIE-SAUVE »', original: 'SuiteCleUSB.docx', file: 'SuiteCleUSB.docx', type: 'docx', size: 5922, kind: 'Message interne', day: 'J2' },

  // Risque / Conformité
  { id: 'rc-retour-court', cellId: 'risque', title: 'Retour Risque / Conformité à la note DC/2026/01 (version courte)', original: 'Retour_Risque_Conformite_DC-2026-01_court (1).pdf', file: 'Retour_Risque_Conformite_DC-2026-01_court_1_.pdf', type: 'pdf', size: 49145, kind: 'Retour de cellule', day: 'J2' },
  { id: 'rc-retour-v3', cellId: 'risque', title: 'Retour Risque / Conformité à la note DC/2026/01 (v3)', original: 'Retour_Risque_Conformite_DC-2026-01_v3.pdf', file: 'Retour_Risque_Conformite_DC-2026-01_v3.pdf', type: 'pdf', size: 55867, kind: 'Retour de cellule', day: 'J2' },
  { id: 'rc-tableau', cellId: 'risque', title: 'Tableau de risques — Incident MIRAGE', original: 'Tableau_de_risques_RisqueConformite.pdf', file: 'Tableau_de_risques_RisqueConformite.pdf', type: 'pdf', size: 55935, kind: 'Registre des risques', day: 'J2' },

  // Continuité d'activité
  { id: 'ca-pca-pra', cellId: 'continuite', title: 'PCA / PRA — Attaque par rançongiciel MIRAGE', original: 'PCA_PRA_AtlasGrid_Cellule_Continuite.pdf', file: 'PCA_PRA_AtlasGrid_Cellule_Continuite.pdf', type: 'pdf', size: 88184, kind: 'Plan', day: 'J1' },
  { id: 'ca-containment', cellId: 'continuite', title: 'Plan de containment — version complète (soir J2)', original: 'Plan_de_containment_complet.pdf', file: 'Plan_de_containment_complet.pdf', type: 'pdf', size: 165453, kind: 'Plan', day: 'J2' },

  // Direction / Coordination
  { id: 'dc-cartographie', cellId: 'direction', title: 'Analyse du système d’information — cartographie et criticité', original: 'cartographie du système d_information_cellule5.pdf', file: 'cartographie_du_systeme_d_information_cellule5.pdf', type: 'pdf', size: 446630, kind: 'Rapport', day: 'J1' },
  { id: 'dc-note', cellId: 'direction', title: 'Note de coordination DC/2026/01', original: 'Note_Coordination_Urgent_upload.pdf', file: 'Note_Coordination_Urgent_upload.pdf', type: 'pdf', size: 230566, kind: 'Note', day: 'J2' },

  // Forensics
  { id: 'fo-hyp-v1', cellId: 'forensics', title: 'Hypothèses d’intrusion — physique vs distant (v1)', original: 'hypothesis.pdf', file: 'hypothesis.pdf', type: 'pdf', size: 1164109, kind: 'Rapport d’investigation', day: 'J1' },
  { id: 'fo-hyp-v2', cellId: 'forensics', title: 'Reconstitution de l’attaque (v2)', original: 'hypothesis_v2.pdf', file: 'hypothesis_v2.pdf', type: 'pdf', size: 1302876, kind: 'Rapport d’investigation', day: 'J1' },
  { id: 'fo-hyp-v3', cellId: 'forensics', title: 'Reconstitution de l’attaque (v3)', original: 'hypothesis_v3.pdf', file: 'hypothesis_v3.pdf', type: 'pdf', size: 1305233, kind: 'Rapport d’investigation', day: 'J1' },

  // SOC
  { id: 'soc-chrono', cellId: 'soc', title: 'Chronologie de l’incident — mise à jour Jour 2', original: 'Chronologie_incident_J1_J2.docx', file: 'Chronologie_incident_J1_J2.docx', type: 'docx', size: 17447, kind: 'Chronologie', day: 'J2' },
  { id: 'soc-deck', cellId: 'soc', title: 'CyberShield SOC — Analyse de l’incident MIRAGE', original: 'CyberShield SOC — Analyse de l_incident MIRAGE.pptx', file: 'CyberShield_SOC_Analyse_de_l_incident_MIRAGE.pptx', type: 'pptx', size: 856714, kind: 'Dossier d’analyse', day: 'J2' },
  { id: 'soc-enquete', cellId: 'soc', title: 'Enquête Mirage — AtlasGrid (synthèse J1 / J2)', original: 'Enquête Mirage — AtlasGrid.pdf', file: 'Enquete_Mirage_AtlasGrid.pdf', type: 'pdf', size: 1509805, kind: 'Synthèse visuelle', day: 'J2' },
  { id: 'soc-fiches-j1', cellId: 'soc', title: 'Fiches de traçabilité — Jour 1', original: 'Fiche_tracabilite_Day1.docx', file: 'Fiche_tracabilite_Day1.docx', type: 'docx', size: 1157309, kind: 'Fiches de traçabilité', day: 'J1' },
  { id: 'soc-fil', cellId: 'soc', title: 'Fil de la journée — annonces du SOC', original: 'fil-de-la-journee-soc_day2.docx', file: 'fil-de-la-journee-soc_day2.docx', type: 'docx', size: 22243, kind: 'Fil d’annonces', day: 'J2' },
  { id: 'soc-suivi', cellId: 'soc', title: 'Suivi SOC — fiches d’incidents 1 à 12', original: 'suivi soc pb.pdf', file: 'suivi_soc_pb.pdf', type: 'pdf', size: 472005, kind: 'Suivi d’incidents', day: 'J2' },
  { id: 'soc-fiches-j2', cellId: 'soc', title: 'Fiches de traçabilité — Jour 2', original: 'Tracabilite JOUR2.docx', file: 'Tracabilite_JOUR2.docx', type: 'docx', size: 2590407, kind: 'Fiches de traçabilité', day: 'J2' },
];
