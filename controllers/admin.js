
const mongoose = require('mongoose')
const {validationResult} = require('express-validator')
const Product = require('../models/product')
const fileHelper = require('../util/file')

exports.getAddProduct = (req, res, next) => {
    // if (!req.session.isLoggedIn) {
    //     return res.redirect('/login')
    // }
    // res.sendFile(path.join(rootDir , 'views', 'add-product.html'))
    res.render('admin/edit-product', {
        pageTitle:'Add Product',
        path: '/admin/add-product',
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
        // isAuthenticated: req.session.isLoggedIn
        // formsCSS: true,
        // productCSS: true,
        // activeAddProduct: true
    })
}

exports.postAddProduct = (req, res, next) => {
    // products.push({title: req.body.title})
    const title = req.body.title
    // const imageUrl = req.body.imageUrl
    const image = req.file
    const price = req.body.price
    const description = req.body.description
    
    if(!image) {
        return res.status(422).render('admin/edit-product', {
            pageTitle:'Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            errorMessage: 'Attached file is not an image.',
            validationErrors: []
        })
    }
    // req.user.createProduct({
    //     title: title,
    //     price: price,
    //     imageUrl: imageUrl,
    //     description: description,
    //     // userId: req.user.id
    // })
    // const product = new Product(null, title,imageUrl, description, price)
    
    // product.save().then(() => {
    //     res.redirect('/')
    // }).catch(err => console.log(err))

    // const product = new Product(title, price, description, imageUrl, null, req.user._id)
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle:'Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                // imageUrl: image,
                price: price,
                description: description
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }

    const imageUrl = image.path

    const product = new Product({
        // _id: new mongoose.Types.ObjectId('6011905bf84b9c3960552246'),
        title: title,
        price: price,
        description: description, 
        imageUrl: imageUrl,
        userId: req.user
    })
    product.save()
    .then(result => {
        console.log(result)
        res.redirect('/admin/products')
    })
    .catch(err => {
        // return res.status(500).render('admin/edit-product', {
        //     pageTitle:'Add Product',
        //     path: '/admin/add-product',
        //     editing: false,
        //     hasError: true,
        //     product: {
        //         title: title,
        //         imageUrl: imageUrl,
        //         price: price,
        //         description: description
        //     },
        //     errorMessage: 'Database operation failed, please try again',
        //     validationErrors: []
        // })
        // res.redirect('/500')
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
    })
}

exports.getEditProduct = (req, res, next) => {

    const editMode = req.query.edit
    
    if(!editMode) {
        return res.redirect('/')
    }
    const prodId = req.params.productId
    // Product.findByPk(prodId)
    Product.findById(prodId)
    // req.user.getProducts({where:{id:prodId}})
    // Product.findByPk(prodId)
        .then(product => {
            // const product = products[0]
            if(!product) {
                return res.redirect('/')
            }
            res.render('admin/edit-product', {
                pageTitle:'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
                hasError: false,
                errorMessage: null,
                validationErrors: []
                // isAuthenticated: req.session.isLoggedIn
               
            })
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })

    // Product.findById(prodId, product => {
    //     if(!product) {
    //         return res.redirect('/')
    //     }
    //     res.render('admin/edit-product', {
    //         pageTitle:'Edit Product',
    //         path: '/admin/edit-product',
    //         editing: editMode,
    //         product: product
           
    //     })
    // })
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId
    const updatedTitle = req.body.title
    const updatedPrice = req.body.price
    const image = req.file
    const updatedDescription = req.body.description

    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle:'Edit Product',
            path: '/admin/edit-product',
            editing: true,
            hasError: true,
            product: {
                title: updatedTitle,
                // imageUrl: updatedImageUrl,
                price: updatedPrice,
                description: updatedDescription,
                _id:prodId
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }
    // const product = new Product(updatedTitle, updatedPrice, updatedDescription, updatedImageUrl, prodId)
    Product.findById(prodId)
        .then(product => {
            if(product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/')
            }
            product.title = updatedTitle
            product.price = updatedPrice
            product.description = updatedDescription
            if(image) {
                fileHelper.deleteFile(product.imageUrl)
                product.imageUrl = image.path
            }
            return product.save()
                .then(result => {
                console.log('UPDATED PRODUCT!')
                res.redirect('/admin/products')
            })
        })
        // .then(product => {
        //     product.title = updatedTitle
        //     product.price = updatedPrice
        //     product.description = updatedDescription
        //     product.imageUrl = updatedImageUrl
        //     return product.save()
        // })
        
        
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })


    // const updatedProduct = new Product(prodId, updatedTitle, updatedImageUrl, updatedDescription, updatedPrice)
    // updatedProduct.save()
    // res.redirect('/admin/products')
}

exports.getProducts = (req, res, next) => {
   
    // Product.fetchAll()
    Product.find({userId: req.user._id})
        // .select('title price -_id')
        // .populate('userId', 'name -_id')
        .then(products => {
            console.log(products);
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
                // isAuthenticated: req.session.isLoggedIn
            })
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
    // req.user
    //     .getProducts()
    // // Product.findAll()
    //     .then(products => {
    //         res.render('admin/products', {
    //             prods: products,
    //             pageTitle: 'Admin Products',
    //             path: '/admin/products',
    //         })
    //     })
    //     .catch(err => console.log(err))

    // Product.fetchAll(products => {
    //     res.render('admin/products', {
    //             prods: products,
    //             pageTitle: 'Admin Products',
    //             path: '/admin/products',
    //         })
    // })
}

// exports.postDeleteProduct = (req, res, next) => {


//     const prodId = req.body.productId
//     Product.findById(prodId)
//         .then(product => {
//             if (!product) {
//                 return next(new Error('Product not found.'))
//             }
//             fileHelper.deleteFile(product.imageUrl)
//             return Product.deleteOne({_id:prodId, userId: req.user._id })
//         })
//         .then(() => {
            
//             console.log('PRODUCT IS DELETED!')
//             res.redirect('/admin/products')
//         })
//         .catch(err => {
//             const error = new Error(err)
//             error.httpStatusCode = 500
//             return next(error)
//         })
//     // Product.findByIdAndRemove(prodId)
        
//     // const prodId = req.body.productId
//     // Product.deleteById(prodId)
//     //     .then(() => {
//     //         console.log('PRODUCT IS DELETED!')
//     //         res.redirect('/admin/products')
//     //     })
//     //     .catch(err => console.log(err))

//     // Product.findByPk(prodId)
//     //     .then(product => {
//     //         return product.destroy()
//     //     })
//     //     .then(result => {
//     //         console.log('PRODUCT IS DELETED!')
//     //         res.redirect('/admin/products')
//     //     })
//     //     .catch(err => console.log(err))

//     // Product.destroy({
//     //     where:{
//     //         id: prodId
//     //     }
//     // })
//     // .then(res => {
//     //     console.log('PRODUCT IS DELETED!')
//             // res.redirect('/admin/products');
//     // })
//     // .catch(err => console.log(err))
//     // res.redirect('/admin/products')


//     // Product.deleteById(prodId)
//     // res.redirect('/admin/products')
// }

exports.deleteProduct = (req, res, next) => {


    const prodId = req.params.productId
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return next(new Error('Product not found.'))
            }
            fileHelper.deleteFile(product.imageUrl)
            return Product.deleteOne({_id:prodId, userId: req.user._id })
        })
        .then(() => {
            
            console.log('PRODUCT IS DELETED!')
            res.status(200).json({message: 'Success!'})
        })
        .catch(err => {
            res.status(500).json({message: 'Deleting product failed!'})
        })

}