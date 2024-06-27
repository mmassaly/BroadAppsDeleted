var http = require("http");
var https = require("https");
const fs = require('fs');
//let awaitres = await doPostHTTPRequest("serveur-de-pointage-de-msa.onrender.com",undefined,"command=vide");
var data = 
{
	fileName : "projects.txt",
	type: "getProjectsFile",
	obj:
	{
		ID:"1"
	}
};

async function currentLocal()
{
	let awaitres = await doPostHTTPRequest("localhost",3035,data,http);
	data.fileName = "employees.txt";
	awaitres = await doPostHTTPRequest("localhost",3035,data,http);
	data.fileName = "IDs.txt";
	awaitres = await doPostHTTPRequest("localhost",3035,data,http);
	data.fileName = "subadmins.txt";
	awaitres = await doPostHTTPRequest("localhost",3035,data,http);
	data.fileName = "localities.txt";
	awaitres = await doPostHTTPRequest("localhost",3035,data,http);
}

async function current()
{
	let awaitres = await doPostHTTPRequest("broadappsdeleted.onrender.com",undefined,data,https);
	data.fileName = "employees.txt";
	awaitres = await doPostHTTPRequest("broadappsdeleted.onrender.com",undefined,data,https);
	data.fileName = "IDs.txt";
	awaitres = await doPostHTTPRequest("broadappsdeleted.onrender.com",undefined,data,https);
	data.fileName = "subadmins.txt";
	awaitres = await doPostHTTPRequest("broadappsdeleted.onrender.com",undefined,data,https);
	data.fileName = "localities.txt";
	awaitres = await doPostHTTPRequest("broadappsdeleted.onrender.com",undefined,data,https);
}
current();
setInterval(current,60000);
async function doPostHTTPRequest(hostName,port,smth,http_s)
{
		return new Promise((resolve)=>{
			var postreqOptions =
			{
				hostname: hostName,
				port:port,
				method: "POST",
				path: "/themeBase",
				followRedirect:true,
				headers :
				{
					"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
					,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
					,"Access-Control-Max-Age":'86400'
					,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
				}
			};
			
			let req2 = http_s.request(postreqOptions,function(res)
			{
				let data = "";
				var index = 0;
				var fileString = smth.fileName;
				while(fs.existsSync(fileString))
				{
					++index;
					fileString = smth.fileName.split('.txt')[0]+index+".txt";
				}
				
				const writeStream = fs.createWriteStream(fileString);
				res.pipe(writeStream);
				writeStream.on('finish', () => {
					writeStream.close();
					console.log('Download Completed');
				});
				res.on("data",function(chunk)
				{
					data += chunk;
				});
				
				res.on("end",function()
				{
					//console.log(data);
					resolve(true);
					try
					{
						console.log(data);
					}
					catch(ex)
					{
						
					}
				}); 
			});
			
			req2.write(JSON.stringify(smth));
			req2.on('timeout',()=>{console.log("request is timed-out");});
			req2.on('error',(errdata)=>{ console.log(errdata);resolve(false);});
			req2.end();
		});
	}