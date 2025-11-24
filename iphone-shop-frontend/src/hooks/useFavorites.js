import { useQuery, useMutation } from '@apollo/client';
import { GET_FAVORITES } from '../graphql/queries';
import { ADD_FAVORITE, REMOVE_FAVORITE } from '../graphql/mutations';

export const useFavorites = (userId) => {
  const { data, refetch } = useQuery(GET_FAVORITES, {
    variables: { userId },
  });

  const [addFavoriteMutation] = useMutation(ADD_FAVORITE);// Mutation hook for adding a favorite
  const [removeFavoriteMutation] = useMutation(REMOVE_FAVORITE);// Mutation hook for removing a favorite

  const favorites = data?.favorites || [];// List of favorite products
  const favoriteIds = favorites.map((f) => f.product.id);// List of favorite product IDs

  const addFavorite = async (productId) => {
    try {
      await addFavoriteMutation({ variables: { productId, userId } });// Call addFavorite mutation
      refetch();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const removeFavorite = async (productId) => { // Function to handle removing a favorite
    try {
      await removeFavoriteMutation({ variables: { productId, userId } });// Call removeFavorite mutation
      refetch();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const toggleFavorite = async (productId) => { // Function to handle toggling a favorite
    if (favoriteIds.includes(productId)) {
      return await removeFavorite(productId);
    } else {
      return await addFavorite(productId);
    }
  };

  const isFavorite = (productId) => favoriteIds.includes(productId); // Function to check if a product is a favorite

  return {
    favorites,
    favoriteIds,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
};