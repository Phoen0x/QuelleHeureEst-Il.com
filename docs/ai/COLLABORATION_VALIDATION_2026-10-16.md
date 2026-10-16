# Vérification documentaire — règles de collaboration

## Base et portée

- Dépôt : https://github.com/Phoen0x/QuelleHeureEst-Il.com
- Source lue intégralement : [PR #167](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/167), head `adf9efda058f389a9acf99c70f2a096c91a3871a`, branche `docs/ai-relay-working-contract-20261016`, ouverte en brouillon et non fusionnée au relevé.
- Nouvelle branche : `docs/ai-collaboration-handoff-167`, issue de ce SHA exact ; PR documentaire en brouillon ciblant la branche de #167. Le SHA livré est celui du head de cette nouvelle PR, à vérifier avant revue.
- `main` observé : `235194a6fe825a6dac27012f07cbac2cc5d86794`. Son arbre récursif complet contient 87 fichiers et **aucun `AGENTS.md` ni `docs/ai/WORKING_CONTRACT.md`**, ni répertoire `docs/ai/`. L'arbre source de #167 contient 91 fichiers et ces quatre documents.
- Accès GitHub par le connecteur ; aucune requête réseau directe depuis le terminal nécessaire à cette mission.

## Préservation et changements

Les octets d'origine de `AGENTS.md`, `docs/ai/WORKING_CONTRACT.md` et `docs/ai/README.md` sont conservés en préfixe intégral : seuls des compléments sont ajoutés. Le relais historique `PROJECT_RELAY_2026-10-16.md` reste identique. Le complément README est en français puis anglais ; le contrat, le rapport et les échanges sont en français.

Sept obligations sont explicitées : passage de relais, mini-bilan final, portée des langues, fiabilité réseau, reprise après panne, découverte/persistance des consignes, ergonomie TDAH et prompt de délégation fourni spontanément. Aucun changement aux dépendances, lockfiles, archives, code, CI, sécurité ou configurations des bots. Aucune modification directe des PR #153, #162, #167, #170 et #171 ni de leurs branches ; aucune fusion ou réécriture d'historique.

## Contrôles documentaires

- Lecture des quatre documents de #167 ; identification des blobs d'origine : `AGENTS.md` = `f7e63ee9cc0602b7fba93e686dd2c1dafa131317`, contrat = `5e7acf39ff4cef92e4513d027d768dfe1772e01e`, index = `381ec7b2e642b6e56fb1b2cbb2db76adf4dbca6e`, relais = `10942af52affcc8966d26528dd32e28bc7f7ab85`.
- Comparaison des trois fichiers complétés avec les blobs d'origine : préfixes inchangés, aucune ligne historique retirée. Contrôle `git diff --check` et du périmètre : trois fichiers Markdown complétés, un rapport Markdown ajouté.
- Résolution des liens relatifs et de l'ancre des nouvelles sections depuis le worktree réel fondé sur #167. Parcours vérifié : racine `AGENTS.md` → contrat et index → rapport et relais historique.
- Contrôle distant après publication : parent exact #167, head de la nouvelle PR, base, état brouillon, diff limité aux quatre documents ; comparaison des arbres et des références de branches préexistantes. Les résultats exacts au SHA publié sont consignés dans le mini-bilan de la PR.

## Limites et revue à effectuer

Cette vérification est documentaire : **aucun test applicatif, rejeu Renovate, test réseau de panne ou lancement d'un nouvel agent réel n'est réalisé**. Aucun résultat ancien de #170/#171 n'est requalifié. L'ajout d'un protocole de timeout ne prouve pas que chaque connecteur permet l'annulation effective : la section 10 impose d'annoncer cette limite lorsqu'elle existe.

Le schéma du connecteur GitHub utilisé pour cette publication n'expose ni paramètre de timeout ni commande d'annulation. L'agent ne peut donc pas garantir lui-même une borne d'arrêt de ces appels ; les réponses reçues ne démontrent pas un mécanisme d'annulation. Aucun essai de requête bloquée n'est revendiqué.

**Persistance partielle :** les règles sont versionnées, mais non présentes sur main. Un agent ouvrant uniquement main ou une ancienne branche ne peut pas les découvrir automatiquement. Les liens de cette PR et son SHA doivent figurer dans le prompt de reprise ; aucune mémoire inter-conversations n'est garantie. Aucune fusion n'est autorisée pour corriger cette limite dans la présente mission.

ChatGPT doit relire indépendamment le diff au head exact, vérifier la conservation intégrale du contrat et des autres blobs, les sept obligations, la portée du bilinguisme, la découvrabilité réelle et les limites d'annulation des outils. Il doit conserver une seule prochaine action pour l'utilisatrice ; toute intégration future requiert une autorisation distincte.
