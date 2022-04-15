const controller = require('../controllers/approvalAuthorization.controller');
const API = require('../configs/db.config');

module.exports = app => {

	let router = require('express').Router();
	
	router.get('/', controller.read);
	router.get('/:id', controller.readById);
	router.delete('/:id', controller.delete);
	router.patch('/:id', controller.update);
	router.post('/', controller.create);

	app.use(`${API.VERSION}/approvalAuthorization/`, router);
}