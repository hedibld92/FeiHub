# 🌳 Guide Workflow Git - Fei.Hub

## 🚀 Workflow Quotidien

### 1. Commencer à travailler

```bash
# Aller sur develop et récupérer les dernières modifications
git checkout develop
git pull origin develop

# Créer une nouvelle branche pour ta fonctionnalité
git checkout -b feature/ma-nouvelle-fonctionnalite
```

### 2. Pendant le développement

```bash
# Voir les fichiers modifiés
git status

# Ajouter tes modifications
git add .

# Créer un commit
git commit -m "feat: description de ce que tu as fait"
```

### 3. Sauvegarder ton travail

```bash
# Pousser tes modifications sur GitHub
git push origin feature/ma-nouvelle-fonctionnalite
```

### 4. Finaliser la fonctionnalité

```bash
# Retourner sur develop
git checkout develop

# Récupérer les dernières modifications
git pull origin develop

# Fusionner ta fonctionnalité
git merge feature/ma-nouvelle-fonctionnalite

# Pousser sur develop
git push origin develop
```

## 📝 Convention des Commits

```bash
feat: nouvelle fonctionnalité
fix: correction d'un bug
docs: modification de la documentation
style: formatage du code
refactor: amélioration du code sans ajout de fonctionnalité
test: ajout ou modification de tests
chore: modification des outils, dépendances...
```

## 🌿 Structure des Branches

- `main` : Code en production
- `develop` : Branche de développement principale
- `feature/*` : Nouvelles fonctionnalités
- `fix/*` : Corrections de bugs
- `docs/*` : Documentation
- `chore/*` : Maintenance

## 🆘 Commandes Utiles

### Annuler des modifications

```bash
# Annuler les modifications non commitées
git checkout -- .

# Annuler le dernier commit (garde les modifications)
git reset --soft HEAD~1

# Annuler le dernier commit (supprime les modifications)
git reset --hard HEAD~1
```

### Gérer les branches

```bash
# Voir toutes les branches
git branch

# Supprimer une branche locale
git branch -d nom-de-la-branche

# Supprimer une branche distante
git push origin --delete nom-de-la-branche
```

### Mettre de côté des modifications

```bash
# Mettre de côté tes modifications
git stash

# Voir la liste des modifications mises de côté
git stash list

# Récupérer les dernières modifications mises de côté
git stash pop
```

## 🚨 En cas de Problème

### Conflit lors d'un merge

1. Ne panique pas
2. Ouvre les fichiers en conflit
3. Choisis les modifications à garder
4. `git add .`
5. `git commit -m "fix: résolution des conflits"`

### Mauvaise branche

```bash
# Si tu as commité sur la mauvaise branche
git checkout bonne-branche
git cherry-pick hash-du-commit
```

## 📱 Workflow pour une nouvelle fonctionnalité

1. **Partir de develop**
   ```bash
   git checkout develop
   git pull origin develop
   ```

2. **Créer une branche**
   ```bash
   git checkout -b feature/ma-fonctionnalite
   ```

3. **Développer et commiter**
   ```bash
   git add .
   git commit -m "feat: description"
   ```

4. **Pousser régulièrement**
   ```bash
   git push origin feature/ma-fonctionnalite
   ```

5. **Finaliser**
   ```bash
   git checkout develop
   git pull origin develop
   git merge feature/ma-fonctionnalite
   git push origin develop
   ```

## 🎯 Bonnes Pratiques

1. **Commits**
   - Fais des commits réguliers
   - Une fonctionnalité = une branche
   - Messages clairs et descriptifs

2. **Branches**
   - Toujours partir de `develop`
   - Supprimer les branches après fusion
   - Nommer clairement les branches

3. **Avant de pusher**
   - Vérifie tes modifications (`git status`)
   - Teste ton code
   - Vérifie que tu es sur la bonne branche

## 🔄 Mise en Production

```bash
# Une fois que develop est stable
git checkout main
git pull origin main
git merge develop
git push origin main
```

---

💡 **Rappel** : En cas de doute, n'hésite pas à faire un `git status` pour voir où tu en es ! 