# MINDFLOW - L'Application de Jeux Cérébraux Sans Friction

## Vision Executive

**Problème identifié** : Les applications de jeux de mots et de chiffres (Sudoku, mots fléchés, Cemantix, Number Match) sont devenues quasi-injouables à cause de la publicité omniprésente et agressive.

**Notre solution** : Une plateforme unifiée de jeux cérébraux 100% gratuite au gameplay complet, financée par des achats cosmétiques optionnels et des donations volontaires.

**Positionnement** : "Tous les jeux cérébraux, gratuits, sans pub, pour toujours."

**Philosophie technique** : Coût de maintenance 0€/mois, quelle que soit la taille de la base utilisateurs.

---

## 1. ANALYSE CONCURRENTIELLE

### 1.1 Problèmes des Applications Existantes

| Problème | Impact Utilisateur | Notre Solution |
|----------|-------------------|----------------|
| Pub vidéo après chaque niveau | Frustration, abandon | Zéro pub, jamais |
| Pubs interstitielles | Interruption du flow | Expérience fluide |
| Achat de vies/indices | Pay-to-win | Gameplay 100% gratuit |
| Apps fragmentées | 10 apps différentes | Tout-en-un |
| Design daté/cheap | Expérience médiocre | UI/UX premium |
| Données vendues | Vie privée compromise | Privacy-first, tout en local |
| Abonnements multiples | Fatigue de l'abonnement | Pas d'abonnement |

### 1.2 Mapping Concurrentiel

```
                    PREMIUM
                       ↑
                       |
    Peak (puzzles)     |     ★ MINDFLOW
    NYT Games (abo)    |     (gratuit + dons)
                       |
    ←------------------+------------------→
    FRAGMENTÉ          |           UNIFIÉ
                       |
    Sudoku.com         |
    Wordle clones      |
    Cemantix           |
                       ↓
                   GRATUIT + PUBS
```

---

## 2. CATALOGUE DE JEUX

### 2.1 Jeux de Mots (Wording Games)

| Jeu | Description | Inspiration | Innovation |
|-----|-------------|-------------|------------|
| **MOTUS** | Deviner le mot en 6 essais | Wordle/Sutom | Classements GameCenter |
| **SÉMANTIQUE** | Trouver le mot par proximité sémantique | Cemantix | Thèmes quotidiens + historique |
| **FLÉCHÉS** | Mots croisés fléchés | Mots fléchés classiques | Génération infinie locale |
| **ANAGRAMMES** | Former des mots avec des lettres | Scrabble GO | Mode rush chronométré |
| **PENDU PRO** | Le pendu réinventé | Classique | Catégories thématiques |
| **CHAÎNE DE MOTS** | Relier des mots par leur sens | Contexto | Achievements dédiés |

### 2.2 Jeux de Chiffres (Number Games)

| Jeu | Description | Inspiration | Innovation |
|-----|-------------|-------------|------------|
| **SUDOKU** | Classique 9x9, 6x6, 16x16 | Sudoku.com | Variantes (Killer, Sandwich, Thermo) |
| **NUMBER MATCH** | Éliminer les paires | Number Match | Mode zen infini |
| **CALCUL MENTAL** | Résoudre des opérations | Brain training | Progression adaptative |
| **2048 FLOW** | Fusionner les tuiles | 2048 | Classements globaux |
| **NONOGRAM** | Picross/griddlers | Picross | Créateur de niveaux |
| **KAKURO** | Mots croisés numériques | Kakuro | Tutoriel interactif |

### 2.3 Jeux Hybrides

| Jeu | Description | Concept |
|-----|-------------|---------|
| **NERDLE** | Équations à deviner | Wordle + Maths |
| **CODE BREAKER** | Mastermind moderne | Logique + Pattern |
| **SEQUENCE** | Trouver la suite logique | Pattern recognition |

---

## 3. FONCTIONNALITÉS

### 3.1 Le "Daily Hub" - Page d'Accueil Quotidienne

```
┌─────────────────────────────────────────┐
│  Bonjour ! Jour 47 de streak            │
├─────────────────────────────────────────┤
│  DÉFIS DU JOUR                          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ MOTUS   │ │ SUDOKU  │ │SÉMANTIQUE│   │
│  │  ***    │ │  **     │ │   ****   │   │
│  │ 2:34    │ │ 5:12    │ │  12 coups│   │
│  └─────────┘ └─────────┘ └─────────┘   │
│                                         │
│  CLASSEMENT AMIS (via GameCenter)       │
│  1. Paul - 3/3 défis                    │
│  2. Vous - 2/3 défis                    │
│  3. Sophie - 1/3 défis                  │
│                                         │
│  OBJECTIF SEMAINE: 15/21 défis          │
│  ████████████░░░░░░ 71%                 │
└─────────────────────────────────────────┘
```

### 3.2 Système de Progression (100% local + GameCenter)

**Streaks & Habitudes**
- Streak quotidien (tous jeux confondus)
- Stocké localement + synchronisé via iCloud/Google Drive
- Rappels intelligents (opt-in)

**Achievements (via GameCenter / Play Games)**
- Achievements par jeu
- Achievements globaux
- Progression visible sur le profil

**Classements**
- Classements mondiaux via GameCenter/Play Games
- Classements amis automatiques
- Classements par jeu et global

### 3.3 Mode Offline Complet

- Tous les jeux jouables hors connexion (c'est le mode par défaut)
- Génération des grilles côté client
- Aucune dépendance serveur

---

## 4. MODÈLE ÉCONOMIQUE (SANS ABONNEMENT)

### 4.1 Philosophie : Gameplay 100% Gratuit

```
┌─────────────────────────────────────────────────────────┐
│                 GAMEPLAY GRATUIT                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ✓ TOUS les jeux (15+) — complets, sans limite         │
│  ✓ Tous les modes de jeu                               │
│  ✓ Défis quotidiens illimités                          │
│  ✓ Classements mondiaux (GameCenter/Play Games)        │
│  ✓ Achievements                                         │
│  ✓ Statistiques                                         │
│  ✓ Mode offline                                         │
│  ✓ Zéro publicité                                       │
│                                                         │
│  Le jeu complet, gratuit, pour toujours.               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Boutique Cosmétique (Achats Optionnels)

```
┌─────────────────────────────────────────────────────────┐
│                     BOUTIQUE                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  THÈMES VISUELS                                        │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │  DARK   │ │  NÉON   │ │ NATURE  │ │  RÉTRO  │      │
│  │  0.99€  │ │  0.99€  │ │  0.99€  │ │  0.99€  │      │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │ MINIMAL │ │  OCEAN  │ │ SUNSET  │ │ MONOCHROME│    │
│  │  0.99€  │ │  0.99€  │ │  0.99€  │ │  0.99€  │      │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘      │
│                                                         │
│  PACK TOUS THÈMES ————————————————————— 4.99€          │
│  (Économisez 60% + futurs thèmes inclus)               │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  PACKS SONS                                            │
│  • Ambiance Zen (nature, pluie, forêt) ——— 1.99€       │
│  • Clics Satisfaisants (ASMR) ———————————— 1.99€       │
│  • Rétro 8-bit ——————————————————————————— 1.99€       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  OUTILS                                                │
│  • Stats Avancées (graphiques, tendances) — 1.99€      │
│  • Export PDF (grilles imprimables) ———————— 1.99€     │
│  • Pack Polices Premium ————————————————————— 0.99€    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  PACK ULTIME (tout inclus) —————————————— 9.99€        │
│  Tous les thèmes + sons + outils                       │
│  + Tous les futurs contenus cosmétiques                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 4.3 Encart Donation (Soutien Volontaire)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  SOUTENIR MINDFLOW                                     │
│                                                         │
│  "MINDFLOW est développé avec passion et reste         │
│   gratuit sans pub. Si vous appréciez le projet,       │
│   vous pouvez nous aider à continuer."                 │
│                                                         │
│  ┌─────────┬─────────┬─────────┬─────────────┐        │
│  │   1€    │   3€    │   5€    │   Libre     │        │
│  │   ☕    │   🍕    │   🎁    │   [____]€   │        │
│  └─────────┴─────────┴─────────┴─────────────┘        │
│                                                         │
│  En remerciement :                                     │
│  • Badge "Supporter" sur votre profil                  │
│  • Nom dans les crédits (optionnel)                    │
│  • Notre gratitude éternelle                           │
│                                                         │
│  [  Peut-être plus tard  ]                             │
│                                                         │
└─────────────────────────────────────────────────────────┘

Règles d'affichage :
- Apparaît après 7 jours d'utilisation active
- Maximum 1 fois par mois si refusé
- Jamais pendant une partie
- Bouton "Ne plus afficher" respecté définitivement
```

### 4.4 Projection Financière

Avec 100,000 utilisateurs actifs :

| Source | Taux conversion | Montant moyen | Revenu estimé |
|--------|-----------------|---------------|---------------|
| Achats cosmétiques | 3-5% | 3€ | 9,000-15,000€ |
| Donations | 1-2% | 2.50€ | 2,500-5,000€ |
| **Total** | | | **11,500-20,000€** |

Note : Les coûts de maintenance étant de 0€/mois, tout revenu est bénéfice net (moins les frais de transaction ~15-30% sur stores).

---

## 5. ARCHITECTURE TECHNIQUE (COÛT ZÉRO)

### 5.1 Principe Fondamental

```
┌─────────────────────────────────────────────────────────┐
│           ARCHITECTURE 100% CLIENT-SIDE                 │
│              = 0€/MOIS DE MAINTENANCE                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  • Aucun serveur backend                               │
│  • Aucune base de données serveur                      │
│  • Tout le code s'exécute dans l'app/navigateur        │
│  • Hébergement statique uniquement                     │
│                                                         │
│  1 utilisateur = même coût que 10 millions             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Stack Technologique : React Native + Expo

```
┌─────────────────────────────────────────────────────────┐
│                 STACK CROSS-PLATFORM                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Framework: React Native + Expo SDK 52+                │
│  ├── iOS : Build natif via Expo                        │
│  ├── Android : Build natif via Expo                    │
│  └── Web : Expo Web (React Native Web)                 │
│                                                         │
│  Langage: TypeScript                                   │
│                                                         │
│  UI/Styling:                                           │
│  ├── NativeWind (Tailwind pour React Native)          │
│  ├── React Native Reanimated (animations)              │
│  └── Expo Vector Icons                                 │
│                                                         │
│  State Management:                                      │
│  ├── Zustand (état global léger)                       │
│  └── MMKV (stockage local ultra-rapide)               │
│                                                         │
│  Navigation: Expo Router (file-based routing)          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 5.3 Services Gratuits des Plateformes

```
┌─────────────────────────────────────────────────────────┐
│              SERVICES NATIFS (GRATUITS)                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  iOS (GameCenter)                 Android (Play Games)  │
│  ─────────────────                ────────────────────  │
│  • Classements        0€          • Classements    0€   │
│  • Achievements       0€          • Achievements   0€   │
│  • Profil joueur      0€          • Profil joueur  0€   │
│  • Sauvegarde iCloud  0€          • Sauvegarde     0€   │
│  • Anti-triche        0€          • Anti-triche    0€   │
│                                                         │
│  Librairies Expo:                                      │
│  • expo-game-center (iOS)                              │
│  • react-native-play-games-services (Android)          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 5.4 Stockage & Persistence

```
┌─────────────────────────────────────────────────────────┐
│                 STOCKAGE LOCAL                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  MMKV (Mobile) / AsyncStorage fallback                 │
│  ├── Progression du joueur                             │
│  ├── Statistiques                                       │
│  ├── Préférences (thème, sons, etc.)                   │
│  ├── Achats effectués                                  │
│  └── Streak et historique                              │
│                                                         │
│  Sauvegarde Cloud (automatique, gratuit)               │
│  ├── iOS : iCloud Key-Value Store                      │
│  ├── Android : Google Drive App Data                   │
│  └── Web : localStorage (pas de sync cross-device)     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 5.5 Hébergement & Distribution

| Plateforme | Solution | Coût |
|------------|----------|------|
| **iOS** | App Store | 99€/an (compte dev) |
| **Android** | Google Play | 25€ one-time |
| **Web** | Cloudflare Pages | 0€ |

**Coût total fixe** : ~100€/an (comptes développeur)
**Coût variable** : 0€ (pas de serveur)

### 5.6 Paiements In-App

```
┌─────────────────────────────────────────────────────────┐
│                   PAIEMENTS                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  iOS      → StoreKit 2 (In-App Purchase)               │
│             Commission Apple : 15-30%                   │
│                                                         │
│  Android  → Google Play Billing                        │
│             Commission Google : 15-30%                  │
│                                                         │
│  Web      → Stripe / Paddle                            │
│             Commission : ~3-5%                          │
│             (ou lien vers stores pour éviter)          │
│                                                         │
│  Note: Pas de coût fixe, uniquement % sur ventes       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 5.7 Structure du Projet

```
mindflow/
├── app/                          # Expo Router (screens)
│   ├── (tabs)/                   # Navigation principale
│   │   ├── index.tsx             # Daily Hub
│   │   ├── games.tsx             # Liste des jeux
│   │   ├── stats.tsx             # Statistiques
│   │   └── shop.tsx              # Boutique
│   ├── games/                    # Écrans de jeux
│   │   ├── motus.tsx
│   │   ├── sudoku.tsx
│   │   └── ...
│   └── _layout.tsx
│
├── src/
│   ├── games/                    # Logique des jeux
│   │   ├── core/                 # Engine partagé
│   │   │   ├── GameEngine.ts
│   │   │   ├── Timer.ts
│   │   │   └── Scoring.ts
│   │   ├── motus/
│   │   │   ├── logic.ts
│   │   │   ├── dictionary.ts     # Mots français (JSON)
│   │   │   └── components/
│   │   ├── sudoku/
│   │   │   ├── generator.ts      # Génération côté client
│   │   │   ├── solver.ts
│   │   │   └── variants/
│   │   └── ...
│   │
│   ├── components/               # Composants réutilisables
│   │   ├── ui/                   # Design system
│   │   ├── game/                 # Composants de jeu
│   │   └── shop/                 # Composants boutique
│   │
│   ├── stores/                   # État global (Zustand)
│   │   ├── userStore.ts
│   │   ├── gameStore.ts
│   │   └── purchaseStore.ts
│   │
│   ├── services/
│   │   ├── gameCenter.ts         # Intégration GameCenter
│   │   ├── playGames.ts          # Intégration Play Games
│   │   ├── purchases.ts          # In-App Purchases
│   │   └── storage.ts            # MMKV wrapper
│   │
│   ├── themes/                   # Thèmes visuels
│   │   ├── default.ts
│   │   ├── dark.ts
│   │   ├── neon.ts
│   │   └── ...
│   │
│   └── constants/
│       ├── achievements.ts       # Liste des achievements
│       ├── leaderboards.ts       # IDs des classements
│       └── products.ts           # IDs des achats in-app
│
├── assets/                       # Voir ASSETS.md
│   ├── images/
│   ├── sounds/
│   └── fonts/
│
└── dictionaries/                 # Données statiques
    ├── fr/
    │   ├── words-5.json          # Mots de 5 lettres
    │   ├── words-6.json
    │   └── definitions.json
    └── ...
```

---

## 6. ACHIEVEMENTS & CLASSEMENTS

### 6.1 Achievements GameCenter / Play Games

```
┌─────────────────────────────────────────────────────────┐
│                    ACHIEVEMENTS                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  MOTUS                                                 │
│  ├── "Premier Mot" — Trouver son premier mot    (10pt) │
│  ├── "Sans Faute" — Trouver en 1 essai          (50pt) │
│  ├── "Semaine Parfaite" — 7 jours de streak     (25pt) │
│  ├── "Centenaire" — 100 mots trouvés            (50pt) │
│  └── "Maître des Mots" — 1000 mots trouvés     (100pt) │
│                                                         │
│  SUDOKU                                                │
│  ├── "Logicien" — Finir une grille sans erreur  (10pt) │
│  ├── "Speed Demon" — Finir en moins de 3 min    (25pt) │
│  ├── "Expert" — Finir une grille Diabolique     (50pt) │
│  ├── "Variétés" — Jouer toutes les variantes    (50pt) │
│  └── "Grand Maître" — 500 grilles complétées   (100pt) │
│                                                         │
│  NUMBER MATCH                                          │
│  ├── "Première Paire" — Éliminer sa 1ère paire  (10pt) │
│  ├── "Combo x5" — 5 paires d'affilée            (25pt) │
│  ├── "Zen Master" — 1h en mode zen              (50pt) │
│  └── "Perfectionniste" — Vider une grille      (100pt) │
│                                                         │
│  GLOBAL                                                │
│  ├── "Touche-à-Tout" — Jouer à tous les jeux    (25pt) │
│  ├── "Régulier" — 30 jours de streak            (50pt) │
│  ├── "Supporter" — Faire un achat               (25pt) │
│  ├── "Mécène" — Faire une donation              (50pt) │
│  └── "Légende" — Tous les achievements         (200pt) │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 6.2 Classements (Leaderboards)

| Classement | Type | Reset |
|------------|------|-------|
| Motus - Meilleur temps | Par jeu | Permanent |
| Motus - Streak | Par jeu | Permanent |
| Sudoku Facile - Temps | Par difficulté | Hebdo |
| Sudoku Expert - Temps | Par difficulté | Hebdo |
| Score Global Hebdo | Tous jeux | Hebdomadaire |
| Score Global All-Time | Tous jeux | Permanent |

---

## 7. ROADMAP DE DÉVELOPPEMENT

### Phase 1 : MVP (8 semaines)

**Semaines 1-2 : Setup**
- [ ] Initialisation projet Expo
- [ ] Configuration TypeScript + NativeWind
- [ ] Design system de base (boutons, inputs, cards)
- [ ] Navigation (Expo Router)
- [ ] Store Zustand + MMKV

**Semaines 3-4 : Premier Jeu (MOTUS)**
- [ ] Logique complète du jeu
- [ ] UI du clavier et grille
- [ ] Animations (lettres qui se révèlent)
- [ ] Dictionnaire français intégré
- [ ] Écran de victoire/défaite

**Semaines 5-6 : Deuxième Jeu (SUDOKU)**
- [ ] Générateur de grilles (algorithme local)
- [ ] UI de la grille 9x9
- [ ] Système de notes
- [ ] Vérification des erreurs
- [ ] 4 niveaux de difficulté

**Semaines 7-8 : Infrastructure**
- [ ] Daily Hub (écran d'accueil)
- [ ] Système de streaks
- [ ] Statistiques basiques
- [ ] Intégration GameCenter (iOS)
- [ ] Build et test sur devices

### Phase 2 : Enrichissement (8 semaines)

**Semaines 9-10 : Jeux Additionnels**
- [ ] NUMBER MATCH
- [ ] ANAGRAMMES
- [ ] 2048

**Semaines 11-12 : Social**
- [ ] Intégration Play Games (Android)
- [ ] Classements fonctionnels
- [ ] Achievements
- [ ] Partage de scores

**Semaines 13-14 : Monétisation**
- [ ] Boutique UI
- [ ] Intégration StoreKit 2 (iOS)
- [ ] Intégration Google Play Billing
- [ ] Thèmes achetables
- [ ] Système de donations

**Semaines 15-16 : Polish**
- [ ] Thèmes visuels (dark, néon, nature)
- [ ] Sons et haptics
- [ ] Onboarding
- [ ] Optimisations performances

### Phase 3 : Lancement (4 semaines)

**Semaines 17-18**
- [ ] Beta TestFlight (iOS)
- [ ] Beta interne Play Store
- [ ] Corrections bugs
- [ ] Landing page web

**Semaines 19-20**
- [ ] Soumission App Store
- [ ] Soumission Play Store
- [ ] Déploiement version web
- [ ] Lancement public

### Phase 4 : Post-Lancement (continu)

- [ ] Nouveaux jeux (1 par mois)
- [ ] Nouveaux thèmes
- [ ] Variantes Sudoku (Killer, Sandwich)
- [ ] Jeu sémantique (avec embeddings locaux)
- [ ] Mots fléchés (générateur)
- [ ] Localisation (EN, ES, DE)

---

## 8. STRATÉGIE DE LANCEMENT

### 8.1 Acquisition Utilisateurs

| Canal | Action | Objectif |
|-------|--------|----------|
| **App Store / Play Store** | ASO optimisé ("sudoku sans pub") | Trafic organique |
| **Product Hunt** | Lancement featured | Buzz initial |
| **Reddit** | r/puzzles, r/france, r/iosgaming | Communauté early |
| **Twitter/X** | Thread "pourquoi j'ai créé..." | Viralité |
| **TikTok** | Vidéos gameplay satisfaisant | Gen Z |

### 8.2 Message Principal

> "Tous vos jeux cérébraux préférés. Gratuits. Sans pub. Pour toujours."

### 8.3 Différenciateurs à Mettre en Avant

1. **ZÉRO PUB** — Le message numéro 1
2. **Tout gratuit** — Pas de paywall sur le gameplay
3. **Tout-en-un** — Plus besoin de 10 apps
4. **Premium** — Design soigné, pas cheap
5. **Respectueux** — Pas de dark patterns

---

## 9. RISQUES & MITIGATIONS

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Faible conversion achats | Moyenne | Moyen | Le projet ne dépend pas des revenus (coût 0€) |
| Complexité jeu sémantique | Haute | Faible | Reporter à une phase ultérieure |
| Rejet App Store | Faible | Fort | Suivre les guidelines strictement |
| Copie par concurrents | Moyenne | Faible | Avance communautaire, qualité |

---

## 10. RÉCAPITULATIF

### Ce qui rend MINDFLOW unique

| Aspect | Apps Existantes | MINDFLOW |
|--------|-----------------|----------|
| **Publicité** | Omniprésente | Aucune, jamais |
| **Gameplay** | Limité ou payant | 100% gratuit et complet |
| **Abonnement** | Requis | Aucun |
| **Jeux** | 1 app = 1 jeu | 15+ jeux |
| **Classements** | Souvent absents | GameCenter / Play Games |
| **Coût serveur** | Élevé | 0€ |
| **Design** | Daté | Premium |

### Notre Manifeste

> "Les jeux cérébraux doivent stimuler l'esprit, pas l'exaspérer.
> Nous refusons les pubs intrusives et les abonnements forcés.
> MINDFLOW : gratuit, sans pub, pour toujours.
> Soutenez-nous si vous le souhaitez, jouez librement dans tous les cas."

---

*Document mis à jour le 28/01/2026 - Version 2.0*
*Projet : MINDFLOW - Jeux cérébraux sans friction*
*Architecture : React Native + Expo | Coût maintenance : 0€/mois*
