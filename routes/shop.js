// const path = require('path')
const {Router} = require('express')

// const rootDir = require('../util/path')
const shopController = require('../controllers/shop')
// const adminData = require('./admin')
const router = Router()

router.get('/', shopController.getIndex)

router.get('/products', shopController.getProducts)

router.get('/cart', shopController.getCart)

router.get('/orders', shopController.getOrders)

router.get('/checkout',shopController.getCheckout)

module.exports = router