require('dotenv').config()
const express = require('express')
const { v4: uuidv4 } = require('uuid')

// const http = require('http')
const errorController = require('./controllers/error')
// const mongoConnect = require('./util/database').mongoConnect
// const User = require('./models/user')
const path = require('path')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')
const multer = require('multer')
// const expressHbs = require('express-handlebars')
// const db = require('./util/database')
// const sequelize = require('./util/database')
// const Product = require('./models/product')
const User = require('./models/user')

const MONGODB_URI = 'mongodb+srv://Alex:ajW86oLXppXPnQ66@cluster0.nreob.mongodb.net/shop?retryWrites=true&w=majority'
// const Cart = require('./models/cart')
// const CartItem = require('./models/cart-item')
// const Order = require('./models/order')
// const OrdertItem = require('./models/order-item')

const app = express()
const store = new MongoStore({
    uri: MONGODB_URI,
    collection: 'sessions'
})

const csrfProtection = csrf()

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' ) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

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
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))

app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store
}))

app.use(csrfProtection)
app.use(flash())

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn
    res.locals.csrfToken = req.csrfToken()
    next()
})

app.use((req, res, next) => {
    // throw new Error('Dummy')
    if(!req.session.user) {
        return next()
    }
    User.findById(req.session.user._id)
        .then(user => {
            // throw new Error('Dummy')
            if(!user) {
                return next()
            }
            // req.user = user
                    req.user = user
                    next()
                   
                })
                .catch(err => {
                    next(new Error(err))
                    
                })
})

// app.use((req, res, next) => {
//     User.findById('60034aa285985505800c9f97')
//         .then(user => {
//             // req.user = user
//             req.user = user
            
//             next()
//         })
//         .catch(err => {
//             console.log(err);
//         })
// })

// app.use((req, res, next) => {
//     User.findByPk('5ffb2778da8b448570185c5a')
//         .then(user => {
//             // req.user = user
//             req.user = new User(user.name, user.email, user.cart, user._id)
            
//             next()
//         })
//         .catch(err => {
//             console.log(err);
//         })
// })



app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)
// db.execute('SELECT * FROM products').then((result) => {
//     console.log(result[0], result[1])
// }).catch((err) => {
//     console.log(err)
// })
app.get('/500', errorController.get500)
app.use(errorController.get404)

app.use((error, req, res, next) => {
    // res.status(error.httpStatusCode).render(...)
    // res.redirect('/500')
    res.status(500).render('500', { 
        pageTitle: 'Error!', 
        path: '/500', 
        // isAuthenticated: req.session.isLoggedIn
    });
})
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

// mongoConnect(() => {
    
//     app.listen(3000)
// })

mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(result => {
        // User.findOne().then(user => {
        //     if(!user) {
        //         const user = new User({
        //             name: 'Alex',
        //             email: 'kitten2000@gmail.com',
        //             cart: {
        //                 items: []
        //             }
        //         })
        //         user.save()
        //     }
        // })
        
        app.listen(3000)
    })
    .catch(err => [
        console.log(err)
    ])