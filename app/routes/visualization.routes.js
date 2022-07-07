const controller = require('../controllers/visualization.controller');
const API = require('../configs/db.config');

module.exports = app => {

	let router = require('express').Router();

	router.get('/leaveAndClaim', controller.readLeaveAndClaimCount);
	router.get('/genderAndRole', controller.readGenderAndRoleCount);

	app.use(`${API.VERSION}/visualizations`, router);
}