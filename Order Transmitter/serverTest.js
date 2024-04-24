var http = require("http");
var requestCount = 0;
var server = http.createServer(function(req,res)
{
	let reqData = "";
	let reqObject;
	++requestCount;
	req.on("data",function(data)
	{
		reqData += data;
	}).on("end",()=>
	{
		//reqObject = JSON.parse(reqData);
		let body = longString(1048576);
		res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
		,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
		,"Access-Control-Max-Age":'86400'
		,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept","Content-Length": Buffer.byteLength(body)
		});
		
		res.socket.write(JSON.stringify(body));
		
	});
	
});


function longString(length)
{
	let value = 0;
	let content = "";
	while( value < length)
	{
		content += String.fromCharCode (  66 + Math.floor( Math.random() * 60  )  );
		++value;
	}
	return content;
}
server.listen(3038);