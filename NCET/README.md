# 🌾 Kisan Setu – Local Farmer Market

**Kisan Setu** (Farmer's Bridge) is a modern AgriTech platform designed to connect farmers directly with consumers. By eliminating intermediaries and the traditional mandi system, it ensures that farmers get better profit margins while consumers get fresher, organic produce at lower prices.

![Kisan Setu Overview](https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=1200&q=80)

---

## 🌟 Key Features

### 👨‍🌾 For Farmers
- **Product Management:** Add, edit, and manage crop listings with details like price, quantity, unit, and location.
- **Order Tracking:** View incoming orders, see precisely what was ordered, and update order statuses (`PENDING` → `SHIPPED` → `DELIVERED`).
- **Analytics Dashboard:** Visualize inventory value and product breakdown across categories (Vegetables, Fruits, Grains, Dairy) with progress bars and dynamic metrics.

### 🛒 For Customers
- **Marketplace Discovery:** Browse a modern, premium UI with category filtering and real-time search functionality.
- **Shopping Cart:** Slide-out multi-item cart with quantity steppers and real-time total calculations.
- **Order History:** Visual timeline to track the status of current and past orders.

### 🔑 For Admins
- **Platform Analytics:** Real-time metrics tracking total users, active products, total platform orders, and gross revenue.
- **User Management:** View the entire user base and securely remove accounts if necessary.
- **Global Order Overview:** Track the status of every order placed across the platform.

---

## 🛠️ Technology Stack

**Frontend**
- **React 18 & Vite** – Lightning-fast frontend build tool and rendering.
- **Vanilla CSS** – A bespoke, utility-first CSS design system featuring glassmorphism, dynamic gradients, and modern micro-animations.
- **React Router** – Secure, role-based client-side routing.
- **Axios** – Interceptor-based API client for automatic JWT injection.

**Backend**
- **Java 17 & Spring Boot 3.2** – Robust, enterprise-grade REST API.
- **Spring Security** – Stateless JWT (JSON Web Token) based authentication.
- **Spring Data MongoDB** – NoSQL data layer using denormalized documents (e.g., embedding OrderItems directly inside Orders for zero-join reads).

**Database**
- **MongoDB Atlas** – Fully managed cloud NoSQL database.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Java 17+
- Maven
- MongoDB Atlas Account (with your IP whitelisted)

### 1. Database Setup
The backend is pre-configured to connect to MongoDB Atlas. Ensure your IP address is whitelisted in your MongoDB Atlas Network Access settings. 

> **Note:** The `DataSeeder` automatically injects 3 demo users and 15 mock products on the very first startup!

### 2. Run the Backend
```bash
cd backend
mvn clean spring-boot:run
```
*The API will start on `http://localhost:8080`*

### 3. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
*The UI will start on `http://localhost:5173`*

---

## 🔐 Demo Credentials

Use these pre-seeded accounts to explore the different roles on the platform:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@kisansetu.com` | `admin123` |
| **Farmer** | `ramesh@example.com` | `password` |
| **Customer** | `suresh@example.com` | `password` |

*(You can also use the auto-fill buttons directly on the Login page)*

---

## 🛡️ Architecture & Security
- **Stateless Authentication:** All API endpoints (except `/api/auth/**` and public `GET /api/products`) are protected by a stateless JWT filter.
- **Role-Based Access Control (RBAC):** Users are assigned specific roles (`ROLE_CUSTOMER`, `ROLE_FARMER`, `ROLE_ADMIN`). Both the frontend router and backend controllers strictly enforce these boundaries.
- **Denormalized Data Model:** In MongoDB, the `OrderItem` is not a separate collection. It is an embedded sub-document inside the `Order` collection, eliminating complex relational joins and dramatically speeding up order history queries.
