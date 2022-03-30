const controller = require('../controllers/attendance.controller');
const API = require('../configs/db.config');
const { verifyUser } = require('../middlewares/index.middleware');

module.exports = app => {

	let router = require('express').Router();
	
	router.get('/readByUserId/:id', controller.readByUserId);
	router.get('/readById/:id', controller.readById);
	router.get('/readTodayAttendance/:id', verifyUser.checkIfUserExists, controller.readTodayAttendance);
	router.post('/', controller.upload.any(), controller.create);
	router.patch('/:id', controller.update);

	app.use(`${API.VERSION}/attendances`, router);
}