// const mysql = require('mysql2')


// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password: '123456'
// })

// module.exports = pool.promise()

const Sequelize = require('sequelize')


const sequelize = new Sequelize('node-complete', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = sequelize