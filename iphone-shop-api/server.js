/**
 * Lightweight GraphQL API Server for iPhone Shop App
 * Compatible with the Rails GraphQL schema on port 3001.
 * Allows running the full-stack app out-of-the-box using Node.js without requiring Ruby or PostgreSQL installation.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { graphql, buildSchema } = require('../iphone-shop-frontend/node_modules/graphql');

const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'db_data.json');

const INITIAL_PRODUCTS = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    description: 'Latest flagship with A17 Pro chip',
    price: 1199.0,
    model: '15 Pro Max',
    color: 'Natural Titanium',
    storage: '256GB',
    category: 'Pro Models',
    stock: 15,
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
  },
  {
    id: '2',
    name: 'iPhone 15 Pro',
    description: 'Pro model with titanium design',
    price: 999.0,
    model: '15 Pro',
    color: 'Blue Titanium',
    storage: '128GB',
    category: 'Pro Models',
    stock: 20,
    createdAt: new Date('2024-01-01T00:01:00Z').toISOString(),
  },
  {
    id: '3',
    name: 'iPhone 15 Plus',
    description: 'Large screen standard model',
    price: 899.0,
    model: '15 Plus',
    color: 'Black',
    storage: '256GB',
    category: 'Standard Models',
    stock: 25,
    createdAt: new Date('2024-01-01T00:02:00Z').toISOString(),
  },
  {
    id: '4',
    name: 'iPhone 15',
    description: 'Standard latest generation',
    price: 799.0,
    model: '15',
    color: 'Pink',
    storage: '128GB',
    category: 'Standard Models',
    stock: 30,
    createdAt: new Date('2024-01-01T00:03:00Z').toISOString(),
  },
  {
    id: '5',
    name: 'iPhone 14',
    description: 'Previous generation value',
    price: 699.0,
    model: '14',
    color: 'Purple',
    storage: '128GB',
    category: 'Previous Gen',
    stock: 40,
    createdAt: new Date('2024-01-01T00:04:00Z').toISOString(),
  },
  {
    id: '6',
    name: 'iPhone SE',
    description: 'Budget-friendly option',
    price: 429.0,
    model: 'SE',
    color: 'Midnight',
    storage: '64GB',
    category: 'Budget',
    stock: 50,
    createdAt: new Date('2024-01-01T00:05:00Z').toISOString(),
  },
];

let state = {
  products: [...INITIAL_PRODUCTS],
  favorites: [],
};

function loadState() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      if (Array.isArray(parsed.products)) {
        state = parsed;
        return;
      }
    } catch (e) {
      console.warn('Could not parse db_data.json, falling back to seed data:', e.message);
    }
  }
  saveState();
}

function saveState() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

loadState();

const schema = buildSchema(`
  type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
    model: String
    color: String
    storage: String
    category: String!
    stock: Int
    createdAt: String
    updatedAt: String
  }

  type Favorite {
    id: ID!
    product: Product!
    userId: String!
  }

  type ProductPayload {
    product: Product
    errors: [String!]!
  }

  type DeletePayload {
    success: Boolean!
    errors: [String!]!
  }

  type FavoritePayload {
    favorite: Favorite
    errors: [String!]!
  }

  input CreateProductInput {
    name: String!
    price: Float!
    category: String!
    description: String
    model: String
    color: String
    storage: String
    stock: Int
  }

  input UpdateProductInput {
    id: ID!
    name: String
    price: Float
    category: String
    description: String
    model: String
    color: String
    storage: String
    stock: Int
  }

  input DeleteProductInput {
    id: ID!
  }

  input FavoriteInput {
    productId: ID!
    userId: String!
  }

  type Query {
    products(search: String, category: String, sortBy: String): [Product!]!
    categories: [String!]!
    favorites(userId: String!): [Favorite!]!
    product(id: ID!): Product
  }

  type Mutation {
    createProduct(input: CreateProductInput!): ProductPayload!
    updateProduct(input: UpdateProductInput!): ProductPayload!
    deleteProduct(input: DeleteProductInput!): DeletePayload!
    addFavorite(input: FavoriteInput!): FavoritePayload!
    removeFavorite(input: FavoriteInput!): DeletePayload!
  }
`);

const root = {
  products: ({ search, category, sortBy }) => {
    let result = [...state.products];

    if (search && search.trim()) {
      const term = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(term)) ||
          (p.model && p.model.toLowerCase().includes(term))
      );
    }

    if (category && category.trim()) {
      result = result.filter((p) => p.category === category.trim());
    }

    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'stock':
        result.sort((a, b) => (b.stock || 0) - (a.stock || 0));
        break;
      default:
        result.sort((a, b) => (b.id > a.id ? 1 : -1));
        break;
    }

    return result;
  },

  categories: () => {
    const categories = new Set();
    state.products.forEach((p) => {
      if (p.category) categories.add(p.category);
    });
    return Array.from(categories);
  },

  favorites: ({ userId }) => {
    return state.favorites
      .filter((f) => f.userId === userId)
      .map((f) => {
        const product = state.products.find((p) => String(p.id) === String(f.productId));
        return {
          id: f.id,
          userId: f.userId,
          product: product || {
            id: f.productId,
            name: 'Unknown',
            price: 0,
            category: 'Unknown',
          },
        };
      });
  },

  product: ({ id }) => {
    return state.products.find((p) => String(p.id) === String(id)) || null;
  },

  createProduct: ({ input }) => {
    const id = String(Date.now());
    const newProduct = {
      id,
      name: input.name,
      description: input.description || '',
      price: Number(input.price),
      model: input.model || '',
      color: input.color || '',
      storage: input.storage || '',
      category: input.category,
      stock: input.stock != null ? Number(input.stock) : 0,
      createdAt: new Date().toISOString(),
    };
    state.products.unshift(newProduct);
    saveState();
    return { product: newProduct, errors: [] };
  },

  updateProduct: ({ input }) => {
    const index = state.products.findIndex((p) => String(p.id) === String(input.id));
    if (index === -1) {
      return { product: null, errors: ['Product not found'] };
    }
    const current = state.products[index];
    const updated = {
      ...current,
      name: input.name !== undefined ? input.name : current.name,
      description: input.description !== undefined ? input.description : current.description,
      price: input.price !== undefined ? Number(input.price) : current.price,
      model: input.model !== undefined ? input.model : current.model,
      color: input.color !== undefined ? input.color : current.color,
      storage: input.storage !== undefined ? input.storage : current.storage,
      category: input.category !== undefined ? input.category : current.category,
      stock: input.stock !== undefined ? Number(input.stock) : current.stock,
      updatedAt: new Date().toISOString(),
    };
    state.products[index] = updated;
    saveState();
    return { product: updated, errors: [] };
  },

  deleteProduct: ({ input }) => {
    const idStr = String(input.id);
    const initialLength = state.products.length;
    state.products = state.products.filter((p) => String(p.id) !== idStr);
    if (state.products.length === initialLength) {
      return { success: false, errors: ['Product not found'] };
    }
    state.favorites = state.favorites.filter((f) => String(f.productId) !== idStr);
    saveState();
    return { success: true, errors: [] };
  },

  addFavorite: ({ input }) => {
    const { productId, userId } = input;
    const exists = state.favorites.find(
      (f) => String(f.productId) === String(productId) && f.userId === userId
    );
    if (exists) {
      return { favorite: exists, errors: [] };
    }
    const newFav = {
      id: String(Date.now()),
      productId: String(productId),
      userId,
    };
    state.favorites.push(newFav);
    saveState();
    const product = state.products.find((p) => String(p.id) === String(productId));
    return {
      favorite: {
        id: newFav.id,
        userId: newFav.userId,
        product: product || { id: productId, name: 'Unknown', price: 0, category: 'Unknown' },
      },
      errors: [],
    };
  },

  removeFavorite: ({ input }) => {
    const { productId, userId } = input;
    const initialLen = state.favorites.length;
    state.favorites = state.favorites.filter(
      (f) => !(String(f.productId) === String(productId) && f.userId === userId)
    );
    saveState();
    return { success: true, errors: [] };
  },
};

const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'iPhone Shop GraphQL API' }));
    return;
  }

  if (req.url === '/graphql') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const query = payload.query;
        const variables = payload.variables;
        const operationName = payload.operationName;

        const result = await graphql({
          schema,
          source: query,
          rootValue: root,
          variableValues: variables,
          operationName,
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ errors: [{ message: err.message }] }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`iPhone Shop GraphQL Server running on http://localhost:${PORT}/graphql`);
});
