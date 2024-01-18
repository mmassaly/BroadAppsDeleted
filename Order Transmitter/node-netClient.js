	const net = require('node:net');
	const http = require('http');
	require('dotenv').config();
	let client = undefined;
	let hostname = "localhost";
	
	function watch()
	{
			client = net.createConnection({ port: 3006 ,host:hostname}, () => {
			  // 'connect' listener.
			  console.log('connected to server!');
			  client.write(JSON.stringify({keyElement:process.env.keyElement,text:"Hello server"}));
			});

			client.on('data', (data) => 
			{
				let receivedData = JSON.parse(data.toString());
				console.log(receivedData);
			});

			client.on('error',(err)=>{  console.log("Connection abruptly interrupted");client.close();watch();});
			client.on('end', () => 
			{
				console.log('disconnected from server');
				watch();
			}); 
	}
	watch();

	