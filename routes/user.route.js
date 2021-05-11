const express = require('express');
const router = express.Router({ strict: true, caseSensitive: true });

const userController = require('../controllers/user.controller');
const auth = require('../middlewares/authentication');

router.post('/login', [userController.login]);
router.post('/updatepassword', auth.newUserAuthentication, [userController.updatePassword]);
router.post('/forgotpassword', [userController.forgotPassword]);
router.post('/logout', auth.newUserAuthentication, [userController.logout]);

module.exports = router;