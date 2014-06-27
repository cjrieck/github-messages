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
var firebaseMembers = new Firebase("https://github-messages.firebaseio.com/members");
var firebaseConversations = new Firebase("https://github-messages.firebaseio.com/conversations");
// console.log(firebaseMembers);

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
	var context = {};
	res.render("body", context);
});

app.get("/members", function(req, res){
	github.orgs.getMembers({org: "Raizlabs"}, function(err, items){
		if (err) {
			res.send(err);
		}

		firebaseMembers.set(items, function(err){
			if (err) {console.log(err)};
		});

		var context = {members: items};
		res.render("members", _.extend(context, {layout: false}));
	});
});

app.get("/conversation/:requester/:responder", function(req, res) {
	// req.params.requester
	var conversationName = req.params.requester+req.params.responder;
	firebaseConversations.child(conversationName).once('value', function(snapshot){
		if (snapshot.val() != null) {
			var context = snapshot.val();
			// res.send(context);
			// console.log("CONTEXT:");
			console.log(context);
			// var message = context["mesages"]["ic"]["m"];
			// context = {messages: message};
			res.render("messages", _.extend(context, {layout: false}));	

		}
		else {
			res.send("false");
		}
	});
});

app.post("/create/conversation/:requester/:responder", function(req, res) {
	// req.params.requester
	var conversationName = req.params.requester+req.params.responder;
	var firebaseUserConversation = new Firebase("https://github-messages.firebaseio.com/conversations/"+conversationName.toString());
	firebaseUserConversation.set({ messages: [{message: "Talk about anything!", avatar_url:"http://upload.wikimedia.org/wikipedia/commons/e/ec/Happy_smiley_face.png"}] } );
	res.send("created");
});

app.get("/populate/conversation/:requester/:responder", function(){
	var conversationName = req.params.requester+req.params.responder;
	var firebaseUserConversation = new Firebase("https://github-messages.firebaseio.com/conversations/"+conversationName.toString());

	var context = {};
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
	console.log("Listening on " + port);
});