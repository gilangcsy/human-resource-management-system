const controller = require('../controllers/user.controller');
const API = require('../configs/db.config');

module.exports = app => {

	let router = require('express').Router();

	router.get('/', controller.read);
	router.post('/', controller.create);

	app.use(`${API.VERSION}/users`, router);
}