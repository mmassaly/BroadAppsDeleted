var http = require("http");
var url = require("url");
var fs = require("fs");
var http = require("http");
var joinPageContent = undefined;
var sessionPageContent = undefined;
var server = undefined;

fs.readFile("join-server.html",function(err,data)
{
	server = http.createServer(function(req,res)
	{
		if( !err )
		{
			console.log(req.url);
			console.log(req.domain);
			console.log(req.port);
			joinPageContent = data;
			sessionPageContent = fs.readFileSync("create-session.html");
			
			if (req.method === 'OPTIONS') 
			{
				//console.log('!OPTIONS');
				// IE8 does not allow domains to be specified, just the *
				//headers["Access-Control-Allow-Origin"] = req.headers.origin;
				res.writeHead(200,{"Content-Type":'text/html',"Access-Control-Allow-Origin":"*"
					,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
					,"Access-Control-Max-Age":'86400'
					,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
				});
				res.end();
			}
			
			if(req.method === 'GET')
			{
				res.writeHead(200,{"Content-Type":'text/html',"Access-Control-Allow-Origin":"*"
					,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
					,"Access-Control-Max-Age":'86400'
					,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
				});
				res.write((req.url =="/joindre")?joinPageContent:((req.url =="/session")? sessionPageContent:"<p>Service pas pris en compte</p>"));
				res.end();
			}
			
		}
	});
	
	server.listen(3034);
});	

 