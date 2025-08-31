const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addToWishlist,
  addToCart
} = require('../controllers/Userscontroller');
const { authenticateToken } = require('../auth/middleware');

// Public routes
router.post('/', createUser); // User registration

// Protected routes (require authentication)
router.use(authenticateToken);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/:id/wishlist', addToWishlist);
router.post('/:id/cart', addToCart);

module.exports = router;
