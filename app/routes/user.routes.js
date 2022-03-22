const controller = require('../controllers/user.controller');
const API = require('../configs/db.config');
const myMiddleware = require('../middlewares/upload');

module.exports = app => {

	let router = require('express').Router();

	router.get('/', controller.read);
	router.delete('/:id/:deletedBy', controller.delete);
	router.get('/setActive/:id', controller.setActive);
	router.get('/:id', controller.readById);
	router.patch('/:id', controller.uploadImg.single('avatar'), controller.update);
	router.post('/', controller.create);

	app.use(`${API.VERSION}/users`, router);
}