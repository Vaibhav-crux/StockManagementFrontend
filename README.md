# Stock Portfolio Management Frontend

## Overview

The Stock Portfolio Management Frontend is a modern, responsive web application built to provide an intuitive user interface for managing and analyzing stock portfolios. It integrates seamlessly with the Stock Portfolio Management API (backend) to deliver real-time stock data, portfolio tracking, and interactive visualizations.

## Key Functionality

1. **User Authentication**

   - Secure login and registration using JWT tokens.
   - Protected routes to ensure only authenticated users can access sensitive pages.

2. **Shopping Cart**

   - Add, remove, and manage stocks in your cart.
   - Confirmation modal for placing orders.

3. **Portfolio Management**

   - Track and manage your stock portfolio with profit/loss calculations.

4. **Order History**

   - View past orders and their details.

5. **Offline Support**

   - Uses IndexedDB to store data locally for offline access.
   - Synchronizes data with the backend when the user is online.

6. **Responsive Design**
   - Fully responsive and optimized for desktop, tablet, and mobile devices.

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Configuration](#configuration)
5. [Running Tests](#running-tests)

## Features

- **Real-Time Stock Data:** Fetch and display real-time stock prices and trends.
- **Portfolio Management:** Track and manage your stock portfolio with profit/loss calculations.
- **User Authentication:** Secure login and registration system with JWT token management.
- **Shopping Cart:** Add, remove, and manage stocks in your cart before placing orders.
- **Order History:** View your past orders and their details.
- **Responsive Design:** Fully responsive and optimized for desktop, tablet, and mobile devices.
- **Offline Support:** Utilizes IndexedDB for offline data storage and synchronization.
- **Form Handling:** Efficient form management using React Hook Form.
- **State Management:** Centralized state management using Context API.
- **Routing:** Seamless navigation with React Router.

## Technologies Used

- **Frontend Framework:** React.js
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** Context API
- **Offline Storage:** IndexedDB
- **API Integration:** Axios
- **Form Handling:** React Hook Form
- **Routing:** React Router
- **Version Control:** Git and GitHub

## Project Structure

```
stock-frontend/
├── public/              # Static assets
│   └── vite.svg         # Vite logo
├── src/                 # Source code
│   ├── assets/          # Images, icons, and other static files
│   │   └── react.svg    # React logo
│   ├── components/      # Reusable UI components
│   │   ├── cart/        # Cart-related components
│   │   │   └── ConfirmationModal.jsx
│   │   ├── header/      # Header component
│   │   │   └── Header.jsx
│   │   ├── productList/ # Product list components
│   │   │   └── ViewStockModal.jsx
│   │   ├── protectedRoute/ # Protected route component
│   │   │   └── ProtectedRoute.jsx
│   │   └── ui/          # UI components (Card, Input, Modal, Table)
│   │       ├── Card.jsx
│   │       ├── Input.jsx
│   │       ├── Modal.jsx
│   │       ├── Table.jsx
│   ├── context/         # Context API for state management
│   │   ├── AuthContext.jsx  # Authentication context
│   │   └── CartContext.jsx  # Shopping cart context
│   ├── pages/           # Application pages
│   │   ├── Cart.jsx     # Shopping cart page
│   │   ├── List.jsx     # Product list page
│   │   ├── Login.jsx    # Login page
│   │   ├── OrderList.jsx # Order list page
│   │   ├── Payment.jsx  # Payment page
│   │   ├── Portfolio.jsx # Portfolio page
│   │   ├── Signup.jsx   # Signup page
│   │   └── UserOrders.jsx # User orders page
│   ├── router/          # Routing configuration
│   │   └── index.jsx    # React Router setup
│   ├── utils/          # Utility functions
│   │   ├── cn.js        # Utility for class names
│   │   └── indexedDB.js # IndexedDB helper functions
│   ├── App.jsx          # Main application component
│   ├── index.css        # Global styles
│   └── main.jsx         # Entry point
├── .env.example         # Environment variables template
├── package.json         # Project dependencies
├── tailwind.config.js   # Tailwind CSS configuration
└── README.md            # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

Clone the repository:

```bash
git clone https://github.com/Vaibhav-crux/StockManagementFrontend.git
cd stock-frontend
```

Install dependencies:

```bash
npm install
# or
yarn install
```

`npm run build`

### Configuration

Create a `.env` file in the root directory and add the necessary environment variables (e.g., API URLs):

```env
VITE_API_BASE_UR= backend-api

```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open the application:
Visit `http://localhost:3000` in your browser to view the application.

## Running Tests

To run unit tests, use the following command:

```bash
npm test
# or
yarn test
```
