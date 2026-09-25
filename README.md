# Kasbah — plateforme de pilotage de crise (exercice MIRAGE)

Application React (Vite) qui exploite les documents du dossier `Data/` : tableau de bord global,
une interface dédiée par cellule, alertes, activités, événements, pièces à conviction, statistiques.

## Lancer

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # build de production dans dist/
```

Connexion : choisir une cellule et un profil (authentification simulée côté frontend).

## Architecture

```
src/
├── data/            Données transcrites des 27 fichiers de Data/ (une source par cellule + common/)
├── services/        Couche d'accès (api.js) : mock local ou backend via VITE_API_URL
├── hooks/           useAsync, useTable (recherche/tri/filtre/pagination), useTabParam…
├── context/         Thème & session, alertes (lu/archivé), toasts
├── components/      Réutilisables : layout, cards, charts, tables, alerts, activity, notifications, search, common
├── features/        Une interface par cellule (soc, forensics, continuite, risque, direction, communication)
├── pages/           Routes
└── styles/          Design system (tokens, thèmes sombre/clair)
public/evidence/     21 captures d'artefacts extraites des fiches de traçabilité
public/sources/      Copies des documents sources (ouverts / téléchargés depuis l'app)
```

## Brancher un backend

Définir `VITE_API_URL` (ex. `VITE_API_URL=https://api.exemple.ma npm run dev`). Chaque service
appelle alors `GET ${VITE_API_URL}/<ressource>` (`/cells`, `/cells/soc/dashboard`, `/alerts`,
`/activities`, `/evidence`, `/statistics`, `/documents`, `/users`) et attend la même forme de
données que `src/data`. Les pages n'ont pas à changer.

## Routes

`/dashboard` · `/cellules` · `/cellules/:id` (+ `/activites`, `/statistiques`) · `/relations` ·
`/alertes` · `/activites` · `/evenements` · `/pieces` · `/statistiques` · `/rapports` ·
`/utilisateurs` · `/parametres` · `/profil` — alias anglais `/alerts`, `/activities`, `/statistics`,
`/users`, `/settings`, `/cellules/:id/activities|statistics`.

Voir `docs/ANALYSE_DONNEES.md` pour l'analyse des fichiers sources.
