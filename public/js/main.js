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

	initialize();
});