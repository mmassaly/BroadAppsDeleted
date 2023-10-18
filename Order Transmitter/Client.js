var http = require("http");
//var request = require("request");
const postData = JSON.stringify({
  'msg': 'Hello World!'
});

console.log(postData);
var reqOptions =
{
	hostname: "127.0.0.1",
	port:3006,
	method: "POST",
	path: "/",
	headers: 
	{
		'Content-Type': 'application/json',
		'Connection': 'Keep-Alive',
		'Keep-Alive': 'timeout = 14400000,max= 99999'
	}
};

let req = http.request(reqOptions,function(res)
{
	let data ="";

	res.on("data",function(chunk)
	{
		data += chunk;
	});
	res.on("end",function()
	{
		let reqObject = JSON.parse(data);
		console.log(reqObject.OK);
	});
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// write data to request body
req.write(postData);
req.end();