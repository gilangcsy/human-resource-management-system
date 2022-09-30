const controller = require('../controllers/role.controller');
const API = require('../configs/db.config');

module.exports = app => {

	let router = require('express').Router();
	
	router.get('/', controller.readWithUser);
	router.get('/read/all', controller.read);
	router.get('/readBySuperiorId/:superiorId', controller.readBySuperiorId);
	router.get('/:id', controller.readById);
	router.post('/', controller.create);
	router.delete('/:id', controller.delete);
	router.patch('/:id', controller.update);

	app.use(`${API.VERSION}/master/role/`, router);
}