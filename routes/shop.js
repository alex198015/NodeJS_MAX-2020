// const path = require('path')
const {Router} = require('express')

// const rootDir = require('../util/path')
const shopController = require('../controllers/shop')
// const adminData = require('./admin')
const router = Router()

router.get('/', shopController.getIndex)

router.get('/products', shopController.getProducts)

router.get('/products/:productId', shopController.getProduct)

// router.get('/cart', shopController.getCart)

router.post('/cart', shopController.postCart)

// router.post('/cart-delete-item', shopController.postCartDeleteProduct)

// router.post('/create-order', shopController.postOrder)

// router.get('/orders', shopController.getOrders)

// router.get('/checkout',shopController.getCheckout)

module.exports = router