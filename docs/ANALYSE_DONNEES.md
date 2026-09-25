# Analyse du dossier `Data/` — Projet Kasbah (exercice MIRAGE)

27 fichiers analysés (10 docx, 16 pdf, 1 pptx), répartis en 6 dossiers de cellule.
Contexte commun : **AtlasGrid**, opérateur d'énergie à Casablanca (~1 200 salariés), victime du
rançongiciel **Mirage.A** revendiqué par **SIROCCO** (double extorsion, 20 BTC sous 48 h).
Entrée par le compte VPN du prestataire **OasisNet** (`svc_oasisnet`, sans MFA) dès J-21.
J1 = 23/09/2026, J2 = 24/09/2026 ; les autres horodatages sont relatifs (J-n) dans les sources.

| Cellule | Fichiers | Type de données | Informations principales | Interface construite |
|---|---|---|---|---|
| **SOC / Détection** (Yahya El Hama) | Chronologie J1-J2 (docx), Fiches traçabilité J1 et J2 (docx + 21 captures), Fil de la journée (docx), Suivi SOC (pdf), Enquête Mirage (pdf), Dossier CyberShield (pptx) | Journaux (VPN, proxy, pare-feu, EDR, SIEM, Veeam), fiches de pièces A-xx avec SHA-256 et chaîne de custody, 35 annonces horodatées, IOC, ATT&CK | 23/40 serveurs chiffrés, 117,8 Go exfiltrés en 10 nuits, 2 118 sessions C2, 21 fiches (9 preuves, 8 bruits, 4 fausses pistes), 5 incidents, 12 IOC, 13 techniques, 9 faiblesses | Dashboard SOC : KPI (réels / dérivés / N/A), séquence 03:11→03:16, exfiltration par nuit, sessions VPN, triage filtrable, IOC copiables, matrice ATT&CK, actifs, faiblesses, fil des annonces |
| **Forensique** (Achraf Khairouni) | hypothesis.pdf, _v2, _v3 | Rapport d'investigation versionné | Vecteur distant confirmé ; 8 hypothèses chiffrées (55 % → 2 %) ; frise Survenue/Signalée ; contradictions (OasisNet, DSI) ; 7 points ouverts ; état des actifs | Enquête, hypothèses, convergence de la nuit J-1, frise, casier à preuves (captures réelles), points ouverts, historique v1→v3 |
| **Continuité d'activité** (Malak Atouahri + 5) | PCA/PRA (pdf), Plan de containment (pdf) | BIA (DMIA/PDMA), modes dégradés, ordre de reprise, 38 actions avec statut, échéances, décisions, main courante | Écart majeur : PDMA jusqu'à 3 mois si Veeam perdu ; 2 scénarios de reprise ; critère de coupure IT/OT | Pilotage, Kanban de containment (statuts modifiables), analyse d'impact, modes dégradés, Gantt PRA + scénarios, blocage & sortie, main courante |
| **Risque / Conformité** (Amina Essafi) | Tableau de risques, Retour DC/2026/01 (v3 + court) | Registre P×I, obligations légales (05-20, 09-08, 17-99, DOC), engagements clients, rançon | 11 risques (6 critiques), 8 obligations, SLA 99,5 %, responsabilités OasisNet, données exposées | Heatmap P×I, registre, suivi des obligations (J2 matin vs soir), calculateur SLA, OasisNet, données exposées, arbitrage rançon, sources |
| **Direction / Coordination** (Aya Belkhaouad, Reda El Ghardegue + 4) | Note DC/2026/01, Cartographie SI | Demandes par cellule, cartographie, criticité C1–C4, dépendances | Situation à consolider, format de réponse, 15 actifs classés, 6 dépendances, priorités | Poste de commandement, suivi des retours de cellules, cartographie SI, dépendances, registre D1–D5, main courante |
| **Communication** (Hamza El Ouardi) | 8 docx + 2 communiqués pdf | Messages internes, salariés, clients, presse, public | Pistes FP-2 et FP-6 levées sans accusation ; 2 versions de communiqué ; réponses Chérifienne des Mines et presse | Salle de presse par audience, lecteur de message, comparaison des communiqués, demandes entrantes, règles de communication |

## Relations entre cellules (documentées)
Direction → 5 cellules (note DC/2026/01) · Risque → Direction (retour J2 16:45) · Continuité → Communication (faits) ·
Communication → Direction (validation) · Forensic → Continuité (feu vert de reprise) · SOC → Forensic (pièces) ·
SOC → Continuité (A-13) · SOC → Communication (A-16, incident public) · Risque → Communication (consignes).

## Règles appliquées
- Aucune donnée inventée : absence dans les sources → « N/A » ou « Aucune donnée disponible ».
- Chaque KPI porte sa provenance : **Réel** (lu dans une pièce), **Dérivé** (calculé), **N/A**.
- Les jours des messages sans horodatage sont marqués « déduit ».

## Mise à jour — fil de la plateforme KASBAH (`KASBAH · Cellule.pdf`)

Export du fil de la cellule (Rabat · Cellule 5, actes I à III). Il fait foi pour les heures,
les verdicts posés par la cellule et les décisions. Données ajoutées dans
`src/data/common/platformFeed.js` et `src/data/common/cellDecisions.js`.

**Corrections apportées**
- Main courante du Plan de containment : heures décalées d'une heure par rapport à la plateforme
  (ex. A-02 : 13:27 → 14:27, notification Autorité : 15:42 → 16:42) ; réalignées, heure d'origine conservée (`docTime`).
- Décision D2 : le plan la laissait « à reporter » ; choix réel = isoler seulement les segments critiques.
- Décision D5 (rançon) : temporiser puis faire traîner → 40 BTC, échéance J3 minuit, deux lots publiés.
- Bande LTO-9 : « non vérifiée » → intacte à Settat, dernière copie J-42, 38 To, jamais testée, 5 à 10 jours (A-06, RSSI J3 12:12).
- « Vos sauvegardes ont été détruites » : réfuté.
- Communiqués : ordre établi (A déposé 16:40, B 16:46) ; journaliste : Leïla Mansouri.
- Pièces ajoutées ou complétées : A-04, A-06, A-07, A-15, A-18, A-24.

**Ajouts**
- 12 décisions tracées (page `/decisions`), fil complet (page `/evenements`), pistes écartées FP-2 à FP-12, rendus déposés.
- Verdict de la cellule sur les 27 pièces, avec justification, confiance et retour du RSSI ;
  4 écarts avec les fiches : A-19, A-21, A-40 (bruit dans la fiche) et A-24 (fausse piste dans la fiche).
- Messages de SIROCCO décodés : César +3 « Fausse piste AhAhAh » ; Base64 « délai de 42 minutes ».
- Fichiers déposés absents de `Data/` : `final_timeline.png`, `AtlasGrid_Plan_de_reprise_FR_sans_termes_simples.pdf`.

## Indicateurs calculés (MTTR, taux de résolution, Security Risk Score)

Calculés dans `src/services/metricsService.js` à partir des données ; provenance « dérivé ».
Hypothèse : J1, J2 et J3 sont des jours consécutifs (23, 24, 25/09/2026).

- **MTTR** : pour chacune des 9 pistes écartées (FP-2 à FP-12), délai entre le premier message citant la pièce
  et le message de clôture. Moyenne **5 h 39**, médiane **1 h 25** (FP-2 et FP-6 clôturées le lendemain, 20 h 09).
- **Taux de résolution** : incidents contenus / incidents identifiés par le SOC = **2 / 5 = 40 %**
  (INC-003 fraude en 1 h, INC-005 clé USB en 2 h 30 ; INC-001 confiné mais non résolu).
- **Temps de confinement** du rançongiciel : 4 h 13 pour le patient zéro (J1 11:52 → 16:05), 28 h 06 pour le réseau (→ J2 15:58).
- **Security Risk Score** : Σ(P × I) du registre / (11 × 16) × 100 = 115 / 176 = **65 / 100** (niveau élevé).
