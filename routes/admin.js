// const path = require('path')
const {Router} = require('express')

// const rootDir = require('../util/path')
const adminController = require('../controllers/admin')
const router = Router() 

// const products = []

router.get('/add-product', adminController.getAddProduct)

router.get('/products',adminController.getProducts )

router.post('/add-product', adminController.postAddProduct)


// exports.routes = router
// exports.products = products

module.exports = router