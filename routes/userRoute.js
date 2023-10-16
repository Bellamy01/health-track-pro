const express = require('express');
const router = express.Router();
const { register, login, protect } = require('../controllers/authController');
const { getAllUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/userController');


router.post('/register', register);
router.post('/login', login);

router.use(protect);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
