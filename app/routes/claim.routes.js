const controller = require('../controllers/claim.controller');
const API = require('../configs/db.config');

module.exports = app => {

	let router = require('express').Router();
	
	router.get('/', controller.read);
	router.get('/readByUserId/:id', controller.readByUserId);
	router.get('/:id', controller.readById);
	router.delete('/:id', controller.delete);
	router.patch('/:id', controller.upload.single('attachment'), controller.update);
	router.post('/', controller.upload.single('attachment'), controller.create);
	router.post('/approve', controller.approve);
	router.get('/readByApproverNowId/:id', controller.readByApproverNowId);
	router.get('/download/:attachment', controller.download);

	app.use(`${API.VERSION}/claims/`, router);
}