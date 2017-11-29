$(document).ready( function() {
  app.initialized()
  .then(function(_client) {
    var client = _client;
    var monkeykey = <monkeykey_key>; // monekey for key
    console.log("Dispatch AI App Started");

    client.data.get("ticket").then (
      function(data) {
        var ticketSubject = data.ticket.subject;
        var ticketDescription = data.ticket.description_text;
        var ticketgroupdId = data.ticket.custom_fields.group;

        if(ticketgroupdId == <group_id>){
          $(".classify_option_div").hide();
          $("#classify_classify").on("click", function() {
          var taskClassifierURL = <monkeykey_url>; // monekey for url with the specific classifier
          var jsonHeaders = {"Authorization": "Token " + monkeykey, "Content-Type": "application/json" };
          var jsonBody = { "text_list": [ String(ticketSubject) , String(ticketDescription)] };
          var options = { headers: jsonHeaders, body: JSON.stringify(jsonBody) };

          client.request.post(taskClassifierURL, options).then(
            function(data) {
              var classification = JSON.parse(data.response);
              $('#classify_info').html("<i><b>Subject = </b> " + classification.result[0][0].label + " <b> | Description = </b>" + classification.result[1][0].label+"</i>");
              var data_all = [String(ticketSubject),String(ticketDescription),classification];


              if( classification.result[0][0].label == classification.result[1][0].label ){
                $("#classify_classify").remove();
                $('#classify_button_div').html('<button type="button" class="btn btn-success" id="classify_correct">Correct</button>'+
                  '&nbsp;<button type="button" class="btn btn-danger" id="classify_wrong">Wrong</button>');
              }else{
                $("#classify_button_div").empty();
                $("#classify_classify").remove();
                $(".classify_option_div").show();
              }

              $("#classify_wrong").on("click", function() {
                $("#classify_info").empty();
                jQuery("#classify_classify").remove();
                $("#classify_button_div").empty();
                $(".classify_option_div").show();
              });

              $("#classify_correct").on("click", function() {
                $("#classify_info").empty();
                $("#classify_button_div").empty();
                $("#classify_info").html('<b>PLEASE RUN THE '+classification.result[0][0].label.toUpperCase()+' DISPATCH SCENARIO </b>');
                data_all.push(classification.result[0][0].label);
                output(data_all);
              });


              $("#classify_correct_type").on("click",function() {
                data_all.push(jQuery("#classify_options").val());
                output(data_all);
                $("#classify_info").empty();
                $("#classify_button_div").empty();
                $(".classify_option_div").hide();
                $("#classify_info").html('<b>SAVE</b>');
              });

              function output(data){
                var output_all = {
                  "subject":data[0],
                  "subject_classification":data[2].result[0][0].label,
                  "subject_confidence":data[2].result[0][0].probability,
                  "description":data[1],
                  "description_classification":data[2].result[1][0].label,
                  "description_confidence":data[2].result[1][0].probability,
                  "correct_classification":data[3]};

                  var zapUrl = <hooks.zapier>; //->catcher for hook
                  var jsonHeaders = { "Content-Type": "application/json" };
                  var jsonBody = { "text_list": output_all };
                  var options = {headers: jsonHeaders,body: JSON.stringify(jsonBody) };
                  client.request.post(zapUrl, options)
                  .done(function(){
                    console.log(JSON.stringify(jsonBody));
                  })
                  .fail(function(err){
                    console.log(err);
                  });
                }


              },
              function(error) {
                console.log(error)
              }
              );

          })
        }else{
          $('#dispatch_app').hide();
        }
      },
      function(error) {

      }
      );

});
});
