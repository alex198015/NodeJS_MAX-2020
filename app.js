const express = require('express')

// const http = require('http')
const errorController = require('./controllers/error')
const mongoConnect = require('./util/database').mongoConnect
const path = require('path')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const bodyParser = require('body-parser')
// const expressHbs = require('express-handlebars')
// const db = require('./util/database')
// const sequelize = require('./util/database')
// const Product = require('./models/product')
// const User = require('./models/user')
// const Cart = require('./models/cart')
// const CartItem = require('./models/cart-item')
// const Order = require('./models/order')
// const OrdertItem = require('./models/order-item')

const app = express()

// app.engine('hbs', expressHbs({
//     layoutsDir: 'views/layouts/',
//     defaultLayout: 'main-layout',
//     extname:'hbs'
// }))
app.set('view engine', 'ejs')
// app.set('view engine', 'hbs')
// app.set('view engine', 'pug')
app.set('views', 'views')
app.use(bodyParser.urlencoded({ extended: false }))


app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
//     User.findByPk(1)
//         .then(user => {
//             req.user = user
//             next()
//         })
//         .catch(err => {
//             console.log(err);
//         })
next()
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
// db.execute('SELECT * FROM products').then((result) => {
//     console.log(result[0], result[1])
// }).catch((err) => {
//     console.log(err)
// })

app.use(errorController.get404)
// const server = http.createServer(app)

// Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'}) 
// User.hasMany(Product) 
// User.hasOne(Cart)   
// Cart.belongsTo(User)   
// Cart.belongsToMany(Product, {through: CartItem})
// Product.belongsToMany(Cart, {through: CartItem})
// Order.belongsTo(User)
// User.hasMany(Order)
// Order.belongsToMany(Product, { through: OrdertItem})

// sequelize
//     // .sync({force: true})
//     .sync()
//     .then(result => {
//         return User.findByPk(1)
//         // console.log(result)
        
//     })
//     .then(user => {
//         if(!user) {
//             return User.create({name:'Max', email: 'test@test.com'})
//         }
//         return user
//     })
//     .then(user => {
//         // console.log(user)
//         return user.createCart()
        
//     })
//     .then(cart => {
//         app.listen(3000, () => {
//             console.log('Server is running');
//         })  
//     })
//     .catch(err => console.log(err))

// app.listen(3000, () => {
//     console.log('Server is running');
// })  

mongoConnect(() => {
    
    app.listen(3000)
})