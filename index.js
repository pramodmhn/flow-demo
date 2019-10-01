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
	  		responsefromWeb.send(response.data.accessToken);
	  		token = response.data.accessToken;
	  	
	}).catch(function (error) {
	    console.log(error);
	    responsefromWeb.send(error);
	  });
})
/**get data from MC**/
app.get('/connecttoMCData', function(request, responsefromWeb) {
	
	axios({
	    method: 'post',
	    url: 'https://mcpdwdml-zryw5dczwlf-f-f9kcm.rest.marketingcloudapis.com/hub/v1/dataevents/key:weatherdataextension/rowset',
	    data: weatherData,
	    headers:{
	       'Authorization': 'Bearer ' + token,
	       'Content-Type': 'application/json',
	    }
	  })
	    .then(function(response) {
	      console.log(response);
	      responsefromWeb.send(response);
	  });
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})