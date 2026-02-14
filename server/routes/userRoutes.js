const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateUserProfile,
  deleteUser
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.route('/profile').put(protect, updateUserProfile).delete(protect, deleteUser);

module.exports = router;