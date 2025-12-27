# FinTrack - Personal Expense Tracker

**FinTrack** is a comprehensive personal finance management application that helps you take control of your money. Track your daily expenses, monitor your income, set budgets, and gain insights into your spending habits through intuitive visualizations.

## 🎯 What is FinTrack?

Managing personal finances can be overwhelming. FinTrack simplifies this by providing a single platform where you can:

- **Record every transaction** - Never lose track of where your money goes
- **Visualize your finances** - Understand your spending patterns at a glance
- **Set and track budgets** - Stay within your financial limits
- **Analyze trends** - Make informed decisions based on your financial history

Whether you're saving for a goal, trying to reduce unnecessary expenses, or simply want to know where your money goes each month, FinTrack provides the tools you need.

---

## ✨ Features

### 📊 Dashboard

Your financial command center. Get an instant overview of your financial health with:

- **Total Income** - Sum of all money coming in for the selected period
- **Total Expenses** - Sum of all money going out
- **Net Savings** - The difference between income and expenses
- **Visual Charts** - Area chart showing expense trends over the month
- **Recent Transactions** - Quick view of your latest financial activities

### 💸 Transaction Management

The core of expense tracking. Record and manage all your financial activities:

- **Add Transactions** - Log income or expenses with amount, category, date, and notes
- **Edit & Delete** - Modify or remove transactions as needed
- **Filter & Search** - Find transactions by type, category, date range, or keyword
- **Pagination** - Navigate through large transaction histories easily
- **Payment Method** - Track whether you paid by cash, card, or bank transfer

### 🏷️ Categories

Organize your transactions for better insights:

- **Pre-built Categories** - Common categories like Food, Transport, Shopping, Salary, etc.
- **Custom Categories** - Create your own categories that match your lifestyle
- **Color Coding** - Assign colors to categories for easy visual identification
- **Separate by Type** - Different categories for income and expenses

### 💰 Budgets

Stay on top of your spending limits:

- **Monthly Budgets** - Set spending limits for each category per month
- **Progress Tracking** - Visual progress bars showing how much you've spent vs. your limit
- **Status Indicators** - Green (on track), Yellow (near limit), Red (over budget)
- **Remaining Amount** - See exactly how much you can still spend in each category

### 📈 Reports

Gain deep insights into your financial behavior:

- **Monthly Summary** - Compare income vs. expenses for any month
- **Category Breakdown** - Pie chart showing where your money goes
- **Daily Spending** - Bar chart of day-by-day expenses
- **Trend Analysis** - Understand your spending patterns over time

### ⚙️ Settings

Customize FinTrack to your preferences:

- **Profile Management** - Update your name and email
- **Currency Selection** - Choose from USD, EUR, GBP, PKR, INR, or AED
- **Display Preferences** - Toggle payment method visibility
- **Security** - Change your password anytime

---

## 🛠️ Tech Stack

| Layer        | Technology      | Purpose                      |
| ------------ | --------------- | ---------------------------- |
| **Frontend** | React 18        | User interface               |
|              | Vite            | Fast build tool & dev server |
|              | Tailwind CSS    | Styling                      |
|              | React Router v6 | Navigation                   |
|              | Recharts        | Charts & visualizations      |
|              | Axios           | API communication            |
| **Backend**  | Node.js         | Runtime environment          |
|              | Express.js      | Web framework                |
|              | MongoDB         | Database                     |
|              | Mongoose        | Database ODM                 |
|              | JWT             | Authentication               |
|              | bcryptjs        | Password security            |

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local installation or MongoDB Atlas account) - [Download](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js) or **yarn**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/fin-track.git
   cd fin-track
   ```

2. **Set up the Backend**

   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```

   Edit the `.env` file with your configuration (see Backend README for details)

3. **Set up the Frontend**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the Application**

   Open two terminal windows:

   ```bash
   # Terminal 1 - Start Backend
   cd backend
   npm run dev
   ```

   ```bash
   # Terminal 2 - Start Frontend
   cd frontend
   npm run dev
   ```

5. **Open the Application**

   Visit `http://localhost:3000` in your browser

For detailed setup instructions, see:

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

---

## 📁 Project Structure

```
fin-track/
├── backend/                 # Node.js + Express API
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Authentication middleware
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API route definitions
│   ├── scripts/            # Utility scripts (seeding)
│   ├── server.js           # Application entry point
│   └── README.md           # Backend documentation
│
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context (Auth)
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   └── utils/          # Helper functions
│   ├── index.html          # HTML entry point
│   └── README.md           # Frontend documentation
│
└── README.md               # This file
```

---

## 📄 License

This project is licensed under the MIT License - you are free to use, modify, and distribute this software for personal or commercial purposes.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
