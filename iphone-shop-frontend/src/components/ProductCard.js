import React from 'react';

const ProductCard = ({
  product,
  isFavorite,
  onToggleFavorite,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg">{product.name}</h3>
          <p className="text-sm text-gray-600">{product.category}</p>
        </div>
        <button
          onClick={() => onToggleFavorite(product.id)}
          className="text-2xl hover:scale-110 transition"
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <p><strong>Model:</strong> {product.model}</p>
        <p><strong>Color:</strong> {product.color}</p>
        <p><strong>Storage:</strong> {product.storage}</p>
        <p><strong>Stock:</strong> {product.stock}</p>
      </div>

      <p className="text-2xl font-bold text-blue-600 mb-4">RM{product.price}</p>

      <div className="flex gap-2">
        <button
          onClick={() => onViewDetails(product)}
          className="flex-1 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition"
        >
          View Details
        </button>
        <button
          onClick={() => onEdit(product)}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;