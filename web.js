var express = require("express");
var logfmt = require("logfmt");
var Handlebars = require("handlebars");
var exphbs = require('express3-handlebars')
var firebase = require("firebase");
var _ = require('lodash')
var bodyParser = require("body-parser");
var app = express();

app.use(logfmt.requestLogger());
app.use(bodyParser.json());

app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(express.static(__dirname+"/public"));

app.get("/", function(req, res){
	var context = {};
	res.render("body", context);
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
	console.log("Listening on " + port);
});