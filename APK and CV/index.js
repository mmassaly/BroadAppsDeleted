	var http = require("http");
	var url = require("url");
	
	
	
	var server = http.createServer(function(req,res)
	{
		console.log(req.method);
		//console.log(req.url);
		
		if (req.method === 'OPTIONS') 
		{
			console.log('!OPTIONS');
			// IE8 does not allow domains to be specified, just the *
			//headers["Access-Control-Allow-Origin"] = req.headers.origin;
			res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
				,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
				,"Access-Control-Max-Age":'86400'
				,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
			});
			res.end();
		}
		else if(req.method === 'GET')
		{
			//console.log("Inside request method "+req.method);
			//console.log(req.url);
			//console.log(req.method);
			//console.log(url.parse(req.url));
			callIndex++;
			//console.log("Call index is "+callIndex);
			var imageType = "";
			if(req.url.endsWith(".jpeg"))
				imageType = "jpeg";
			if(req.url.endsWith(".png"))
				imageType = "png";
			if(req.url.endsWith(".jpg"))
				imageType = "jpg";
			
			if(req.url.endsWith(".jpeg") ||req.url.endsWith(".png") || req.url.endsWith(".jpg") || req.url.endsWith(".ico"))
			{
				var imageUrlReprocessed = req.url.substring(1,req.url.length).replaceAll("%20"," ");
				imageUrlReprocessed = decodeURI(imageUrlReprocessed);
				console.log("You bot are making an image request processed to be "+imageUrlReprocessed);
				
				let responseb = res;
				fs.exists(imageUrlReprocessed,async function(exists)
				{
					//console.log("exists = "+exists);
					if(exists)
					{
						fs.readFile(imageUrlReprocessed,function(err,data)
						{
							if(err)
							{
								//console.log(err);
								responseb.end();
							}
							else if(data)
							{
								responseb.writeHeader(200,{"Content-Type":"image/"+imageType});
								responseb.write(data);
								responseb.end();
							}
						});
					}
					else
					{
						try
						{
							
							imageDictionary.findUrlBufferValue("https://msa-pointage-server.vercel.app/"+imageUrlReprocessed).then((result)=>{
								responseb.writeHeader(200,{"Content-Type":"image/"+imageType});
								console.log(result);
								responseb.write(result);
								responseb.end();
							}
							,(err)=>
							{
								responseb.writeHeader(200,{"Content-Type":"image/"+imageType});
								console.log(err);
								responseb.write(err);
								responseb.end();
							});
						}
						catch(ex)
						{
							console.log(ex);
							responseb.end();
						}
						
						//console.log("Image file does not exist.");
					}
				});
			}
			else
			{
				console.log("Down here");
				console.log(req.url);
				if(req.url.endsWith("MCV"))
				{
					//console.log("Before MCV file");
					fs.readFile("SelfDescription.htm",function(err,data)
					{
						if(data != undefined)
						{
							res.writeHeader(200,{"Content-Type":"text/html"});
							res.write(data);
							res.end();
						}
						else if(err != undefined)
						{
							res.writeHeader(200,{"Content-Type":"text/html"});
							res.end();
						}
					});
				}
				else if(req.url.endsWith("Download/pointage-apk"))
				{
					console.log("inside Download");
					let resb = res;
					fs.readFile("File/app-pointage-msa.apk",(error,data)=>
					{
						if(error)
						{
							console.log(error);
							resb.writeHead(500,{"Content-Type":"application/vnd.android.package-archive"});
							resb.end();
						}
						else
						{
							console.log(data);
							resb.writeHead(200,{"Content-Type":"application/vnd.android.package-archive"});
							resb.write(data);
							resb.end();
							console.log("Done sending apk...");
						}
					});
				}
				else
				{
					var imageUrlReprocessed = "icons/outline_home_black_24dp.png";	
					fs.exists(imageUrlReprocessed,function(exists)
					{
						if(exists)
						{
							fs.readFile(imageUrlReprocessed,function(err,data)
							{
								if(err)
								{
									//console.log(err);
									res.end();
								}
								else if(data)
								{
									res.writeHeader(200,{"Content-Type":"image/"+imageType});
									res.write(data);
									res.end();
								}
							});
						}
						else
						{
							res.end();
							//console.log("Image file does not exist.");
						}
					});
				}
			}
		}
		else if(req.method === 'POST')
		{
			res.end();	
		}
	}
	);
	
	server.listen(process.env.PORT || 3034);
	console.log("Listening at port 3034.............");