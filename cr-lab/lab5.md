# LAB 5 : Pipeline CI/CD Complète

## Question : Quels étaient les objectifs du lab ?

Mettre en place une pipeline CI/CD complète :

- **CI (Intégration Continue)** : Automatiser les tests à chaque modification via GitHub Actions.
- **CD (Déploiement Continu)** : Déployer automatiquement l'application sur Heroku après validation des tests.
- **Workflow Git moderne** : Pratiquer les Pull Requests et la revue de code automatisée.

## Question : Quelles sont les applications dans le monde réel ou en entreprise ?

Le CI/CD est obligatoire pour :

- **Gain de temps** : Réduction du temps de déploiement manuel de quelques heures à quelques minutes.
- **Qualité et sécurité** : Les tests bloquent automatiquement le code cassé, réduisant l'erreur humaine.
- **Collaboration** : Travail en parallèle facilité.

**Exemples** : Netflix déploie des centaines de fois par jour et Amazon toutes les 11 secondes grâce à ces pipelines.

## Question : Quelles sont les étapes dans le cycle DevOps touchées ?

- **Test (CI)** : GitHub Actions exécute les tests à chaque push/PR pour détecter les bugs avant la production.
- **Release** : La branche `main` représente le code stable prêt pour la production.
- **Deploy (CD)** : Déploiement automatique sur Heroku après merge, assurant une livraison rapide et fiable.

## Question : Quels problèmes ont été rencontrés et comment ont-ils été résolus ?

- **Erreur 403 lors du push** : Conflit de credentials. Résolu par l'utilisation de SSH.
- **Workflow non déclenché** : Fichier YAML dans un sous-dossier. Résolu en le déplaçant à la racine et en ajustant le `working-directory`.
- **Sparse checkout bloquant** : Résolu avec `git add --sparse`.
- **Erreur Heroku "not found"** : Passage à un déploiement via `git subtree push` via l'API Heroku au lieu de la CLI.
- **Mauvaise branche de PR** : Fermeture et recréation de la PR vers `main`.

## Question : Quelle est la finalité du lab et êtes-vous arrivé au bout ?

**OUI**, le lab est terminé. La CI est fonctionnelle (tests automatiques OK), la CD est opérationnelle (application déployée sur Heroku). Seuls le bonus Swagger (manque de temps) et Redis sur Heroku (contrainte de carte bancaire) n'ont pas été finalisés. 

**Apprentissages clés** : Maîtrise des workflows YAML, du cycle CI/CD complet et de la résolution de problèmes Git complexes.
