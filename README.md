# TravelBharat
India tourism encyclopedia: React (Vite) + Express + MongoDB.

## Run
1. MongoDB running locally (or an Atlas URI).
2. API: `cd server && cp .env.example .env && npm i && npm run seed && npm run dev`
3. Web: `cd client && npm i && npm run dev` → http://localhost:5173
4. Admin: http://localhost:5173/admin (credentials from `server/.env`)

## API
GET /api/states · /api/states/:slug · /api/places?q=&state=&city=&category=&page= · /api/cities · /api/places/:slug
Admin (Bearer JWT): POST /api/states · POST/PUT/DELETE /api/places

## Deploy
Client → Vercel/Netlify (set proxy/API base to your API URL). Server → Render/Railway/AWS with MongoDB Atlas.
