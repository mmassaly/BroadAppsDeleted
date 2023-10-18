const net = require('node:net');
let main = undefined;
require('dotenv').config();

const server = net.createServer((c) => {
  // 'connection' listener.
  let count = 0;
  let transmission = [];
  let transmission_count = 0;
  let setIntervalLocked = false;
  console.log('client connected');
  c.pipe(c);
  c.on('end', () => {
    console.log('client disconnected');
	if(main == c) 
	{
		main = undefined;
	}
	clearInterval(connectionInterval);
  });
  
  let connectionInterval = setInterval(function()
  {
	  if(transmission.length > 0)
	  {
		  while(setIntervalLocked);
			transmission.forEach((element)=> { 
				while((element.transmitted == false && element.transmitting));
				if(!element.transmitted)
				{
					element.transmitting = true;
					if(main != undefined)
					{
						main.write(JSON.write(element));
					}
					element.transmitting = false;
				}
			});
	  }
  }, 100);
  
  c.on('data',(data)=>{ 
	data = JSON.parse(data.toString());
	if(data.keyElement == process.env.keyElement && main == undefined && data.loggin)
	{
		main = c;
		main.write(JSON.stringify({loggedIn:true}));
	}
	else if(data.keyElement == process.env.keyElement && main != undefined && data.transmit)
	{
		let elemObj = {count:transmission_count++,transmitting:true,transmitted: false,dataObj:data.transmitData};
		main.write(JSON.stringify(elemObj));
		
		if(data.count == undefined)
		{
			transmission.push(elemObj);
		}
		else
		{
			let found = false;
			transmission.forEach((element)=> { 
				if(element.count == data.count)
				{
					found = true;
					break;
				}
			});
			
			if(!found)
			{
				transmission.push(elemObj);
			}
		}
		
		elemObj.transmitting = false;
	}
	else if(data.keyElement == process.env.keyElement && data.transmitted)
	{
		setIntervalLocked = true;
		let index = 0;
		transmission.forEach((element)=> { 
			if(element.count == data.count)
			{
				element.transmitted = true;
				break;
			}
			++index;
		});
		transmission.splice(index,1);
		setIntervalLocked = false;
	}
  });
  
  c.on('error',(err)=>
  { 
	  if(main == c) 
	  {
		  main = undefined;
	  }
	  clearInterval(connectionInterval);
  });
  
});

server.on('error', (err) => {
  console.log(err.msg);
});

server.listen(3006, () => {
  console.log('server bound');
});