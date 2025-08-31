const User = require('../models/Userschema');
const bcrypt = require('bcryptjs');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password field
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('wishlist', 'name price')
      .populate('cart.product', 'name price');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      address
    });
    
    await user.save();
    
    // Return user without password
    const userResponse = await User.findById(user._id).select('-password');
    res.status(201).json({
      message: 'User created successfully',
      user: userResponse
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // If password is being updated, hash it
    if (updateData.password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating user', error: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { wishlist: productId } }, // $addToSet prevents duplicates
      { new: true }
    ).populate('wishlist', 'name price');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      message: 'Product added to wishlist',
      wishlist: user.wishlist
    });
  } catch (error) {
    res.status(400).json({ message: 'Error adding to wishlist', error: error.message });
  }
};

// Add to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if product already in cart
    const existingItem = user.cart.find(item => item.product.toString() === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      user.cart.push({ product: productId, quantity: quantity || 1 });
    }
    
    await user.save();
    
    const updatedUser = await User.findById(req.params.id)
      .populate('cart.product', 'name price');
    
    res.json({
      message: 'Product added to cart',
      cart: updatedUser.cart
    });
  } catch (error) {
    res.status(400).json({ message: 'Error adding to cart', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addToWishlist,
  addToCart
};
