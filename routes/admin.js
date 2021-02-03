// const path = require('path')
const {Router} = require('express')
const {body} = require('express-validator')
// const rootDir = require('../util/path')
const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')
const router = Router() 

// const products = []

router.get('/add-product', isAuth, adminController.getAddProduct)

router.get('/products', isAuth, adminController.getProducts )

router.post('/add-product', [ 
    body('title')
        .isString()
        .isLength({min: 5})
        .trim(),
    // body('imageUrl')
    //     .isURL(),
    body('price')
        .isFloat(),
    body('description')
        .isLength({min: 8, max: 400})
        .trim()
],
isAuth, adminController.postAddProduct)

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct )

router.post('/edit-product',[ 
    body('title')
        .isString()
        .isLength({min: 5})
        .trim(),
    // body('imageUrl')
    //     .isURL(),
    body('price')
        .isFloat(),
    body('description')
        .isLength({min: 8, max: 400})
        .trim()
], 
isAuth, adminController.postEditProduct )

// router.post('/delete-product', isAuth, adminController.postDeleteProduct )
router.delete('/product/:productId', isAuth, adminController.deleteProduct )


// exports.routes = router
// exports.products = products

module.exports = router