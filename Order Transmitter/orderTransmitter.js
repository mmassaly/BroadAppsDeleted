var http = require("http");
let requestCount = 0;

var server = http.createServer(function(req,res)
{
	console.log("Request no "+ ++requestCount);
	let reqData = "";
	let reqObject;
	req.on("data",function(data)
	{
		reqData += data;
	}).on("end",()=>
	{
		reqObject = JSON.parse(reqData);
		res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
		,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
		,"Access-Control-Max-Age":'86400'
		,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
		});
		res.write(JSON.stringify({OK:"Request no "+requestCount+" passed."}));
		res.end();
		res.write(JSON.stringify({OK:"Request no "+requestCount+" passed. Two"}));
	});
});

var server2 = http.createServer(function(req,res)
{
	
});

/* server.on('upgrade',function(req, socket, head)
{
	console.log(JSON.stringify({OK:"Request no but through sockets option"+requestCount+" passed."}));
	socket.write(JSON.stringify({OK:"Request no but through sockets option"+requestCount+" passed."}));
	socket.pipe(socket); // echo back
	console.log("Done");
	setInterval(function()
	{
		console.log(JSON.stringify({OK:"Request no but through sockets option "+requestCount+" passed."}));
		socket.write(JSON.stringify({OK:"Request no but through sockets option "+requestCount+" passed."}));
	},2000);
	
});
*/

server2.on('connect',function(req, socket, head)
{
	console.log(req.url)
	console.log("Connect accepted");
	console.log(JSON.stringify({OK:"Request no but through sockets option "+requestCount+" passed."}));
	socket.write("HTTP/1.1 200\r\n Content-Type: application/json");
	//socket.write(JSON.stringify({OK:"Request no but through sockets option "+requestCount+" passed."}));
	//socket.pipe(socket); // echo back
	//req.socket.pipe(socket);
	console.log("Done");
	setInterval(function()
	{
		console.log(JSON.stringify({OK:"Request no but through sockets option "+requestCount+" passed."}));
		socket.write(JSON.stringify({OK:"Request no but through sockets option "+requestCount+" passed."}));
	},2000);
	
}); 
server2.listen(3016);