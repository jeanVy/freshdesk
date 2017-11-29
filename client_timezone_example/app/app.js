$(document).ready( function() {
  app.initialized()
  .then(function(_client) {
    var client = _client;

    client.data.get("ticket").then(function(data){
        var id = data.ticket.id;
        client.iparams.get().then (
        function(data) {
            var frsh_key = data.freshKey;
            var api_key = data.APIKey;
          $.ajax({
           url: 'https://<freshdesk_url>/api/v2/tickets/'+id+'?include=requester',
           headers: {
               'Authorization':"Basic " + btoa(frsh_key + ":"),
           },
           method: 'GET',
           dataType: 'json',
           success: function(data){
             requesterID = data.requester.id;
         }
           }).done(function(){
            $.ajax({
             url: 'https://<freshdesk_url>/api/v2/contacts/'+requesterID,
             headers: {
                 'Authorization':"Basic " + btoa(frsh_key + ":"),
             },
             method: 'GET',
             dataType: 'json',
             success: function(data){
              console.log(data);
              requesterTimezone = data.time_zone;
              console.log(requesterTimezone)

              switch (requesterTimezone) {
                case "Pacific Time (US & Canada)":
                requesterTimezone = "Los Angeles";
                break;
                case "Mountain Time (US & Canada)":
                requesterTimezone = "Denver";
                break;
                case "Eastern Time (US & Canada)":
                requesterTimezone = "New York";
                break;
                case "Atlantic Time (Canada)":
                requesterTimezone = "Quebec";
                break;
                case "UTC":
                requesterTimezone = "Dublin";
                break;
            } 

            var weatherAPIXU = "https://api.apixu.com/v1/current.json?key="+api_key+"&q=" + requesterTimezone;
            var options = {};


            client.request.post(weatherAPIXU, options).then(
                function(data) {
                    var obj = JSON.parse(data.response);


                    function formatdate(input) {
                        var d = new Date(Date.parse(input.replace(/-/g, "/")));
                        var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        var day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        var date = day[d.getDay()] + ", " + month[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
                        return date;  
                    }
                    function formattime(input) {
                        var d = new Date(input);
                        var hours = d.getHours();
                        var minutes = d.getMinutes();
                        var ampm = hours >= 12 ? 'PM' : 'AM';
                        hours = hours % 12;
                        hours = hours ? hours : 12; 
                        minutes = minutes < 10 ? '0'+minutes : minutes;
                        var strTime = hours + ':' + minutes + ' ' + ampm;
                        var local_utc = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDay(),d.getHours(), d.getMinutes(), d.getSeconds()));  
                        var localtime = new Date(local_utc.getTime() + d.getTimezoneOffset() * 60000);
                        var rightnow = new Date();
                        var nowtime = new Date(rightnow.getTime() + d.getTimezoneOffset()* 60000);

                        return strTime;
                    }

                    $('#timezone_local_date').append(formatdate(obj.location.localtime));
                    $('#timezone_local_time').append(formattime(obj.location.localtime));
                    $('#timezone_local_city').append(obj.location.name);

                })
            }
         })  
        });
       },
       function(error) {
          console.log(error);
      }
      );

    },function(error) {

    }
    );

});

});
