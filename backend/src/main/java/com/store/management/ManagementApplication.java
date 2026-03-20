package com.store.management;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import javax.sql.DataSource;
import java.sql.Connection;

@SpringBootApplication
public class ManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(ManagementApplication.class, args);
    }

    // This block tests the database connection on startup
    @Bean
    public CommandLineRunner testConnection(DataSource dataSource) {
        return args -> {
            try (Connection conn = dataSource.getConnection()) {
                System.out.println("\n==============================================");
                System.out.println(" SUCCESS: Connected to MySQL Database!");
                System.out.println("Database Catalog: " + conn.getCatalog());
                System.out.println("==============================================\n");
            } catch (Exception e) {
                System.err.println("\n FAILED: Could not connect to the database.");
                e.printStackTrace();
            }
        };
    }
}