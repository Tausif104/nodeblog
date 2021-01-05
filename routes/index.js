const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { ensureAuthenticated } = require('../config/auth')

// welcome route
router.get('/', (req, res) => {
    res.render('welcome')
})

// dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {
        name: req.user.name,
    })
})

router.get('/users', ensureAuthenticated, (req, res) => {
    User.find({}).exec((err, users) => {
        if (err) throw err
        res.render('users', { users: users })
    })
})

module.exports = router
