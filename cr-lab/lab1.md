# LAB 1 : Les bases de Git et GitHub

## Question : Quels étaient les objectifs du lab ?

Apprendre les bases de Git avec GitHub Desktop : créer un repo, cloner, gérer des branches, modifier/push des fichiers, résoudre des conflits, et refaire l'intégralité des opérations via l'interface en ligne de commande (CLI).

## Question : Quelles sont les applications dans le monde réel ou en entreprise ?

Git sert à la gestion de versions pour les équipes de développement, à la mise en place de pipelines CI/CD (avec GitLab par exemple), et à la collaboration sur des projets open source ou internes. À titre d'exemple, GitHub Copilot génère désormais environ 46 % du code, optimisant les workflows DevOps sans perte de données.

## Question : Quelles sont les étapes dans le cycle DevOps touchées (avec justification) ?

Ce lab touche les étapes suivantes :

- **Code** : Création de repo, de branches et de commits.
- **Build** : Le push permet l'auto-build.
- **Test** : Le merge intervient après les checks de validation.
- **Deploy** : Pull sur le serveur.

**Justification** : Les branches isolent le développement (Code), le commit/push lance des tests automatisés (Build/Test), et le merge permet un déploiement propre (Deploy), à l'image des GitHub Actions.

## Question : Quels problèmes ont été rencontrés et comment ont-ils été résolus ?

- **Conflit de merge (étape 5)** : Apparition de marqueurs `<<<<` `====` `>>>>` dans le README.md après des pushs alternés. Résolu via VS Code en choisissant de garder le HEAD ou dev-nom, en supprimant les lignes de conflit, puis en effectuant un add/commit/push.
- **Oubli de commandes en CLI** : Oubli de la commande `git add`. Résolu par la relecture d'une "cheat sheet" (mémo).

## Question : Quelle est la finalité du lab et êtes-vous arrivé au bout ?

Le lab a été terminé avec succès en duo (Desktop + CLI) et le bonus sur le `.gitignore` a été traité. La finalité était de maîtriser la collaboration Git pour des projets professionnels futurs (comme les ETL/API en alternance).
