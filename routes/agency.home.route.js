const express = require('express');
const router = express.Router({ strict: true, caseSensitive: true });

const agencyHomeController = require('../controllers/agency.home.controller');
const auth = require('../middlewares/authentication');

router.get('/profilecategorysubcategory/:gender', auth.newUserAuthentication, [agencyHomeController.profileandCategory]);
router.get('/subcategorydetail/:subcategoryid', auth.newUserAuthentication, [agencyHomeController.subCategoryDetail]);
router.get('/event', auth.newUserAuthentication, [agencyHomeController.event]);
router.get('/descriptionofshows/:descriptiontype', auth.newUserAuthentication, [agencyHomeController.descriptionOfShows]);
router.get('/subcategorydata/:subcategoryid', auth.newUserAuthentication, [agencyHomeController.subCategoryData]);
router.get('/allactiveemployee/:gender', auth.newUserAuthentication, [agencyHomeController.activeEmployee])
router.get('/employeedetail/:employeeid', auth.newUserAuthentication, [agencyHomeController.employeeDetail]);
router.post('/allservices/:gender', [agencyHomeController.allServices]);
router.get('/employeebysubcategory/:subcategoryid', auth.newUserAuthentication, [agencyHomeController.employeeBySubCategory]);

module.exports = router;