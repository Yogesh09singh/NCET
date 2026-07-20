# 🌾 Kisan Setu – Local Farmer Market

**Kisan Setu** (Farmer's Bridge) is a modern AgriTech platform designed to connect farmers directly with consumers. By eliminating intermediaries and the traditional mandi system, it ensures that farmers get better profit margins while consumers get fresher, organic produce at lower prices.

![Kisan Setu Overview](https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=1200&q=80)

---

## 📋 Table of Contents
- [Key Features](#-key-features)
- [Tech Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Demo Credentials](#-demo-credentials)
- [Architecture & Security](#-architecture--security)
- [Troubleshooting](#-troubleshooting)

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
- **Java 25 & Spring Boot 3.2** – Robust, enterprise-grade REST API.
- **Spring Security** – Stateless JWT (JSON Web Token) based authentication.
- **Spring Data MongoDB** – NoSQL data layer using denormalized documents.

**Database**
- **MongoDB Atlas** – Fully managed cloud NoSQL database with replica set.

---

## 📁 Project Structure

```
NCET/
├── backend/                          # Spring Boot REST API
│   ├── src/main/java/com/kisansetu/backend/
│   │   ├── controller/               # REST controllers (Auth, Product, Order, Admin)
│   │   ├── entity/                   # JPA entities (User, Product, Order, OrderItem, Role)
│   │   ├── dto/                      # Data transfer objects (Request/Response)
│   │   ├── repository/               # Spring Data MongoDB repositories
│   │   ├── security/                 # JWT filters, security configuration
│   │   ├── BackendApplication.java   # Main Spring Boot entry point
│   │   └── DataSeeder.java           # Auto-seeds demo users and products
│   ├── src/main/resources/
│   │   └── application.properties    # Server config, MongoDB URI, JWT secret
│   └── pom.xml                       # Maven dependencies
│
├── frontend/                         # React + Vite UI
│   ├── src/
│   │   ├── pages/                    # Role-based pages (Home, Login, Register, Dashboards)
│   │   ├── components/               # Reusable UI components (Navbar)
│   │   ├── services/                 # API client (Axios with JWT interceptor)
│   │   ├── App.jsx                   # Main React component
│   │   ├── main.jsx                  # React entry point
│   │   ├── App.css & index.css       # Global styling
│   │   └── assets/                   # Images and static files
│   ├── public/                       # Static assets
│   ├── index.html                    # HTML template
│   ├── package.json                  # npm dependencies
│   ├── vite.config.js                # Vite configuration
│   └── eslint.config.js              # Linting rules
│
├── .gitignore                        # Git ignore rules
├── README.md                         # This file
└── LICENSE                           # License information
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ ([Download](https://nodejs.org/))
- **Java 25+** (LTS or current) ([Download](https://www.oracle.com/java/technologies/downloads/))
- **Maven** 3.9+ ([Download](https://maven.apache.org/))
- **MongoDB Atlas Account** – Free tier available at [mongodb.com](https://www.mongodb.com/cloud/atlas)
- **Git** for version control

### 1. Clone the Repository
```bash
git clone https://github.com/Yogesh09singh/NCET.git
cd NCET
```

### 2. Database Setup
The backend is pre-configured to connect to MongoDB Atlas. Ensure:
- Your IP address is whitelisted in MongoDB Atlas **Network Access** settings
- The connection string in `backend/src/main/resources/application.properties` is valid

> **Note:** The `DataSeeder` class automatically injects 3 demo users and 15 mock products on the first startup!

### 3. Run the Backend
```bash
cd backend
mvn clean spring-boot:run
```
- **API URL:** `http://localhost:8080`
- **Swagger Docs:** `http://localhost:8080/swagger-ui.html` (if enabled)

### 4. Run the Frontend (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```
- **UI URL:** `http://localhost:5173`
- **Auto-reload:** Enabled on file changes

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/signin` | Login and get JWT token |

### Products (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | Fetch all products (no auth required) |
| `GET` | `/api/products/{id}` | Fetch product by ID |

### Products (Farmer)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/products` | Add a new product (Farmer only) |
| `PUT` | `/api/products/{id}` | Update product (Farmer only) |
| `DELETE` | `/api/products/{id}` | Delete product (Farmer only) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/orders` | Place a new order (Customer) |
| `GET` | `/api/orders` | Fetch user's orders |
| `GET` | `/api/orders/{id}` | Fetch order details |
| `PUT` | `/api/orders/{id}/status` | Update order status (Farmer/Admin) |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/users` | Fetch all users (Admin only) |
| `DELETE` | `/api/admin/users/{id}` | Delete user (Admin only) |
| `GET` | `/api/admin/stats` | Fetch platform statistics |

---

## 🔐 Demo Credentials

Use these pre-seeded accounts to explore the different roles:

| Role | Email | Password | Access |
|---|---|---|---|
| **Admin** | `admin@kisansetu.com` | `admin123` | Platform analytics, user management |
| **Farmer** | `ramesh@example.com` | `password` | Product management, order tracking |
| **Customer** | `suresh@example.com` | `password` | Browse products, place orders |

> **Auto-Fill:** The login page has quick-fill buttons for each demo account.

---

## 🛡️ Architecture & Security

### Authentication Flow
1. User submits credentials via `/api/auth/signin`
2. Server validates and returns a **JWT token** (24-hour expiration)
3. Frontend stores token in localStorage and injects it in every API request header
4. Backend `AuthTokenFilter` validates the token on protected endpoints

### Token Structure
```
Header: { "Authorization": "Bearer <JWT_TOKEN>" }
```

### Role-Based Access Control (RBAC)
- `ROLE_CUSTOMER` – Browse products, place orders
- `ROLE_FARMER` – Manage products, fulfill orders
- `ROLE_ADMIN` – Full platform access

Both frontend routing and backend controllers enforce these boundaries.

### Data Model
- **OrderItem** is embedded inside `Order` (not a separate collection)
- This denormalized approach eliminates complex joins and speeds up queries
- Users and Products are stored as separate collections with references

---

## 🐛 Troubleshooting

### Backend Won't Start – Port 8080 Already in Use
```bash
# On Windows (PowerShell)
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# On macOS/Linux
lsof -i :8080
kill -9 <PID>
```

### Frontend Won't Start – Port 5173 Already in Use
```bash
# Update vite.config.js:
export default {
  server: {
    port: 5174  # Change to different port
  }
}
```

### MongoDB Connection Fails
- ✅ Verify IP address is whitelisted in MongoDB Atlas Network Access
- ✅ Check connection string in `application.properties` is correct
- ✅ Ensure MongoDB cluster is active (not paused)

### Maven Command Not Found
```bash
# Install Maven or add to PATH
# Then verify:
mvn -version
```

### CORS Errors When Calling Backend from Frontend
- The backend is configured with CORS headers
- Ensure frontend URL and backend URL match the configuration
- Check `WebSecurityConfig.java` for CORS allowed origins

---

## 📦 Dependencies

**Frontend (React)**
- react@18
- react-router-dom (routing)
- axios (HTTP client)
- vite (build tool)

**Backend (Java/Maven)**
- spring-boot-starter-web
- spring-boot-starter-data-mongodb
- spring-boot-starter-security
- jjwt (JWT library)

---

## 🔄 Development Workflow

1. **Start MongoDB cluster** (MongoDB Atlas console)
2. **Start Backend** – `cd backend && mvn clean spring-boot:run`
3. **Start Frontend** – `cd frontend && npm run dev` (in new terminal)
4. **Open Browser** – Navigate to `http://localhost:5173`
5. **Login** – Use demo credentials to test features
6. **Make Changes** – Code automatically reloads in dev mode

---

## 📝 Git Workflow

```bash
# Push changes to main branch
git add .
git commit -m "Description of changes"
git push origin main
```

---

## 🎯 Future Enhancements
- Real-time notifications for order updates
- Payment gateway integration (Stripe/Razorpay)
- Review & rating system
- Inventory management alerts
- Push notifications for mobile

---

## 📄 License
This project is open-source and available under the MIT License.

---

**Last Updated:** July 20, 2026  
**Repository:** [github.com/Yogesh09singh/NCET](https://github.com/Yogesh09singh/NCET)
