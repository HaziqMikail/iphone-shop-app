# iPhone Shop Management — Developer Guide

This guide contains the project overview, tech stack breakdown, database credentials, and all essential commands to remember when developing or running this project.

---

## 🛠 Tech Stack

### 1. Frontend
* **Framework:** React 18 (Create React App)
* **GraphQL Client:** Apollo Client 3 (`@apollo/client`, `graphql`)
* **Styling:** Custom Tailwind-utility CSS (`App.css`)
* **Testing:** React Testing Library + Jest

### 2. Backend
* **API Paradigm:** GraphQL API (Queries & Mutations)
* **Port:** `3001` (Endpoint: `http://localhost:3001/graphql`)
* **Engines Supported:**
  * **Node.js Server:** [`iphone-shop-api/server.js`](file:///c:/Coding%20Project/Iphone%20Management/iphone-shop-api/server.js) — Lightweight, zero-config native runner with local persistence (`db_data.json`).
  * **Ruby on Rails Server:** [`iphone-shop-api/`](file:///c:/Coding%20Project/Iphone%20Management/iphone-shop-api) — Original Rails 8 GraphQL backend with Puma and PostgreSQL.

### 3. Database & Management
* **Database:** PostgreSQL 15 (Docker container `iphone_postgres`)
* **Database GUI:** pgAdmin 4
* **Port:** `5432`

---

## 🔌 Ports Summary

| Service | Host / URL | Port |
| :--- | :--- | :--- |
| **Frontend Web App** | `http://localhost:3000` | `3000` |
| **GraphQL API** | `http://localhost:3001/graphql` | `3001` |
| **PostgreSQL Database** | `localhost` | `5432` |

---

## 🔑 Database Credentials (PostgreSQL & pgAdmin)

| Parameter | Value |
| :--- | :--- |
| **Server Name** | `PostgreSQL Local` |
| **Host Name / Address** | `localhost` (or `127.0.0.1`) |
| **Port** | `5432` |
| **Maintenance Database** | `postgres` |
| **Project Database** | `iphone_shop_api_development` |
| **Username** | `postgres` |
| **Password** | `Pass1234*` |

---

## 🚀 Daily Workflow & Commands

### 1. Quick Start (Frontend + API)
From the project root:
```bash
npm start
```
* Starts GraphQL API on port `3001`.
* Starts React development server on port `3000`.

### 2. Running Services Separately
```bash
# Start backend server only
npm run server

# Start frontend only
npm run client

# Run test suite
npm test
```

---

## 🐳 PostgreSQL Docker Cheatsheet

### Start Database Container
```powershell
docker start iphone_postgres
```

### Stop Database Container
```powershell
docker stop iphone_postgres
```

### Auto-start Container With Docker (Set & Forget)
Run this once so the database automatically boots whenever Docker Desktop is open:
```powershell
docker update --restart unless-stopped iphone_postgres
```

### Check Database Status
```powershell
docker ps -f name=iphone_postgres
```

### Open Direct SQL Terminal
```powershell
docker exec -it iphone_postgres psql -U postgres -d iphone_shop_api_development
```

---

## 🐘 pgAdmin 4 Connection Steps

1. Open **Docker Desktop** (ensure Docker Engine is running).
2. Open **pgAdmin 4**.
3. In the left panel, expand **Servers** &rarr; **PostgreSQL Local**.
4. Browse your tables under:
   ```text
   Servers
     └── PostgreSQL Local
           └── Databases
                 └── iphone_shop_api_development
                       └── Schemas
                             └── public
                                   └── Tables (products, favorites)
   ```
5. Right-click **`products`** &rarr; **View/Edit Data** &rarr; **All Rows** to view and edit items.

---

## 💡 Important Notes

* **Data Safety:** Your database container (`iphone_postgres`) keeps its data stored locally on disk. Stopping the container or shutting down your PC will **never** delete your data.
* **pgAdmin:** You do **not** need to leave pgAdmin open while using the web app; pgAdmin is only an optional viewer tool.
* **Git Cleanliness:** `node_modules`, build caches, log files, and local runtime files (`db_data.json`) are ignored via `.gitignore` to keep commits clean.
