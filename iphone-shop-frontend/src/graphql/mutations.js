import { gql } from '@apollo/client';

export const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $name: String!
    $price: Float!
    $category: String!
    $description: String
    $model: String
    $color: String
    $storage: String
    $stock: Int
  ) {
    createProduct(
      input: {
        name: $name
        price: $price
        category: $category
        description: $description
        model: $model
        color: $color
        storage: $storage
        stock: $stock
      }
    ) {
      product {
        id
        name
      }
      errors
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct(
    $id: ID!
    $name: String
    $price: Float
    $category: String
    $description: String
    $model: String
    $color: String
    $storage: String
    $stock: Int
  ) {
    updateProduct(
      input: {
        id: $id
        name: $name
        price: $price
        category: $category
        description: $description
        model: $model
        color: $color
        storage: $storage
        stock: $stock
      }
    ) {
      product {
        id
        name
      }
      errors
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(input: { id: $id }) {
      success
      errors
    }
  }
`;

export const ADD_FAVORITE = gql`
  mutation AddFavorite($productId: ID!, $userId: String!) {
    addFavorite(input: { productId: $productId, userId: $userId }) {
      favorite {
        id
      }
      errors
    }
  }
`;

export const REMOVE_FAVORITE = gql`
  mutation RemoveFavorite($productId: ID!, $userId: String!) {
    removeFavorite(input: { productId: $productId, userId: $userId }) {
      success
      errors
    }
  }
`;