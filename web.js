var express = require("express");
var logfmt = require("logfmt");
var Handlebars = require("handlebars");
var exphbs = require('express3-handlebars')
var Firebase = require("firebase");
var _ = require('lodash')
var bodyParser = require("body-parser");
var GitHubApi = require("github");
var app = express();

var firebaseRoot = new Firebase("https://github-messages.firebaseio.com/");
var github = new GitHubApi({
    // required
    version: "3.0.0",
});

app.use(logfmt.requestLogger());
app.use(bodyParser.json());

app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(express.static(__dirname+"/public"));

app.get("/", function(req, res){
	// var RZMembers = /orgs/:org/members
	var context = {};//{members: };
	github.orgs.getMembers({org: "Raizlabs"}, function(err, items){
		if (err) {
			res.send(err);
		}

		var context = {members: items};
		res.render("body", context);
	});
});

app.get("/members", function(req, res){
	github.orgs.getMembers({org: "Raizlabs"}, function(err, items){
		if (err) {
			res.send(err);
		}

		var context = {members: items};
		res.render("members", _.extend(context, {layout: false}));
	});
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
	console.log("Listening on " + port);
});