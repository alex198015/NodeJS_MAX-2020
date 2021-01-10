// const Sequelize = require('sequelize')

// const sequelize = require('../util/database')

// const User = sequelize.define('user', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     name: Sequelize.STRING,
//     email: Sequelize.STRING
// })
const getDb = require('../util/database').getDb
const mongodb = require('mongodb')

class User {
    constructor(username, email, cart, id){
        this.name = username
        this.email = email
        this.cart = cart // { items: []}
        this._id = id
    }
    save() {
        const db = getDb()
        return db.collection('users')
            .insertOne(this)
            
    }

    addToCart(product) {
        // const cartProduct = this.cart.items.findIndex(cp => {
        //     return cp._id === product._id
        // })
        // product.quantity = 1
        const updatedCart = {items: [{productId: new mongodb.ObjectId(product._id), quantity: 1}]}
        const db = getDb()
        return db.collection('users').updateOne({_id : new mongodb.ObjectId(this._id)}, { $set: {cart: updatedCart}})
    }

    static findByPk(userId) {
        const db = getDb()
        return db.collection('users').findOne({_id: new mongodb.ObjectId(userId)})
            .then(user => {
                console.log(user)
                return user
            })
            .catch(err => console.log(err))
    }
}

module.exports = User