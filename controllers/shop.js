const Product = require('../models/product')
const Order = require('../models/order')
const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit')
const stripe = require('stripe')('sk_test_51IGnNqKa01I4AqKGvNYvQfDsjuJn7cXJ3BjwOIMXBD8ZV4BRBRIJy3mgRqq2W4BS7h6GY4MM6W07XfUO3nnSD7so00QyejvRvF')

const ITEMS_PER_PAGE = 2

exports.getProducts = (req, res, next) => {

    // Product.fetchAll()
    // Product.find()
    // .then(products => {
    //     console.log(products);
    //     res.render('shop/product-list', {
    //         prods: products,
    //         pageTitle: 'All Products',
    //         path: '/products',
    //         // isAuthenticated: req.session.isLoggedIn
    //     })
    // })
    const page = +req.query.page || 1
    
    let totalItems;

    Product.find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
        })
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products',
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1 ,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems/ ITEMS_PER_PAGE)
            })
        })
    .catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
    })

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
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })

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
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
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
    const page = +req.query.page || 1
    
    let totalItems;

    Product.find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
        })
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1 ,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems/ ITEMS_PER_PAGE)
            })
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })

        
    // Product.fetchAll()
    
        
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
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })

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

exports.getCheckout = (req, res, next) => {
    let products
    let total = 0
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
           
            products = user.cart.items
            total = 0
            products.forEach(p => {
                total += p.quantity * p.productId.price
            })


            return stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: products.map(p => {
                    return {
                        name: p.productId.title,
                        description: p.productId.description,
                        amount: p.productId.price * 100,
                        currency: 'usd',
                        quantity: p.quantity
                    }
                }),
                success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
                cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
            })
            .then(session => {
                res.render('shop/checkout', {
                    path: '/checkout',
                    pageTitle: 'Checkout',
                    products: products,
                    totalSum: total,
                    sessionId: session.id
                        // isAuthenticated: req.session.isLoggedIn
                    })
                        })
            })
        .catch(err => {
           
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

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
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
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

exports.getCheckoutSuccess = (req, res, next) => {

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
            console.log(err)
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
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

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId

    Order.findById(orderId)
        .then(order => {
            if(!order) {
                return next(new Error('No order found.'))
            }
            if(order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error('Unauthorized'))
            }

            const invoiceName = `invoice-${orderId}.pdf`
            const InvoicePath = path.join('data', 'invoices', invoiceName)
            const pdfDoc = new PDFDocument()
            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', `inline; filename='${invoiceName}'`)
            
            pdfDoc.pipe(fs.createWriteStream(InvoicePath))
            pdfDoc.pipe(res)
            // pdfDoc.text('Hello World!')
            pdfDoc.fontSize(26).text('Invoice', {
                underline: true,
            })

            pdfDoc.text('---------------------------------')
            let totalPrice = 0
            order.products.forEach(prod => {
                totalPrice += prod.quantity * prod.product.price
                pdfDoc.fontSize(14).text(prod.product.title + ' - ' + prod.quantity + ' x ' + '$' + prod.product.price)
            })
            pdfDoc.text('------------------')
            pdfDoc.fontSize(20).text('Total Price: $' + totalPrice)
            // Initial setup
            pdfDoc.fillColor('red')
            .translate(0, 200)
            .scale(0.4);

            // Draw the path with the non-zero winding rule
            pdfDoc.path('M 250,75 L 323,301 131,161 369,161 177,301 z')
            .fill('non-zero');

            // Draw the path with the even-odd winding rule
            pdfDoc.translate(280, 0)
            .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
            .fill('even-odd');
            pdfDoc.end()


    //         fs.readFile(InvoicePath, (err, data) => {
    //             if (err) {
    //                 return next(err)
    //             }
    //             res.setHeader('Content-Type', 'application/pdf')
    //             // res.setHeader('Content-Disposition', `attachment; filename='${invoiceName}'`)
    //             res.setHeader('Content-Disposition', `inline; filename='${invoiceName}'`)
    //             res.send(data)
                
                // })

            // const file = fs.createReadStream(InvoicePath)
            // res.setHeader('Content-Type', 'application/pdf')
            // res.setHeader('Content-Disposition', `inline; filename='${invoiceName}'`)
            // file.pipe(res)
        })
        .catch(err => {
        
            return next(err)
        })
    
}