exports.send = function (req, res) {
  var nodemailer = require('nodemailer')
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'email.sender184@gmail.com',
      pass: 'xxxxxxxx'
    }
  })
  var mailOptions = {
    from: 'email.sender.184@gmail.com',
    to: 'cenouy@gmail.com,' + req.query.email,
    subject: 'info',
    text: 'Name:\n' + req.query.username + '\n\nEmail:\n' + req.query.email + '\n\nFavorite Studio:\n' + req.query.content
  }
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  })
  var sqlite3 = require('sqlite3').verbose()
  var db = new sqlite3.Database('./user.db')
  db.run('UPDATE user SET count = count + 1 WHERE name = ?', req.user.name)
  db.close()
  req.user.count++
  res.render('results', {msg: req.query, user: req.user})
}

exports.signup = function(req, res) {
  var bcrypt = require('bcrypt')
  const saltRounds = 10
  var sqlite3 = require('sqlite3').verbose()
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    if (err) { console.error("Unable to hash password.") }
    var db = new sqlite3.Database('./user.db')
    db.run("INSERT INTO user VALUES (?, ?, 0)", [req.body.username, hash], function(err) {
      if (err) {
        req.flash('error', 'Username already exists.')
        res.redirect('/signup')
      } else {
        res.redirect('/login')
      }
    })
    db.close()
  })
}

exports.findOne = function(username, callback) {
  var sqlite3 = require('sqlite3').verbose()
  var db = new sqlite3.Database('./user.db')
  db.get('SELECT * FROM user WHERE name = ?', username, function(err, row) {
    if (err) { console.error("Unable to query.") }
    else { return callback(null, row) }
  })
}
