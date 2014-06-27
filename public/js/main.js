$(function(){
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();

	$(".container").height(windowHeight);
	$(".container").width(windowWidth);

	// var chatRef = new Firebase('https://github-messages.firebaseio.com');
	// var auth = new FirebaseSimpleLogin(chatRef, function(error, user) {
	// 	if (error) {
	// 		// an error occurred while attempting login
	// 		console.log(error);
	// 	} 
	// 	// else if (user) {
	// 		// user authenticated with Firebase
	// 		// console.log('User ID: ' + user.uid + ', Provider: ' + user.provider);
	// 	else {
	// 		// user is logged out
	// 		auth.login("github");
	// 	}
	// });

	function initialize() 
	{
		$.ajax({
			type: "GET",
			url: "/members",
			success: function(data) {
				$(".member-names").html(data);
			},
			error: function(jqXHR, textStatus, errorThrown){
				console.log("bad: " + textStatus + ": " + errorThrown);
			}
		});
	}

	// function signIn() {
	// 	$.ajax({
	// 		type: "GET",
	// 		url: "/signin",
	// 		success: function() {
	// 			// show they're signed in
	// 		}
	// 		error: function(jqXHR, textStatus, errorThrown) {
	// 			console.log(errorThrown);
	// 		}
	// 	});
	// }

	// will return a boolean value corresponding to if the conversation between the
	// 2 people exist or not
	function checkConversationExists(name) {
		$.ajax({
			type: "GET",
			url: "/conversation/cjrieck/"+name, // change cjrieck to be dynamic
			success: function(data){
				if (data == "false") {
					createConversation(name);
				};
			},
			error: function(jqXHR, textStatus, errorMessage) {
				console.log(errorMessage);
			}
		});
	}

	function createConversation(name) {
		$.ajax({
			type: "POST",
			url: "/create/conversation/cjrieck/"+name, // change cjrieck to be dynamic
			success: function(data){
				checkConversationExists(name);
			},
			error: function(jqXHR, textStatus, errorMessage) {
				console.log(errorMessage);
			}
		});
	}

	// $(".signin").click(function(){
	// 	signIn();
	// });

	function getConversation() {
		$.ajax({
			type: "GET",
			url: ""
		});
	}

	$(document).on("click", ".person", function(e){
		var nameToChat = $(e.target).text();
		console.log(nameToChat);
		if ( checkConversationExists(nameToChat) ) {

		};
	});

	initialize();
});