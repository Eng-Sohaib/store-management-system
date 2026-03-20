package com.store.management.repository;

import com.store.management.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    // By extending JpaRepository, Spring Boot automatically gives us methods like:
    // save(), findById(), findAll(), and deleteById()
}