import React from 'react';

const FavoritesList = ({ favorites, onRemove }) => {
  if (favorites.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">My Favorites</h2>
        <p className="text-gray-500">No favorites yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">My Favorites</h2>
      <div className="space-y-2">
        {favorites.map((fav) => (
          <div
            key={fav.id}
            className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition"
          >
            <div>
              <span className="font-medium">{fav.product.name}</span>
              <span className="text-gray-600 ml-2">${fav.product.price}</span>
              <span className="text-sm text-gray-500 ml-2">
                {fav.product.model} • {fav.product.color}
              </span>
            </div>
            <button
              onClick={() => onRemove(fav.product.id)}
              className="text-red-600 hover:text-red-800 transition"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;