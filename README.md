# 🚀 Fei.Hub

Fei.Hub est votre espace personnel de productivité, conçu pour centraliser vos fichiers, notes et liens importants dans une interface moderne et sécurisée.

![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

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

## 🛠️ Technologies

- **Frontend**: Vue.js 3 avec Composition API
- **Styling**: Tailwind CSS
- **Backend**: Supabase
- **Stockage**: Supabase Storage
- **Authentification**: Supabase Auth
- **Sécurité**: Chiffrement AES-256-GCM

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

4. **Lancez le serveur de développement**
```bash
npm run serve
```

## 🔒 Sécurité

Fei.Hub intègre plusieurs couches de sécurité :
- Chiffrement des données sensibles
- Protection contre les attaques XSS
- Headers de sécurité configurés
- Gestion sécurisée des sessions
- Politique de sécurité du contenu (CSP)

## 📱 Responsive Design

L'application est entièrement responsive et optimisée pour :
- 💻 Ordinateurs de bureau
- 📱 Tablettes
- 📱 Smartphones

## 🎨 Personnalisation

Le thème de l'application utilise un système de couleurs personnalisé basé sur :
- Palette de couleurs sombres élégante
- Accents bleus pour les interactions
- Design minimaliste et moderne

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

---

Fait avec ❤️ par Fei
