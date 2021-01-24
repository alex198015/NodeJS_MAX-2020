const Product = require('../models/product')
const Order = require('../models/order')


exports.getProducts = (req, res, next) => {

    // Product.fetchAll()
    Product.find()
    .then(products => {
        console.log(products);
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
            // isAuthenticated: req.session.isLoggedIn
        })
    })
    .catch(err => console.log(err))

    // Product.findAll()
    // .then(products => {
    //     res.render('shop/product-list', {
    //         prods: products,
    //         pageTitle: 'All Products',
    //         path: '/products',
    //     })
    // })
    // .catch(err => console.log(err))
    
    // Product.fetchAll()
    //     .then(([rows, fieldData]) => {
    //             res.render('shop/product-list', {
    //                 prods: rows,
    //                 pageTitle: 'All Products',
    //                 path: '/products',
    //             })
    //         })
    //     .catch(err => console.log(err))
            
    
}

exports.postCart = (req, res, next) => {

    const prodId = req.body.productId
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product)
        })
        .then(result => {
            console.log(result);
            res.redirect('/cart')
        })
        

    // const prodId = req.body.productId
    // Product.findByPk(prodId)
    //     .then(product => {
    //         return req.user.addToCart(product)
    //     })
    //     .then(result => {
    //         console.log(result);
    //         res.redirect('/cart')
    //     })
        
    // let fetchedCart
    // let newQuantity = 1
    // req.user
    //     .getCart()
    //     .then(cart => {
    //         fetchedCart = cart
    //         return cart.getProducts({where:{id:prodId}})
    //     })
    //     .then(products => {
    //         let product
    //         if(products.length > 0) {
               
    //             product = products[0]
    //         }

            
    //         if(product) {
    //             const oldQuantity = product.cartItem.quantity
    //             newQuantity = oldQuantity + 1
    //             return product
    //         }
    //         return Product.findByPk(prodId)
                
           
    //     })
    //     .then(product => {
    //         return fetchedCart.addProduct(product, { through : {quantity:newQuantity}})
    //     })
    //     .then(() => {
    //         res.redirect('/cart')
    //     })
    //     .catch(err => console.log(err))

    // const prodId = req.body.productId
    
    // Product.findById(prodId, (product) => {
    //     Cart.addProduct(prodId,product.price )
    // })
    // res.redirect('/cart')
}

exports.postCartDeleteProduct = (req, res, next) => {

    const prodId = req.body.productId

    req.user.removeFromCart(prodId)
        .then(result => {
            res.redirect('/')
        })
        .catch(err => console.log(err))

    // const prodId = req.body.productId

    // req.user.deleteItemFromCart(prodId)
    //     .then(result => {
    //         res.redirect('/')
    //     })
    //     .catch(err => console.log(err))

    // const prodId = req.body.productId

    // req.user.getCart()
    //     .then(cart => {
    //         return cart.getProducts({where:{id: prodId}})
    //     })
    //     .then(products => {
    //         const product = products[0]
    //         return product.cartItem.destroy()
    //     })
    //     .then(result => {
    //         res.redirect('/')
    //     })
    //     .catch(err => console.log(err))


    // Product.findById(prodId, product => {
        
    //     Cart.deleteProduct(prodId, product.price)
    //     res.redirect('/')
    // })

}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId
    // Product.findAll({where:{id:prodId}})
    //     .then(products => {
    //         res.render('shop/product-detail', {
    //             product: products[0],
    //             pageTitle: products[0].title,
    //             path: '/products',
    //         })
    //     })
    //     .catch(err => console.log(err))

    // Product.findByPk(prodId)
    Product.findById(prodId)
        .then(product => {
        
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products',
                // isAuthenticated: req.session.isLoggedIn
            })
        })
        .catch(err => console.log(err))
    // Product.findById(prodId)
    //     .then(([product]) => {
           
    //         res.render('shop/product-detail', {
    //             product: product[0],
    //             pageTitle: product.title,
    //             path: '/products',
    //         })
    //     })
    //     .catch(err => console.log(err))
}

exports.getIndex = (req, res, next) => {

    // Product.fetchAll()
    Product.find()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
                
            })
        })
        .catch(err => console.log(err))

    // Product.findAll()
    //     .then(products => {
    //         res.render('shop/index', {
    //             prods: products,
    //             pageTitle: 'Shop',
    //             path: '/',
    //         })
    //     })
    //     .catch(err => console.log(err))
    // Product.fetchAll()
    //     .then(([rows, fieldData]) => {
    //         res.render('shop/index', {
    //             prods: rows,
    //             pageTitle: 'Shop',
    //             path: '/',
    //         })
    //     })
    //     .catch(err => {
    //     console.log(err)
    // })
    
}

exports.getCart = (req, res, next) => {

    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
           
            const products = user.cart.items

                res.render('shop/cart', {
                        path: '/cart',
                        pageTitle: 'Your Cart',
                        products: products,
                        // isAuthenticated: req.session.isLoggedIn
                        })
                            })
        .catch(err => console.log(err))

    // req.user.getCart()
    //     .then(products => {
    //             res.render('shop/cart', {
    //                     path: '/cart',
    //                     pageTitle: 'Your Cart',
    //                     products: products
    //                     })
    //                         })
    //     .catch(err => console.log(err))

    // req.user.getCart()
    //     .then(cart => {
    //         cart.getProducts()
    //             .then(products => {
    //                 res.render('shop/cart', {
    //                             path: '/cart',
    //                             pageTitle: 'Your Cart',
    //                             products: products
    //                             })
    //             })
    //             .catch(err => console.log(err))
    //     })
    //     .catch(err => console.log(err))
    // Cart.getCart(cart => {
    //     Product.fetchAll(products => {
    //         let cartProducts = []
    //     for (product of products){
    //         const cartProductData = cart.products.find(p => p.id === product.id)
    //         if (cartProductData) {
    //             cartProducts.push({productData: product, qty:cartProductData.qty })
    //         }
    //     }
    //     res.render('shop/cart', {
    //         path: '/cart',
    //         pageTitle: 'Your Cart',
    //         products: cartProducts
    //         })
    //     })
    // })
    
}

// exports.getCheckout = (req, res, next) => {
//     res.render('shop/checkout', {
//         path: '/checkout',
//         pageTitle: 'Checkout'
//     })
// }

exports.postOrder = (req, res, next) => {

    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
           
            const products = user.cart.items.map(i => {
                return {quantity: i.quantity, product: {...i.productId._doc}}
            })
            const order = new Order({
                user: {
                    email:req.user.email,
                    userId: req.user
                },
                products: products
                
            })
            return order.save()
        })
        .then(result => {
            return req.user.clearClart()
            
        })
        .then(() => {
            res.redirect('/orders')
        })
        .catch(err => {
            console.log(err);
        })

    // let fetchedCart
    // req.user.addOrder()
    //     .then(result => {
    //         res.redirect('/orders')
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })


    // let fetchedCart
    // req.user.getCart()
    //     .then(cart => {
    //         fetchedCart = cart
    //         return cart.getProducts()
    //     })
    //     .then(products => {
    //         return req.user.createOrder()
    //             .then(order => {
    //                 return order.addProducts(products.map(product => {
    //                     product.orderItem = { quantity: product.cartItem.quantity}
    //                     return product
    //                 }))
    //             })
    //             .catch(err => {
    //                 console.log(err)
    //             })
    //     })
    //     .then(result => {
    //         return fetchedCart.setProducts(null)
            
    //     })
    //     .then(result => {
    //         res.redirect('/orders')
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })
}

exports.getOrders = (req, res, next) => {

    Order.find({"user.userId": req.user._id})
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders,
                // isAuthenticated: req.session.isLoggedIn
            })
        })

    // req.user.getOrders()
    //     .then(orders => {
    //         res.render('shop/orders', {
    //             path: '/orders',
    //             pageTitle: 'Your Orders',
    //             orders: orders
    //         })
    //     })
    //     .catch(err => console.log(err))


    // req.user.getOrders({include: ['products']})
    //     .then(orders => {
    //         res.render('shop/orders', {
    //             path: '/orders',
    //             pageTitle: 'Your Orders',
    //             orders: orders
    //         })
    //     })
    //     .catch(err => console.log(err))
    // res.render('shop/orders', {
    //     path: '/orders',
    //     pageTitle: 'Your Orders'
    // })
}