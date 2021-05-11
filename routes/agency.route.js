const express = require('express');
const router = express.Router({ strict: true, caseSensitive: true });

const agencyController = require('../controllers/agency.controller');
const auth = require('../middlewares/authentication');

router.post('/signup', [agencyController.signup]);
router.get('/agentprofile', auth.newUserAuthentication, [agencyController.agentProfile]);
router.post('/changepassword', auth.newUserAuthentication, [agencyController.changePassword]);
router.post('/edit', auth.newUserAuthentication, [agencyController.edit]);

module.exports = router;