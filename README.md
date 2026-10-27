# Wavify

Wavify is a full-stack music streaming web app. Listeners sign up, browse the music library, open albums and play tracks in a persistent bottom player. Artists get a dashboard where they upload music and group tracks into albums.

The repository has two parts:

| Folder | What it is |
| --- | --- |
| [`Backend/`](./Backend) | REST API built with Node.js, Express 5, MongoDB (Mongoose) and ImageKit for audio storage |
| [`Frontend/`](./Frontend) | Responsive single-page app built with React 18 and Vite |

---

## Table of contents

1. [Features](#features)
2. [Tech stack](#tech-stack)
3. [Project structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Getting started](#getting-started)
6. [Environment variables](#environment-variables)
7. [Available scripts](#available-scripts)
8. [API reference](#api-reference)
9. [Authentication and roles](#authentication-and-roles)
10. [Frontend routes](#frontend-routes)
11. [How the frontend talks to the backend](#how-the-frontend-talks-to-the-backend)
12. [Known limitations and roadmap](#known-limitations-and-roadmap)
13. [Troubleshooting](#troubleshooting)
14. [Production notes](#production-notes)
15. [License](#license)

---

## Features

**For everyone**
- Register and log in as a `user` or an `artist`.
- Logged-out visitors see a login banner instead of music, with Listen now and Follow buttons that lead to the login page.
- Popular Artists block (static for now, see [roadmap](#known-limitations-and-roadmap)).
- Support page with a contact form and a banner image.

**For logged-in users and artists**
- Browse the music library, recently added tracks and search by title or artist.
- **Albums page** (sidebar, next to Home): see every album with its title and artist, open one and play its tracks.
- Persistent music player with play/pause, previous/next, seek bar, current time and duration, and volume control.
- Logging out stops playback, clears the loaded music and returns to Home.

**For artists only**
- Artist dashboard with track counts and your published tracks.
- Create music by uploading an audio file.
- Create albums from existing tracks.
- Artist-only pages are protected both in the UI (protected routes) and on the server (role check in middleware).

**UI**
- Dark navy and indigo design based on the reference mockup.
- Fully responsive: the sidebar becomes a bottom tab bar on phones, and the player adapts to small screens.
- Sidebar navigation with Home, Albums, Support and Log out (a bottom tab bar on phones).
- Loading skeletons, empty states, error messages with retry, and toast notifications.

---

## Tech stack

**Backend**
- Node.js (CommonJS) and Express 5
- MongoDB with Mongoose 9
- JSON Web Tokens (`jsonwebtoken`) stored in an HTTP cookie, read with `cookie-parser`
- `bcryptjs` for password hashing
- `multer` (memory storage) for audio uploads
- ImageKit (`@imagekit/nodejs`) for storing the uploaded audio files
- `cors` and `dotenv`

**Frontend**
- React 18 and Vite 5 (JavaScript, no TypeScript)
- React Router DOM 6
- Axios
- Context API for auth, player and toast state
- Lucide React icons
- Plain CSS with CSS variables (`global.css` and `responsive.css`)

---

## Project structure

```
Wavify/
├── .gitignore
├── README.md
├── Backend/
│   ├── server.js                  # Loads env, connects to MongoDB, starts Express
│   ├── package.json
│   └── src/
│       ├── app.js                 # Express app: CORS, JSON, cookies, route mounting
│       ├── db/db.js               # Mongoose connection
│       ├── routes/
│       │   ├── auth.routes.js     # /api/auth/*
│       │   └── music.routes.js    # /api/music/*
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   └── music.controller.js
│       ├── middlewares/auth.middleware.js   # authUser / authArtist (JWT cookie)
│       ├── models/                # user, music, album
│       └── services/storage.service.js      # ImageKit upload
└── Frontend/
    ├── index.html
    ├── vite.config.js
    ├── .env.example
    └── src/
        ├── main.jsx               # Providers and router
        ├── App.jsx                # Layout and routes
        ├── components/            # Navbar, Sidebar, Footer, MusicPlayer, MusicCard, AlbumCard,
        │                          # Carousel, LoginBanner, PopularArtists, ProtectedRoute, ...
        ├── pages/                 # Home, Albums, AlbumDetails, Login, Register, ArtistDashboard,
        │                          # CreateMusic, CreateAlbum, Support, NotFound
        ├── context/               # AuthContext, MusicPlayerContext, ToastContext
        ├── services/              # api.js (Axios), authService, musicService, supportService
        ├── hooks/useMusicLibrary.js
        ├── data/popularArtists.js # Static artist list (no API yet)
        ├── styles/                # global.css, responsive.css
        ├── assets/                # Images, favicon files
        └── utils/formatTime.js
```

---

## Prerequisites

- **Node.js 20 or newer** and npm
- A **MongoDB** database: local MongoDB or a free MongoDB Atlas cluster
- An **ImageKit** account (free tier works) for audio storage. You need its **private key**.
- Git

---

## Getting started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Wavify
```

### 2. Set up the backend

```bash
cd Backend
npm install
```

Create a file named `.env` inside `Backend/` (see [Environment variables](#environment-variables)):

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/wavify
JWT_PRIVATE_KEY=replace-with-a-long-random-string
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
```

Start the server:

```bash
npm start
```

You should see `Server is running on PORT 3000` and `Connected to Database`.

> `npm run dev` runs `nodemon server.js`, but `nodemon` is not listed in `Backend/package.json`. Run `npm install -D nodemon` once if you want auto-restart during development.

### 3. Set up the frontend

Open a second terminal:

```bash
cd Frontend
npm install
cp .env.example .env      # on Windows: copy .env.example .env
npm run dev
```

Open **http://localhost:5173**.

The backend allows requests only from `http://localhost:5173` (see `Backend/src/app.js`), so keep the frontend on that port during development.

### 4. Try it out

1. Go to **Sign up** and create an account with the **Artist** role.
2. Open the **Dashboard**, then **Create music** and upload an audio file.
3. Optionally create an album from your tracks, then find it under **Albums** in the sidebar.
4. Register a second account as a **Listener** to check the regular-user experience, including the Albums page.

---

## Environment variables

### Backend (`Backend/.env`)

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No (default `3000`) | Port the API listens on |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_PRIVATE_KEY` | Yes | Secret used to sign and verify login tokens. Use a long random value |
| `IMAGEKIT_PRIVATE_KEY` | Yes | ImageKit private key, used to upload audio files |

Generate a strong JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### Frontend (`Frontend/.env`)

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:3000/api` | Base URL of the backend API. The only place it is configured |
| `VITE_USE_COOKIES` | `true` | Sends cookies with requests. Keep `true`: the backend authenticates with a cookie |
| `VITE_MUSIC_FILE_FIELD` | `music` | Multipart field name for the audio file. Matches `upload.single("music")` on the backend |
| `VITE_MUSIC_URL_FIELD` | `uri` | Field name used for the "Audio URL" mode (not supported by the backend, see [limitations](#known-limitations-and-roadmap)) |

Vite only exposes variables that start with `VITE_`, and they end up in the browser bundle. Never put secrets in the frontend `.env`. Restart `npm run dev` after changing it.

**Never commit real `.env` files.** The root `.gitignore` excludes them but keeps `.env.example` files tracked.

---

## Available scripts

### Backend (`Backend/`)

| Command | Description |
| --- | --- |
| `npm start` | Runs `node server.js` |
| `npm run dev` | Runs `nodemon server.js` (install `nodemon` first) |

### Frontend (`Frontend/`)

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite dev server on port 5173 |
| `npm run build` | Creates a production build in `Frontend/dist` |
| `npm run preview` | Serves the production build locally |

---

## API reference

Base URL: `http://localhost:3000/api`

All routes except register, login and logout require the `token` cookie that login/register set. Send requests with credentials (the frontend does this through Axios `withCredentials`).

### Auth

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | None | Create an account |
| POST | `/auth/login` | None | Log in |
| POST | `/auth/logout` | None | Clears the `token` cookie |

**POST `/auth/register`**

```json
{ "username": "jane", "email": "jane@example.com", "password": "secret123", "role": "artist" }
```

`role` is `user` (default) or `artist`. Responses: `201` with `{ message, user: { id, username, email, role } }`, or `409` if the username or email already exists.

**POST `/auth/login`**

```json
{ "email": "jane@example.com", "password": "secret123" }
```

You can send `username` instead of `email`. Responses: `201` with `{ message, user: { id, username, email, role } }`, or `401` with `Invalid Credentials`.

### Music and albums

| Method | Endpoint | Role | Description |
| --- | --- | --- | --- |
| GET | `/music/` | user or artist | List music (currently the first 10 tracks) |
| POST | `/music/create` | artist | Upload a track (multipart form) |
| POST | `/music/album` | artist | Create an album |
| GET | `/music/albums` | user or artist | List albums (`title` and `artist` only). Used by the Albums page |
| GET | `/music/albums/:albumId` | user or artist | Get one album with its tracks |

**GET `/music/`** returns:

```json
{
  "message": "Musics Fetched Successfully",
  "musics": [
    { "_id": "…", "uri": "https://ik.imagekit.io/…", "title": "Song", "artist": { "_id": "…", "username": "jane", "email": "jane@example.com" } }
  ]
}
```

**POST `/music/create`** is `multipart/form-data` with:

| Field | Type | Description |
| --- | --- | --- |
| `title` | text | Track title |
| `music` | file | The audio file |

The file is uploaded to ImageKit (folder `/music`) and the returned URL is saved as `uri`. Response `201`: `{ message, music: { id, uri, title, artist } }`.

**POST `/music/album`** takes JSON:

```json
{ "title": "My Album", "musics": ["<trackId1>", "<trackId2>"] }
```

Response `201`: `{ message, album: { id, title, musics, artist } }`.

**GET `/music/albums`** returns:

```json
{
  "message": "Albums Fetched Successfully",
  "albums": [
    { "_id": "…", "title": "My Album", "artist": { "_id": "…", "username": "jane", "email": "jane@example.com" } }
  ]
}
```

The list has no tracks, so open an album with the next endpoint to get its tracks.

**GET `/music/albums/:albumId`** returns `{ message, album }`, where `album.musics` is populated with full track documents and `album.artist` with `username` and `email`.

### Error responses

| Status | Meaning |
| --- | --- |
| `401` | Missing, invalid or expired token (`Unauthorized`) |
| `403` | Logged in but the role is not allowed (for example a `user` calling an artist route) |
| `409` | Username or email already registered |

---

## Authentication and roles

- On login or register the server signs a JWT containing `{ id, role }` and sets it in a cookie named `token`.
- `authUser` middleware allows both `user` and `artist`. `authArtist` allows only `artist`. Permissions are enforced on the server.
- The server returns no "current user" endpoint, so the frontend stores the user object from the login response in `localStorage` and uses it only to show or hide UI. A `401` response clears that stored session and shows a "session expired" message.
- Music and album routes require login, so logged-out visitors never request them. They see the login banner instead.

---

## Frontend routes

| Route | Access | Page |
| --- | --- | --- |
| `/` | Everyone | Home. Login banner when logged out; music library when logged in |
| `/login` | Everyone | Login |
| `/register` | Everyone | Register (Listener or Artist) |
| `/albums` | Logged in | Albums page: all albums, each card opens its details |
| `/albums/:albumId` | Logged in | Album details and track list, with play controls |
| `/support` | Everyone | Support page with contact form |
| `/dashboard` | Artist | Artist dashboard |
| `/dashboard/music/new` | Artist | Create music |
| `/dashboard/albums/new` | Artist | Create album |
| `*` | Everyone | 404 page |

---

## How the frontend talks to the backend

- One Axios instance in `Frontend/src/services/api.js` reads `VITE_API_BASE_URL` and sends cookies.
- Request code lives in `src/services/` (`authService.js`, `musicService.js`, `supportService.js`), not in components.
- `musicService.js` normalizes API responses, so field names are mapped in one place.
- The music player (`MusicPlayerContext`) uses a native `<audio>` element that plays the `uri` returned by the API.

---

## Known limitations and roadmap

**Not connected yet**
- **Support form**: the form validates input and shows a success message, but `Frontend/src/services/supportService.js` is a placeholder that sends nothing. Replace its body with an `api.post(...)` call once the endpoint exists.
- **Popular Artists**: static names and images in `Frontend/src/data/popularArtists.js`, with no click action. Replace with an API call when an artists endpoint exists.

**Backend behavior to be aware of**
- `GET /music/albums` returns only each album's title and artist, so album cards on the Albums page have no track count, and they show a generated gradient placeholder instead of a cover image.
- `GET /music/` returns at most **10 tracks** (`.limit(10)`), so Home shows at most 10. Add pagination if the library grows.
- **Create music works with file upload only.** The "Audio URL" mode in the Create Music form is not supported by `POST /music/create`, which expects a `music` file.
- Tracks have no cover image field, so cards show a generated gradient placeholder.
- Tracks inside `GET /music/albums/:albumId` come back with the artist as an ID, so the frontend shows the album artist's name for them.
- `GET /music/albums/:albumId` returns `200` with `album: null` for an ID that does not exist, and the frontend shows an error for that.
- Anyone can register as an `artist` by sending `role: "artist"`. Restrict this (for example, an admin approval step) before a public launch.

---

## Troubleshooting

| Problem | Likely cause and fix |
| --- | --- |
| `Cannot reach the server` in the UI | Backend not running, or `VITE_API_BASE_URL` is wrong. Check the URL and restart the frontend after editing `.env` |
| CORS error in the browser console | The backend only allows `http://localhost:5173`. Run the frontend on that port, or update the `origin` in `Backend/src/app.js` |
| Login works but the next request is `401 Unauthorized` | The cookie is not being sent. Keep `VITE_USE_COOKIES=true`, and use `localhost` consistently (not `127.0.0.1` in one place and `localhost` in another) |
| `Database Connection Error` | Wrong `MONGODB_URI`, MongoDB not running, or your IP is not allowed in Atlas |
| `secretOrPrivateKey must have a value` | `JWT_PRIVATE_KEY` is missing in `Backend/.env` |
| Upload fails with a 500 error | `IMAGEKIT_PRIVATE_KEY` is missing or wrong, or no file was attached (the field must be named `music`) |
| `nodemon: command not found` | Run `npm install -D nodemon` in `Backend/`, or use `npm start` |
| Environment changes are ignored | Restart the process. Vite and Node read `.env` only at startup |

---

## Production notes

These are suggestions for a deployment, and none of them have been applied or tested in this repository.

- Build the frontend with `npm run build` and serve `Frontend/dist` from a static host or CDN.
- Set `VITE_API_BASE_URL` to your deployed API URL before building.
- Update the CORS `origin` in `Backend/src/app.js` to your deployed frontend URL.
- Serve both over HTTPS. For cookies across different domains, set `secure: true` and `sameSite: "none"` on the `token` cookie (currently it is set with default options), and consider `httpOnly: true` and a token expiry.
- Keep all secrets in the host's environment settings, never in the repository.

---

## License

The backend `package.json` declares the **ISC** license. Add a `LICENSE` file if you want to publish the project under it.
