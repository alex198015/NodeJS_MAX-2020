// const path = require('path')
const {Router} = require('express')

// const rootDir = require('../util/path')
const adminController = require('../controllers/admin')
const router = Router() 

// const products = []

router.get('/add-product', adminController.getAddProduct)

router.get('/products',adminController.getProducts )

router.post('/add-product', adminController.postAddProduct)

// router.get('/edit-product/:productId', adminController.getEditProduct )

// router.post('/edit-product', adminController.postEditProduct )

// router.post('/delete-product', adminController.postDeleteProduct )


// exports.routes = router
// exports.products = products

module.exports = router