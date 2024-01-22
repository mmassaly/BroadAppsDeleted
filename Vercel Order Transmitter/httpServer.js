	const http = require('http');
	
	const httpServer = http.createServer((request,result)=>
	{
		let dataStr = '';
		if (request.method === 'OPTIONS') 
		{
			console.log('!OPTIONS');
			// IE8 does not allow domains to be specified, just the *
			//headers["Access-Control-Allow-Origin"] = req.headers.origin;
			result.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
				,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
				,"Access-Control-Max-Age":'86400'
				,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
			});
			result.end();
		}	
		if(request.method == 'POST')
		{
			if(request.url == '/form')
			{
				console.log(request);
			}
			else
			{
				request.on('data',(content)=>
				{
					dataStr += content;
				});
				request.on('end',()=>
				{
					console.log(dataStr);
					
				})
			}
		}
		else if(request.method == 'GET')
		{
			result.end();
		}
	});
	
	httpServer.on('connect', (req, clientSocket, head) => {
  // Connect to an origin server
		
	});
	
	httpServer.listen(3014);