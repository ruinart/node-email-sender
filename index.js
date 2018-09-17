const express = require('express')
const app = express()
const port = 3000

var send = require('./send');
var path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('index'))

app.get('/send', send.send)

app.listen(port, () => console.log(`Listening on port ${port}!`))
