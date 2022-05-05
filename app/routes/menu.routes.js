const controller = require('../controllers/menu.controller')
const API = require('../configs/db.config')

module.exports = app => {

	let router = require('express').Router()
	
	router.get('/', controller.readAll)
	router.get('/readById/:id', controller.readById)
	router.get('/readMasterMenu', controller.readMasterMenu)
	router.get('/readSubMenu', controller.readSubMenu)
	router.post('/', controller.create)
	router.patch('/:id', controller.update)
	router.post('/newPositions', controller.newPositions)
	router.delete('/:id', controller.delete)

	app.use(`${API.VERSION}/master/menu/`, router)
}