# 🚀 TradeSphere AI

> A full-stack fintech platform for paper trading, portfolio management, expense tracking, and AI-powered financial insights.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?logo=postgresql)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-UI-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📌 Overview

TradeSphere AI is a **full-stack fintech web application** that simulates stock trading using virtual money. Users can buy and sell stocks, track portfolio performance, monitor expenses, manage financial goals, and receive AI-powered financial insights through an intuitive dashboard.

The project demonstrates modern full-stack development practices using React, Express, Prisma, PostgreSQL, JWT authentication, REST APIs, and interactive data visualizations.

---

# ✨ Features

## 🔐 Authentication

- User Registration
- Secure Login
- JWT Authentication
- Protected Routes
- Logout

---

## 💰 Wallet

- Virtual Wallet
- Wallet Balance
- Automatic Balance Updates
- Buy/Sell Transactions

---

## 📈 Portfolio

- Buy Stocks
- Sell Stocks
- Live Portfolio
- Average Buy Price
- Profit/Loss Calculation
- Holdings Summary
- Portfolio Value
- Asset Allocation Chart

---

## 📊 Dashboard

- Portfolio Overview
- Wallet Balance
- Total Investment
- Overall Profit/Loss
- Holdings Count
- Recent Transactions
- Portfolio Charts

---

## 📉 Market

- Live Stock Quotes
- Search Stocks
- Stock Details
- TradingView Charts
- Price Changes

---

## ⭐ Watchlist

- Add to Watchlist
- Remove from Watchlist
- Quick Access to Favorite Stocks

---

## 💸 Expense Tracker

- Add Expenses
- Edit Expenses
- Delete Expenses
- Expense Categories
- Payment Methods
- Expense Analytics
- Expense Pie Chart
- Expense Trend Chart
- Category Breakdown

---

## 🎯 Financial Goals

- Create Goals
- Track Progress
- Goal Analytics
- SIP Planning

---

## 🔔 Notifications

- Buy/Sell Notifications
- Expense Notifications
- Goal Notifications
- Mark as Read
- Delete Notifications

---

## 🤖 AI Financial Assistant

- Financial Questions
- Expense Insights
- Portfolio Insights
- Goal Suggestions
- Investment Guidance

---

## 📱 Responsive Design

- Mobile Friendly
- Tablet Friendly
- Desktop Friendly

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router
- Recharts
- React Hook Form
- React Hot Toast

---

## Backend

- Node.js
- Express.js
- Prisma ORM
- JWT Authentication
- Zod Validation

---

## Database

- PostgreSQL

---

## External APIs

- Finnhub API (Stock Market Data)
- TradingView Widget
- Google Gemini API (AI Assistant)

---

# 📂 Folder Structure

```
TradeSphere-AI/

├── client/
│
│   ├── src/
│   │
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── services/
│   ├── hooks/
│   ├── layouts/
│   └── assets/
│
└── server/
    │
    ├── controllers/
    ├── routes/
    ├── middlewares/
    ├── prisma/
    ├── utils/
    ├── services/
    └── validators/
```

---

# 🗄 Database Schema

Main Entities

- User
- Wallet
- Portfolio
- Transaction
- Watchlist
- Expense
- Goal
- Notification

---

# 📊 Application Flow

```
User

↓

Authentication

↓

Dashboard

↓

Buy / Sell Stocks

↓

Portfolio Updates

↓

Wallet Updates

↓

Transactions

↓

Analytics

↓

AI Insights
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/yourusername/tradesphere-ai.git
```

---

## Frontend

```bash
cd client

npm install

npm run dev
```

---

## Backend

```bash
cd server

npm install

npx prisma generate

npx prisma migrate dev

npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file inside the server folder.

```env
DATABASE_URL=

JWT_SECRET=

FINNHUB_API_KEY=

GEMINI_API_KEY=
```

---


---

# 📈 Future Improvements

- Real-time stock updates using WebSockets
- Advanced portfolio analytics
- Budget management
- Email notifications
- Multi-currency support
- PDF report generation
- OAuth Login
- Dark Mode

---

# 🎓 Learning Outcomes

This project helped me gain practical experience with:

- Full-Stack Development
- REST API Design
- Database Modeling
- Authentication & Authorization
- Prisma ORM
- PostgreSQL
- React State Management
- Financial Data Visualization
- External API Integration
- AI Integration
- Responsive UI Design

---

# 👨‍💻 Author

**Jayesh Deore**

- GitHub: https://github.com/Jayeshd6/TradeSphere.git
- LinkedIn: https://www.linkedin.com/in/jayesh-deore-024719319/

---

# ⭐ If you found this project helpful, consider giving it a star!
