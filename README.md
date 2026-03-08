 FurniForge - AI-Powered 3D Interior Design Engine

FurniForge is a modern web application that allows users to design 2D floor plans and instantly transform them into photorealistic 3D environments. It features a robust material system, dynamic lighting, walkthrough modes, and Augmented Reality (AR) viewing.

---

##  Getting Started

Follow these steps to set up and run the project locally on your machine.

###  Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas Cloud)
- NPM (Comes with Node.js)

---

##  Installation & Setup

### 1. Clone the Repository
```bash
# Open your terminal and navigate to the project root
cd "Desktop Application"
```

### 2. Backend Setup
Navigate to the `server` directory and install dependencies:
```bash
cd server
npm install
```

**Configure Environment Variables:**
Create a `.env` file in the `server` folder and add your configuration:
```env
PORT=5000
DATABASE=mongodb+srv://your_username:your_password@cluster.mongodb.net/your_db_name
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=90d
```

### 3. Frontend Setup
Navigate to the `client` directory and install dependencies:
```bash
cd ../client
npm install
```

---

##  Running the Application

You need to run **both** the server and the client simultaneously.

### Step 1: Start the Backend Server
In one terminal window, navigate to the `server` folder:
```bash
cd server
npm run dev
```
*Server will start on: `http://localhost:5000`*

### Step 2: Start the Frontend App
In a **second** terminal window, navigate to the `client` folder:
```bash
cd client
npm run dev
```
*Frontend will start on: `http://localhost:5173` (Note: Default for Vite, adjust if Electron is set to another port)*

### Step 3: Start the Desktop App (Electron)
If you want to run the desktop version, open a **third** terminal window:
```bash
cd electron
npm install
npm run dev
```

---

##  Electron Configuration Note
The Desktop app is configured to load the frontend from `http://localhost:3000` by default in development mode. If your Vite client is running on another port (like `5173`), please update `electron/main.js` accordingly:
```javascript
// Inside electron/main.js
win.loadURL(isDev ? 'http://localhost:5173' : ...);
```

---

##  Key Features

- **2D/3D Instant Toggle:** Design in 2D and view in 3D in one click.
- **Material Customization:** Apply Wood, Metal, or Fabric textures to furniture.
- **Lighting Studio:** Simulate Morning, Noon, Evening, and Night lighting.
- **Walkthrough Mode:** Explore your room at eye-level inside the 3D scene.
- **AR View:** Scan a QR code to view your design in the real world using Augmented Reality.
- **PDF Export:** Generate professional invoices for your furniture layouts.

---

##  Tech Stack

- **Frontend:** React 19, Three.js, React Three Fiber, Tailwind CSS.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB.
- **Authentication:** JWT & Bcrypt.


