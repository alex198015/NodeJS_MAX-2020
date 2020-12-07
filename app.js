const express = require('express')
const http = require('http')
const adminData = require('./routes/admin')
const path = require('path')
const shopRoutes = require('./routes/shop')
const bodyParser = require('body-parser')
const expressHbs = require('express-handlebars')

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
app.use('/admin', adminData.routes)
app.use(shopRoutes)


app.use((req, res, next) => {
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
    res.status(404).render('404', {pageTitle: 'Page Not Found'})
})
// const server = http.createServer(app)


app.listen(3000, () => {
    console.log('Server is running');
})  
