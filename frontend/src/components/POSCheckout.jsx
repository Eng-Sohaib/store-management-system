import React, { useState, useEffect } from 'react';
import { fetchProducts, processCheckout } from '../services/api';

const POSCheckout = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState(null);

  // Load products so we can populate the dropdown menu
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data.filter(p => p.quantity > 0)); // Only show in-stock items
    } catch (err) {
      console.error("Failed to load products for POS");
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setReceipt(null);

    if (!selectedProductId) {
      setError("Please select a product.");
      setLoading(false);
      return;
    }

    try {
      const data = await processCheckout(selectedProductId, quantity);
      setReceipt(data);
      setQuantity(1);
      setSelectedProductId('');
      loadProducts(); // Refresh the dropdown to get updated stock
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate dynamic total for the UI before submitting
  const selectedProduct = products.find(p => p.productId === parseInt(selectedProductId));
  const estimatedTotal = selectedProduct ? (selectedProduct.price * quantity).toFixed(2) : "0.00";

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-full">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        🛒 Point of Sale
      </h2>

      {/* Success Receipt */}
      {receipt && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-green-800 font-semibold mb-1">Transaction Successful!</h3>
          <p className="text-sm text-green-700">Receipt ID: #{receipt.transactionId}</p>
          <p className="text-sm text-green-700">Total Charged: <span className="font-bold">${receipt.totalPrice.toFixed(2)}</span></p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleCheckout} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Select Product</label>
          <select 
            className="w-full border border-slate-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            required
          >
            <option value="" disabled>-- Choose an item --</option>
            {products.map(p => (
              <option key={p.productId} value={p.productId}>
                {p.name} (${p.price.toFixed(2)} | {p.quantity} in stock)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Quantity</label>
          <input 
            type="number" 
            min="1" 
            max={selectedProduct ? selectedProduct.quantity : 99}
            className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            required
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          <span className="text-slate-500 font-medium">Total:</span>
          <span className="text-2xl font-bold text-slate-900">${estimatedTotal}</span>
        </div>

        <button 
          type="submit"
          disabled={loading || !selectedProductId}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-colors mt-4"
        >
          {loading ? 'Processing...' : 'Complete Sale'}
        </button>
      </form>
    </div>
  );
};

export default POSCheckout;