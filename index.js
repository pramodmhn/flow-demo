var express = require('express')
var app = express()
const axios = require('axios');

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.get('/getweather', function(request, responsefromWeb) {
  axios.get('https://api.weather.gov/alerts?active=1&state=MN')
  .then(function (response) {
    responsefromWeb.send(response.data.features);
  })
  .catch(function (error) {
    console.log(error);
    responsefromWeb.send(error);
  });
})

/**MC Connect **/
app.get('/connecttoMC', function(request, responsefromWeb) {
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
	  		responsefromWeb.send(response.data.access_token);
	  		token = response.data.access_token;
	  	
	}).catch(function (error) {
	    console.log(error);
	    responsefromWeb.send(error);
	  });
})
/**get data from MC**/
app.get('/connecttoMCData', function(request, responsefromWeb) {
     //responsefromWeb.send(token);
	
    var weatherData = [
    {
        "keys":{
                "SubscriberKey": "pramod.maharjan@datarati.com.au"
                },
        "values":{
                "FirstName": "Pramod",
                "LastName": "Maharjan",
                "EmailAddress": "pramod.maharjan@datarati.com.au"
                }
    }];
    
	axios({
	    method: 'post',
	    url: 'https://mcpdwdml-zryw5dczwlf-f-f9kcm.rest.marketingcloudapis.com/hub/v1/dataevents/key:E5B89F58-D93E-418F-9D70-07107E624936/rowset',
	    data: [
    {
        "keys":{
                "SubscriberKey": "pramod.maharjan2@datarati.com.au"
                },
        "values":{
                "FirstName": "Pramod",
                "LastName": "Maharjan",
                "EmailAddress": "pramod.maharjan2@datarati.com.au"
                }
    }],
	    headers:{
	       'Authorization': 'Bearer ' + token,
	       'Content-Type': 'application/json',
	    }
	  })
	    .then(function(response) {
        var json = CircularJSON.stringify(response);
	      console.log(json);
	      responsefromWeb.send(json);
	  });
      
    
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})