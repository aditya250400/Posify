# 🧾 Posify (Point of Sale) – Fullstack JavaScript

A modern **Point of Sale (POS)** web application built using a **Fullstack JavaScript ecosystem**.
This system is designed to streamline daily retail operations, from inventory management to financial reporting.

---

## 🚀 Technologies Used

* **Node.js** – JavaScript runtime environment
* **Express.js** – Backend framework for RESTful APIs
* **MySQL** – Relational database
* **Prisma ORM** – Database ORM for efficient data handling
* **React.js** – Frontend library with Zustand for state management
* **JWT Authentication** – Secure token-based authentication
* **REST API** – Communication between frontend and backend

---

## 🎯 Features

### 📊 Dashboard Analytics

* Overview of daily business performance
* Sales metrics: total transactions, revenue, and net profit
* Data visualization:

  * Line charts for revenue trends
  * Bar charts for profit trends (last 7 days)
* Inventory monitoring:

  * Best-selling products
  * Low-stock alerts (below 10 items)

---

### 📦 Master Data Management

* Manage **products & categories** (CRUD)
* Store product details: purchase price, selling price, description
* **Barcode system**:

  * Automatically generate barcode images
  * Compatible with barcode scanners
* Manage **customers and users** (admin & cashier roles)

---

### 🛒 Transaction Module (POS)

* Fast and efficient cashier interface
* **Barcode scanner integration** for instant product input
* Smart cart system:

  * Automatic quantity & subtotal calculation
  * Discount support (in currency format)
* Flexible checkout:

  * Optional customer selection
  * Automatic change calculation
* **Receipt printing**:

  * Thermal printer support
  * Complete transaction details included

---

### 📑 Reporting & Export System

* Generate **sales and profit reports**
* Filter reports by date range
* Export reports to **Excel (.xlsx)** format
* Suitable for offline archiving and further analysis

---

## 🎨 User Experience (UX)

* **Dark & Light Mode** toggle for better usability
* Responsive interface design
* **Real-time validation** without page reload
* Toast notifications for user feedback

---

## 🔐 Security

* Token-based authentication system (JWT)
* Server-side validation for all critical operations
* Secure API access control
