const controller = require('../controllers/news.controller')
const API = require('../configs/db.config')

const { authJwt } = require('../middlewares/index.middleware');

module.exports = app => {

	let router = require('express').Router()
	
	router.get('/', controller.read)
	router.get('/:id', controller.readById)
	router.post('/', controller.upload.single('thumbnail'), controller.create)
	router.patch('/:id', controller.upload.single('thumbnail'), controller.update)
	router.delete('/:id', controller.delete)

	app.use(`${API.VERSION}/news`, authJwt.verifyToken, router)
}