import React from "react";

const ProductDetail = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center p-4 z-50">
      <div className="bg-white text-gray-900 rounded-lg max-w-2xl w-full p-6 max-h-screen overflow-y-auto border border-gray-300 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <button
            onClick={onClose}
            className="text-3xl text-gray-500 hover:text-gray-700 transition"
          >
            &times;
          </button>
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <div>
            <strong className="text-gray-700">Description:</strong>
            <p className="text-gray-900">{product.description || "N/A"}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong className="text-gray-700">Model:</strong>
              <p className="text-gray-900">{product.model || "N/A"}</p>
            </div>
            <div>
              <strong className="text-gray-700">Color:</strong>
              <p className="text-gray-900">{product.color || "N/A"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4"> 
            <div>
              <strong className="text-gray-700">Storage:</strong>
              <p className="text-gray-900">{product.storage || "N/A"}</p>
            </div>
            <div>
              <strong className="text-gray-700">Category:</strong>
              <p className="text-gray-900">{product.category || "N/A"}</p>
            </div>
          </div>

          <div>
            <strong className="text-gray-700">Stock:</strong>
            <p className="text-gray-900">{product.stock} units</p>
          </div>

          <div className="pt-4 border-t">
            <p className="text-3xl font-bold text-blue-600">RM{product.price}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
