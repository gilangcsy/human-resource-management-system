const controller = require('../controllers/taskManagement.controller');
const API = require('../configs/db.config');

const { authJwt } = require('../middlewares/index.middleware');

module.exports = app => {

	let router = require('express').Router();
	
	router.get('/', controller.read);
	router.post('/', controller.create);
	router.get('/:id', controller.readById);
	router.get('/readByUser/:id', controller.readByUser);
	router.patch('/:id', controller.update);
	router.delete('/:id', controller.delete);

	app.use(`${API.VERSION}/tasks/`, authJwt.verifyToken, router);
}