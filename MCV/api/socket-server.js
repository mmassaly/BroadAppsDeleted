var http = require("http");
var { Server } = require('socket.io');
var url = require("url");	
const connected_guys = {};

var server2 = http.createServer(function(req,res)
{
		console.log(req.method);
		console.log(req.url);
		
		if (req.method === 'OPTIONS') 
		{
			console.log('!OPTIONS');
			// IE8 does not allow domains to be specified, just the *
			//headers["Access-Control-Allow-Origin"] = req.headers.origin;
			res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
				,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
				,"Access-Control-Max-Age":'86400'
				,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
			});
			res.end();
		}
		else if(req.method === 'GET')
		{
			let reqUrl = url.parse(req.url,true);
			console.log(reqUrl.query);
			console.log(reqUrl.query.command);
			if(reqUrl.query.command)
			{
				if(reqUrl.query.command.update)
				{
					if(reqUrl.query.command.updateSpecific)
					{
						connected_guys[reqUrl.command.updateSpecific].socket.emit("askforupdate","from socket-server");
					}
					else if(reqUrl.query.command.updateALL)
					{
						Object.values(connected_guys).forEach((value)=>{ value.socket.emit("askforupdate","from socket-server");});
					}
				}
				else if(reqUrl.query.command == "updateALL")
				{
					console.log("Inside updateALL");
					console.log(connected_guys);
					Object.values(connected_guys).forEach(value => { 
						console.log(value);
						value.sockets.forEach( asocket => 
						{
							console.log(asocket)
							if(asocket)
							{
								console.log("Found a value to emit");
								asocket.emit("askforupdate","from socket-server");
							}
						});
					});
				}
			}
			res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
				,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
				,"Access-Control-Max-Age":'86400'
				,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
			});
			res.end();
		}
		else if (req.method == 'POST')
		{
			
			let result = res;
			let reqData = "";
			
			req.on("data",function(data)
			{
				reqData += data;
			}).on("end",()=>
			{
				console.log("At 3037")
			});
		}
	});
	
	const io = new Server(server2, {cors: {
		origin: "*",
		methods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ["X-Requested-With", "X-HTTP-Method-Override", "Content-Type", "Accept"]
	}});

	io.on("connection", (socket) => {
	  // ...
	  console.log("Hello Mamadou");
	  socket.emit('serverconnected',"Hello Mamadou!");
	  socket.emit("update","Hello Mamadou!");
	  socket.emit("updated","Hello Mamadou!");
	  
	  socket.on("json", (data) => {
		socket.emit('askforupdate',"Hello Mamadou!");
		console.log(data);
		let user = JSON.parse(data);
		console.log(user);
		if(!connected_guys[user.ID])
		{
			connected_guys[user.ID] = {};
		}
		
		if(connected_guys[user.ID].sockets)
		{
			connected_guys[user.ID].sockets.push(socket);
		}
		else
		{
			connected_guys[user.ID].sockets = [socket];
		}
		
		socket.on("disconnect",()=>
		{
			let result = Object.keys.find( el=>{ connectedguys[el].sockets.find( el2 => el2 == socket)});
			if(result)
			{
				connectedguys[result].sockets.splice(connectedguys[result].sockets.indexOf(socket),1);
			}
		});
		
	  });
	});
	server2.listen(3037)