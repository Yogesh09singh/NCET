package com.kisansetu.backend.controller;

import com.kisansetu.backend.dto.MessageResponse;
import com.kisansetu.backend.dto.OrderItemRequest;
import com.kisansetu.backend.dto.OrderRequest;
import com.kisansetu.backend.entity.Order;
import com.kisansetu.backend.entity.OrderItem;
import com.kisansetu.backend.entity.Product;
import com.kisansetu.backend.entity.User;
import com.kisansetu.backend.repository.OrderRepository;
import com.kisansetu.backend.repository.ProductRepository;
import com.kisansetu.backend.repository.UserRepository;
import com.kisansetu.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public List<Order> getCustomerOrders() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        return orderRepository.findByCustomerId(userDetails.getId());
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();

        User customer = userRepository.findById(userDetails.getId()).orElse(null);
        if (customer == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Customer not found!"));
        }

        Order order = new Order();
        order.setCustomerId(customer.getId());
        order.setCustomerName(customer.getName());
        order.setCustomerEmail(customer.getEmail());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");

        double totalAmount = 0.0;
        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderItemRequest itemRequest : orderRequest.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId()).orElse(null);
            if (product == null) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Product not found with ID " + itemRequest.getProductId()));
            }

            if (product.getQuantity() < itemRequest.getQuantity()) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Insufficient stock for " + product.getName()));
            }

            // Deduct stock
            product.setQuantity(product.getQuantity() - itemRequest.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setProductId(product.getId());
            orderItem.setProductName(product.getName());
            orderItem.setProductUnit(product.getUnit());
            orderItem.setFarmerId(product.getFarmerId());
            orderItem.setFarmerName(product.getFarmerName());
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPrice(product.getPrice());

            orderItems.add(orderItem);
            totalAmount += product.getPrice() * itemRequest.getQuantity();
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);

        orderRepository.save(order);

        return ResponseEntity.ok(new MessageResponse("Order placed successfully!"));
    }

    @GetMapping("/farmer")
    @PreAuthorize("hasRole('FARMER')")
    public List<Order> getFarmerOrders() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        String farmerId = userDetails.getId();

        // Find all orders that contain at least one product belonging to the farmer
        List<Order> allOrders = orderRepository.findAll();
        return allOrders.stream()
                .filter(order -> order.getOrderItems().stream()
                        .anyMatch(item -> farmerId.equals(item.getFarmerId())))
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String id, @RequestBody java.util.Map<String, String> payload) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();

        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Order not found!"));
        }

        // Verify the farmer has products in this order
        boolean hasFarmerProduct = order.getOrderItems().stream()
                .anyMatch(item -> userDetails.getId().equals(item.getFarmerId()));

        if (!hasFarmerProduct) {
            return ResponseEntity.status(403).body(new MessageResponse("Error: Unauthorized to update this order."));
        }

        String newStatus = payload.get("status");
        if (newStatus != null) {
            order.setStatus(newStatus.toUpperCase());
            orderRepository.save(order);
            return ResponseEntity.ok(new MessageResponse("Order status updated successfully!"));
        }

        return ResponseEntity.badRequest().body(new MessageResponse("Error: Status is required."));
    }
}
