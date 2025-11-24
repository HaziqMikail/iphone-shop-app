import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUCTS } from '../graphql/queries';
import { CREATE_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT } from '../graphql/mutations';

export const useProducts = (filters = {}) => { 
  const { loading, error, data, refetch } = useQuery(GET_PRODUCTS, { // Query hook to fetch products and categories
    variables: filters,
  });

  const [createProduct] = useMutation(CREATE_PRODUCT); // Mutation hook for creating a product
  const [updateProduct] = useMutation(UPDATE_PRODUCT); // Mutation hook for updating a product
  const [deleteProduct] = useMutation(DELETE_PRODUCT); // Mutation hook for deleting a product

  const handleCreate = async (productData) => { // Function to handle product creation
    try {
      const result = await createProduct({// Call createProduct mutation
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

  const handleUpdate = async (id, productData) => { // Function to handle product update
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

  const handleDelete = async (id) => { // Function to handle product deletion
    try {
      const result = await deleteProduct({ variables: { id } });
      refetch();
      return { success: true, data: result.data.deleteProduct };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const resetFilters = () => { // Function to reset filters
    refetch({ search: "", category: "", sort_by: "" });
  };

  return {  // Return products, categories, loading state, error state, and mutation handlers
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