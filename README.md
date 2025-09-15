Fullstack App (minimal starter)
Backend: Node/Express + Sequelize (Postgres or sqlite fallback)
Frontend: React

To run backend locally with sqlite (quick):
  cd backend
  npm install
  node scripts/sync.js
  npm start

To run frontend:
  cd frontend
  npm install
  npm start

Replace DATABASE_URL in backend/.env if you want Postgres.
