const controller = require('../controllers/auth.controller');
const API = require('../configs/db.config');

module.exports = app => {

	let router = require('express').Router();

	router.post('/invitation/checkToken', controller.expiredCheck);
	router.post('/invitation/invite', controller.invite);
	router.post('/login', controller.login);
	router.post('/logout', controller.logout);
	router.patch('/invitation/accepting', controller.acceptingInvitation);

	app.use(`${API.VERSION}/auth/`, router);
}