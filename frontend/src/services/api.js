// src/services/api.js

// This must match the port your Spring Boot server is running on
const API_BASE_URL = 'http://localhost:8081/api';

// --- PRODUCT ENDPOINTS ---

export const fetchProducts = async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
};

export const createProduct = async (productData) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
};

export const deleteProduct = async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return true; // Just returning true on success since DELETE doesn't return a body
};


// --- TRANSACTION ENDPOINTS ---

export const processCheckout = async (productId, quantity) => {
    // Note: We use query parameters here to match how we built the Spring Boot controller
    const response = await fetch(`${API_BASE_URL}/transactions/checkout?productId=${productId}&quantity=${quantity}`, {
        method: 'POST',
    });
    
    if (!response.ok) {
        // This catches our custom backend errors (like "Insufficient stock!")
        const errorText = await response.text();
        throw new Error(errorText || 'Checkout failed');
    }
    return response.json();
};