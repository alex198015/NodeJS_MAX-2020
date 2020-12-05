const path = require('path')
const {Router} = require('express')

const rootDir = require('../util/path')
const adminData = require('./admin')
const router = Router()

router.get('/', (req, res, next) => {
    console.log(adminData.products);
    // res.sendFile(path.join(rootDir, 'views', 'shop.html' ))
    const products = adminData.products
    res.render('shop', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
    })
})

module.exports = router