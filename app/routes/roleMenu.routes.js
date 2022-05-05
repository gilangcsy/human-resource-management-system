const controller = require('../controllers/roleMenu.controller');
const API = require('../configs/db.config');

module.exports = app => {

	let router = require('express').Router();
	
	router.get('/', controller.read);
	router.post('/', controller.create);
	router.patch('/:id', controller.update);
	router.get('/readByRoleId/:role_id', controller.readByRoleId);
	router.post('/check', controller.checkAccessRights);

	app.use(`${API.VERSION}/accessRights/`, router);
}