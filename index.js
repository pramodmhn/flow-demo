var express = require('express')
var app = express()
const axios = require('axios');
const CircularJSON = require('circular-json');
var token='';
var weatherData = [];

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
require('dotenv').load();
app.get('/', function(request, response) {
  response.send('Hello World!')
})
app.get('/getweather', function(request, responsefromWeb) {
  axios.get('https://api.weather.gov/alerts/active/area/MN')
  .then(function (response) {
  	var datafromCall = response.data.features;
  	for(var x=0;x<datafromCall.length;x++){
  		var weatherItem = {
  			"keys":{
  				"id" : datafromCall[x].properties.id
  			},
  			"values":{
					"type": datafromCall[x].type,
					"response": datafromCall[x].properties.response,
                "event": datafromCall[x].properties.event
  			}
  		}
  		weatherData.push(weatherItem);
  	}
    responsefromWeb.send(response.data.features);
  })
  .catch(function (error) {
    console.log(error);
    responsefromWeb.send(error);
  });
})

/**MC Connect **/
app.get('/connecttoMC', function(request, responsefromWeb) {
    //console.log("test"+process.env.CLIENT_ID);
	var conData = {
        "grant_type": "client_credentials",
        "client_id": process.env.CLIENT_ID,
        "client_secret": process.env.CLIENT_SECRET,
        "account_id": "6391294"
    //'clientId': process.env.CLIENT_ID,
    //'clientSecret': process.env.CLIENT_SECRET  
  	}
    console.log("test"+conData.clientId);
	axios({
	  method:'post',
	  url:'https://mcpdwdml-zryw5dczwlf-f-f9kcm.auth.marketingcloudapis.com/v2/token',
	  data: conData,
	  headers:{
       'Content-Type': 'application/json',
	  }
	})
	  .then(function(response) {
	  	console.log(response);
	  		responsefromWeb.send('Authorization Sent');
	  		token = response.data.access_token;
	  	
	}).catch(function (error) {
	    console.log(error);
	    responsefromWeb.send(error);
	  });
})
/**get data from MC**/
app.get('/connecttoMCData', function(request, responsefromWeb) {
     //responsefromWeb.send(token);
	
    /*var weatherData = [
    {
        "keys":{
                "SubscriberKey": "pramod.maharjan.test@datarati.com.au"
                },
        "values":{
                "FirstName": "Pramod",
                "LastName": "Maharjan",
                "EmailAddress": "pramod.maharjan.test@datarati.com.au"
                }
    }];*/
    
	axios({
	    method: 'post',
	    url: 'https://mcpdwdml-zryw5dczwlf-f-f9kcm.rest.marketingcloudapis.com/hub/v1/dataevents/key:AB9E2BA8-B2A8-45CA-BEE7-0722977B90A6/rowset',
	    data: weatherData,
	    headers:{
	       'Authorization': 'Bearer ' + token,
	       'Content-Type': 'application/json',
	    }
	  })
	    .then(function(response) {
       var json = CircularJSON.stringify(response);
	      console.log(json);
	      responsefromWeb.send(json);
	     // responsefromWeb.send(response.data);
	  })
    .catch(function (error) {
			console.log(error);
		});
      
    
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})