const express = require('express')
const app = express()
const port = 3000

var bodyParser = require('body-parser')
var bcrypt = require('bcrypt')
var flash = require('connect-flash')
var session = require('express-session')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var func = require('./func')
var path = require('path')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

passport.use(new LocalStrategy(
  function(username, password, done) {
    func.findOne(username, function (err, user) {
      if (err) { return done(err) }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' })
      }
      bcrypt.compare(password, user.pass, function(err, res) {
        if (err) { console.error("Unable to compare hash.") }
        if (!res) { return done(null, false, { message: 'Incorrect password.' }) }
        return done(null, user)
      })
    })
  }
))

passport.serializeUser(function(user, done) {
  done(null, user.name)
})

passport.deserializeUser(function(username, done) {
  func.findOne(username, function(err, user) {
    done(err, user);
  })
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => res.render('index', { title: 'Main Page', user: req.user }))

app.get('/send', func.send)

app.get('/login', (req, res) => res.render('login', { title: 'Log In', user: req.user, message: req.flash('error') }))
app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }))

app.get('/signup', (req, res) => res.render('signup', { title: 'Sign Up', message: req.flash('error') }))
app.post('/signup', func.signup)

app.get('/logout', function(req, res) {
  req.logout()
  res.redirect('/')
})

app.listen(port, () => console.log(`Listening on port ${port}!`))
