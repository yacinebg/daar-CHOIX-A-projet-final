# Dernier projet de DAAR  - Moteur de Recherche de Livres dans la base Gutenberg 
## ✍️ Auteur
- Kessal Yacine (21311739)
- Bouzarkouna Malek (28706508)

---

Bienvenue dans le projet **Gutenberg Search** ! Ce projet est un moteur de recherche de livres basé sur une base de données d'ouvrages du projet Gutenberg. Il permet d'effectuer des recherches avancées sur les titres, auteurs et contenus des livres, en utilisant des techniques d'indexation, d'algorithmes de recherche et de recommandation basés sur le graphe de Jaccard.

##  Fonctionnalités
-  Recherche de livres par **titre**, **auteur** ou **contenu**
-  Recherche avancée avec **expressions régulières**
-  Classement des résultats avec des **indices de centralité** (PageRank, Closeness, Betweenness)
-  **Recommandation de livres similaires** à l'aide d'un graphe de Jaccard
-  Lecture intégrée des livres disponibles en local
-  Interface web en **React.js** avec une API backend en **Django**

---

## Installation et Prérequis

### 1️⃣ Prérequis
Assurez-vous d'avoir installé les éléments suivants :
- **Python 3.9+**
- **Node.js 16+** et **npm** (pour le frontend)
- **pip** et **virtualenv**
- **Django 4+**
- **PostgreSQL** (ou SQLite pour le développement local)

### 2️⃣ Cloner le projet
```bash
git clone https://github.com/....
cd gutenberg-search
```

### 3️⃣ Installer l'environnement backend (Django)
#### ➤ Création de l'environnement virtuel et installation des dépendances
```bash
python -m venv venv
source venv/bin/activate  # sous Windows : venv\Scripts\activate
pip install -r requirements.txt
```

#### ➤ Configuration de la base de données
Par défaut, le projet utilise **SQLite**. Si vous souhaitez utiliser **PostgreSQL**, modifiez `settings.py` :

Ensuite, appliquez les migrations :
```bash
python manage.py migrate
```

#### ➤ Lancer le serveur backend
Dans le répértoire gutenberg_search, éxécutez cette commande pour lancer le serveur :
```bash
python manage.py runserver
```

---

### 4️⃣ Installer et exécuter le frontend (React.js)

#### ➤ Aller dans le dossier `frontend` et installer les dépendances
```bash
cd frontend
npm install
```

#### ➤ Lancer le serveur React
```bash
npm run dev
```
---

## 🔗 API Endpoints
### Recherche de livres
- `GET /search/?q=motcle` → Recherche par titre, auteur et contenu
- `GET /search_regex/?q=motcle` → Recherche par expression régulière
- `GET /search_by_centrality/?q=motcle&metric=pagerank` → Recherche en triant par centralité

### Récupération des détails d'un livre
- `GET /book/<id>/` → Détails d’un livre
- `GET /read_book/<id>/` → Lire le contenu complet du livre

### Recommandation
- `GET /suggestions/<id>/` → Recommande des livres similaires basés sur le graphe de Jaccard





