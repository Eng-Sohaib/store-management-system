package com.store.management.controller;

import com.store.management.model.Transaction;
import com.store.management.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    // POST: Process a new sale
    @PostMapping("/checkout")
    public ResponseEntity<?> processCheckout(@RequestParam Integer productId, @RequestParam Integer quantity) {
        try {
            Transaction receipt = transactionService.processTransaction(productId, quantity);
            return ResponseEntity.ok(receipt);
        } catch (RuntimeException e) {
            // If there isn't enough stock or the product doesn't exist, return a 400 Bad Request with the error message
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}