// const path = require('path')
const {Router} = require('express')

// const rootDir = require('../util/path')
const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')
const router = Router() 

// const products = []

router.get('/add-product', isAuth, adminController.getAddProduct)

router.get('/products', isAuth, adminController.getProducts )

router.post('/add-product', isAuth, adminController.postAddProduct)

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct )

router.post('/edit-product', isAuth, adminController.postEditProduct )

router.post('/delete-product', isAuth, adminController.postDeleteProduct )


// exports.routes = router
// exports.products = products

module.exports = router