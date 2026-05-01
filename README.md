# Inventory Management System

### A full-stack production application — built from scratch during a one-month university internship at [ISETK](https://isetk.rnu.tn/)

*My first professional project. Real company. Real deployment. Real responsibility.*
---

## Overview

This is not a tutorial project or a class exercise. It's a complete, production-grade business application built under actual operational requirements — during my mandatory internship at **Institut Supérieur des Études Technologiques de Kairouan (ISETK)**.

The company chose to invest in having me design and develop this system from the ground up. In one month, I went from zero professional experience to delivering a fully functional inventory management platform used in a real business environment. It was my first time working in a professional setting, my first production application, and one of the most formative engineering experiences I've had.

Every architectural decision, every feature, every line of code was written with one goal: **deliver something that works in the real world.**

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Symfony 6.4 (PHP 8.1+) |
| **API** | API Platform 4.2 with Doctrine ORM |
| **Database** | MySQL / PostgreSQL with Doctrine Migrations |
| **Frontend** | React 19 with Vite 7 |
| **Styling** | Tailwind CSS 4 + Material UI |
| **Routing** | React Router v7 |
| **HTTP Client** | Axios |
| **Icons** | Lucide React |
| **Auth** | Custom RBAC security system |
| **Build Tool** | Vite + npm |

---

## Features

### Inventory & Stock
- **Product Management** — Create, update, and organize articles with codes and categories
- **Stock Tracking** — Real-time inventory monitoring with full movement history
- **Category & Unit Management** — Structured product classification
- **Multi-code per Article** — Support for product variants and SKUs

### Supplier & Client Operations
- **Supplier Management** — Full supplier profiles, purchase relationships, and statistics
- **Client Management** — Customer profiles, order history, and analytics
- **Purchase Tracking** — Complete incoming inventory from suppliers
- **Sales Processing** — Full outgoing transaction management

### Business Tools
- **Point of Sale (POS)** — Fast-checkout interface for real-time sales
- **Analytics Dashboard** — Live business metrics and inventory overview
- **Transaction History** — Detailed logs for both sales and purchases

### Security & Access
- **Role-Based Access Control (RBAC)** — Granular permission management per role
- **Secure Authentication** — JWT-based login with authorization layers
- **RESTful API** — Full API Platform integration with documented endpoints

---
## Architecture

```
inventory_management_system/
├── backend/
│   ├── src/
│   │   ├── Controller/        # API endpoint handlers
│   │   ├── Entity/            # Doctrine ORM models
│   │   ├── Repository/        # Data access layer
│   │   ├── Security/          # RBAC & authentication
│   │   ├── Processor/         # API Platform state processors
│   │   └── EventListener/     # Domain event handling
│   ├── config/                # Symfony configuration
│   ├── migrations/            # Incremental DB migrations
│   └── composer.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/             # Route-level page components
│   │   ├── components/        # Reusable UI components
│   │   ├── lib/               # Utilities, context, hooks
│   │   ├── assets/            # Static resources
│   │   └── style/             # Global CSS
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```
---

### Backend

```bash
# 1. Navigate to backend
cd backend

# 2. Install PHP dependencies
composer install

# 3. Copy and configure environment
cp .env .env.local

# 4. Set your database credentials in .env.local
# DATABASE_URL="mysql://user:password@127.0.0.1:3306/inventory_system"

# 5. Create the database
php bin/console doctrine:database:create

# 6. Run migrations
php bin/console doctrine:migrations:migrate

# 7. (Optional) Load seed data
php bin/console doctrine:fixtures:load

# 8. Start the development server
symfony server:start
# API available at: http://localhost:8000/api
```

---

### Frontend

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
# App available at: http://localhost:5173

# 4. Build for production
npm run build
```

---

## Internship Context

This project was built during my **mandatory university internship** at **ISETK** (Institut Supérieur des Études Technologiques de Kairouan). The company decided to have me build this system entirely from scratch — which meant I was responsible for every layer of the application: database design, backend API, frontend UI, authentication, and deployment readiness.

It was my **first professional experience**, my **first production application**, and one of the most valuable learning periods of my engineering journey. I had to operate at a professional standard from day one, deliver real business value, and make real architectural decisions — all within a single month.

The result is a system that is deployed and operational. I'm proud of what it represents: not just code, but the bridge between academic knowledge and professional engineering.

---

## License

This project is open source and available for everyone.
