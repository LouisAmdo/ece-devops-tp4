# LAB 4 : Test-Driven Development (TDD) et API REST

## Question : Quels étaient les objectifs du lab ?

Mettre en pratique le Test-Driven Development (TDD) en créant une API REST Node.js/Express avec Redis. Les objectifs incluaient l'écriture de tests avant le code, l'implémentation d'une fonctionnalité GET user et la documentation de l'API avec Swagger.

## Question : Quelles sont les applications dans le monde réel ou en entreprise ?

- **TDD** : Standard dans les équipes agiles pour garantir la qualité.
- **Tests automatisés** : Essentiels en CI/CD pour détecter les bugs avant la production.
- **Redis** : Utilisé pour le caching (ex: Netflix, Twitter, GitHub).
- **Swagger** : Standard industriel pour documenter les API REST.
- **Express.js** : Framework populaire pour les microservices.

## Question : Quelles sont les étapes dans le cycle DevOps touchées ?

Principalement les phases **Build & Test** :

- **Plan** : Spécifications de la méthode GET.
- **Code** : Application du cycle TDD (tests → implémentation → refactoring).
- **Test** : Exécution automatisée avec Mocha/Chai.
- **Release** : Documentation Swagger.

**Justification** : L'accent est mis sur le Test car l'écriture des tests en amont garantit le bon fonctionnement avant tout déploiement.

## Question : Quels problèmes ont été rencontrés et comment ont-ils été résolus ?

- **Installation Redis bloquée** : Résolu par l'attente (processus normal de 5-10min sur macOS).
- **Commande `code .` non trouvée** : Installation via la Command Palette de VS Code.
- **Port déjà utilisé** : Utilisation de `kill -9 $(lsof -ti:3000)` ou changement du `PORT=3001`.
- **Redis déconnecté** : Redémarrage de l'application Node.js.
- **Swagger sur mauvais port** : Modification de la configuration.
- **Gestion multi-terminaux** : Organisation méthodique (T1: Redis, T2: App, T3: Tests).

## Question : Quelle est la finalité du lab et êtes-vous arrivé au bout ?

Oui, terminé avec succès (bonus inclus). Les tests unitaires et d'intégration sont écrits, la méthode GET est implémentée (11/11 tests passent) et Swagger UI est fonctionnel sur `/api-docs`. Le TDD a permis de produire un code plus robuste et maintenable.
