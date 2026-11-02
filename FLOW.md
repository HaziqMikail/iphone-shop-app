# iPhone Shop Application — Architecture & Operation Flow

This document visualizes the complete end-to-end operation flow of the iPhone Shop Management system, showing which technology stack is used at each step, where GraphQL fits in, and how data moves between layers.

---

## 1. High-Level Architecture Overview

```mermaid
graph TD
    subgraph Browser ["Client-Side (React Application) - Port 3000"]
        UI["React UI Components<br/>(ProductGrid, ProductCard, SearchControls, ProductForm)"]
        Hooks["Custom Hooks<br/>(useProducts, useFavorites)"]
        Apollo["Apollo Client 3<br/>(InMemoryCache & GraphQL Document Nodes)"]
    end

    subgraph Transport ["Network / Transport Layer"]
        HTTP["HTTP POST http://localhost:3001/graphql<br/>(JSON payload: query, variables, operationName)"]
    end

    subgraph Backend ["Backend API Layer - Port 3001"]
        Server["GraphQL Engine & Schema Resolvers<br/>(QueryType, MutationType)"]
    end

    subgraph Storage ["Database / Persistence Layer"]
        DB["PostgreSQL 15 (Docker) & Local db_data.json<br/>Tables: products, favorites"]
    end

    UI -->|"User interaction (clicks, inputs)"| Hooks
    Hooks -->|"Triggers useQuery / useMutation"| Apollo
    Apollo -->|"Dispatches GraphQL Request"| HTTP
    HTTP -->|"Processes request"| Server
    Server -->|"Reads / Writes Data"| DB
    DB -->|"Returns dataset / status"| Server
    Server -->|"Returns GraphQL JSON result"| HTTP
    HTTP -->|"Resolves Promise / Updates Cache"| Apollo
    Apollo -->|"Triggers re-render with new data"| Hooks
    Hooks -->|"Renders updated UI"| UI
```

---

## 2. Technology Stack Roles in the Flow

| Layer | Technology | Primary Role in the Flow |
| :--- | :--- | :--- |
| **Presentation (UI)** | **React 18 & CSS Utilities** | Renders product cards, search inputs, dropdowns, and modal dialogs. Listens for user events. |
| **State Management** | **React Hooks (`useState`, `useEffect`)** | Maintains local UI state (modal open/close, active search term, selected filters). |
| **GraphQL Client** | **Apollo Client (`@apollo/client`)** | Manages remote data, caches GraphQL responses in memory (`InMemoryCache`), and triggers automatic component re-renders. |
| **Data Contracts** | **GraphQL (`graphql-tag` / `gql`)** | Defines exact schema contracts: [`queries.js`](file:///c:/Coding%20Project/Iphone%20Management/iphone-shop-frontend/src/graphql/queries.js) & [`mutations.js`](file:///c:/Coding%20Project/Iphone%20Management/iphone-shop-frontend/src/graphql/mutations.js). No over-fetching or under-fetching. |
| **Network Protocol** | **HTTP / JSON / CORS** | Sends GraphQL queries and mutations as HTTP `POST` requests to `http://localhost:3001/graphql`. |
| **API Server** | **Node.js GraphQL / Rails GraphQL** | Validates incoming GraphQL AST, executes resolvers for requested fields, and enforces business rules. |
| **Database** | **PostgreSQL 15 / pgAdmin / JSON** | Stores relational entities (`products` and `favorites`) with foreign keys and unique constraints. |

---

## 3. Detailed Operational Flows

### Flow A: Fetching, Searching & Filtering Products

When a user opens the page, changes a category, or types in the search bar:

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant SC as SearchControls.js
    participant Hook as useProducts.js
    participant Apollo as Apollo Client
    participant API as GraphQL Server (Port 3001)
    participant DB as PostgreSQL / Storage

    User->>SC: Types search term or selects category
    SC->>Hook: Updates filters { search, category, sortBy }
    Hook->>Apollo: useQuery(GET_PRODUCTS, { variables: filters })
    Apollo->>API: POST /graphql { query: "GetProducts", variables: { ... } }
    API->>API: Execute Query: products(...) & categories
    API->>DB: Query products matching search/category/sort
    DB-->>API: Return matching rows
    API-->>Apollo: 200 OK { data: { products: [...], categories: [...] } }
    Apollo->>Hook: Returns { data, loading: false }
    Hook->>User: Re-renders ProductGrid with filtered iPhones
```

* **Where GraphQL is used:**
  * Client sends:
    ```graphql
    query GetProducts($search: String, $category: String, $sortBy: String) {
      products(search: $search, category: $category, sortBy: $sortBy) {
        id
        name
        price
        category
        stock
      }
      categories
    }
    ```
  * Server executes field resolver `products(search, category, sortBy)`.

---

### Flow B: Adding / Removing Favorites (Heart Icon)

When the user clicks the heart icon on any iPhone card:

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant Card as ProductCard.js
    participant Hook as useFavorites.js
    participant Apollo as Apollo Client
    participant API as GraphQL Server (Port 3001)
    participant DB as PostgreSQL / Storage

    User->>Card: Clicks ❤️ / 🤍 button
    Card->>Hook: toggleFavorite(productId)
    alt Product not in favoriteIds
        Hook->>Apollo: addFavoriteMutation({ variables: { productId, userId } })
        Apollo->>API: POST /graphql { mutation: "AddFavorite", input: { ... } }
        API->>DB: INSERT INTO favorites (product_id, user_id)
        DB-->>API: Row created
        API-->>Apollo: { data: { addFavorite: { favorite: { id: ... } } } }
    else Product already in favoriteIds
        Hook->>Apollo: removeFavoriteMutation({ variables: { productId, userId } })
        Apollo->>API: POST /graphql { mutation: "RemoveFavorite", input: { ... } }
        API->>DB: DELETE FROM favorites WHERE product_id = ...
        DB-->>API: Row deleted
        API-->>Apollo: { data: { removeFavorite: { success: true } } }
    end
    Hook->>Apollo: refetch(GET_FAVORITES)
    Apollo->>API: Re-query favorites list
    API-->>Apollo: Updated favorites
    Apollo->>Card: Updates heart color (❤️) and header count badge
```

---

### Flow C: Adding a New Product

When an admin clicks **Add Product** and submits the form:

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant Form as ProductForm.js
    participant Hook as useProducts.js
    participant Apollo as Apollo Client
    participant API as GraphQL Server (Port 3001)
    participant DB as PostgreSQL / Storage

    User->>Form: Fills form (Name, Price, Category, etc.) & clicks Save
    Form->>Hook: createProduct(formData)
    Hook->>Apollo: createProductMutation({ variables: { ... } })
    Apollo->>API: POST /graphql { mutation: "CreateProduct", input: { ... } }
    API->>API: Validate inputs (price > 0, required name/category)
    API->>DB: INSERT INTO products (name, price, category, ...)
    DB-->>API: New product record (id: 7)
    API-->>Apollo: { data: { createProduct: { product: { id: "7", name: "..." }, errors: [] } } }
    Hook->>Apollo: refetch() GET_PRODUCTS
    Apollo->>API: Query fresh product list
    API->>DB: SELECT * FROM products ORDER BY id DESC
    DB-->>API: All products including new iPhone
    API-->>Apollo: Updated product array
    Apollo->>Form: Closes modal
    Apollo->>User: New iPhone card immediately displays in ProductGrid
```

---

### Flow D: Deleting a Product

When the user clicks **Delete** on an iPhone card:

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant Card as ProductCard.js
    participant Hook as useProducts.js
    participant API as GraphQL Server (Port 3001)
    participant DB as PostgreSQL / Storage

    User->>Card: Clicks Delete & confirms browser prompt
    Card->>Hook: deleteProduct(id)
    Hook->>API: POST /graphql { mutation: "DeleteProduct", input: { id } }
    API->>DB: DELETE FROM favorites WHERE product_id = id (Cascade)
    API->>DB: DELETE FROM products WHERE id = id
    DB-->>API: Success confirmation
    API-->>Hook: { data: { deleteProduct: { success: true, errors: [] } } }
    Hook->>API: refetch() GET_PRODUCTS
    API-->>Hook: Updated product list
    Hook->>User: Card disappears with smooth transition
```

---

## 4. File-to-Layer Mapping Reference

```text
iphone-shop-app/
├── iphone-shop-frontend/src/
│   ├── apollo/client.js        <-- Configures Apollo Client HTTP link to :3001/graphql
│   ├── graphql/
│   │   ├── queries.js          <-- GET_PRODUCTS, GET_FAVORITES (gql definitions)
│   │   └── mutations.js        <-- CREATE_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT, ADD/REMOVE_FAVORITE
│   ├── hooks/
│   │   ├── useProducts.js      <-- Handles product queries, refetches, and mutations
│   │   └── useFavorites.js     <-- Handles favorite status, toggling, and queries
│   └── components/
│       ├── Header.js           <-- App title bar
│       ├── SearchControls.js   <-- Search bar, category filter, sort by, favorites toggle
│       ├── ProductGrid.js      <-- Responsive cards grid container
│       ├── ProductCard.js      <-- Individual product card, price, stock, ❤️ button
│       ├── ProductDetail.js    <-- Full details modal
│       ├── ProductForm.js      <-- Add / Edit product modal
│       └── FavoritesList.js    <-- My Favorites drawer
│
├── iphone-shop-api/
│   ├── server.js               <-- Express/Node.js GraphQL schema, resolvers, CORS, and local db
│   ├── app/graphql/            <-- Ruby on Rails GraphQL types, queries, and mutations
│   └── db/seeds.rb             <-- Initial iPhone database seeds
│
└── PostgreSQL (Docker)         <-- Persistent relational storage on port 5432
```
