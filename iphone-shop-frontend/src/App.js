import './App.css';
import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apollo/client';
import { useProducts } from './hooks/useProducts';
import { useFavorites } from './hooks/useFavorites';

import Header from './components/Header';
import SearchControls from './components/SearchControls';
import ProductGrid from './components/ProductGrid';
import FavoritesList from './components/FavoritesList';
import ProductDetail from './components/ProductDetail';
import ProductForm from './components/ProductForm';

function IPhoneShopApp() {
  const userId = 'user123';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  const {
    products,
    categories,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts({
    search: searchTerm,
    category: selectedCategory,
    sortBy,
  });

  const { favorites, favoriteIds, toggleFavorite, removeFavorite } =
    useFavorites(userId);

  const handleAddProduct = () => {
    setShowAddForm(true);
    setEditingProduct(null);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowAddForm(false);
  };

  const handleSaveProduct = async (formData) => {
    if (editingProduct) {
      const result = await updateProduct(editingProduct.id, formData);
      if (result.success) {
        setEditingProduct(null);
      } else {
        alert('Error updating product: ' + result.error);
      }
    } else {
      const result = await createProduct(formData);
      if (result.success) {
        setShowAddForm(false);
      } else {
        alert('Error creating product: ' + result.error);
      }
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    const result = await deleteProduct(id);
    if (result.success) {
      setSelectedProduct(null);
    } else {
      alert('Error deleting product: ' + result.error);
    }
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingProduct(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-red-600">Error: {error.message}</p>
          <p className="text-gray-600 mt-2">
            Make sure your Rails backend is running on port 3001
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <SearchControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
          onAddProduct={handleAddProduct}
          onToggleFavorites={() => setShowFavorites(!showFavorites)}
          favoritesCount={favoriteIds.length}
        />

        {showFavorites && (
          <FavoritesList favorites={favorites} onRemove={removeFavorite} />
        )}

        <ProductGrid
          products={products}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
          onViewDetails={setSelectedProduct}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />

        {selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}

        {(showAddForm || editingProduct) && (
          <ProductForm
            product={editingProduct}
            onClose={handleCloseForm}
            onSave={handleSaveProduct}
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <IPhoneShopApp />
    </ApolloProvider>
  );
}