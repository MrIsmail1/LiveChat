# LiveChat - Application de Chat en Temps Réel

Une application de chat moderne et performante construite avec Next.js et NestJS, permettant des conversations en temps réel grâce à Socket.IO.

## 🚀 Technologies Utilisées

- **Frontend**: Next.js (React)
- **Backend**: NestJS
- **Base de données**: PostgreSQL
- **Communication en temps réel**: Socket.IO
- **Conteneurisation**: Docker & Docker Compose
- **Tests d'emails**: MailDev

## 📋 Prérequis

- Docker et Docker Compose
- Node.js (version recommandée : 18.x ou supérieure)
- npm ou yarn

## 🛠 Installation

1. Clonez le repository :
```bash
git clone [votre-repo-url]
cd LiveChat
```

2. Lancez l'application avec Docker Compose :
```bash
docker-compose up --build
```

## 📦 Structure du Projet

```
LiveChat/
├── next/               # Frontend Next.js
├── nest/               # Backend NestJS
├── compose.yml         # Configuration Docker Compose
└── .env               # Variables d'environnement
```

## 🔌 Services et Ports

- **Frontend (Next.js)**: http://localhost:3000
- **Backend (NestJS)**: http://localhost:4500
- **Base de données (PostgreSQL)**: localhost:5432
- **MailDev**: http://localhost:1080 (UI) et localhost:1025 (SMTP)

## 🔧 Configuration

### Frontend (Next.js)
- Port: 3000
- Hot-reloading activé en développement
- Configuration Socket.IO pour la communication en temps réel

### Backend (NestJS)
- Port: 4500
- API RESTful
- Websockets avec Socket.IO
- Connection à PostgreSQL

### Base de données (PostgreSQL)
- Port: 5432
- Persistence des données via Docker volume

### MailDev
- Interface Web: Port 1080
- Serveur SMTP: Port 1025

## 🚀 Développement

Pour développer localement sans Docker :

1. Frontend (Next.js) :
```bash
cd next
npm install
npm run dev
```

2. Backend (NestJS) :
```bash
cd nest
npm install
npm run start:dev
```

## 📝 Fonctionnalités

- Chat en temps réel
- Notifications de connexion/déconnexion des utilisateurs
- Persistance des messages
- Interface utilisateur moderne et responsive
- Gestion des salles de chat

## 🔒 Sécurité

- Communication sécurisée via HTTPS
- Authentification des utilisateurs
- Protection CSRF
- Validation des données

## 📫 Support

Pour toute question ou problème, veuillez ouvrir une issue dans le repository GitHub.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
