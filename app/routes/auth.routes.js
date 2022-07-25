const controller = require('../controllers/auth.controller');
const API = require('../configs/db.config');

module.exports = app => {

	let router = require('express').Router();

	router.post('/invitation/checkToken', controller.expiredCheck);
	router.post('/invitation/invite', controller.invite);
	router.post('/login', controller.login);
	router.post('/logout', controller.logout);
	router.patch('/invitation/accepting', controller.acceptingInvitation);

	//Password Reset
	router.post('/passwordReset', controller.passwordResetNotification);
	router.get('/passwordReset', controller.passwordResetCheckToken);
	router.patch('/setNewPassword', controller.setNewPassword);

	app.use(`${API.VERSION}/auth/`, router);
}