const verifySignUp = require('./verifySignUp');
const authJwt = require('./verifyJwtToken');

module.exports = function(app) {

	const authController = require('../controller/authController.js');
	const travelController = require('../controller/travelController.js');
 

	//Auth routes
	app.post('/api/auth/signup', [verifySignUp.checkDuplicateUserNameOrEmail, verifySignUp.checkRolesExisted], authController.signup);

	app.post('/api/auth/signin', authController.signin);
	
	app.get('/api/test/user', [authJwt.verifyToken], authController.userContent);
	
	app.get('/api/test/pm', [authJwt.verifyToken, authJwt.isPmOrAdmin], authController.managementBoard);
	
	app.get('/api/test/admin', [authJwt.verifyToken, authJwt.isAdmin], authController.adminBoard);

	//Travel routes
	app.post('/api/travel/quote', [authJwt.verifyToken], travelController.quoteTravel);
	app.post('/api/travel/order', [authJwt.verifyToken], travelController.travelOrder);
	app.get('/api/travel/order/:id', [authJwt.verifyToken], travelController.travelGetOrder);
	app.put('/api/travel/order/:id', [authJwt.verifyToken], travelController.travelOrderUpdate);
	app.post('/api/travel/zones', [authJwt.verifyToken], travelController.travelCreateZone);
	app.get('/api/travel/zones', [authJwt.verifyToken], travelController.travelGetZone);
	app.get('/api/travel/zones/:id', [authJwt.verifyToken], travelController.travelGetZoneByID);
	app.delete('/api/travel/zones/:id', [authJwt.verifyToken], travelController.travelDeleteZoneByID);
}