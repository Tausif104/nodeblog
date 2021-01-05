const express = require('express')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const User = require('../models/User')
const router = express.Router()

// @GET register route
router.get('/register', (req, res) => {
    res.render('register')
})

// @POST register route
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body
    let errors = []
    // check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' })
    }

    // macthing passwords
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' })
    }

    // check pass length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' })
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2,
        })
    } else {
        // validation pass
        User.findOne({ email: email }).then((user) => {
            if (user) {
                errors.push({ msg: 'Email is already registered' })
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2,
                })
            } else {
                const newUser = new User({
                    name,
                    email,
                    password,
                })

                // hash password
                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err
                        // set password to hashed
                        newUser.password = hash

                        // save user
                        newUser
                            .save()
                            .then((user) => {
                                req.flash(
                                    'success_msg',
                                    'You are now registered and can log in'
                                )
                                res.redirect('/login')
                            })
                            .catch((err) => console.log(err))
                    })
                )
            }
        })
    }
})

// @GET login route
router.get('/login', (req, res) => {
    res.render('login')
})

// @POST login route
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true,
    })(req, res, next)
})

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'You are logged out')
    res.redirect('/login')
})

module.exports = router