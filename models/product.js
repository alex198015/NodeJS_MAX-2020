// const fs = require('fs')
// const path = require('path')
// const rootPath = require('../util/path')
// const p = path.join(rootPath, 'data', 'products.json')
const Cart = require('./cart')

// const getProductsFromFile = (cb) => {
    
//         fs.readFile(p, (err, fileContent) => {
//             if(err) {
//                 return cb([])
//             }
//             cb(JSON.parse(fileContent))
//         })
//     }

const db = require('../util/database')


module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id
        this.title = title
        this.imageUrl = imageUrl
        this.description = description
        this.price = price
    }


    save() {
        return db.execute('INSERT INTO products (title, price, imageUrl, description ) VALUES (?, ?, ?, ?)',
        [this.title, this.price, this.imageUrl, this.description]
        )
    }


    static fetchAll() {
        return db.execute('SELECT * FROM products')
    }

    static findById(id) {
        return db.execute(`SELECT * FROM products WHERE products.id = ?`, [id])
    }
    // save() {

    //     getProductsFromFile(products => {
    //         if(this.id) {
    //             const existingProductIndex = products.findIndex(p => p.id === this.id)
    //             const updatedProducts = [...products]
    //             updatedProducts[existingProductIndex] = this

    //             fs.writeFile(p, JSON.stringify(updatedProducts), err => {
    //                 console.log(err);
    //             })
    //         } else {
    //             this.id = Math.random().toString()
    //             products.push(this)
    //             fs.writeFile(p, JSON.stringify(products), err => {
    //                 console.log(err);
    //             })
    //         }
            
    //     })
    // }

    // static deleteById(id) {
    //     getProductsFromFile(products => {
    //         const product = products.find(p => p.id === id)
    //         const updatedProducts = products.filter(p => p.id !== id)
    //         fs.writeFile(p, JSON.stringify(updatedProducts), err => {
    //             if(!err) {
    //                 Cart.deleteProduct(id, product.price)
    //             }
    //         })
    //     })

    // }

    // static fetchAll(cb) {
    //     getProductsFromFile(cb)
    // }

    // static findById(id, cb) {
    //     getProductsFromFile(products => {
    //         const product = products.find(p => p.id === id)
    //         cb(product)
    //     })
    // }
}