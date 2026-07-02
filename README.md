# 👟 WashIt — Premium Sneaker Cleaning & Restoration Service

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2014.x-brightgreen.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/express-4.21.2-blueviolet.svg)](https://expressjs.com/)

**WashIt** is a premium, web-based sneaker booking and cleaning management platform. Built for sneakerheads and collectors who value high-end care, the application allows users to choose cleaning packages, calculate dynamic pricing based on sneaker brands, select pickup dates, and automatically receive professional email receipts/confirmations.

---

## ✨ Features

- **Interactive Dynamic Pricing**: Automatically calculates costs based on selected service levels and applies a `+₹200/pair` branded shoe surcharge for premium brands (Nike, Jordan, Adidas, Yeezy, etc.).
- **Interactive UI & Micro-animations**: Features a modern dark theme, smooth slide-in layouts, glowing ambient backdrops, hover effects, and CSS particles.
- **Nodemailer Booking System**: The backend handles reservation submissions, validates user inputs, and triggers a rich, professionally designed HTML invoice directly to the user's email address.
- **Responsive Layout**: Designed for mobile, tablet, and desktop screens with a slide-out hamburger menu navigation.
- **Eco-Friendly & Specialized Care Info**: Sections detailing hand-cleaning methods, material-safe pH solutions, and priority turnaround.

---

## 🛠️ Technology Stack

- **Frontend**: 
  - [HTML5](https://developer.mozilla.org/en-US/docs/Web/HTML) (Semantic structure)
  - [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS) (Vanilla styling, Flexbox/Grid layouts, Glassmorphism, animations)
  - [JavaScript (ES6+)](https://developer.mozilla.org/en-US/docs/Web/JavaScript) (Interactive UI logic, pricing calculations, particle systems, AJAX booking requests)
- **Backend**:
  - [Node.js](https://nodejs.org/) (Runtime environment)
  - [Express.js](https://expressjs.com/) (Web framework & API endpoints)
  - [Nodemailer](https://nodemailer.com/) (Transactional email delivery)
  - [dotenv](https://www.npmjs.com/package/dotenv) (Environment configurations)
  - [cors](https://www.npmjs.com/package/cors) (Cross-Origin Resource Sharing)

---

## 📂 Project Directory Structure

```text
Washit/
├── images/               # Image assets (hero.png, branded.png, process.png)
├── index.html            # Main web application landing page
├── styles.css            # Stylesheets with full design tokens
├── script.js             # Client-side dynamic interaction & booking handling
├── server.js             # Express backend server & Nodemailer transporter
├── package.json          # Node dependencies & npm scripts
├── .env                  # Environment configuration variables (ignored by Git)
└── .gitignore            # Git exclusion rules
```

---

## 🚀 Installation & Setup

Follow these steps to set up and run the WashIt application locally:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v14 or above) installed on your system.

### 2. Clone and Setup Dependencies
Navigate to the project root directory and install dependencies:
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (based on the sample format below) to handle the email transporter credentials:
```env
# WashIt Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
PORT=3000
```
> **Note**: For Gmail, `EMAIL_PASS` must be a 16-character **App Password** generated from your Google Account settings, which requires 2-Factor Authentication to be enabled.

### 4. Running the Application

To start the local development server:
```bash
npm run dev
```
Once started, the application will serve static frontend assets and the backend API at:
* **Frontend/Backend Server**: [http://localhost:3000](http://localhost:3000)

---

## 🔌 API Reference

### Book a Sneaker Wash

Submit booking details to record a pickup and send a confirmation email.

* **Endpoint**: `/api/book`
* **Method**: `POST`
* **Content-Type**: `application/json`

#### Request Body Schema
```json
{
  "name": "Anubhav Poddar",
  "email": "anubhav@example.com",
  "phone": "9876543210",
  "brand": "nike",
  "brandName": "Nike",
  "pairs": 2,
  "service": 399,
  "serviceName": "Deep Clean",
  "pickupDate": "2026-07-03",
  "notes": "Grass stains on left heel.",
  "isBranded": true,
  "surcharge": 200,
  "total": 1198
}
```

#### Response (Success)
```json
{
  "success": true,
  "message": "Booking confirmed! Confirmation email sent to anubhav@example.com"
}
```

#### Response (Fallback/No Credentials Configured)
If Gmail credentials are not configured in `.env`, the server handles booking gracefully in mock mode:
```json
{
  "success": true,
  "message": "Booking confirmed! (Email sending was skipped because credentials in .env are not configured)"
}
```

---

## 🔒 Security & Best Practices

- **API Validation**: Basic validations are performed both client-side and server-side (empty parameters, regex email validation).
- **Environment Safety**: Configuration secrets like email addresses and app passwords are set inside `.env` which is configured in `.gitignore` to prevent credentials from being pushed to public version control repositories.

---

## 📄 License
This project is licensed under the ISC License - see [package.json](package.json) for details.
