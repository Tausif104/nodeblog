const express = require('express')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

// initialize exxpress app
const app = express()

require('./config/passport')(passport)

// view engine
app.set('view engine', 'ejs')

// Bodyparser
app.use(express.urlencoded({ extended: false }))

app.use(express.json())

// public static folder
app.use(express.static('public'))

// db uri
const db = require('./config/db').MongoUri

// connect with DB
mongoose
    .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log(`MongoDB Connected`))
    .catch((err) => console.log(err))

// express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
)

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// connect flash
app.use(flash())

// global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

// routes
app.use('/', require('./routes/index'))
app.use('/', require('./routes/users'))

// port
const PORT = process.env.PORT || 5000

// server listening
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
