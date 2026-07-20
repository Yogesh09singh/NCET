package com.kisansetu.backend.controller;

import com.kisansetu.backend.dto.MessageResponse;
import com.kisansetu.backend.dto.ProductRequest;
import com.kisansetu.backend.entity.Product;
import com.kisansetu.backend.entity.User;
import com.kisansetu.backend.repository.ProductRepository;
import com.kisansetu.backend.repository.UserRepository;
import com.kisansetu.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    ProductRepository productRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/farmer")
    @PreAuthorize("hasRole('FARMER')")
    public List<Product> getFarmerProducts() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        return productRepository.findByFarmerId(userDetails.getId());
    }

    @GetMapping("/analytics")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<?> getFarmerAnalytics() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        List<Product> products = productRepository.findByFarmerId(userDetails.getId());

        // Category breakdown
        Map<String, Long> categoryCount = new HashMap<>();
        Map<String, Double> categoryRevenue = new HashMap<>();
        double totalInventoryValue = 0;

        for (Product p : products) {
            String cat = p.getCategory() != null ? p.getCategory() : "Other";
            categoryCount.merge(cat, 1L, Long::sum);
            double val = (p.getPrice() != null ? p.getPrice() : 0) * (p.getQuantity() != null ? p.getQuantity() : 0);
            categoryRevenue.merge(cat, val, Double::sum);
            totalInventoryValue += val;
        }

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalProducts", products.size());
        analytics.put("totalInventoryValue", totalInventoryValue);
        analytics.put("categoryCount", categoryCount);
        analytics.put("categoryRevenue", categoryRevenue);

        return ResponseEntity.ok(analytics);
    }

    @PostMapping
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<?> addProduct(@RequestBody ProductRequest productRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();

        User farmer = userRepository.findById(userDetails.getId()).orElse(null);
        if (farmer == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Farmer not found!"));
        }

        Product product = new Product();
        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setQuantity(productRequest.getQuantity());
        product.setImageUrl(productRequest.getImageUrl());
        product.setCategory(productRequest.getCategory());
        product.setLocation(productRequest.getLocation());
        product.setUnit(productRequest.getUnit());
        if (productRequest.getStatus() != null) {
            product.setStatus(productRequest.getStatus());
        }
        product.setFarmerId(farmer.getId());
        product.setFarmerName(farmer.getName());

        productRepository.save(product);

        return ResponseEntity.ok(new MessageResponse("Product added successfully!"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<?> updateProduct(@PathVariable String id, @RequestBody ProductRequest productRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();

        Product product = productRepository.findById(id).orElse(null);
        if (product == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Product not found!"));
        }

        if (!product.getFarmerId().equals(userDetails.getId())) {
            return ResponseEntity.status(403).body(new MessageResponse("Error: Unauthorized to edit this product!"));
        }

        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setQuantity(productRequest.getQuantity());
        product.setImageUrl(productRequest.getImageUrl());
        product.setCategory(productRequest.getCategory());
        product.setLocation(productRequest.getLocation());
        product.setUnit(productRequest.getUnit());
        if (productRequest.getStatus() != null) {
            product.setStatus(productRequest.getStatus());
        }

        productRepository.save(product);
        return ResponseEntity.ok(new MessageResponse("Product updated successfully!"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<?> deleteProduct(@PathVariable String id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();

        Product product = productRepository.findById(id).orElse(null);
        if (product == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Product not found!"));
        }

        if (!product.getFarmerId().equals(userDetails.getId())) {
            return ResponseEntity.status(403).body(new MessageResponse("Error: Unauthorized to delete this product!"));
        }

        productRepository.delete(product);
        return ResponseEntity.ok(new MessageResponse("Product deleted successfully!"));
    }
}
