var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var path = require('path');

app.use('/', routes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('port', (process.env.PORT || 5000));
app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "ejs");
app.set("views", "./views");

app.listen(app.get('port'), function() {
  console.log('Node app running on ', app.get('port'));
});
