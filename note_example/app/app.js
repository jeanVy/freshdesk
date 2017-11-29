$(document).ready( function() {
	app.initialized()
	.then(function(_client) {
		var client = _client;

		client.data.get("ticket").then (
			function(data) {
				if(data.ticket.custom_fields.company == "Announcement"){
					client.interface.trigger("showNotify", {type: "danger", message: "Account Notice: Testing"})
					$("#apptext2").hide()
				} else {
					client.interface.trigger("showNotify", {type: "info", message: "testing"})
					$("#apptext").hide()
				}
			},
			function(error) {
				console.log(error)
			}
			);
	});

});
