const express = require('express');
// const Transaction = require('./../Service/transcationService')
const authService = require('./../Service/AuthService')
const userService = require('./../Service/UserService')
const router = express.Router();

router.post('/signup', authService.signUp);
router.post('/login', authService.login);
router.get('/logout', authService.logout);
router.post('/forgotPassword', authService.forgotPassword);
router.post('/resetPassword', authService.resetPassword);
router.post('/verify', authService.verify)
// router.post('/loginwithuser', authService.loginWithUser)
router.get('/resendOTP', authService.protect, authService.resendTo)

router.use(authService.protect)
router.get('/me', userService.getMe, userService.getUser)

module.exports = router;