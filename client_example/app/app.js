$(document).ready( function() {
    app.initialized()
    .then(function(_client) {
      var client = _client;
      client.data.get("ticket").then (
          function(data) {
            var ticketID = data.ticket.id;
            $("#client_ticket_url").val(<link for the redirect url of client> + ticketID);
            $('#copy_status').hide();
            $("#btn_copy_client_ticket_url").on("click", function() {
               $('#copy_status').text("");
               $('#copy_status').show();
               $("#client_ticket_url").select();
               document.execCommand("copy");
               $('#copy_status').text("URL copied to clipboard!");
               $('#copy_status').fadeOut(2800);
           });

        },function(error) {

        });
  });
});
