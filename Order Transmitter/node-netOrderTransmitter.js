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
	
  });
  
  c.on('data',(data)=>{ 
		let elemObj = {dataObj:JSON.parse(data.toString())};
		c.write(JSON.stringify(elemObj));
		console.log(JSON.parse(data.toString()));				
	});
  
  c.on('error',(err)=>
  { 
	console.log(err);
  });
  
});

server.on('error', (err) => {
  console.log(err.msg);
});

server.listen(3006, () => {
  console.log('server bound');
});