var express = require('express');
var app = express();
const axios = require('axios');

require('dotenv').config()

app.set('port', (process.env.PORT || 5000));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public');

/*app.get('/', function(request, response) {
  var env = process.env.APP_ENV;
  if (env == 'staging') {
    var envName = 'staging'
  } else if (env == 'production') {
    var envName = 'production'
  } else {
    var envName = 'review app'
  }
  response.render('index.html', { env: envName});
});

*/

app.get('/', function(request, response) {
  response.send('Hello World1!')
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
    'clientId': process.env.CLIENT_ID,
    'clientSecret': process.env.CLIENT_SECRET  
  	}
	axios({
	  method:'post',
	  url:'https://auth.exacttargetapis.com/v1/requestToken',
	  data: conData,
	  headers:{
       'Content-Type': 'application/json',
	  }
	})
	  .then(function(response) {
	  	console.log(response);
	  		responsefromWeb.send('Authorization Sent');
	  		token = response.data.accessToken;
	  	
	}).catch(function (error) {
	    console.log(error);
	    responsefromWeb.send(error);
	  });
})


app.listen(app.get('port'), function() {
  console.log("Node app running at localhost:" + app.get('port'));
});

module.exports = app
