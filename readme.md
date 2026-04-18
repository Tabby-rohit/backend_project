# TweetTube

TweetTube is a full-stack video sharing application with:

- an `Express` + `MongoDB` backend API
- a `React` + `Vite` frontend
- JWT-based authentication
- Cloudinary media uploads
- features for videos, comments, likes, subscriptions, tweets, playlists, dashboard stats, and watch history

This README is focused on setup and deployment.

## Tech Stack

### Backend

- Node.js
- Express
- MongoDB Atlas with Mongoose
- JWT auth
- Multer
- Cloudinary

### Frontend

- React
- React Router
- Axios
- Vite

## Project Structure

```text
.
├── src/                # Backend source
├── public/             # Backend public assets
├── frontend/           # React + Vite frontend
├── package.json        # Backend package.json
└── readme.md
```

## Prerequisites

Make sure these are installed before running or deploying:

- Node.js 18+ recommended
- npm 9+ recommended
- MongoDB Atlas database
- Cloudinary account

## Environment Variables

Create a `.env` file in the project root for the backend.

Example:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Notes:

- the backend database name is appended in code as `BACKENDDB`
- never commit real secrets to Git
- if you deploy the frontend and backend on different domains, update CORS accordingly in [src/app.js](/D:/projects/src/app.js)

## Local Development

### 1. Install backend dependencies

```bash
npm install
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Start the backend

From the project root:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:8000
```

### 4. Start the frontend

From `frontend/`:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## Health Check

The backend health endpoint is:

```text
GET /api/v1/healthcheck
```

Example:

```text
http://localhost:8000/api/v1/healthcheck
```

## Important Frontend Deployment Note

The frontend currently uses a hardcoded API base URL in [frontend/src/api/api.js](/D:/projects/frontend/src/api/api.js):

```js
baseURL: 'http://localhost:8000/api/v1'
```

Before production deployment, change this to your deployed backend URL, for example:

```js
baseURL: 'https://your-backend-domain.com/api/v1'
```

For a better production setup, consider moving this to a Vite environment variable such as:

```env
VITE_API_BASE_URL=https://your-backend-domain.com/api/v1
```

## Backend Deployment

You can deploy the backend to platforms like:

- Render
- Railway
- Cyclic
- VPS with PM2 and Nginx

### Backend deployment steps

1. Push the project to GitHub.
2. Create a backend service on your hosting platform.
3. Set the root directory to the repository root.
4. Add all backend environment variables from the `.env` example.
5. Use this install command:

```bash
npm install
```

6. Use this start command:

```bash
node src/index.js
```

### Backend production checklist

- add all environment variables
- verify MongoDB Atlas network access allows your host
- verify Cloudinary credentials are correct
- confirm the deployed backend can respond at `/api/v1/healthcheck`
- update CORS in [src/app.js](/D:/projects/src/app.js) to allow your frontend domain

## Frontend Deployment

You can deploy the frontend to platforms like:

- Vercel
- Netlify
- Cloudflare Pages
- Render Static Site

### Frontend build steps

From `frontend/`:

```bash
npm install
npm run build
```

The production build output is generated in:

```text
frontend/dist
```

### Frontend deployment checklist

1. Update the API base URL in [frontend/src/api/api.js](/D:/projects/frontend/src/api/api.js).
2. Build the frontend:

```bash
cd frontend
npm run build
```

3. Deploy the `frontend/dist` folder to your static host.

## Deploying Backend and Frontend Together

Recommended setup:

- deploy the backend separately as an API service
- deploy the frontend separately as a static site
- point the frontend API base URL to the deployed backend

Example:

- frontend: `https://tweettube.vercel.app`
- backend: `https://tweettube-api.onrender.com`

Then set:

```js
baseURL: 'https://tweettube-api.onrender.com/api/v1'
```

And allow the frontend origin in backend CORS.

## Common Deployment Issues

### Frontend loads but API requests fail

Likely causes:

- frontend still points to `localhost`
- backend CORS does not allow the frontend domain
- backend server is down

### Login or cookies do not work in production

Likely causes:

- secure cookie settings in production
- frontend and backend are on different domains
- CORS and credentials are not configured correctly

### Media upload fails

Likely causes:

- Cloudinary keys are missing or invalid
- upload file size is too large
- temporary file handling fails on the deployment platform

### Database connection fails

Likely causes:

- invalid MongoDB URI
- MongoDB Atlas IP/network rules are blocking the host

## Useful Commands

### Backend

```bash
npm run dev
node src/index.js
```

### Frontend

```bash
cd frontend
npm run dev
npm run build
```

## Future Improvements

For a cleaner production deployment, consider:

- moving frontend API URL to `VITE_API_BASE_URL`
- adding a backend `start` script in root `package.json`
- adding a frontend `.env.production`
- hiding debug `console.log` output in backend upload/auth code
- adding deployment configs for Render, Railway, or Vercel

## Author

Built as a full-stack backend-focused learning project and expanded into the TweetTube UI.
