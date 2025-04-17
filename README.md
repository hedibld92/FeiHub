# 🚀 Fei.Hub

Fei.Hub est votre espace personnel de productivité, conçu pour centraliser vos fichiers, notes et liens importants dans une interface moderne et sécurisée.

![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Cypress](https://img.shields.io/badge/Cypress-17202C?style=for-the-badge&logo=cypress&logoColor=white)

## ✨ Fonctionnalités

- 📁 **Gestion de fichiers**
  - Upload sécurisé
  - Prévisualisation des fichiers
  - Organisation intuitive

- 📝 **Notes**
  - Création et édition de notes
  - Notes épinglées
  - Formatage riche

- 🔗 **Liens**
  - Sauvegarde de liens
  - Favoris
  - Suivi des clics

- 📊 **Statistiques**
  - Vue d'ensemble de l'utilisation
  - Activité hebdomadaire
  - Tendances

- 📋 **Kanban**
  - Tableau Kanban interactif
  - Gestion des tâches par glisser-déposer
  - Priorités (basse, moyenne, haute)
  - Dates d'échéance
  - Colonnes : À faire, En cours, Terminé

## 🛠️ Technologies

- **Frontend**: Vue.js 3 avec Composition API
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **Backend**: Supabase
- **Base de données**: PostgreSQL
- **Stockage**: Supabase Storage
- **Authentification**: Supabase Auth
- **Sécurité**: Chiffrement AES-256-GCM
- **Tests**: Cypress

## 🚀 Installation

1. **Clonez le repository**
```bash
git clone https://github.com/votre-username/fei-hub.git
cd fei-hub
```

2. **Installez les dépendances**
```bash
npm install
```

3. **Configurez les variables d'environnement**
```bash
cp .env.example .env
```
Remplissez les variables suivantes dans le fichier `.env` :
```
VUE_APP_SUPABASE_URL=votre_url_supabase
VUE_APP_SUPABASE_ANON_KEY=votre_clé_anon_supabase
```

4. **Configuration de la base de données**
- Créez un projet Supabase
- Exécutez les migrations SQL dans le dossier `supabase/migrations`
- Configurez les politiques RLS pour la sécurité

5. **Lancez le serveur de développement**
```bash
npm run serve
```

## 🧪 Tests

### Configuration des tests

1. **Configurez les variables d'environnement de test**
```bash
cp .env.example .env.test
```
Ajoutez les identifiants de test :
```
CYPRESS_USER_EMAIL=votre_email_test
CYPRESS_USER_PASSWORD=votre_mot_de_passe_test
```

2. **Lancer les tests**
- Mode interface graphique :
```bash
npm run cypress:open
```
- Mode ligne de commande :
```bash
npm run test:e2e
```

### Suites de tests
- **Authentication** : Tests de connexion et gestion des sessions
- **Kanban** : Tests des fonctionnalités du tableau Kanban
  - Création de tâches
  - Modification et suppression
  - Drag & drop
  - Gestion des priorités

## 🔒 Sécurité

Fei.Hub intègre plusieurs couches de sécurité :
- Chiffrement des données sensibles (AES-256-GCM)
- Protection contre les attaques XSS
- Headers de sécurité configurés
- Gestion sécurisée des sessions
- Politique de sécurité du contenu (CSP)
- Row Level Security (RLS) dans Supabase

## 📱 Responsive Design

L'application est entièrement responsive et optimisée pour :
- 💻 Ordinateurs de bureau
- 📱 Tablettes
- 📱 Smartphones

## 🎨 Personnalisation

Le thème de l'application utilise un système de couleurs personnalisé :
- Palette de couleurs sombres élégante
- Accents bleus pour les interactions
- Design minimaliste et moderne
- Indicateurs visuels pour les priorités (rouge, orange, vert)

## 🔄 Workflow Git

Consultez le fichier `WORKFLOW.md` pour :
- Convention des commits
- Structure des branches
- Procédures de merge
- Déploiement

## 🚀 Déploiement

L'application est configurée pour un déploiement automatique sur Vercel :
- Intégration continue
- Déploiement automatique
- Preview des branches
- Configuration SSL/TLS

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

Un grand merci aux technologies open source qui ont rendu ce projet possible :
- Vue.js
- Tailwind CSS
- Supabase
- Chart.js
- Cypress
- date-fns

---

Fait avec ❤️ par Fei
