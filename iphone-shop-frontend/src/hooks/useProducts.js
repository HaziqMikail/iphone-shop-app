import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUCTS } from '../graphql/queries';
import { CREATE_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT } from '../graphql/mutations';

export const useProducts = (filters = {}) => {
  const { loading, error, data, refetch } = useQuery(GET_PRODUCTS, {
    variables: filters,
  });

  const [createProduct] = useMutation(CREATE_PRODUCT);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);

  const handleCreate = async (productData) => {
    try {
      const result = await createProduct({
        variables: {
          ...productData,
          price: parseFloat(productData.price),
          stock: parseInt(productData.stock),
        },
      });
      refetch();
      return { success: true, data: result.data.createProduct };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const handleUpdate = async (id, productData) => {
    try {
      const result = await updateProduct({
        variables: {
          id,
          ...productData,
          price: productData.price ? parseFloat(productData.price) : undefined,
          stock: productData.stock ? parseInt(productData.stock) : undefined,
        },
      });
      refetch();
      return { success: true, data: result.data.updateProduct };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await deleteProduct({ variables: { id } });
      refetch();
      return { success: true, data: result.data.deleteProduct };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    products: data?.products || [],
    categories: data?.categories || [],
    loading,
    error,
    refetch,
    createProduct: handleCreate,
    updateProduct: handleUpdate,
    deleteProduct: handleDelete,
  };
};