import { useQuery, useMutation } from '@apollo/client';
import { GET_FAVORITES } from '../graphql/queries';
import { ADD_FAVORITE, REMOVE_FAVORITE } from '../graphql/mutations';

export const useFavorites = (userId) => {
  const { data, refetch } = useQuery(GET_FAVORITES, {
    variables: { userId },
  });

  const [addFavoriteMutation] = useMutation(ADD_FAVORITE);
  const [removeFavoriteMutation] = useMutation(REMOVE_FAVORITE);

  const favorites = data?.favorites || [];
  const favoriteIds = favorites.map((f) => f.product.id);

  const addFavorite = async (productId) => {
    try {
      await addFavoriteMutation({ variables: { productId, userId } });
      refetch();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const removeFavorite = async (productId) => {
    try {
      await removeFavoriteMutation({ variables: { productId, userId } });
      refetch();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const toggleFavorite = async (productId) => {
    if (favoriteIds.includes(productId)) {
      return await removeFavorite(productId);
    } else {
      return await addFavorite(productId);
    }
  };

  const isFavorite = (productId) => favoriteIds.includes(productId);

  return {
    favorites,
    favoriteIds,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
};