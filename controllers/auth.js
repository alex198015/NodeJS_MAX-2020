const crypto = require('crypto')
const sgMail = require('@sendgrid/mail')
// const nodemailer = require('nodemailer')
// const sendgridTransport = require('nodemailer-sendgrid-transport')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const { validationResult } = require('express-validator')

// const transporter = nodemailer.createTransport(sendgridTransport({
//     auth: {
//         api_key: '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'
//     }
// }))

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.getLogin = (req, res, next) => {
        let message = req.flash('error')
        // if (message.length > 0) {
        //     message = message[0]
        // } else {
        //     message = null
        // }
            
        // const isLoggedIn = req.get('Cookie').split('=')[1].trim() === 'true'
        // console.log(req.session.isLoggedIn);
        res.render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: message.length > 0 && message,
            oldInput: {
                email: '',
                password: ''
            },
            validationErrors: []
            // isAuthenticated: false
        })
    }

exports.postLogin = (req, res, next) => {
        // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly')
        const email = req.body.email
        const password = req.body.password

        const errors = validationResult(req)

        if(!errors.isEmpty()) {

            return res.status(422).render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: errors.array()[0].msg,
                oldInput: {
                    email: email,
                    password: password
                },
                validationErrors: errors.array()
                
            })
        }
        // User.findById('60034aa285985505800c9f97')
        User.findOne({email: email})
        .then(user => {
            // req.user = user
            if (!user) {
                return res.status(422).render('auth/login', {
                  path: '/login',
                  pageTitle: 'Login',
                  errorMessage: 'Invalid email or password.',
                  oldInput: {
                    email: email,
                    password: password
                  },
                  validationErrors: []
                });
              }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true
                        req.session.user = user
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/')
                        })
                    }
                    return res.status(422).render('auth/login', {
                        path: '/login',
                        pageTitle: 'Login',
                        errorMessage: 'Invalid email or password.',
                        oldInput: {
                          email: email,
                          password: password
                        },
                        validationErrors: []
                      })
                })
                .catch(err => {
                    console.log(err)
                    res.redirect('/login')
                    })
                })
            .catch(err => {
                const error = new Error(err)
                error.httpStatusCode = 500
                return next(error)
            })
    }

exports.postLogout = (req, res, next) => {
        req.session.destroy((err) => {
            console.log(err);
            res.redirect('/')
        })
        
    }

exports.getSignup = (req, res, next) => {
    let message = req.flash('error')
        res.render('auth/signup', {
          path: '/signup',
          pageTitle: 'Signup',
          errorMessage: message.length > 0 && message,
          oldInput : {
            email: '', 
            password: '',
            confirmPassword: ''
        },
        validationErrors: []
        //   isAuthenticated: false
        })
      }

exports.postSignup = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    // const confirmPassword = req.body.confirmPassword
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInput : {
                email: email, 
                password: password,
                confirmPassword: req.body.confirmPassword
            },
            validationErrors: errors.array()
          })
    }
    // User.findOne({email: email})
    //     .then(userDoc => {
    //         if(userDoc) {
    //             req.flash('error', 'E-Mail exists already, please pick a different one!')
    //             return res.redirect('/signup')
    //         }
        bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: email, 
                        password: hashedPassword,
                        cart: {items : []}
                    })
                    return user.save()
        
                })
                .then(result => {
                    res.redirect('/login')
                    // return transporter.sendMail({
                    //     to: email,
                    //     from: 'shop@node-complete.com',
                    //     subject: 'Signup succeeded!',
                    //     html: '<h1>You successfully signed up!</h1>'
                    // })
                    return sgMail.send({
                        to: email,
                        from: 'sting99998@gmail.com',
                        subject: 'Signup succeeded!',
                        html: '<h1>You successfully signed up!</h1>'
                    })
                    .then(() => {
                        console.log('Email sent');
                    })
                    .catch(err => {
                        console.log(err);
                    })
                })
                .catch(err => {
                    const error = new Error(err)
                    error.httpStatusCode = 500
                    return next(error)
                })
}

exports.getReset = (req, res, next) => {
    let message = req.flash('error')
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message.length > 0 && message
      //   isAuthenticated: false
      })
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset')
        }
        const token = buffer.toString('hex')
        User.findOne({email: req.body.email})
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with that email found.')
                    return res.redirect('/reset')
                }
                user.resetToken = token
                user.resetTokenExpiration = Date.now() + 3600000
                return user.save()
            })
            .then(result => {
                res.redirect('/')
                sgMail.send({
                    to: req.body.email,
                    from: 'sting99998@gmail.com',
                    subject: 'Password reset',
                    html: `
                        <p>You requested a password reset</p>
                        <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
                    `
                })
            })
            .catch(err => {
                const error = new Error(err)
                error.httpStatusCode = 500
                return next(error)
            })
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token
    User.findOne({resetToken: token,resetTokenExpiration: {$gt: Date.now()} })
        .then(user => {

        let message = req.flash('error')

        res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message.length > 0 && message,
        userId: user._id.toString(),
        passwordToken: token
      //   isAuthenticated: false
      })
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password
    const userId = req.body.userId
    const passwordToken = req.body.passwordToken
    let resetUser

    User.findOne({
        resetToken: passwordToken,
        resetTokenExpiration: {$gt: Date.now()},
        _id: userId
    })
    .then(user => {
        resetUser = user
        return bcrypt.hash(newPassword, 12)
    })
    .then(hashedPassword => {
        resetUser.password = hashedPassword
        resetUser.resetToken = undefined
        resetUser.resetTokenExpiration = undefined
        return resetUser.save()
    })
    .then(result => {
        res.redirect('/login')
    })
    .catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
    })

}