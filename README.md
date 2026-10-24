# EVENTORA — Your City's Event Radar

A creative hackathon MVP with a responsive React website, Express backend, and Expo React Native app starter.

## Features
- Responsive hero section and flexible layouts using CSS Grid and Flexbox
- Event search plus city, category, and free-event filters
- Save/favourite events in the website session
- Event details modal with date, venue, organizer, price, and listing status
- RSVP form stored by the backend, including duplicate RSVP validation
- Organizer event submission; new events are marked unverified
- Transparent demo recommendations with a match score
- API health and summary statistics endpoints
- Mobile app starter using Expo
- Local JSON data store for an easy student demo

## Requirements
Install Node.js (Node 20 LTS recommended) and npm.

## IMPORTANT: folder structure
After extracting the ZIP, open the **EVENTORA_Complete_Project** folder in VS Code. The actual project folder is inside it, named `eventora-project`.

## Run the website and backend
Open two separate VS Code terminals.

### Terminal 1 — Backend
```bash
cd eventora-project/server
npm install
npm start
```
Backend runs at `http://localhost:4000`. Check `http://localhost:4000/api/health` and `http://localhost:4000/api/stats`.

### Terminal 2 — Website
```bash
cd eventora-project/web
npm install
npm run dev
```
Open the localhost URL printed by Vite, usually `http://localhost:5173`.

### Optional shortcut from inside `eventora-project`
```bash
npm run server:install
npm run web:install
npm run server
npm run web
```
The server and website must run in separate terminals.

### Mobile app
Open a third terminal:
```bash
cd eventora-project/mobile
npm install
npx expo start
```
Use Expo Go to preview. On a physical phone, change `http://localhost:4000/api` in `mobile/App.js` to your computer's Wi-Fi IP address, and keep both devices on the same Wi-Fi. For Android emulator, use `http://10.0.2.2:4000/api`.

## Honest prototype notes
Event listings are sample/demo data, not confirmed real events. The recommendation score is a simple transparent heuristic, not a trained AI model. RSVP and event submissions are stored locally in `server/data.json`. Login/authentication, payments, live maps, real-time notifications, and production-grade moderation are not implemented. Do not deploy publicly or collect sensitive data without adding authentication, security, privacy controls, and a production database.
