// const path = require('path')
const {Router} = require('express')

// const rootDir = require('../util/path')
const shopController = require('../controllers/shop')
const isAuth = require('../middleware/is-auth')
// const adminData = require('./admin')
const router = Router()

router.get('/', shopController.getIndex)

router.get('/products', shopController.getProducts)

router.get('/products/:productId', shopController.getProduct)

router.get('/cart', isAuth, shopController.getCart)

router.post('/cart', isAuth, shopController.postCart)

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct)

router.post('/create-order', isAuth, shopController.postOrder)

router.get('/orders', isAuth, shopController.getOrders) 

router.get('/orders/:orderId', isAuth, shopController.getInvoice)

// router.get('/checkout',shopController.getCheckout)

module.exports = router