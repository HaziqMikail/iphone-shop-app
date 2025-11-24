import { gql } from '@apollo/client';

// Query to get products with optional filters
export const GET_PRODUCTS = gql` 
  query GetProducts($search: String, $category: String, $sortBy: String) {
    products(search: $search, category: $category, sortBy: $sortBy) {
      id
      name
      description
      price
      model
      color
      storage
      category
      stock
    }
    categories
  }
`;

// Query to get favorite products for a user
export const GET_FAVORITES = gql`
  query GetFavorites($userId: String!) {
    favorites(userId: $userId) {
      id
      product {
        id
        name
        price
        category
        model
        color
        storage
      }
    }
  }
`;