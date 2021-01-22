const User = require('../models/user')

exports.getLogin = (req, res, next) => {
        // const isLoggedIn = req.get('Cookie').split('=')[1].trim() === 'true'
        // console.log(req.session.isLoggedIn);
        res.render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            isAuthenticated: false
        })
    }

exports.postLogin = (req, res, next) => {
        // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly')
        User.findById('60034aa285985505800c9f97')
        .then(user => {
            // req.user = user
                    req.session.isLoggedIn = true
                    req.session.user = user
                    req.session.save(err => {
                        console.log(err);
                        res.redirect('/')
                    })
                   
                })
                .catch(err => {
                    console.log(err);
                })
    }

exports.postLogout = (req, res, next) => {
        req.session.destroy((err) => {
            console.log(err);
            res.redirect('/')
        })
        
    }