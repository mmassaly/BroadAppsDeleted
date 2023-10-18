var http = require("http");
//var request = require("request");
const postData = JSON.stringify({
  'msg': 'Hello World!'
});

var reqOptions =
{
	hostname: "127.0.0.1",
	port:3006,
	method: "CONNECT",
	path: "/",
	headers: 
	{
		'Content-Type': 'application/json',
		'Content-Length': Buffer.byteLength(postData),
		/* ,
		'Connection': 'Upgrade',
		'Upgrade': 'websocket' */
	}
	 
};

let req = http.request(reqOptions,function(res)
{
	
	let odata ="";
	
	req.on('connect',function(res,socket, head)
	{
		
		console.log("Connected");
		socket.on("data",function(chunk)
		{
			odata += chunk;
		});
		
		socket.on("end",function()
		{
			odata ="";
			console.log("Change detected by socket");
			let reqObject = JSON.parse(odata);
			console.log(reqObject.OK);
		});
		
	});
	
	let data = "";
	res.on("data",function(chunk)
	{
		data += chunk;
	});
	
	res.on("end",function()
	{
		let reqObject = JSON.parse(data);
		console.log("Change detected by http");
		console.log(reqObject.OK);
	}); 
});


req.write(postData);
req.end();



/* 
let data ="";

req.on('connect',function(res,socket, head)
{
	
	console.log("Connected");
	socket.on("data",function(chunk)
	{
		data += chunk;
	});
	
	socket.on("end",function()
	{
		data ="";
		let reqObject = JSON.parse(data);
		console.log(reqObject.OK);
	});
	
});
 */

req.on('information', (info) => {
  console.log(`Got information prior to main response: ${info.statusCode}`);
}); 



// write data to request body
