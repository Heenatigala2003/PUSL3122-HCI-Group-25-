const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authController = require('./controllers/authController');
const designController = require('./controllers/designController');
const { protect, restrictTo } = require('./controllers/middleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ── Auth ─────────────────────────────────────────────────────────────────────
app.post('/api/auth/signup', authController.signup);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/me', protect, authController.getMe);

// ── Designs (user owns) ───────────────────────────────────────────────────────
app.use('/api/designs', protect);
app.post('/api/designs', designController.createDesign);
app.get('/api/designs', designController.getAllDesigns);
app.get('/api/designs/:id', designController.getDesign);
app.patch('/api/designs/:id', designController.updateDesign);
app.delete('/api/designs/:id', designController.deleteDesign);

// ── Admin: all designs & users ────────────────────────────────────────────────────────
app.get('/api/admin/designs', protect, restrictTo('designer'), designController.getAllDesignsAdmin);
app.get('/api/admin/users', protect, restrictTo('designer'), authController.getAllUsers);
app.delete('/api/admin/users/:id', protect, restrictTo('designer'), authController.deleteUser);

// ── Customer: all designs ─────────────────────────────────────────────────────
app.get('/api/public/designs', protect, designController.getPublicDesigns);
app.get('/api/public/designs/:id', designController.getPublicDesign);

// ── Health ────────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FurniForge API is running' });
});

// ── DB Connection ─────────────────────────────────────────────────────────────
const DB = process.env.DATABASE || 'mongodb+srv://HCI:1212@cluster0.j787j1z.mongodb.net/';
mongoose.connect(DB).then(() => console.log('✅ DB connection successful!'));

app.listen(PORT, () => {
  console.log(`🚀 FurniForge server running on port ${PORT}`);
});
