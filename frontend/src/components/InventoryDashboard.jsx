import React, { useState, useEffect } from 'react';
import { fetchProducts, createProduct, deleteProduct } from '../services/api';

const InventoryDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the "Add Product" form
  const [newProduct, setNewProduct] = useState({ name: '', quantity: '', price: '' });

  // Load products when the component mounts
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load products from the database.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    try {
      await createProduct({
        name: newProduct.name,
        quantity: parseInt(newProduct.quantity),
        price: parseFloat(newProduct.price)
      });
      setNewProduct({ name: '', quantity: '', price: '' }); // Reset form
      loadProducts(); // Refresh the table
    } catch (err) {
      alert('Failed to add product.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        loadProducts(); // Refresh the table
      } catch (err) {
        alert('Cannot delete product. It might be linked to existing transactions.');
      }
    }
  };

  if (loading) return <div className="text-center py-10 text-slate-500">Loading inventory...</div>;

  return (
    <div className="space-y-8">
      {/* Error Message Display */}
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>}

      {/* Add Product Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Add New Product</h2>
        <form onSubmit={handleAddProduct} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-600 mb-1">Product Name</label>
            <input 
              type="text" 
              required
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-slate-600 mb-1">Quantity</label>
            <input 
              type="number" 
              required min="0"
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newProduct.quantity}
              onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
            />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-slate-600 mb-1">Price ($)</label>
            <input 
              type="number" 
              required min="0" step="0.01"
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newProduct.price}
              onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
            />
          </div>
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            Add Item
          </button>
        </form>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {products.map((product) => (
              <tr key={product.productId} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">#{product.productId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.quantity} in stock
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleDelete(product.productId)}
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No products found. Add one above!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryDashboard;