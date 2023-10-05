const http = require("http");

var connection = http.createServer(function(req,res)
{
	res.writeHead(200,{"Content-Type": "text/html","Access-Control-Allow-Origin":"*"
				,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false});
	res.write("<p>"+"Hello!"+"</p>");
	res.end();
	
});

connection.listen(process.env.PORT || 3035);
//require('dotenv').config();
