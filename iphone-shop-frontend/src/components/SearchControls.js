import React from 'react';

const SearchControls = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categories,
  onAddProduct,
  onToggleFavorites,
  favoritesCount,
}) => {

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('');
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <input // Search Input
          type="text"
          placeholder="Search products..."
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} //update state
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select // Category Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={sortBy} // Sort By Select
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sort By</option>
          <option value="name">Name</option>
          <option value="price_asc">Price (Low to High)</option>
          <option value="price_desc">Price (High to Low)</option>
          <option value="stock">Stock</option>
        </select>

        <button // Reset Button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition"
        >
          Reset
        </button>

        <button // Add Product Button
          onClick={onAddProduct}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
         Add Product
        </button>
      </div>

      <button // Favorites Button
        onClick={onToggleFavorites}
        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
      >
        Favorites ({favoritesCount})
      </button>
    </div>
  );
};

export default SearchControls;