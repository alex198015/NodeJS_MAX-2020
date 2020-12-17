const express = require('express')

// const http = require('http')
const errorController = require('./controllers/error')
const path = require('path')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const bodyParser = require('body-parser')
// const expressHbs = require('express-handlebars')
// const db = require('./util/database')


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
app.use('/admin', adminRoutes)
app.use(shopRoutes)
// db.execute('SELECT * FROM products').then((result) => {
//     console.log(result[0], result[1])
// }).catch((err) => {
//     console.log(err)
// })

app.use(errorController.get404)
// const server = http.createServer(app)


app.listen(3000, () => {
    console.log('Server is running');
})  
