# FinTrack Frontend

Modern React-based user interface for the FinTrack personal expense tracker. Built with React 18, Vite, and Tailwind CSS.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [Key Components](#key-components)

---

## Prerequisites

Before running the frontend, ensure you have:

| Requirement | Version | Check Command |
|-------------|---------|---------------|
| Node.js | 18.x or higher | `node --version` |
| npm | 9.x or higher | `npm --version` |

**Important:** The backend server must be running for the application to work properly.

---

## Installation

1. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

---

## Running the Application

### Development Mode

```bash
npm run dev
```

This starts the development server with:
- **Hot Module Replacement (HMR)** - Changes appear instantly without page refresh
- **API Proxy** - Requests to `/api` are automatically forwarded to the backend

The application will be available at: **http://localhost:3000**

### Prerequisites for Running

Before starting the frontend, ensure:
1. ✅ Backend server is running on port 5000
2. ✅ MongoDB is running and accessible

---

## Building for Production

1. **Create production build**
   ```bash
   npm run build
   ```
   This creates an optimized build in the `dist/` folder.

2. **Preview the production build locally**
   ```bash
   npm run preview
   ```

---

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Generic components (buttons, modals, etc.)
│   │   └── layout/         # Layout components (sidebar, header)
│   │
│   ├── context/            # React Context providers
│   │   └── AuthContext.jsx # Authentication state management
│   │
│   ├── pages/              # Page components (routes)
│   │   ├── auth/           # Login and Signup pages
│   │   ├── transactions/   # Transaction list and form
│   │   ├── Dashboard.jsx   # Main dashboard
│   │   ├── Categories.jsx  # Category management
│   │   ├── Budgets.jsx     # Budget management
│   │   ├── Reports.jsx     # Financial reports
│   │   └── Settings.jsx    # User settings
│   │
│   ├── services/           # API communication layer
│   │   └── api.js          # Axios instance and API functions
│   │
│   ├── utils/              # Utility functions
│   │   └── helpers.js      # Formatting, date helpers, etc.
│   │
│   ├── App.jsx             # Root component with routing
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global styles (Tailwind)
│
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

---

## Key Components

### Pages

| Page | Path | Description |
|------|------|-------------|
| Dashboard | `/dashboard` | Financial overview with charts |
| Transactions | `/transactions` | List and manage transactions |
| Add Transaction | `/transactions/new` | Create new transaction |
| Edit Transaction | `/transactions/:id/edit` | Modify existing transaction |
| Categories | `/categories` | Manage income/expense categories |
| Budgets | `/budgets` | Set and track monthly budgets |
| Reports | `/reports` | View financial analytics |
| Settings | `/settings` | User profile and preferences |
| Login | `/login` | User authentication |
| Signup | `/signup` | New user registration |

### Common Components

| Component | Purpose |
|-----------|---------|
| `PageHeader` | Consistent page titles with actions |
| `Modal` | Reusable modal dialog |
| `ConfirmDialog` | Confirmation prompts |
| `LoadingSpinner` | Loading indicators |
| `EmptyState` | Empty data placeholders |
| `SummaryCard` | Dashboard metric cards |

### Context

| Context | Purpose |
|---------|---------|
| `AuthContext` | Manages user authentication state, login/logout, and user data |

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Configuration

### Vite Configuration (`vite.config.js`)

The development server is configured to:
- Run on port **3000**
- Proxy `/api` requests to `http://localhost:5000` (backend)

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
```

### Tailwind Configuration

Custom colors and theme extensions are defined in `tailwind.config.js`.
