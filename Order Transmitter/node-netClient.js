	const net = require('node:net');
	require('dotenv').config();
	let loggedIn = false;
	let connection = false;
	let processing = false;
	let client = undefined;
	let hostname = "localhost";

	function watch()
	{
		if(processing)
			return;
		if(connection == false)
		{
			processing = true;
			client = net.createConnection({ port: 3006 ,host:"localhost"}, () => {
			  // 'connect' listener.
			  console.log('connected to server!');
			  connection = true;
			  client.write(JSON.stringify({keyElement:process.env.keyElement,loggin:true}));
			});

			client.on('data', (data) => 
			{
				let responseData = JSON.parse(data.toString());
				if(responseData.loggedIn == true)
				{
					loggedIn = true;
					console.log("logged in to server");
				}
				else if(responseData.transmitting)
				{
					let both = responseData.dataObj;
					transmissionDoneRequest(both);
					dumpTransmittedRequest(both);
				}
			});

			client.on('error',(err)=>{  console.log("Connection abruptly interrupted"); connection = false; loggedIn = false; });
			client.on('end', () => 
			{
				connection = false;
				loggedIn = false;
				console.log('disconnected from server');
			}); 
			processing == false;
		}
	}

	function transmissionDoneRequest(object)
	{
		client.write(JSON.stringify({keyElement:process.env.keyElement,transmit:false,transmitted:true,transmitData:object}));
	}
	
	function sameServertransmissionRequest(object)
	{
		if(client != undefined)
		{
			client.write(JSON.stringify({keyElement:process.env.keyElement,transmit:true,transmitData:object}));
		}
	}

	function dumpTransmittedRequest(object) 
	{
		
	}
	
	setInterval(watch,300);

