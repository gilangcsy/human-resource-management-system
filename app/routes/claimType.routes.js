const controller = require('../controllers/claimType.controller');
const API = require('../configs/db.config');

module.exports = app => {

	let router = require('express').Router();
	
	router.get('/', controller.read);
	router.get('/:id', controller.readById);
	router.post('/', controller.create);
	router.delete('/:id', controller.delete);
	router.patch('/:id', controller.update);

	app.use(`${API.VERSION}/master/claimType/`, router);
}