let http = require("http");
//vercel-order-transmitter-bpvj7yzxo-massalymamadou-gmailcom.vercel.app
//vercel-order-transmitter.vercel.app	
function repeat(){
	let req = http.request({hostname:"vercel-order-transmitter.vercel.app",mode: "cors",redirect: "follow",path:"/test",method: 'POST',
	headers:{'Content-Type':'application/json'}},
	(res)=>{ let data = ""; 
	res.on('data',(str)=> {data += str;}); 
	res.on('end',()=>{ console.log(data);console.log(data)}); 
	 } ); req.on('error',(err)=>{console.log("error with request "+err);}); req.end();
}

/*repeat();//this can't reach server 
setTimeout(repeat,1000);*/

async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
	redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  
  
  return response.json();
}

try
{
	postData("https://vercel-order-transmitter.vercel.app", { url: "/test", answer: 42 }).then((data) => {
		  console.log(data); // JSON data parsed by `data.json()` call
	});
}
catch(ex)
{
		
}