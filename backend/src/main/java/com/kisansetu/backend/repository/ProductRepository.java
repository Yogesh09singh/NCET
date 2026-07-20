package com.kisansetu.backend.repository;

import com.kisansetu.backend.entity.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByFarmerId(String farmerId);
}
