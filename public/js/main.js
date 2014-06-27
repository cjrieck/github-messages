$(function(){
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();

	$(".container").height(windowHeight);
	$(".container").width(windowWidth);

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

	// will return a boolean value corresponding to if the conversation between the
	// 2 people exist or not
	function checkConversationExists(name) {
		$.ajax({
			type: "GET",
			url: "/conversation/cjrieck/"+name, // change cjrieck to be dynamic
			success: function(data){
				if (data == "false") {
					createConversation(name);
				}
				else {
					console.log(data);
					$(".chat-area").css("background-color", "#fff");
					$(".message-area").html(data);
				}
			},
			error: function(jqXHR, textStatus, errorMessage) {
				console.log(textStatus +", "+errorMessage.toString());
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

	function populateChat(name) {
		$.ajax({
			type: "GET",
			url: "/populate/conversation/cjrieck/"+name, // change cjrieck to be dynamic
			success: function(data){
				// populate chat
				$(".message_area").html(data);
			},
			error: function(jqXHR, textStatus, errorMessage) {
				console.log(errorMessage);
			}
		});
	}

	function getRepos() {
		$.ajax({
			type: "GET",
			url: "/repos",
			success: function (data) {
				console.log(data);
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.log(errorThrown);
			}
		});
	}

	function getConversation() {
		$.ajax({
			type: "GET",
			url: ""
		});
	}

	$(document).on("click", ".signin", function(e){
		$(".signin-prompt").removeClass("hidden");
	});

	$(document).on("click", ".signin-btn", function(e){
		$(".signin-prompt").removeClass("hidden");
	});

	$(document).on("click", ".issue-name", function(e){
		var option = $(e.target).text();
		if (option == "Create Issue") {
			getRepos();
		};
	});

	$(document).on("click", ".person", function(e){
		var nameToChat = $(e.target).text();
		console.log(nameToChat);
		if ( checkConversationExists(nameToChat) ) {

		};
	});

	initialize();
});