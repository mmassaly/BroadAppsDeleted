let http = require("http");
//vercel-order-transmitter-bpvj7yzxo-massalymamadou-gmailcom.vercel.app
//vercel-order-transmitter.vercel.app	
function repeat()
{
	let req = http.request({hostname:"localhost",port:3008,mode: "cors",redirect: "follow",path:"/test",method: 'POST',
	headers:{'Content-Type':'application/json'}},
	(res)=>{ let data = ""; 
	res.on('data',(str)=> {data += str; console.log(str.length);/*console.log(str)*/;}); 
	res.on('end',()=>{ /*console.log(data);console.log(data)*/}); 
	 } ); req.on('error',(err)=>{console.log("error with request "+err);});
	 req.write(JSON.stringify({OK:"element"})); req.end();
	
}

repeat();

