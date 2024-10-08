var http = require("http");
var { Server } = require('socket.io');
var url = require("url");	
const connected_guys = {};
var fs = require("fs");
var callIndex = 0;

var server2 = http.createServer(function(req,res)
{
		console.log("Hello.....\nWelcome!");
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
					//console.log(connected_guys);
					Object.values(connected_guys).forEach(value => { 
						//console.log(value);
						value.sockets.forEach( asocket => 
						{
							if(asocket)
							{
								console.log("Found a value to emit");
								asocket.emit("askforupdate","from socket-server");
							}
						});
					});
				}
			}
			
			var returnValid = false;
			callIndex++;
			//console.log("Call index is "+callIndex);
			var imageType = "";
			if(req.url.endsWith(".jpeg"))
				imageType = "jpeg";
			if(req.url.endsWith(".png"))
				imageType = "png";
			if(req.url.endsWith(".jpg"))
				imageType = "jpg";
			
			if(req.url.endsWith(".jpeg") ||req.url.endsWith(".png") || req.url.endsWith(".jpg") || req.url.endsWith(".ico"))
			{
				returnValid = true;
				var imageUrlReprocessed = req.url.substring(1,req.url.length).replaceAll("%20"," ");
				imageUrlReprocessed = decodeURI(imageUrlReprocessed);
				console.log("You bot are making an image request processed to be "+imageUrlReprocessed);
				
				let responseb = res;
				fs.exists(imageUrlReprocessed,async function(exists)
				{
					//console.log("exists = "+exists);
					if(exists)
					{
						fs.readFile(imageUrlReprocessed,function(err,data)
						{
							if(err)
							{
								//console.log(err);
								responseb.end();
							}
							else if(data)
							{
								responseb.writeHeader(200,{"Content-Type":"image/"+imageType});
								responseb.write(data);
								responseb.end();
							}
						});
					}
					else
					{
						try
						{
							
							imageDictionary.findUrlBufferValue("https://msa-pointage-server.onrender.com/"+imageUrlReprocessed).then((result)=>{
								responseb.writeHeader(200,{"Content-Type":"image/"+imageType});
								console.log(result);
								responseb.write(result);
								responseb.end();
							}
							,(err)=>
							{
								responseb.writeHeader(200,{"Content-Type":"image/"+imageType});
								console.log(err);
								responseb.write(err);
								responseb.end();
							});
						}
						catch(ex)
						{
							console.log(ex);
							responseb.end();
						}
						
						//console.log("Image file does not exist.");
					}
				});
			}
			else
			{
				console.log("Down here...");
				console.log(req.url);
				if(req.url.endsWith("MCV"))
				{
					//console.log("Before MCV file"); 
					returnValid = true;
					fs.readFile("SelfDescription.htm",function(err,data)
					{
						if(data != undefined)
						{
							res.writeHeader(200,{"Content-Type":"text/html"});
							res.write(data);
							res.end();
						}
						else if(err != undefined)
						{
							res.writeHeader(200,{"Content-Type":"text/html"});
							res.end();
						}
					});
				}
				else if(req.url.endsWith("Download/pointage-apk"))
				{
					returnValid = true;
					console.log("inside Download");
					let resb = res;
					fs.readFile("File/app-pointage-msa.apk",(error,data)=>
					{
						if(error)
						{
							console.log(error);
							resb.writeHead(500,{"Content-Type":"application/vnd.android.package-archive"});
							resb.end();
						}
						else
						{
							console.log(data);
							resb.writeHead(200,{"Content-Type":"application/vnd.android.package-archive"});
							resb.write(data);
							resb.end();
							console.log("Done sending apk...");
						}
					});
				}
				
			}
			
			if(returnValid != true )
			{
				res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
					,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
					,"Access-Control-Max-Age":'86400'
					,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
				});
				res.write(JSON.stringify({PASSED:true}));
				res.end();
			}
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
				console.log("At 3037");
			});
		}
		else
		{
			res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
				,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
				,"Access-Control-Max-Age":'86400'
				,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
			});
			res.end();
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
			if( connected_guys[user.ID].sockets.indexOf(socket) < 0 )
				connected_guys[user.ID].sockets.push(socket);
		}
		else
		{
			connected_guys[user.ID].sockets = [socket];
		}
		
		socket.on("disconnect",()=>
		{
			let result = Object.keys(connected_guys).find( el=>{ connected_guys[el].sockets.find( el2 => el2 == socket)});
			console.log("A client disconnected");
			if(result)
			{
				console.log(result +"disconnected");
				connected_guys[result].sockets.splice(connected_guys[result].sockets.indexOf(socket),1);
			}
		});
		
	  });
	});
	server2.listen(3037);
	
	setInterval( () =>
	{
		Object.keys(connected_guys).forEach( key => 
		{
			connected_guys[key].sockets.forEach(sockEl=>
			{
				if(sockEl.connected)
				{
					sockEl.emit("per 3000ms event","Hello client");
				}
			});;
		});
	},3000);