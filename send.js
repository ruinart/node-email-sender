exports.send = function (req, res) {
  var nodemailer = require('nodemailer');
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'email.sender184@gmail.com',
      pass: 'xxxxxxxx'
    }
  });
  var mailOptions = {
    from: 'email.sender.184@gmail.com',
    to: 'cenouy@gmail.com,' + req.query.email,
    subject: 'info',
    text: 'Name:\n' + req.query.username + '\n\nEmail:\n' + req.query.email + '\n\nFavorite Studio:\n' + req.query.content
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  res.render('results', {msg: req.query})
}
