// Personnes citées nommément dans les documents. Aucun e-mail ni téléphone n'est
// inventé : seuls les champs présents dans les sources sont renseignés.

export const cellMembers = [
  // Direction / Coordination — cartographie du système d_information_cellule5.pdf
  { id: 'aya-belkhaouad', name: 'Aya Belkhaouad', cellId: 'direction', role: 'Cheffe de cellule', lead: true, source: 'cartographie du système d_information_cellule5.pdf' },
  { id: 'reda-el-ghardegue', name: 'Reda El Ghardegue', cellId: 'direction', role: 'Chef de cellule adjoint', source: 'Note_Coordination_Urgent_upload.pdf' },
  { id: 'zakaria-rahali', name: 'Zakaria Rahali', cellId: 'direction', role: 'Membre', source: 'cartographie du système d_information_cellule5.pdf' },
  { id: 'ayoub-amarir', name: 'Ayoub Amarir', cellId: 'direction', role: 'Membre', source: 'cartographie du système d_information_cellule5.pdf' },
  { id: 'haitam-barjane', name: 'Haitam Barjane', cellId: 'direction', role: 'Membre', source: 'cartographie du système d_information_cellule5.pdf' },
  { id: 'yazid-assal', name: 'Yazid Assal', cellId: 'direction', role: 'Membre', source: 'cartographie du système d_information_cellule5.pdf' },

  // Continuité d'activité — PCA_PRA + Plan_de_containment_complet.pdf
  { id: 'malak-atouahri', name: 'Malak Atouahri', cellId: 'continuite', role: 'Répondante de la cellule', lead: true, source: 'Note_Coordination_Urgent_upload.pdf' },
  { id: 'hamza-ben-cheich', name: 'Hamza Ben Cheich', cellId: 'continuite', role: 'Rédaction PCA / PRA', source: 'PCA_PRA_AtlasGrid_Cellule_Continuite.pdf' },
  { id: 'mohammed-kouji', name: 'Mohammed Kouji', cellId: 'continuite', role: 'Rédaction PCA / PRA', source: 'PCA_PRA_AtlasGrid_Cellule_Continuite.pdf' },
  { id: 'safae-el-hadri', name: 'Safae El Hadri', cellId: 'continuite', role: 'Rédaction PCA / PRA', source: 'PCA_PRA_AtlasGrid_Cellule_Continuite.pdf' },
  { id: 'taha-zekri', name: 'Taha Zekri', cellId: 'continuite', role: 'Rédaction PCA / PRA', source: 'PCA_PRA_AtlasGrid_Cellule_Continuite.pdf' },
  { id: 'romayssaa-chamli', name: 'Romayssaa Chamli', cellId: 'continuite', role: 'Rédaction PCA / PRA', source: 'PCA_PRA_AtlasGrid_Cellule_Continuite.pdf' },

  // Répondants désignés par la note DC/2026/01
  { id: 'yahya-el-hama', name: 'Yahya El Hama', cellId: 'soc', role: 'Répondant SOC / Détection (G1)', lead: true, source: 'Note_Coordination_Urgent_upload.pdf' },
  { id: 'achraf-khairouni', name: 'Achraf Khairouni', cellId: 'forensics', role: 'Répondant Forensique / Investigation', lead: true, source: 'Note_Coordination_Urgent_upload.pdf' },
  { id: 'amina-essafi', name: 'Amina Essafi', cellId: 'risque', role: 'Répondante Risque / Conformité', lead: true, source: 'Retour_Risque_Conformite_DC-2026-01_v3.pdf' },
  { id: 'hamza-el-ouardi', name: 'Hamza El Ouardi', cellId: 'communication', role: 'Répondant Communication de crise', lead: true, source: 'Note_Coordination_Urgent_upload.pdf' },
];

// Acteurs du scénario (AtlasGrid, partenaires, tiers), cités dans les pièces.
export const stakeholders = [
  { id: 'karim-bennis', name: 'Karim Bennis', org: 'AtlasGrid', role: 'Directeur des SI (DSI)', note: "Qualifie d'abord l'incident de « mineur » (J1 12:52), révise son analyse à J2 14:41.", source: 'fil-de-la-journee-soc_day2.docx' },
  { id: 'salima-idrissi', name: 'Salima Idrissi', org: 'AtlasGrid', role: 'PDG d’AtlasGrid', note: "Confirme n'avoir rien envoyé (J2 13:16).", source: 'Tracabilite JOUR2.docx' },
  { id: 'yassine', name: 'Yassine', org: 'AtlasGrid', role: 'Relais DSI / SOC', note: 'Destinataire des demandes d’export (badgeuse, caméra, bande LTO-9).', source: 'hypothesis_v3.pdf' },
  { id: 'a-elomrani', name: 'a.elomrani', org: 'AtlasGrid (ancien)', role: 'Ancien DSI — compte désactivé depuis J-120', note: 'Jeton mobile jamais révoqué (A-15).', source: 'fil-de-la-journee-soc_day2.docx' },
  { id: 'y-tahiri', name: 'y.tahiri', org: 'AtlasGrid', role: 'Directeur commercial', note: 'Connexions depuis Paris, déplacement légitime (A-26).', source: 'Tracabilite JOUR2.docx' },
  { id: 'y-tazi', name: 'y.tazi', org: 'AtlasGrid', role: 'Utilisateur PC-COMPTA-14', note: 'Signale un poste « qui bouge tout seul » (A-41).', source: 'Tracabilite JOUR2.docx' },
  { id: 'admin-it', name: 'admin_it', org: 'AtlasGrid', role: 'Administrateur IT (compte nominatif)', note: 'PsExec légitime, ticket #4502 (A-25).', source: 'Tracabilite JOUR2.docx' },
  { id: 'mansouri', name: 'Leïla Mansouri', org: 'Presse', role: 'Journaliste, Maghreb Éco', note: 'Publication annoncée à 18h00 (J2 15:06) ; article équilibré intégrant la version d’AtlasGrid (J2 16:01), en ligne J3 13:07.', source: 'KASBAH · Cellule.pdf' },
  { id: 'rssi', name: 'Le RSSI', org: 'AtlasGrid', role: 'Sécurité des SI', note: 'Commente chaque verdict ; confirme à J3 12:12 que les copies hors ligne de Settat sont intactes.', source: 'KASBAH · Cellule.pdf' },
  { id: 'drh', name: 'La DRH', org: 'AtlasGrid', role: 'Ressources humaines', note: 'Signale le badge du stagiaire, la clé PAIE-SAUVE et le salarié en litige ; referme FP-2, FP-6 et FP-12.', source: 'KASBAH · Cellule.pdf' },
  { id: 'representant', name: 'Représentant du personnel', org: 'AtlasGrid', role: 'Instances internes', note: 'Demande une communication claire ; rumeur « les salaires ne seront pas versés » (J2 12:36).', source: 'KASBAH · Cellule.pdf' },
  { id: 'salarie-df', name: 'Un salarié de la direction financière', org: 'AtlasGrid', role: 'Utilisateur', note: 'A saisi son mot de passe (J1 12:17) ; signale l’ordre de virement frauduleux (J2 12:16).', source: 'KASBAH · Cellule.pdf' },
  { id: 'assureur', name: 'Assureur cyber', org: 'Assurance', role: 'Police cyber', note: 'Notification sous 48 h ; aucun paiement de rançon couvert sans accord écrit ; couverture confortée (J2 16:42).', source: 'KASBAH · Cellule.pdf' },
  { id: 'darkatlas', name: 'DarkAtlas Crew', org: 'Tiers', role: 'Revendication opportuniste', note: 'Revendication creuse, échantillon public de 2022 (A-18, FP-3).', source: 'KASBAH · Cellule.pdf' },
  { id: 'cherifienne', name: 'Chérifienne des Mines', org: 'Client grand compte', role: 'Client — SLA 99,5 % invoqué', note: 'Réclamation J1 15:12 ; exige des garanties J2 15:46 ; relation sauvée J3 13:01.', source: 'Plan_de_containment_complet.pdf' },
  { id: 'oasisnet', name: 'OasisNet', org: 'Prestataire', role: "Infogérant (administration d'une partie du SI, sauvegardes en ligne)", note: 'Compte svc_oasisnet compromis ; réponses jugées évasives.', source: 'Retour_Risque_Conformite_DC-2026-01_v3.pdf' },
  { id: 'sirocco', name: 'SIROCCO', org: 'Attaquant', role: 'Groupe revendiquant MIRAGE', note: '20 BTC sous 48 h, puis 40 BTC avant J3 minuit après temporisation ; deux lots publiés.', source: 'Plan_de_containment_complet.pdf' },
  { id: 'autorite', name: 'DGSSI / maCERT', org: 'Autorité', role: 'Autorité nationale de cybersécurité', note: 'Demande d’éléments sous 72 h (J2 16:01) ; notification reçue J2 16:42.', source: 'Plan_de_containment_complet.pdf' },
  { id: 'cndp', name: 'CNDP', org: 'Autorité', role: 'Protection des données personnelles (loi 09-08)', note: 'Information à évaluer si données personnelles confirmées.', source: 'Tableau_de_risques_RisqueConformite.pdf' },
];
