const controller = require('../controllers/claim.controller');
const API = require('../configs/db.config');
const { authJwt } = require('../middlewares/index.middleware');

module.exports = app => {

	let router = require('express').Router();
	
	router.get('/', controller.read);
	router.get('/readByUserId/:id', controller.readByUserId);
	router.get('/:id', controller.readById);
	router.delete('/:id', controller.delete);
	router.patch('/:id', controller.upload.array('attachment'), controller.update);
	router.post('/', controller.upload.array('attachment'), controller.create);
	router.post('/approve', controller.approve);
	router.get('/readByApproverNowId/:id', controller.readByApproverNowId);
	router.get('/download/:attachment', controller.download);
	router.delete('/attachment/remove', authJwt.verifyToken ,controller.removeAttachment);

	router.get('/allStatus/count', controller.getCountAllStatus);
	
	app.use(`${API.VERSION}/claims/`, router);
}