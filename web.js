var express = require("express");
var logfmt = require("logfmt");
var Handlebars = require("handlebars");
var exphbs = require('express3-handlebars')
var Firebase = require("firebase");
var _ = require('lodash')
var bodyParser = require("body-parser");
var GitHubApi = require("github");
var Github = require("github-api");
var app = express();

var firebaseRoot = new Firebase("https://github-messages.firebaseio.com/");
var firebaseMembers = new Firebase("https://github-messages.firebaseio.com/members");
var firebaseConversations = new Firebase("https://github-messages.firebaseio.com/conversations");
// console.log(firebaseMembers);

var github = new GitHubApi({
    // required
    version: "3.0.0",
});

var gitHubUser;
var newUser;
var username;

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
	res.send(conversationName);
});

app.get("/populate/conversation/:requester/:responder", function(){
	var conversationName = req.params.requester+req.params.responder;
	var firebaseUserConversation = new Firebase("https://github-messages.firebaseio.com/conversations/"+conversationName.toString());

	var context = {};
});

app.get("/repos", function(req, res){
	if (gitHubUser) {
		var user = gitHubUser.getUser();
		var repos = user.orgRepos("Raizlabs", function(err, repos){
			if (err) {res.send(err)};
			res.send(repos);
		});
	};
});

app.post("/issue/:repo", function(req, res){
	var reponame = req.params.repo;
	var repo = gitHubUser.getRepo(username, reponame);


});

app.post("/message/:msgbody/:session", function(req, res){
	var messageBody = req.params.msgbody;
	var conversation = req.params.session;

	console.log(messageBody);
	
	firebaseConversations.child(conversation).child("messages").push({message: messageBody, avatar_url: "https://avatars.githubusercontent.com/u/1785533?"}, function(err){
		if (err) {console.log(err)};

		firebaseConversations.child(conversation).once('value', function(snapshot){
			if (snapshot.val() != null) {
				var context = snapshot.val();
				
				console.log(context);
			
				res.render("messages", _.extend(context, {layout: false}));	

			}
			else {
				res.send("false");
			}
		});
	});
});

app.get("/auth/:user/:pwd", function(req, res){
	username = req.params.user;
	var pwd = req.params.pwd;

	// console.log(user);

	gitHubUser = new Github({
		username: username,
		password: pwd,
		auth: "basic"
	});

	newUser = gitHubUser.getUser();
	console.log(newUser);
	res.send(username);
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
	console.log("Listening on " + port);
});