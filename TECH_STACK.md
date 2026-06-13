# SeatWise - Technology Stack Documentation

**Last Updated:** June 14, 2026  
**Version:** 1.0.0

---

## Table of Contents

1. [Frontend Stack](#frontend-stack)
2. [Backend Stack](#backend-stack)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Development Setup](#development-setup)
6. [Project Structure](#project-structure)
7. [Architecture](#architecture)
8. [Performance Notes](#performance-notes)
9. [Deployment Guide](#deployment-guide)

---

## Frontend Stack

### **Framework & Build Tool**

| Package | Version | Purpose |
|---------|---------|---------|
| React | 18.2.0 | UI library for interactive components |
| Vite | 5.0.8 | Ultra-fast build tool and dev server |
| JavaScript | ES Modules | Modern async module syntax |

**Why Vite?** Sub-200ms cold start, instant HMR (hot module replacement), and modern browser support.

### **Routing**

**React Router DOM 6.21.0**
- Client-side navigation without page reloads
- Routes configured in `src/App.jsx`:
  - `/` - Landing page with features & seat types
  - `/login` - User authentication
  - `/map` - Interactive library seat map with QR scanner
  - `/away` - Away mode countdown timer
  - `/dashboard` - Librarian admin dashboard
  - `/info` - Learn More destination page

### **Styling**

| Package | Version | Purpose |
|---------|---------|---------|
| Tailwind CSS | 3.4.0 | Utility-first CSS framework |
| PostCSS | 8.4.32 | CSS transformation pipeline |
| Autoprefixer | 10.4.16 | Browser compatibility prefixes |

**Tailwind Features Used:**
- Responsive grid layouts (`grid-cols-2 md:grid-cols-4`)
- Color system (`bg-primary`, `text-gray-900`)
- Spacing utilities (`p-6`, `gap-4`)
- Animations (`scale-105`, `transition-colors`)
- Dark mode support via toggle

### **UI Components**

**Lucide React 0.383.0** - SVG icon library
- **Icons Used:**
  - `QrCode` - QR scanner button
  - `MapPin` - Location/seat tracking
  - `Bell` - Notifications
  - `Moon` / `Sun` - Dark mode toggle
  - `LogOut` - Logout button
  - `CheckCircle` - Success states
  - And 15+ more

### **QR Code Scanning**

**html5-qrcode 2.3.4**
- Web-based QR code scanner
- Camera integration ready
- Location: `LibraryMap.jsx` (QR Scanner modal)
- Can scan desk QR codes for instant check-in

### **State Management**

**React Context API** (Built-in)
- Global state in `src/context/AppContext.jsx`
- Manages:
  - `user` - Current logged-in user
  - `seats` - All available seats
  - `currentBooking` - User's active booking
  - `awayMode` - Away status toggle

**localStorage**
- Persists user sessions across browser refreshes
- Key: `seatwise-user`
- Auto-syncs on page reload

### **Frontend Features**

✅ Smooth scroll navigation (`scroll-behavior: smooth`)  
✅ Dark mode toggle  
✅ Real-time seat status colors (green/yellow/red)  
✅ Toast notifications  
✅ Responsive mobile design  
✅ Away mode countdown timer  
✅ QR code scanner modal  

---

## Backend Stack

### **Runtime & Framework**

| Package | Version | Purpose |
|---------|---------|---------|
| Node.js | 24.10.0 | JavaScript runtime |
| Express | 4.18.2 | Lightweight web framework |

**Express Server Location:** `server/index.js`  
**Port:** 3001

### **Database**

**SQLite 5.1.6 + sqlite 5.0.1**
- File-based, zero-config database
- Database file: `server/seatwise.db` (auto-created)
- No external database server needed
- Perfect for prototyping and small-scale deployment

**Database Features:**
- Auto-initializes on first run
- Pre-populates with 28 sample seats
- Persists seat state between restarts

### **API & Networking**

**CORS 2.8.5**
- Enables frontend (localhost:5173) to communicate with backend (localhost:3001)
- Configured in `server/index.js`:
  ```javascript
  app.use(cors())
  ```

**Express JSON Middleware**
- Automatically parses incoming JSON request bodies
- Max size: 100KB (default)

### **Background Jobs**

**Automatic Session Expiration**
- Runs every 60 seconds
- Checks for expired bookings and away modes
- Auto-releases seats after 2-hour timer expires
- Implementation: `setInterval(expireSessions, 60 * 1000)`

### **Backend Features**

✅ RESTful API endpoints  
✅ 2-hour booking timer (server-managed)  
✅ Away mode with separate expiration  
✅ Automatic seat release on timeout  
✅ Persistent seat state (SQLite)  
✅ User session management  
✅ Real-time seat availability tracking  

---

## Database Schema

### **Seats Table**

```sql
CREATE TABLE IF NOT EXISTS seats (
  id TEXT PRIMARY KEY,              -- Seat identifier (A01, G1, IS1, etc.)
  type TEXT,                        -- 'solo', 'group', or 'indoor'
  status TEXT,                      -- 'available', 'occupied', or 'away'
  zone TEXT,                        -- 'Quiet Zone', 'Group Zone', 'Indoor Study'
  floor INTEGER,                    -- Floor number (1, 2, 3, etc.)
  seats INTEGER,                    -- Capacity (1 for solo, 4+ for group/indoor)
  occupant TEXT,                    -- Name of person using seat
  bookedBy TEXT,                    -- User ID who booked
  checkIn TEXT,                     -- ISO timestamp of check-in
  expiresAt TEXT,                   -- ISO timestamp (2 hours from checkIn)
  awayExpiresAt TEXT                -- ISO timestamp for away mode expiration
);
```

### **Sample Data**

```
Solo Cubicles (A01-A27):
- Zone: Quiet Zone
- Seats: 1 each
- Status mix: available, occupied, away

Group Tables (G1-G2):
- Zone: Group Zone
- Seats: 6 each
- Type: Collaborative

Indoor Study Areas (IS1-IS2):
- Zone: Indoor Study
- Seats: 6-8 each
- Type: Sound-insulated
```

---

## API Endpoints

### **Base URL**
```
http://localhost:3001/api
```

### **Endpoints**

#### **1. Login User**
```
POST /api/login
Content-Type: application/json

Request Body:
{
  "userId": "user123",
  "name": "John Doe"
}

Response:
{
  "user": {
    "id": "user123",
    "name": "John Doe"
  }
}
```

#### **2. Get Seats & Current Booking**
```
GET /api/seats?userId=user123

Response:
{
  "seats": [
    {
      "id": "A01",
      "type": "solo",
      "status": "available",
      "zone": "Quiet Zone",
      "floor": 1
    },
    ...
  ],
  "currentBooking": {
    "id": "A08",
    "status": "occupied",
    "expiresAt": "2026-06-14T04:13:04Z",
    "timeRemaining": 3600000
  }
}
```

#### **3. Book a Seat**
```
POST /api/book
Content-Type: application/json

Request Body:
{
  "seatId": "A01",
  "userId": "user123"
}

Response:
{
  "success": true,
  "booking": {
    "seatId": "A01",
    "expiresAt": "2026-06-14T04:13:04Z"
  }
}
```

#### **4. Release a Seat**
```
POST /api/release
Content-Type: application/json

Request Body:
{
  "seatId": "A01",
  "userId": "user123"
}

Response:
{
  "success": true,
  "message": "Seat released"
}
```

#### **5. Activate Away Mode**
```
POST /api/away
Content-Type: application/json

Request Body:
{
  "seatId": "A01",
  "userId": "user123"
}

Response:
{
  "success": true,
  "awayExpiresAt": "2026-06-14T02:30:00Z",
  "awayDuration": 300000
}
```

#### **6. Return from Away Mode**
```
POST /api/return
Content-Type: application/json

Request Body:
{
  "seatId": "A01",
  "userId": "user123"
}

Response:
{
  "success": true,
  "message": "Returned to occupied status"
}
```

---

## Development Setup

### **Prerequisites**

- Node.js v18+ (version 24.10.0 tested)
- npm v8+
- macOS, Linux, or Windows

### **Installation**

```bash
# Clone or navigate to project
cd /Users/shivanshiagarwal/Downloads/seatwise_updated

# Install dependencies
npm install

# Verify Node & npm versions
node --version
npm --version
```

### **Running the Application**

#### **Option 1: Run Both (Recommended)**

In one terminal:
```bash
npm run dev:all
```

This runs:
- Frontend: `http://localhost:5173/`
- Backend: `http://localhost:3001/`

#### **Option 2: Run Separately**

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Frontend runs at `http://localhost:5173/`

**Terminal 2 - Backend (new terminal):**
```bash
npm run serve:server
```
Backend runs at `http://localhost:3001/`

### **NPM Scripts**

```json
{
  "dev": "vite",                    // Dev server only
  "serve:server": "node server/index.js",  // Backend server
  "dev:all": "concurrently \"vite\" \"node server/index.js\"",  // Both
  "build": "vite build",            // Production build
  "preview": "vite preview"         // Preview built app
}
```

### **Configuration Files**

- **vite.config.js** - Vite bundler config + API proxy
- **tailwind.config.js** - Tailwind CSS customization
- **postcss.config.js** - PostCSS plugins (Tailwind, Autoprefixer)
- **package.json** - Dependencies and scripts

---

## Project Structure

```
seatwise_updated/
│
├── src/                              # Frontend source code
│   ├── pages/
│   │   ├── LandingPage.jsx           # Homepage, features, seat types
│   │   ├── LoginPage.jsx              # User authentication UI
│   │   ├── LibraryMap.jsx             # Seat selection + QR scanner
│   │   ├── AwayModePage.jsx           # Away mode timer
│   │   ├── LibrarianDashboard.jsx     # Admin dashboard
│   │   └── InfoPage.jsx               # Learn More page
│   │
│   ├── context/
│   │   └── AppContext.jsx             # Global state + API calls
│   │
│   ├── assets/                        # Images & static files
│   │   ├── solo-cubicle.jpg           # Solo seat type image
│   │   ├── group-table.jpg            # Group table image
│   │   └── indoor-study.jpg           # Indoor study room image
│   │
│   ├── App.jsx                        # Route configuration
│   ├── main.jsx                       # React entry point
│   └── index.css                      # Global styles
│
├── server/                            # Backend source code
│   ├── index.js                       # Express server + API routes
│   └── seatwise.db                    # SQLite database (auto-created)
│
├── public/
│   └── index.html                     # HTML template
│
├── TECH_STACK.md                      # This file
├── package.json                       # Dependencies & scripts
├── vite.config.js                     # Vite configuration
├── tailwind.config.js                 # Tailwind configuration
├── postcss.config.js                  # PostCSS configuration
└── README.md                          # Project overview
```

---

## Architecture

### **Frontend Architecture**

```
┌─────────────────────────────────────┐
│       Browser (React App)           │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────────────────────┐   │
│  │   React Router               │   │
│  │  ├─ LandingPage              │   │
│  │  ├─ LoginPage                │   │
│  │  ├─ LibraryMap (+ QR)        │   │
│  │  ├─ AwayModePage             │   │
│  │  ├─ LibrarianDashboard       │   │
│  │  └─ InfoPage                 │   │
│  └──────────────────────────────┘   │
│               ↓                      │
│  ┌──────────────────────────────┐   │
│  │   AppContext (State)         │   │
│  │  ├─ user                     │   │
│  │  ├─ seats                    │   │
│  │  ├─ currentBooking           │   │
│  │  └─ awayMode                 │   │
│  └──────────────────────────────┘   │
│               ↓                      │
│  ┌──────────────────────────────┐   │
│  │   localStorage               │   │
│  │   (user session persist)     │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
         ↓ (HTTP/CORS)
    Vite Proxy
         ↓
   http://localhost:3001/api
```

### **Backend Architecture**

```
┌──────────────────────────────────┐
│   Express Server (Port 3001)     │
├──────────────────────────────────┤
│                                  │
│  ┌────────────────────────────┐  │
│  │  API Routes                │  │
│  │  ├─ POST /api/login        │  │
│  │  ├─ GET /api/seats         │  │
│  │  ├─ POST /api/book         │  │
│  │  ├─ POST /api/release      │  │
│  │  ├─ POST /api/away         │  │
│  │  └─ POST /api/return       │  │
│  └────────────────────────────┘  │
│               ↓                   │
│  ┌────────────────────────────┐  │
│  │  Background Jobs           │  │
│  │  └─ expireSessions()       │  │
│  │     (every 60 seconds)     │  │
│  └────────────────────────────┘  │
│               ↓                   │
│  ┌────────────────────────────┐  │
│  │  SQLite Database           │  │
│  │  └─ seats table            │  │
│  │     (28 rows)              │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

### **Data Flow: Book a Seat**

```
User clicks "Book" in LibraryMap
        ↓
AppContext.bookSeat(seatId)
        ↓
Fetch POST /api/book
        ↓
Express routes to POST handler
        ↓
Update SQLite: seats table
        ↓
Response: { success: true, booking: {...} }
        ↓
AppContext updates state
        ↓
Components re-render
        ↓
User sees "Checked in" toast
```

---

## Performance Notes

### **Frontend Performance**

| Metric | Value | Notes |
|--------|-------|-------|
| Vite Cold Start | ~200ms | Extremely fast dev server |
| HMR | Instant | Hot module replacement |
| Bundle Size | ~150KB gzipped | With React + dependencies |
| First Paint | <1s | On fast connection |
| Tailwind CSS | ~50KB | JIT compilation removes unused |

### **Backend Performance**

| Operation | Time | Notes |
|-----------|------|-------|
| Book Seat | <50ms | SQLite insert |
| Get Seats | <100ms | Query 28 rows |
| Release Seat | <50ms | SQLite update |
| Expire Sessions | <200ms | Background job every 60s |

### **Database Performance**

- SQLite is single-threaded but sufficient for small deployments
- For production >1000 concurrent users, consider PostgreSQL
- Current implementation: ~28 seats, negligible latency

### **Optimization Opportunities**

- [ ] Migrate to PostgreSQL for production scale
- [ ] Add Redis for session caching
- [ ] Implement WebSockets for real-time updates
- [ ] Add pagination for seat list (if >1000 seats)
- [ ] Compress static assets (gzip)

---

## Deployment Guide

### **Frontend Deployment (Vercel, Netlify, etc.)**

```bash
# Build production bundle
npm run build

# Output: dist/ folder
# Deploy dist/ folder to CDN/hosting
```

**Environment Variables:**
```
VITE_API_URL=https://your-backend-domain.com
```

### **Backend Deployment (Heroku, Railway, etc.)**

```bash
# Set environment variables
PORT=3001
NODE_ENV=production

# Start server
npm run serve:server
```

**Database:**
- Keep SQLite for small deployments
- Migrate to PostgreSQL Cloud for production

### **Docker Deployment**

**Dockerfile (Frontend + Backend)**
```dockerfile
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 5173 3001
CMD ["npm", "run", "dev:all"]
```

---

## Troubleshooting

### **Issue: Port Already in Use**

```bash
# Find process on port 3001
lsof -i :3001

# Kill process
kill -9 <PID>

# Or use different port
PORT=3002 npm run serve:server
```

### **Issue: Database Locked**

```bash
# Delete corrupted database
rm server/seatwise.db

# Restart backend (will recreate)
npm run serve:server
```

### **Issue: Images Not Loading**

- Ensure images are in `src/assets/` folder
- Check file extensions: `.jpg`, `.png`
- Import paths must match filenames exactly
- Refresh browser cache (Cmd+Shift+R)

### **Issue: API Connection Refused**

- Verify backend is running on port 3001
- Check `vite.config.js` proxy settings
- Ensure CORS is enabled in `server/index.js`

---

## Additional Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Express.js](https://expressjs.com)
- [SQLite](https://www.sqlite.org)
- [React Router](https://reactrouter.com)

---

## Support & Feedback

For issues or improvements:
1. Check this documentation first
2. Review code comments in source files
3. Check terminal output for error messages
4. Restart both frontend and backend

---

**Generated:** June 14, 2026  
**SeatWise v1.0.0**
