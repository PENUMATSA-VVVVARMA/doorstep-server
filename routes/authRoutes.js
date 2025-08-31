const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { 
    registerController, 
    loginController,
    getAllAdmins,
    getAdminById,
    updateAdminById,
    deleteAdminById
} = require('../controllers/authController');

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', registerController);
router.post('/login', loginController);
router.get('/status', (req, res) => {
    res.json({
        success: true,
        message: 'Auth service is running',
        endpoints: {
            'POST /register': 'Register new admin (public)',
            'POST /login': 'Admin login (public)',
            'GET /admins': 'Get all admins (protected)',
            'GET /admins/:id': 'Get admin by ID (protected)',
            'PUT /admins/:id': 'Update admin by ID (protected)',
            'DELETE /admins/:id': 'Delete admin by ID (protected)'
        }
    });
});

// Protected routes (authentication required)
// GET all admins - Protected
router.get('/admins', authMiddleware, getAllAdmins);

// GET admin by ID (getById) - Protected
router.get('/admins/:id', authMiddleware, getAdminById);

// PUT update admin by ID (getOneAndUpdate) - Protected
router.put('/admins/:id', authMiddleware, updateAdminById);

// DELETE admin by ID (getOneAndDelete) - Protected
router.delete('/admins/:id', authMiddleware, deleteAdminById);

module.exports = router;
