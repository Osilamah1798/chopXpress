# ChopXpress - Nigerian Food Delivery App

ChopXpress is a modern, responsive web application designed for a food delivery service specializing in authentic Nigerian cuisine. It provides a seamless experience for customers to browse a menu, place orders, and track them in real-time, while also offering a comprehensive admin dashboard for complete operational control.

## Key Features

- **Dynamic Menu & Category Management:** A full admin dashboard allows for creating, editing, and deleting not only menu items but also the categories they belong to.
- **Direct Image Uploads:** Admins can upload images for menu items directly to cloud storage.
- **Customer Dashboard:** A personal area for logged-in customers to view their complete order history and re-order their favorite meals with a single click.
- **Role-Based Authentication:** A robust user system with 'Customer', 'Admin', and 'Super-Admin' roles.
- **Full Shopping Cart:** Users can add/remove items and update quantities before checkout.
- **Live Order Tracking:** A status page that provides real-time updates on the order progress via real-time database subscriptions.
- **Comprehensive Admin Dashboard:** A protected, multi-page dashboard for staff to manage the entire application.
- **Responsive Design:** A mobile-first interface that looks great on all devices.

---

## Technical Architecture

The application is a single-page application (SPA) built with a modern, scalable tech stack.

- **Frontend:** React, TypeScript, React Router, Tailwind CSS
- **State Management:** React Context API (`AuthContext`, `OrderContext`, `CartContext`, `MenuContext`)
- **Styling:** Tailwind CSS for a utility-first design system.

---

## Roles & Dynamics

The app supports a clear hierarchy of user roles.

### 1. Super-Admin
The highest level of administrator.
- **Responsibilities:**
    - Has all the capabilities of a standard Admin.
    - **Exclusive:** Manages all other staff accounts (Admins and Super-Admins). This is the only role that can create, edit, or delete other administrative users.

### 2. Admin
The Admin user represents the restaurant manager or staff.
- **Responsibilities:**
    - **Menu Curation:** Add new dishes, update prices, change descriptions, upload photos, and manage all food categories.
    - **Order Fulfillment:** View all incoming customer orders in real-time.
    - **Status Updates:** Update the status of an order as it moves through the kitchen and out for delivery.

### 3. Customer
The Customer is the end-user of the application.
- **Abilities:**
    - Browse the menu curated by Admins.
    - Place orders and track them.
    - Log in to a personal dashboard to view order history.

### The Dynamic Interaction
The system is designed for a live, interactive experience. When an Admin makes a change, it is immediately reflected for all Customers.
- If an Admin **updates a price**, Customers will see the new price instantly.
- If an Admin **updates an order's status**, the Customer's tracking page updates automatically in real-time.
- If an Admin **adds a new category or item**, it appears on the public menu for everyone to see.
---

## Admin Creation

The application starts with no users. The **first user to sign up is automatically assigned the 'super-admin' role**, creating the initial point of control. A corresponding user profile is created in Firestore upon signup.