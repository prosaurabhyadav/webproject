const express = require('express');
const router = express.Router({ strict: true, caseSensitive: true });

const employmentController = require('../controllers/employment.controller');
const auth = require('../middlewares/authentication');

router.post('/statename', employmentController.stateName);
router.post('/statepostcode/:stateid', employmentController.statePostcode);
router.post('/checkemail', [employmentController.checkEmail]);
router.post('/checkmobile', [employmentController.checkMobile]);
router.post('/signup', [employmentController.signup]);
router.post('/editprofile', auth.newUserAuthentication, [employmentController.editProfile]);
router.post('/changestatus', auth.newUserAuthentication, [employmentController.changeStatus]);
router.get('/servicesoffered', auth.newUserAuthentication, [employmentController.servicesOffered]);
router.post('/demo', [employmentController.surcharge]);
router.post('/updateservices', auth.newUserAuthentication, [employmentController.updateServices]);
router.post('/addeventsurcharge/:eventid', auth.newUserAuthentication, [employmentController.addEventSurcharge]);
router.get('/employeeeventsurcharge', auth.newUserAuthentication, [employmentController.employeeEventSurcharge]);
router.post('/updatenotes', auth.newUserAuthentication, [employmentController.updateNotes]);
router.get('/notes', auth.newUserAuthentication, [employmentController.notes]);
router.post('/addprofilephoto', auth.newUserAuthentication, [employmentController.addProfilePhoto]);
router.post('/addprivatebooking', auth.newUserAuthentication, [employmentController.addPrivateBooking]);
router.get('/privatebooking', auth.newUserAuthentication, [employmentController.privateBooking]);
router.post('/checkemployeeavailability', auth.newUserAuthentication, [employmentController.checkEmployeeAvailability]); //incomplete
router.post('/checkout', auth.newUserAuthentication, [employmentController.checkout]);
router.get('/jobhistory', auth.newUserAuthentication, [employmentController.jobHistory]);

module.exports = router;