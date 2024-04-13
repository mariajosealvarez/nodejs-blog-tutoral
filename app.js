require('dotenv').config();

// express servive
const express = require('express');
const expressLayout = require('express-ejs-layouts')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')

const connectDB = require('./server/config/db')
const { isActiveRoute } = require('./server/helpers/routeHelpers')

const app = express();
const PORT = 3000 || process.env.PORT;

// Connect to DB
connectDB();

// middleware to pass data after submit search form
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(methodOverride('_method'))

app.use(session({
  secret: 'keyboard cat',
  resave: 'false',
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  //cookie: { maxAge: new Date ( Date.now() + (3600000) ) }
}))

// create a public folder
app.use(express.static('public'))

// Template engine
app.use(expressLayout)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

app.locals.isActiveRoute = isActiveRoute

// routes
app.use('/', require('./server/routes/main'))
app.use('/', require('./server/routes/admin')) //admin route

// start the server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})

