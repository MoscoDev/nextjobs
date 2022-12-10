const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth');
const authController = require('../controllers/authController');


/*
@route 			POST /api/auth/login
@description 	authenticate the user.
@access 		Public
*/
router.post('/login', authController.authenticateUser);


/*
@route 			POST /api/auth/signup
@description 	authenticate the user.
@access 		Public
*/
router.post("/signup", authController.registerNewUser);



/*
@route 			POST /api/auth/verify
@description 	authenticate the user.
@acces
*/
router.get("/verify/:id", authController.verifyUser)


/*
@route 			POST /api/auth/employer/signup
@description 	authenticate the user.
@acces
*/
router.post("/employer/signup", authController.registerNewEmployer)



/*
@route 			POST /api/auth/employer/login
@description 	authenticate the employer.
@access 		Public
*/
router.post('/employer/login', authController.authenticateEmployer);


/*
@route 			POST /api/auth/employer/verify
@description 	authenticate the user.
@acces
*/

router.get("/employer/verify/:employerID", authController.verifyEmployer);


/*
@route 			GET api/auth/user
@description 	Get authenticated user data.
@access 		Private
*/
router.get('/user', auth, authController.fetchAuthenticatedUser)


//export router
module.exports = router;
