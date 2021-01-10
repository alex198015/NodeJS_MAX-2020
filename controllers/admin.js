
const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir , 'views', 'add-product.html'))
    res.render('admin/edit-product', {
        pageTitle:'Add Product',
        path: '/admin/add-product',
        editing: false
        // formsCSS: true,
        // productCSS: true,
        // activeAddProduct: true
    })
}

exports.postAddProduct = (req, res, next) => {
    // products.push({title: req.body.title})
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description
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
    const product = new Product(title, price, description, imageUrl, null, req.user._id)
    product.save()
    .then(result => {
        console.log(result)
        res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}

exports.getEditProduct = (req, res, next) => {

    const editMode = req.query.edit
    
    if(!editMode) {
        return res.redirect('/')
    }
    const prodId = req.params.productId
    Product.findByPk(prodId)
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
                product: product
               
            })
        })
        .catch(err => console.log(err))

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
    const updatedImageUrl = req.body.imageUrl
    const updatedDescription = req.body.description

   
    const product = new Product(updatedTitle, updatedPrice, updatedDescription, updatedImageUrl, prodId)
       
        // .then(product => {
        //     product.title = updatedTitle
        //     product.price = updatedPrice
        //     product.description = updatedDescription
        //     product.imageUrl = updatedImageUrl
        //     return product.save()
        // })
        product.save()
        .then(result => {
            console.log('UPDATED PRODUCT!')
            res.redirect('/admin/products')
        })
        .catch(err => console.log(err))


    // const updatedProduct = new Product(prodId, updatedTitle, updatedImageUrl, updatedDescription, updatedPrice)
    // updatedProduct.save()
    // res.redirect('/admin/products')
}

exports.getProducts = (req, res, next) => {
   
    Product.fetchAll()
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
            })
        })
        .catch(err => console.log(err))
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

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId
    Product.deleteById(prodId)
        .then(() => {
            console.log('PRODUCT IS DELETED!')
            res.redirect('/admin/products')
        })
        .catch(err => console.log(err))

    // Product.findByPk(prodId)
    //     .then(product => {
    //         return product.destroy()
    //     })
    //     .then(result => {
    //         console.log('PRODUCT IS DELETED!')
    //         res.redirect('/admin/products')
    //     })
    //     .catch(err => console.log(err))

    // Product.destroy({
    //     where:{
    //         id: prodId
    //     }
    // })
    // .then(res => {
    //     console.log('PRODUCT IS DELETED!')
            // res.redirect('/admin/products');
    // })
    // .catch(err => console.log(err))
    // res.redirect('/admin/products')


    // Product.deleteById(prodId)
    // res.redirect('/admin/products')
}