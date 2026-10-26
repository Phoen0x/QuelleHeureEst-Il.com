# Faisabilité uniquement

Copie externe de Tauri 2.11.6, utilitaires 2.9.3 inchangés. Pas de migration. La sonde utilisera un conteneur expérimental séparé, pas une intégration dans AppManager/IPC. Il réutilisera la vraie résolution/fusion Tauri dans une copie de travail, validera les effets complets, puis installera un Arc sous Mutex après vérification propriétaire/révision. Des instantanés épinglés permettront de distinguer atomicité de publication et cohérence d’une requête.

Les clôtures du champ manager et de __allow_command seront seulement des essais de visibilité dans la copie. La route Context/pré-résolu restant publique doit être démontrée comme non couverte, sans prétendre une admission obligatoire dans le produit. Le marqueur de version ne prouve pas un transport complet de matcher entre processus de build et runtime. Aucun moteur Unicode n’est implémenté.

Validation synthétique fournie par l’hôte de confiance à la construction, jamais par le payload. Les callbacks de validation s’exécutent hors verrou ; les caches d’un état nouvellement admis sont reconstruits. Les erreurs de politique/révision/propriétaire doivent laisser l’état actif inchangé. Les anciennes règles deny et la fusion des scopes ne sont pas corrigées.
