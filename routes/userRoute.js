const express = require('express');
const router = express.Router();
const { register, login, protect, restrictTo, updateMyPassword } = require('../controllers/authController');
const { getAllUsers, getUser, createUser, updateUser, deleteUser, getMe, deleteMe, updateMe } = require('../controllers/userController');

router.post('/register', register);
router.post('/login', login);

router.use(protect);

router.route('/updateMyPassword').put(updateMyPassword)
router.route('/me').get(getMe, getUser);
router.route('/deleteMe').delete(deleteMe, deleteUser);
router.route('/updateMe').put(updateMe);

router.use(restrictTo('ADMIN'));

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
