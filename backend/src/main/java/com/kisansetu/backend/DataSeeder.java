package com.kisansetu.backend;

import com.kisansetu.backend.entity.Product;
import com.kisansetu.backend.entity.Role;
import com.kisansetu.backend.entity.User;
import com.kisansetu.backend.repository.ProductRepository;
import com.kisansetu.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        try {
            seedData();
        } catch (Exception e) {
            System.err.println("[DataSeeder] WARNING: Could not seed data – MongoDB may be unreachable.");
            System.err.println("[DataSeeder] Cause: " + e.getMessage());
            System.err.println("[DataSeeder] App will continue without seeded data. Check MongoDB Atlas network access settings.");
        }
    }

    private void seedData() {
        User farmer;
        if (userRepository.count() == 0) {
            // Create an Admin
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@kisansetu.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);

            // Create a Farmer
            farmer = new User();
            farmer.setName("Ramesh Patil");
            farmer.setEmail("ramesh@example.com");
            farmer.setPassword(passwordEncoder.encode("password"));
            farmer.setRole(Role.FARMER);
            userRepository.save(farmer);

            // Create a Customer
            User customer = new User();
            customer.setName("Suresh Kumar");
            customer.setEmail("suresh@example.com");
            customer.setPassword(passwordEncoder.encode("password"));
            customer.setRole(Role.CUSTOMER);
            userRepository.save(customer);

            System.out.println("Users seeded successfully!");
        } else {
            farmer = userRepository.findByEmail("ramesh@example.com").orElse(null);
        }

        if (productRepository.count() == 0 && farmer != null) {
            final String fId = farmer.getId();
            final String fName = farmer.getName();

            Product p1 = new Product();
            p1.setName("Fresh Organic Tomatoes");
            p1.setDescription("Locally grown, pesticide-free red tomatoes straight from the farm.");
            p1.setPrice(40.0); p1.setQuantity(100); p1.setFarmerId(fId); p1.setFarmerName(fName);
            p1.setImageUrl("https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&q=80");
            p1.setCategory("Vegetables"); p1.setLocation("Nashik, Maharashtra"); p1.setUnit("kg");

            Product p2 = new Product();
            p2.setName("Premium Wheat (Gehu)");
            p2.setDescription("High quality wheat grains for daily use, harvested this season.");
            p2.setPrice(30.0); p2.setQuantity(500); p2.setFarmerId(fId); p2.setFarmerName(fName);
            p2.setImageUrl("https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80");
            p2.setCategory("Grains"); p2.setLocation("Pune, Maharashtra"); p2.setUnit("tons");

            Product p3 = new Product();
            p3.setName("Farm Fresh Potatoes");
            p3.setDescription("Large and healthy potatoes, perfect for cooking.");
            p3.setPrice(25.0); p3.setQuantity(200); p3.setFarmerId(fId); p3.setFarmerName(fName);
            p3.setImageUrl("https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80");
            p3.setCategory("Vegetables"); p3.setLocation("Nashik, Maharashtra"); p3.setUnit("kg");

            Product p4 = new Product();
            p4.setName("Organic Onions");
            p4.setDescription("Crisp and flavorful onions grown organically.");
            p4.setPrice(35.0); p4.setQuantity(300); p4.setFarmerId(fId); p4.setFarmerName(fName);
            p4.setImageUrl("https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&q=80");
            p4.setCategory("Vegetables"); p4.setLocation("Lasalgaon, Maharashtra"); p4.setUnit("kg");

            Product p5 = new Product();
            p5.setName("Alphonso Mangoes");
            p5.setDescription("Sweet, juicy, and aromatic Alphonso mangoes.");
            p5.setPrice(800.0); p5.setQuantity(50); p5.setFarmerId(fId); p5.setFarmerName(fName);
            p5.setImageUrl("https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&q=80");
            p5.setCategory("Fruits"); p5.setLocation("Ratnagiri, Maharashtra"); p5.setUnit("dozen");

            Product p6 = new Product();
            p6.setName("Basmati Rice");
            p6.setDescription("Long-grain, aromatic Basmati rice perfect for biryani.");
            p6.setPrice(120.0); p6.setQuantity(400); p6.setFarmerId(fId); p6.setFarmerName(fName);
            p6.setImageUrl("https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80");
            p6.setCategory("Grains"); p6.setLocation("Karnal, Haryana"); p6.setUnit("kg");

            Product p7 = new Product();
            p7.setName("Fresh Carrots");
            p7.setDescription("Crunchy, sweet orange carrots rich in Vitamin A.");
            p7.setPrice(50.0); p7.setQuantity(150); p7.setFarmerId(fId); p7.setFarmerName(fName);
            p7.setImageUrl("https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&q=80");
            p7.setCategory("Vegetables"); p7.setLocation("Ooty, Tamil Nadu"); p7.setUnit("kg");

            Product p8 = new Product();
            p8.setName("Pure Forest Honey");
            p8.setDescription("100% natural and pure raw honey collected from forest bees.");
            p8.setPrice(450.0); p8.setQuantity(80); p8.setFarmerId(fId); p8.setFarmerName(fName);
            p8.setImageUrl("https://images.unsplash.com/photo-1587049352847-81a56d773c1c?w=500&q=80");
            p8.setCategory("Other"); p8.setLocation("Coorg, Karnataka"); p8.setUnit("liters");

            Product p9 = new Product();
            p9.setName("Green Apples");
            p9.setDescription("Crisp and slightly tart green apples, fresh from the orchard.");
            p9.setPrice(180.0); p9.setQuantity(100); p9.setFarmerId(fId); p9.setFarmerName(fName);
            p9.setImageUrl("https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500&q=80");
            p9.setCategory("Fruits"); p9.setLocation("Shimla, Himachal Pradesh"); p9.setUnit("kg");

            Product p10 = new Product();
            p10.setName("Fresh Spinach (Palak)");
            p10.setDescription("Nutrient-rich, dark green spinach leaves.");
            p10.setPrice(20.0); p10.setQuantity(50); p10.setFarmerId(fId); p10.setFarmerName(fName);
            p10.setImageUrl("https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80");
            p10.setCategory("Vegetables"); p10.setLocation("Pune, Maharashtra"); p10.setUnit("kg");

            Product p11 = new Product();
            p11.setName("Toor Dal");
            p11.setDescription("Premium quality unpolished Toor Dal.");
            p11.setPrice(140.0); p11.setQuantity(250); p11.setFarmerId(fId); p11.setFarmerName(fName);
            p11.setImageUrl("https://images.unsplash.com/photo-1585935398934-8c081e289e47?w=500&q=80");
            p11.setCategory("Grains"); p11.setLocation("Latur, Maharashtra"); p11.setUnit("kg");

            Product p12 = new Product();
            p12.setName("Fresh Cow Milk");
            p12.setDescription("Farm-fresh, unadulterated cow milk delivered daily.");
            p12.setPrice(60.0); p12.setQuantity(100); p12.setFarmerId(fId); p12.setFarmerName(fName);
            p12.setImageUrl("https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80");
            p12.setCategory("Dairy"); p12.setLocation("Anand, Gujarat"); p12.setUnit("liters");

            Product p13 = new Product();
            p13.setName("Red Bell Peppers");
            p13.setDescription("Bright red, sweet and crunchy bell peppers.");
            p13.setPrice(120.0); p13.setQuantity(80); p13.setFarmerId(fId); p13.setFarmerName(fName);
            p13.setImageUrl("https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=500&q=80");
            p13.setCategory("Vegetables"); p13.setLocation("Bangalore, Karnataka"); p13.setUnit("kg");

            Product p14 = new Product();
            p14.setName("Jaggery (Gud)");
            p14.setDescription("Organic, chemical-free jaggery blocks.");
            p14.setPrice(80.0); p14.setQuantity(150); p14.setFarmerId(fId); p14.setFarmerName(fName);
            p14.setImageUrl("https://images.unsplash.com/photo-1621257406859-96860d5b78f8?w=500&q=80");
            p14.setCategory("Other"); p14.setLocation("Kolhapur, Maharashtra"); p14.setUnit("kg");

            Product p15 = new Product();
            p15.setName("Strawberries");
            p15.setDescription("Freshly picked, sweet and red strawberries.");
            p15.setPrice(250.0); p15.setQuantity(40); p15.setFarmerId(fId); p15.setFarmerName(fName);
            p15.setImageUrl("https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&q=80");
            p15.setCategory("Fruits"); p15.setLocation("Mahabaleshwar, Maharashtra"); p15.setUnit("packets");

            productRepository.saveAll(Arrays.asList(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15));

            System.out.println("Mock data seeded successfully!");
        }
    }
}
