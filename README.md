# Backend Requirements & API Documentation for BasicMart E-Commerce

## Overview

This document describes the backend API for the BasicMart e-commerce platform. The backend is built with Node.js (Express.js) and Sequelize ORM, supporting MySQL, PostgreSQL, or SQLite databases. It provides endpoints for product management, cart, orders, user authentication, admin features, and search. Security, validation, and best practices are enforced throughout.

---

## Table of Contents

1. [Product Management](#1-product-management)
2. [Cart Management](#2-cart-management)
3. [Order Processing](#3-order-processing)
4. [User Authentication & Profile](#4-user-authentication--profile)
5. [Admin Features](#5-admin-features)
6. [Search & Miscellaneous](#6-search--miscellaneous)
7. [Security & Best Practices](#security--best-practices)
8. [Optional Features](#optional-features)
9. [Example API Flow](#example-api-flow)
10. [Suggested Tech Stack](#suggested-tech-stack)

---

## 1. Product Management

### Endpoints

- `GET /api/products`
  - List all products. Supports optional query params:
    - `category` (string): Filter by category
    - `search` (string): Search by product name
    - `limit` (number): Limit number of results
    - `offset` (number): Pagination offset
- `GET /api/products/:id`
  - Get details of a single product by ID
- `POST /api/products` (Admin only, Auth required)
  - Create a new product. Request body:
    ```json
    {
      "name": "string",
      "description": "string",
      "price": "number",
      "image": "string (URL or path)",
      "category": "string",
      "stock": "number"
    }
    ```
- `PUT /api/products/:id` (Admin only, Auth required)
  - Update product details. Request body: same as above (all or partial fields)
- `DELETE /api/products/:id` (Admin only, Auth required)
  - Delete a product by ID

### Data Model

```json
{
  "id": "string (UUID)",
  "name": "string",
  "description": "string",
  "price": "number",
  "image": "string (URL or path)",
  "category": "string",
  "stock": "number",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

---

## 2. Cart Management

### Endpoints

- `GET /api/cart` (Auth required)
  - Get current user's cart and items
- `POST /api/cart` (Auth required)
  - Add item to cart. Request body:
    ```json
    { "productId": "string", "quantity": "number" }
    ```
- `PUT /api/cart/:itemId` (Auth required)
  - Update quantity of a cart item. Request body:
    ```json
    { "quantity": "number" }
    ```
- `DELETE /api/cart/:itemId` (Auth required)
  - Remove item from cart
- `DELETE /api/cart` (Auth required)
  - Clear all items from cart

### Data Model

```json
{
  "id": "string (UUID)",
  "userId": "string (UUID)",
  "items": [
    {
      "id": "string (UUID)",
      "productId": "string (UUID)",
      "quantity": "number",
      "product": { /* Product object */ }
    }
  ]
}
```

---

## 3. Order Processing

### Endpoints

- `POST /api/orders` (Auth required)
  - Place an order from the current cart. **Requires user delivery info to be set.**
  - If any delivery info is missing, returns 400 with `{ message: "Delivery info required: <field>" }`.
- `GET /api/orders` (Auth required)
  - List current user's orders
- `GET /api/orders/:id` (Auth required)
  - Get details of a specific order (must belong to user)
- `GET /api/admin/orders` (Admin only, Auth required)
  - List all orders (admin dashboard)

### Data Model

```json
{
  "id": "string (UUID)",
  "userId": "string (UUID)",
  "items": [
    {
      "id": "string (UUID)",
      "productId": "string (UUID)",
      "quantity": "number",
      "price": "number",
      "product": { /* Product object */ }
    }
  ],
  "total": "number",
  "status": "string (pending|paid|shipped|delivered|cancelled)",
  "createdAt": "datetime"
}
```

---

## 4. User Authentication & Profile

### Endpoints

- `POST /api/auth/register`
  - Register a new user. Request body:
    ```json
    { "name": "string", "email": "string", "password": "string" }
    ```
- `POST /api/auth/login`
  - Login. Request body:
    ```json
    { "email": "string", "password": "string" }
    ```
  - Returns: `{ "token": "JWT string" }`
- `POST /api/auth/logout`
  - Logout (client-side: just delete token)
- `GET /api/users/me` (Auth required)
  - Get current user profile
- `PUT /api/users/me` (Auth required)
  - Update profile. Request body (any of):
    ```json
    { "name": "string", "email": "string", "password": "string", "country": "string", "state": "string", "city": "string", "address": "string", "phone": "string" }
    ```
  - **Note:** Delivery info fields (`country`, `state`, `city`, `address`, `phone`) are optional at registration, but required before placing an order.

### Data Model

```json
{
  "id": "string (UUID)",
  "name": "string",
  "email": "string",
  "password": "hashed string",
  "role": "user|admin",
  "country": "string (optional)",
  "state": "string (optional)",
  "city": "string (optional)",
  "address": "string (optional)",
  "phone": "string (optional)",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

---

## 5. Admin Features

- Product management (see [Product Management](#1-product-management))
- Order management (see [Order Processing](#3-order-processing))
- Dashboard analytics
  - `GET /api/admin/dashboard` (Admin only, Auth required)
    - Returns stats for admin dashboard:
      ```json
      {
        "totalSales": "number",
        "totalOrders": "number",
        "totalUsers": "number",
        "totalProducts": "number"
      }
      ```
- Account settings
  - `PUT /api/admin/account` (Admin only, Auth required)
    - Update admin account info. Request body: `{ "name": "string", "email": "string", "password": "string" }`

---

## 6. Search & Miscellaneous

- `GET /api/search?q=term`
  - Search products by name or category. Returns array of products.

---

## Security & Best Practices

- All admin routes require JWT authentication and `role: 'admin'`.
- All user routes require JWT authentication.
- All inputs are validated and sanitized using `express-validator`.
- Passwords are hashed with bcrypt before storage.
- Use HTTPS in production.
- Sensitive data (passwords, tokens) are never returned in API responses.
- Rate limiting and CORS are recommended for production.

---

## Optional Features

- Email notifications for order status (e.g., using nodemailer)
- Payment gateway integration (Stripe, PayPal)
- Inventory management (auto-update stock on order)
- User reviews and ratings for products
- Product image upload (local or cloud storage)
- Analytics endpoints for sales, users, etc.

---

## Example API Flow

1. User browses products (`GET /api/products`)
2. Adds items to cart (`POST /api/cart`)
3. Proceeds to checkout and places order (`POST /api/orders`)
   - If delivery info is missing, user must update it before order is accepted.
4. Admin manages products and views dashboard via admin endpoints

---

## Suggested Tech Stack

- **Backend Framework:** Node.js (Express.js)
- **ORM:** Sequelize
- **Database:** MySQL, PostgreSQL, or SQLite
- **Authentication:** JWT-based authentication
- **File Storage:** Local or cloud (for product images)
- **Deployment:** Netlify (frontend), Vercel, Heroku, AWS, or similar for backend

---

This backend API design will make your e-commerce site fully functional, secure, and scalable. For code samples, integration help, or further customization, let us know your requirements!
