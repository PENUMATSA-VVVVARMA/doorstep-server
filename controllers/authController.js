const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/AdminSchema');

// Register Controller
const registerController = async (req, res) => {
    try {
        const { name, password } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ name });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: 'Admin already exists with this name'
            });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new admin
        const newAdmin = new Admin({
            name,
            password: hashedPassword
        });

        await newAdmin.save();

        res.status(201).json({
            success: true,
            message: 'Admin registered successfully',
            admin: {
                id: newAdmin._id,
                name: newAdmin.name
            }
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Login Controller
const loginController = async (req, res) => {
    try {
        const { name, password } = req.body;

        // Find admin by name
        const admin = await Admin.findOne({ name });
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials - Admin not found'
            });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials - Incorrect password'
            });
        }

        // Generate JWT token with 1 hour expiration
        const token = jwt.sign(
            { 
                adminId: admin._id, 
                name: admin.name 
            },
            process.env.JWT_SECRET || 'your-secret-key', // Use environment variable
            { 
                expiresIn: '1h' 
            }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            admin: {
                id: admin._id,
                name: admin.name
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get all admins
const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({}, { password: 0 }); // Exclude password field
        res.status(200).json({
            success: true,
            message: 'Admins retrieved successfully',
            count: admins.length,
            admins
        });
    } catch (error) {
        console.error('Get all admins error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get admin by ID
const getAdminById = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await Admin.findById(id, { password: 0 }); // Exclude password field
        
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Admin retrieved successfully',
            admin
        });
    } catch (error) {
        console.error('Get admin by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Update admin by ID (getOneAndUpdate)
const updateAdminById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, password } = req.body;

        // Build update object
        const updateData = {};
        if (name) updateData.name = name;
        if (password) {
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(password, saltRounds);
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(
            id,
            updateData,
            { new: true, select: { password: 0 } } // Return updated document, exclude password
        );

        if (!updatedAdmin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Admin updated successfully',
            admin: updatedAdmin
        });
    } catch (error) {
        console.error('Update admin error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Delete admin by ID (getOneAndDelete)
const deleteAdminById = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAdmin = await Admin.findByIdAndDelete(id);

        if (!deletedAdmin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Admin deleted successfully',
            deletedAdmin: {
                id: deletedAdmin._id,
                name: deletedAdmin.name
            }
        });
    } catch (error) {
        console.error('Delete admin error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = {
    registerController,
    loginController,
    getAllAdmins,
    getAdminById,
    updateAdminById,
    deleteAdminById
};
