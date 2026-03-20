import React from 'react';
import InventoryDashboard from './components/InventoryDashboard';
import POSCheckout from './components/POSCheckout';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <header className="bg-white shadow-sm border-b border-slate-200 mb-8 w-full">
        <div className="max-w-[1400px] mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Store Management System
          </h1>
        </div>
      </header>
      
      {/* Dashboard Grid Layout */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* POS takes up 1 column on the left */}
          <div className="lg:col-span-1">
            <POSCheckout />
          </div>

          {/* Inventory takes up 2 columns on the right */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">📦 Inventory Management</h2>
                <span className="text-sm text-slate-500">Refresh page to sync table after a sale</span>
              </div>
              <InventoryDashboard />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;