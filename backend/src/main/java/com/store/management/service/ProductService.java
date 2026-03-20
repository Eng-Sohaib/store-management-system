package com.store.management.service;

import com.store.management.model.Product;
import com.store.management.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Retrieve all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Retrieve a single product by its ID
    public Optional<Product> getProductById(Integer id) {
        return productRepository.findById(id);
    }

    // Add a new product or update an existing one
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    // Delete a product
    public void deleteProduct(Integer id) {
        productRepository.deleteById(id);
    }
}