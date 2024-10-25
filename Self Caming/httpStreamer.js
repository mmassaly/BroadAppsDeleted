	var http = require("http");
	var url = require("url");
	var fs = require("fs");
	var sessionLib = require("./SessionHandlerClass");
	var convertLib = require("./executewithffmpeg");
	var openAllDirrectoriesFsLib = require("./openAllDirrectoriesFs");
	let callIndex = 0;
	let currentValue = undefined;
	let masterPacket = 0;
	let session = new sessionLib.SessionHandlerClass(undefined);
	var multimediaClients = [];
	var multimediaClients2 = [];
	
	const { PassThrough} = require('node:stream');
	const pass = new PassThrough();
	const piped = [];
	const{ Server } = require("socket.io");

	
	var server = http.createServer(function(req,res)
	{
		//console.log(req.url);
		if (req.method === 'OPTIONS') 
		{
			//console.log('!OPTIONS');
			// IE8 does not allow domains to be specified, just the *
			//headers["Access-Control-Allow-Origin"] = req.headers.origin;
			res.writeHead(200, {"Access-Control-Allow-Origin":"*"
				,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
				,"Access-Control-Max-Age":'86400'
				,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
			});
			res.end();
		}
		if(req.method === 'GET')
		{
			console.log(req.method+" "+req.url);
			
			if(req.url == '/cam')
			{
				console.log(req.url);
				res.end();
			}
			else if( req.url == '/image' )
			{
				var reqObj = url.parse(req.url);
				//console.log(reqObj);				
				multimediaClients.push(res);
				console.log(req.url);
				return;
			}
			else if( req.url == '/sound' )
			{
				var reqObj = url.parse(req.url);
				//console.log(reqObj);
				multimediaClients2.push(res);
				console.log(req.url);
				return;
			}
		}
		
		if(req.method === 'POST')
		{
			console.log(req.method+" "+req.url);
			let reqDataStr = "";
			let chunks = [];
			let sessionObject = session.CreateSession("Streaming");
			let fileName = sessionObject.sessionName;
			++masterPacket;
			
			req.on('data',(data)=>
			{
				//console.log(typeof data);
				reqDataStr += data;
				chunks.push(data);
			}).on('end',()=>
			{
				//let urlObject = JSON.parse(reqDataStr);
				//console.log(reqDataStr);
				//console.log(req.headers);
				//console.log(typeof JSON.parse(reqDataStr));
				/*
					This does not work.
					FileOperations.saveFile(Buffer.concat(chunks),fileName,"video/mp4");//ex application/matroska
				*/
				//FileOperations.saveFileFs("./Captures",fileName,Buffer.concat(chunks),req.headers["content-type"]);// this works for matroska files for other mime types I have not applied
				//FileOperations.saveFileFs("./Captures",fileName,Buffer.concat(chunks),"webm");
				
				let chunksConcatenated = Buffer.concat(chunks);
				//multimediaClients.forEach(socket=> socket.write(chunksConcatenated
				//console.log(req.headers["content-type"]);
				//console.log( multimediaClients.length+" clients ");
				//console.log( multimediaClients.filter(res => res.writableEnded == false ).length+" clients ");
				let ares = res; 
				if(req.url == "/image")
				{
					console.log("Inside /image");
					const multimediaClientsb = multimediaClients;
					SendData(multimediaClientsb,chunksConcatenated,req);
					multimediaClients = multimediaClients.filter(res => res.writableEnded == false );
					console.log("Inside /image done");
				}
				
				if(req.url == "/sound")
				{
					console.log("Inside /sound");
					const multimediaClientsc = multimediaClients2;
					SendData(multimediaClientsc,chunksConcatenated,req);
					multimediaClients2 = multimediaClients2.filter(res => res.writableEnded == false );
					console.log("Inside /sound done");
				}
				
				
				res.writeHead(200,{"Content-Type":"text/plain","Access-Control-Allow-Origin":"*"
				,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
				,"Access-Control-Max-Age":'86400'
				,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
				res.write("All received!");
				res.end();
			});
		}
		
	});
	
	server.listen(3035);
	function SendData(multimediaClientsb,chunksConcatenated,req)
	{
		multimediaClientsb.forEach((ares,index)=> 
					{
						if(!ares.writableEnded)
						{
							/*if(piped.indexOf(ares) < 0 )
							{
								pass.pipe(ares);
								piped.push(ares);
							}
							pass.write(chunksConcatenated);*/
							
							//pass.resume();
							//"Content-Type":req.headers["content-type"]
							ares.writeHead(200,{"Content-Type":req.headers["content-type"],"Access-Control-Allow-Origin":"*"
							,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
							,"Access-Control-Max-Age":'86400'
							,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
							console.log("Response written to client no "+ (index+1) );
							ares.write(chunksConcatenated);
							//console.log(reqDataStr);
							//let object = JSON.parse(reqDataStr);
							//console.log(object);
							//ares.write(JSON.stringify(object));
							ares.end();
						}
					}
				);
	}
	class FileOperations 
	{
		used;
		static saveFile(content,fileName,mime)
		{
			while(used);
			let file = new File(chunks,fileName,{type:mime,endings:(mime =='text/plain')?transparent:undefined,lastModified:Date.now()});
			used = false;
		}
		
		static saveFileFs(dir,fileName,content,mime)
		{
			if(mime != undefined && mime.length > 0)
			{
				let mimeType = mime.split("/")[mime.split("/").length-1];
				if( mimeType.toLowerCase().indexOf("matroska") > -1 )
					mimeType = "mkv";
				if( mimeType.toLowerCase().indexOf("mp4") > -1 )
					mimeType = "mp4";
				
				fs.writeFile(dir+"/"+fileName+"."+mimeType,content,(err)=>
				{
					console.log(err);
				});
			}
		}
		
		static forceConversions()
		{
			fs.exists(__dirname+"/Captures",
			(res)=>
			{
				if(!res)
					fs.mkdir(__dirname+"/Captures",(err)=>
					{
						if(err)
							console.log(res);
						openAllDirrectoriesFsLib.start([__dirname+"/Captures"],FileOperations .conversionHandler);
					});
				else
					openAllDirrectoriesFsLib.start([__dirname+"/Captures"],FileOperations.conversionHandler);
			});	
		}
		
		static conversionHandler(fileName)
		{
			let newFileName = fileName.split(".")[0]+".mp4";
				fs.exists(__dirname+"\\Captures",
					(res)=>
					{
						if(!res)
						{
							fs.open(__dirname+"\\Captures",'w',(err,file)=>
							{
								if(err) 
									console.log(err);
								else
									convertLib.convert(__dirname+"\\Captures\\"+fileName,__dirname+"\\Captures\\"+newFileName);
							});
						}
						else
							convertLib.convert(__dirname+"\\Captures\\"+fileName,__dirname+"\\Captures\\"+newFileName);
					});
		}
		
	}
	
	var server2 = http.createServer(function(req,res)
	{
		console.log("Server 2");
		//console.log(res.socket);
		
			if( req.url == '/image' )
			{
				var reqObj = url.parse(req.url);
				//console.log(reqObj);				
				multimediaClients.push(res);
				console.log(req.url);
				return;
			}
			else if( req.url == '/sound' )
			{
				var reqObj = url.parse(req.url);
				//console.log(reqObj);
				multimediaClients2.push(res);
				console.log(req.url);
				return;
			}
		//res.socket.write("HTTP/1.1 200\r\n Content-Type: video/x-matroska;codecs=avc1,opus");
	});
	
	server2.listen(3016);
	