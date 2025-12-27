# FinTrack Backend

REST API server for the FinTrack personal expense tracker application. Built with Node.js, Express.js, and MongoDB.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)

---

## Prerequisites

Before running the backend, ensure you have:

| Requirement | Version | Check Command |
|-------------|---------|---------------|
| Node.js | 18.x or higher | `node --version` |
| npm | 9.x or higher | `npm --version` |
| MongoDB | 6.x or higher | `mongod --version` |

### MongoDB Setup Options

**Option 1: Local MongoDB**
1. Download and install [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Start the MongoDB service:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Windows
   net start MongoDB
   
   # Linux
   sudo systemctl start mongod
   ```

**Option 2: MongoDB Atlas (Cloud)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string from the cluster dashboard

---

## Installation

1. **Navigate to the backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see [Configuration](#configuration))

---

## Configuration

Edit the `.env` file with your settings:

```env
# Server Configuration
PORT=5000                    # Port the server will run on
NODE_ENV=development         # Environment: development or production

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/fintrack    # Your MongoDB connection string

# JWT Configuration
JWT_SECRET=your-secret-key-here    # Secret key for JWT tokens (use a strong random string)
JWT_EXPIRE=7d                       # Token expiration time (e.g., 7d, 24h, 30d)
```

### Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port number | `5000` |
| `NODE_ENV` | Application environment | `development` or `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/fintrack` |
| `JWT_SECRET` | Secret for signing JWT tokens | `my-super-secret-key-123` |
| `JWT_EXPIRE` | How long tokens remain valid | `7d` (7 days) |

---

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```
The server will restart automatically when you make changes.

### Production Mode
```bash
npm start
```

### Seed Default Categories
```bash
npm run seed
```
This creates default income and expense categories for all existing users.

### Verify the Server is Running
```bash
curl http://localhost:5000/api/health
```
Expected response:
```json
{"status":"ok","message":"FinTrack API is running"}
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get token |
| GET | `/api/auth/me` | Get current user profile |
| PUT | `/api/auth/profile` | Update user profile |
| PUT | `/api/auth/password` | Change password |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get all transactions (with filters) |
| POST | `/api/transactions` | Create a transaction |
| GET | `/api/transactions/:id` | Get a single transaction |
| PUT | `/api/transactions/:id` | Update a transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| POST | `/api/categories` | Create a category |
| PUT | `/api/categories/:id` | Update a category |
| DELETE | `/api/categories/:id` | Delete a category |

### Budgets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/budgets` | Get budgets (query: month) |
| POST | `/api/budgets` | Create a budget |
| PUT | `/api/budgets/:id` | Update a budget |
| DELETE | `/api/budgets/:id` | Delete a budget |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/summary` | Get monthly summary |
| GET | `/api/reports/category-breakdown` | Get category breakdown |
| GET | `/api/reports/daily-spending` | Get daily spending data |

---

## Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection setup
├── controllers/
│   ├── auth.controller.js      # Authentication logic
│   ├── budget.controller.js    # Budget CRUD operations
│   ├── category.controller.js  # Category CRUD operations
│   ├── report.controller.js    # Report generation
│   └── transaction.controller.js # Transaction CRUD operations
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── models/
│   ├── Budget.js          # Budget schema
│   ├── Category.js        # Category schema
│   ├── Transaction.js     # Transaction schema
│   └── User.js            # User schema
├── routes/
│   ├── auth.routes.js     # Auth endpoints
│   ├── budget.routes.js   # Budget endpoints
│   ├── category.routes.js # Category endpoints
│   ├── report.routes.js   # Report endpoints
│   └── transaction.routes.js # Transaction endpoints
├── scripts/
│   └── seedCategories.js  # Default categories seeder
├── .env.example           # Environment template
├── package.json           # Dependencies
├── server.js              # Application entry point
└── README.md              # This file
```
