$(document).ready(function() {
      $.ajax({
                type: 'POST',
                url: "https://api.twitter.com/oauth2/token",
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", "Basic " + "UDh2cFNkSENQdGNvbUdzR0wwWm5TcE9HdTpwdUthNDNQS0h4MmpYTW8zTVZ4M3FiQTh0WHJ3OExGNHBqWUNMRTI2SzRDTmRZSFlRdQo=");
                    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
                },
                data: 'grant_type=client_credential',
                processData:false,
                success: function (msg) {
                    callback(msg);
                    alert("It worked");
                }, error: function(msg) {
                    alert(msg);
                }
              });


  $('#Go').click(function() {
    var search_term = $("#search_term").val();
    var location = $("#location").val();
    var number = $("#number").val();
    var geocoder = new google.maps.Geocoder();
    if (geocoder) {
      geocoder.geocode({ 'address': location }, function (results, status) {
         if (status == google.maps.GeocoderStatus.OK) {
            console.log(results[0].geometry.location);
            alert(results[0].geometry.location);
         }
         else {
            console.log("Geocoding failed: " + status);
         }

      });
   }
  });
});