// const mysql = require('mysql2')



// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password: '123456'
// })

// module.exports = pool.promise()

// const Sequelize = require('sequelize')


// const sequelize = new Sequelize('node-complete', 'root', '123456', {
//     host: 'localhost',
//     dialect: 'mysql'
// })

// module.exports = sequelize
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let _db

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://Alex:ajW86oLXppXPnQ66@cluster0.nreob.mongodb.net/shop?retryWrites=true&w=majority', { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected!');
        _db = client.db()
        callback()
    })
    .catch(err => {
        console.log(err);
        throw err
    })
}

const getDb = () => {
    if (_db) {
        return _db
    }
    throw 'No database found!'
}


exports.mongoConnect = mongoConnect
exports.getDb = getDb