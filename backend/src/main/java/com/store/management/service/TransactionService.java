package com.store.management.service;

import com.store.management.model.Product;
import com.store.management.model.Transaction;
import com.store.management.repository.ProductRepository;
import com.store.management.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private ProductRepository productRepository;

    // The @Transactional annotation ensures that if anything fails, 
    // the entire database operation rolls back to prevent corrupted data.
    @Transactional
    public Transaction processTransaction(Integer productId, Integer quantitySold) {
        
        // 1. Find the product
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

        // 2. Check if there is enough inventory
        if (product.getQuantity() < quantitySold) {
            throw new RuntimeException("Insufficient stock! Only " + product.getQuantity() + " left.");
        }

        // 3. Calculate the total price
        BigDecimal quantityDecimal = new BigDecimal(quantitySold);
        BigDecimal totalPrice = product.getPrice().multiply(quantityDecimal);

        // 4. Deduct the stock from the product and update it
        product.setQuantity(product.getQuantity() - quantitySold);
        productRepository.save(product);

        // 5. Create and save the transaction record
        Transaction transaction = new Transaction();
        transaction.setProductId(product.getProductId());
        transaction.setQuantitySold(quantitySold);
        transaction.setTotalPrice(totalPrice);

        return transactionRepository.save(transaction);
    }
}