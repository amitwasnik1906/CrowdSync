const express = require('express');
const { adminRegister, adminLogin, adminLogout, userRegister, userLogin, userLogout } = require('../controllers/authController');
const checkUser = require('../middlewares/checkUserMiddleware');
const checkAdmin = require('../middlewares/checkAdminMiddleware');

const router = express.Router();

router.post('/admin/register', adminRegister)
router.post('/admin/login', adminLogin)
router.get('/admin/logout', checkAdmin, adminLogout)

router.post('/user/register', userRegister)
router.post('/user/login', userLogin)
router.get('/user/logout', checkUser, userLogout)

module.exports = router