const net = require('node:net');
let prev = 0;

let start = new Date();
let hostname = "vercel-order-transmitter.vercel.app";

function watch()
{			
			try
			{
				connectiontoServer = net.createConnection({ port: 3010 ,host:hostname}, () => {
				  // 'connect' listener.
				  console.log('connected to server!');
				  prev = 0;
				});
				
				connectiontoServer.on('data', (data) => 
				{
					try
					{
						let receivedDataStr = data.toString();
						let receivedData = JSON.parse(receivedDataStr);
						//console.log(receivedData);
					}
					catch(ex)
					{
						//console.log(ex);
						//console.log(data.toString());
					}
				});

				connectiontoServer.on('error',(err)=>{ if ( Math.floor ((new Date()-start)/(1000*3)) > prev ) {console.log(err);console.log("Connection abruptly interrupted"); prev = Math.floor ((new Date()-start)/(1000*30));};setTimeout(watch,500);});
				connectiontoServer.on('end', () => 
				{
					console.log('disconnected from server');
					setTimeout(watch,500);
				});
			}catch(ex){console.log(ex);}
}
watch();
