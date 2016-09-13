var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var path = require('path');

app.use('/', routes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "ejs");
app.set("views", "./views");

app.listen(3000);
