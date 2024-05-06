	var http = require("http");
	var https = require("https");
	var url = require("url");
	var postgres = require('pg');
	var formidable = require('formidable');
	var fs = require('fs');
	var vercelBlob = require("@vercel/blob");
	var {GlobalsForcedFolding} = require('./Extra.js');	
	var {ImageFilesContainer} = require('./queryTests.js');
	var kvPackage = require('@vercel/kv');
	var { Server } = require('socket.io');
	let globalForcedFoldingPrime = undefined;
	let imageDictionary = new ImageFilesContainer();
	let connection = undefined;
	let precedentDate = new Date(Date.now());
	let todaysDate = new Date(Date.now());
	let primaryObject = undefined;
	let baseInit = false;
	let schema = "";
	let current = todaysDate;
	let addUser_In_use = false; 
	let commands = [];
	let callIndex = 0;
	//"SET @@lc_time_names = 'fr_FR';"
	let charging_percentage = 0; 	
	let base_init_exiting = false;
	//run
	var kvURL = "https://legal-herring-37422.upstash.io";
	var kvToken = "AZIuASQgYThlYjIyZTQtNzBhMS00MGI0LWJjNzgtOTUxMWYzNTFkOTlhNjhiMmZjZWRmZGQyNDBmYmI1NmIxMDYyNWIzNDI2OGE=";
	var connectedguys =
	[	
	];
	var hoursLocker = undefined;
	const kvUser = kvPackage.createClient({
							url: kvURL,
							token: kvToken,
						});
						
	var filesdirectories = 
	[
		{command:'update employee',path:'../Project Timing/my-app/src/assets/images/'}
	];
	
	
	let d = new Date(Date.now());
	console.log(d.getHours()+" "+d.getMinutes()+" "+d.getSeconds());
	
	function caller()
	{
		precedentDate = todaysDate;
		todaysDate = new Date(Date.now());
			
		let dateTime = new Date();
		console.log("This function must sleep for 1 seconds before starting");
		
			setTimeout(
				async function()
				{	
							let length = -1;//await kvUser.get("primaryObjectsLength");	//set primaryObjectsLength -1
							console.log("PrimaryObject in KV's length is "+length);
							if(length  == -1 || length  == undefined || length  == -1)
							{
								let currentDatedetails = getDateDetailsFromCorruptJavascript();
								console.log("Done sleeping..............");
								if(precedentDate.getYear() != todaysDate.getYear())
								{
									getDataForAdmin(undefined,undefined,undefined,undefined,currentDatedetails[2],undefined,undefined,true);
								}
								else if (precedentDate.getMonth() != todaysDate.getMonth())
								{
									getDataForAdmin(undefined,undefined,undefined,undefined,currentDatedetails[2],currentDatedetails[1],undefined,true);
								}
								else if(precedentDate.getDay() != todaysDate.getDay() )
								{
									getDataForAdmin(undefined,undefined,undefined,undefined,currentDatedetails[2],currentDatedetails[1],currentDatedetails[0],true);
								}
							}
							else
							{
								let allAddedUp = "";
								let done = true;
									
									let problem = false;
									let startTime = new Date();
									for(let count = 0; count < length && !problem; ++count)
									{
										let tryCount = 0;
										do 
										{
											++tryCount;
											try 
											{
												let strElement = await kvUser.get("primaryObjects"+count);
												allAddedUp += strElement;
												problem = false;
											}catch(err)
											{
												problem = true;
											}
										}
										while(problem && tryCount < 2);
									}
									
									if(problem == false)
									{
										try
										{
											primaryObject = JSON.parse(allAddedUp);
											reorganizeKv(primaryObject);
											let dateTime = new Date();
											console.log("primaryObject has been successfully initialized ");
											console.log(((dateTime - startTime)/1000) +" seconds ...");
										}
										catch(err)
										{
											console.log(err.messge.substring(0,1000));
											problem = true;
										}
									}
									
									if(problem)
									{
										let currentDatedetails = getDateDetailsFromCorruptJavascript();
										console.log("Done sleeping..............");
										if(precedentDate.getYear() != todaysDate.getYear())
										{
											getDataForAdmin(undefined,undefined,undefined,undefined,currentDatedetails[2],undefined,undefined,true);
										}
										else if (precedentDate.getMonth() != todaysDate.getMonth())
										{
											getDataForAdmin(undefined,undefined,undefined,undefined,currentDatedetails[2],currentDatedetails[1],undefined,true);
										}
										else if(precedentDate.getDay() != todaysDate.getDay() )
										{
											getDataForAdmin(undefined,undefined,undefined,undefined,currentDatedetails[2],currentDatedetails[1],currentDatedetails[0],true);
										}
									}
							}
				ofUpdate();
			},1000);
	}

	setInterval(async () =>{ 
		let awaitres = await doGetHTTPRequest("msa-pointage-server-socket.onrender.com",undefined,"command=vide");
		//console.log(!awaitres?"Bad refreshing result":"Good refreshing result");
		},10000);

	function ofUpdate()
	{
		current = new Date(Date.now());
		let totalSeconds = (current.getHours()*60*60 + current.getMinutes()*60+ current.getSeconds())*1000;
		let total = 86400000;
		//total = 180000 + totalSeconds;
		//'fr-FR'(total-totalSeconds)
		setTimeout(caller,total-totalSeconds);
		
		if(current.getHours()>= 8 && current.getMinutes() >= 30 && current.getSeconds() >= 00 || (current.getHours()> 8) )
		{
			getEightThirty();
		}
		else
		{
			setTimeout(getEightThirty,(8*60*60+30*60)*1000-totalSeconds);
		}
		
	}
	
	function getEightThirty()
	{
		if(primaryObject != undefined)
		{
			let currentDatedetails = getDateDetailsFromCorruptJavascript();
			getDataForAdmin(undefined,undefined,undefined,undefined,currentDatedetails[2],currentDatedetails[1],currentDatedetails[0],true);
		}
	}
	
	function getCommandGivenID(ID)
	{
		for(let index = 0; index < connectedguys.length; ++index)
		{
			if(connectedguys[index].ID == ID)
			{
				return connectedguys.commands;
			}
		}
		return {paths:[],commandObj:{path:undefined,index:-1}};
	}

	function pushCommands(command)
	{
		if(primaryObject == undefined)
			return;
		for(let index = 0; index < connectedguys.length; ++index)
		{
			if(connectedguys[index].superadmin)
			{
				connectedguys[index].commands.push(command);
			}
			else if(connectedguys[index].admin)
			{
				if(primaryObject.content[command[0].location_index].ID == connectedguys[index].locationID)
				{
					connectedguys[index].commands.push(command);
				}
			}
			else if(connectedguys[index].user)
			{
				if(primaryObject.content[command[0].index].ID == connectedguys[index].locationID)
				{
					if( command[command.length-1].commandObj != undefined && command[command.length-1].commandObj.value.ID == connectedguys[index].ID )
					{
						connectedguys[index].commands.push(command);
					}
				}
			}
		}
	}
	
	let sleep = true;
	
	var server2 = http.createServer(function(req,res)
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
			res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
				,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
				,"Access-Control-Max-Age":'86400'
				,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
			});
			res.end();
		}
		else if (req.method == 'POST')
		{
			
			let result = res;
			let reqData = "";
			
			req.on("data",function(data)
			{
				reqData += data;
			}).on("end",()=>
			{
				console.log("At 3037")
			});
		}
	});
	
	async function doGetHTTPRequest(hostName,port,command)
	{
		return new Promise((resolve)=>{
			var getreqOptions =
			{
				hostname: hostName,
				port:port,
				method: "GET",
				path: "/"+"?"+command,
				followRedirect:true,
				headers :
				{
					"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
					,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
					,"Access-Control-Max-Age":'86400'
					,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
				}
			};
			/*
				headers: 
				{
					'Content-Length': Buffer.byteLength(postData),
				}
			*/
			let req2 = https.request(getreqOptions,function(res)
			{
				let data = "";
				
				res.on("data",function(chunk)
				{
					data += chunk;
				});
				
				res.on("end",function()
				{
					console.log(data);
					resolve(true);
					try
					{
						let reqObject = JSON.parse(data);
					}
					catch(ex)
					{
						
					}
				}); 
			});
			
			req2.on('timeout',()=>{console.log("request is timed-out");});
			req2.on('error',(errdata)=>{ console.log(errdata);resolve(false);});
			req2.end();
		});
	}
	
	/*
	const io = new Server(server, {cors: {
		origin: "*",
		methods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ["X-Requested-With", "X-HTTP-Method-Override", "Content-Type", "Accept"]
	}});

	io.on("connection", (socket) => {
	  // ...
	  console.log("Hello Mamadou");
	  socket.emit('updated',"Hello Mamadou!");
	  socket.emit("update","Hello Mamadou!");
	  socket.emit("updated","Hello Mamadou!");
	  
	  socket.on("json", (data) => {
		socket.emit('askforupdate',"Hello Mamadou!");
		let user = JSON.parse(data);
		let res = findUserShort(user.ID,user.pass);
			if(res.found)
			{
				connectedguys[res.index].socket = socket;
			}
		socket.on("disconnect",()=>
		{
			connectedguys[res.index].socket = undefined;
		});
	  });
	});
	//server2.listen(3037);
	*/
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
				//console.log("Down here");
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
				callIndex++;
				//console.log("Call index is "+callIndex);
				//console.log("Charging pourcentage "+ charging_percentage+"...");
				//console.log("Base init has "+((base_init_exiting == true)?"exited" :"not exited"));
				var reqData = "";
				if(req.url == "/form")
				{
					//console.log("incomming request but primary object is "+primaryObject);
					formidableFileUpload(req,"../Project Timing/my-app/src/assets/images/",res);
				}
				else
				{
						let result = res;
						req.on("data",function(data)
						{
							reqData += data;
						}).on("end",()=>
						{
							//console.log("incomming request but primary object is "+primaryObject);
							if(primaryObject == undefined)
							{
								//console.log("Your response should be with the 200 code");
								result.writeHeader(200,{"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
									,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
									,"Access-Control-Max-Age":'86400'
									,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
								});
								result.write(JSON.stringify({first: undefined,res:"Call index is "+callIndex+"\n"
								+"Charging pourcentage "+ charging_percentage+"",third:true,text:"Still Charging",charging:true}));
								result.end();
								return;
							} 
							//console.log(reqData);
							let urlObject = undefined;
							try
							{
								urlObject = JSON.parse(reqData);	
							}
							catch(ex)
							{
								//console.log(ex);
								dummyResponseSimple(result);
								return;
							}

							//console.log(reqData);
							//console.log(urlObject);
							//console.log("Able to continue to step 1");
							
							if(urlObject == undefined)
							{
								//console.log("Undefined urlObject");
								dummyResponseSimple(result);
								return;
							}

							//console.log("Able to continue to step 2");
							
							let command = urlObject.command;
							//console.log("Command is update "+ command == "update");
							
							if(command === "update")
							{
								let commandArg = urlObject.cmdArg;
								if(commandArg == undefined)
								{
									//console.log("undefined commandArg");
									dummyResponseSimple(result);
									return;
								}
								else if(commandArg !== "hours")
								{
									//console.log("undefined commandArg");
									dummyResponseSimple(result);
									return;
								}
								
								let userAuthentification = urlObject.userAuthentification;
								if(userAuthentification == undefined) 
								{
									//console.log("undefined userAuthentification");
									dummyResponseSimple(result);
									return;
								}
								else
								{
									//console.log("user authentification request received");
								}
								
								if(userAuthentification.ID == undefined || userAuthentification.Prenom == undefined
									|| userAuthentification.Nom == undefined || userAuthentification.genre == undefined
									|| userAuthentification.naissance == undefined || userAuthentification.pass == undefined)
								{
									console.log("undefined credentials");
									dummyResponseSimple(result);
									return;
								}
								else
								{
									//console.log("all credentials received");
								}

								//console.log("Trying to authenticate");
								let resultb = result;
								forced_authentification_query(userAuthentification,undefined).then(async ( tempresult )=>
								{
									let othertempResult = check_super_admin(userAuthentification,undefined,undefined);
									let resultc = resultb;
									urlObject.date = new Date(urlObject.date);
									await kvUser.set("primaryObjectsLength",-1);
									await insertEntryandExitIntoEmployees(userAuthentification.ID,urlObject.date,urlObject.start,urlObject.end,urlObject,resultb)	
									resultc.writeHeader(200,{"Content-Type": "application/json"});
									resultc.write(JSON.stringify({OK:200}));
									resultc.end();
									urlObject.day = undefined; urlObject.startDay = undefined; urlObject.endDay = undefined;
									console.log("Awaiting refreshing from getDataForAdmin");
									await getDataForAdmin(undefined,undefined,undefined,urlObject,undefined,undefined,undefined,false);
									console.log("Done Awaiting refreshing from getDataForAdmin");
								}
								,(ex) =>
								{
									console.log(ex);
									dummyResponseSimple(resultb);
									return;
								});
							}
							if(command === "login")
							{	
								let resultb = result;
								
								forced_authentification_query_login(urlObject.userAuthentification,result).then((ares)=>
								{
										console.log(ares);
										if(JSON.stringify(ares.first) == "false" && JSON.stringify(ares.second) == "false" )
										{
											resultb.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
											,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
											,"Access-Control-Max-Age":'86400'
											,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
											console.log("Sending response");
											resultb.write(JSON.stringify(ares));
											resultb.end();
											return;
										}
										
										check_super_admin(urlObject.userAuthentification,undefined,undefined).then((othertempResult)=>
										{
											//console.log(othertempResult);
												if(ares.first == true || ares.second == true || ares.third == true)
												{
													console.log("Inside setting");
													if(othertempResult.first)
													{
														ares.element.superadmin = true;
														ares.element.admin = false;
														ares.element.user = false; 
														ares.element.keyadmin = false;
													}
													else if(othertempResult.second)
													{
														ares.element.superadmin = false;
														ares.element.admin = true;
														ares.element.user = false;
														ares.element.keyadmin = false;
													}
													else if(othertempResult.third)
													{
														ares.element.superadmin = false;
														ares.element.admin = false;
														ares.element.user = true;
														ares.element.keyadmin = false;
													}
													else if (othertempResult.fourth)
													{
														ares.element.superadmin = false;
														ares.element.admin = false;
														ares.element.user = false; 
														ares.element.keyadmin = true;
													}
												}
												else
												{
													//console.log(ares);
													//console.log("Not inside setting");
												}
												
												if(ares.first)
												{
													resultb.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
													,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
													,"Access-Control-Max-Age":'86400'
													,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
													});
													console.log("Sending response");
													resultb.write(JSON.stringify(ares));
													resultb.end();
												}
												else if(ares.second || ares.third || ares.fourth)
												{
													
													resultb.writeHead(200,{"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
													,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
													,"Access-Control-Max-Age":'86400'
													,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
													});

													resultb.write(JSON.stringify(ares));
													resultb.end();
													
												}
												else
												{
													
												}

											
										}
										,(ex)=>
										{
											console.log(ex);
											dummyResponse(resultb,ex);
											return;
										});
									}
									,(ex2)=>
									{
										console.log(ex2);
										dummyResponse(resultb,ex2);
										return;
									});
							}
							else if(command === "pull") 
							{
								let commandArg = urlObject.cmdArg;
								console.log("{hello:\"Hello World\"}");
								if(commandArg == undefined)
								{
									//console.log("undefined commandArg");
									dummyResponseSimple(result);
									return;
								}
								else
								{
									//console.log("pull command received");
								}
								
								let userAuthentification = urlObject.userAuthentification;
								if(userAuthentification == undefined) 
								{
									console.log("undefined userAuthentification");
									dummyResponseSimple(result);
									return;
								}
								else
								{
									//console.log("user authentification request received");
								}
								
								if(userAuthentification.ID == undefined || userAuthentification.Prenom == undefined
									|| userAuthentification.Nom == undefined || userAuthentification.genre == undefined
									|| userAuthentification.naissance == undefined || userAuthentification.pass == undefined)
									{
										console.log(userAuthentification);
										console.log("undefined credentials");
										dummyResponseSimple(result);
										return;
									} 
									else
									{
										//console.log("all credentials received");
									}
									
								let queries = [];

								if(commandArg === "all" || commandArg === "update") 
								{
									let sqlConnection = connection;
									console.log("Trying to authenticate");
									let resultc = result;
									
									forced_authentification_query(userAuthentification,undefined).then((tempResult)=>
									{
											if(tempResult)
											{
												//console.log("This guy is authenticated");
												let resultd = resultc;
												check_super_admin(userAuthentification,sqlConnection,undefined).then((othertempResult)=>
												{
													//console.log("Inside checking admin type");
													if(othertempResult.first)
													{
														//console.log("This guy is a primary admin");
														//console.log("responding");
														resultd.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
														,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
														,"Access-Control-Max-Age":'86400'
														,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
														});
														//console.log(primaryObject);
														resultd.write(JSON.stringify(primaryObject));
														resultd.end();
														/*getDataForAdminThreeArgs(undefined,undefined).then((getresult)=>{
															console.log(getresult);
															if(getresult == false)
															{
																dummyResponseSimple(resultd);
																return;
															}
															console.log("responding");
															resultd.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
															,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
															,"Access-Control-Max-Age":'86400'
															,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
															});
															resultd.write(JSON.stringify(getresult));
															resultd.end();
															
														},
														(error)=>
														{
															console.log(error); console.log("Error Problem");	
														});*/
													}
													else if(othertempResult.second || othertempResult.fourth)
													{
														//console.log("This guy is a secondary or a fouth kind of  admin");
														let tempLocation = getLocation(primaryObject,userAuthentification.locationID);
														tempLocation = Object.fromEntries(Object.entries(tempLocation.first));
														let tempData =
														{
															selected_name: 0,
															container : [tempLocation],
															nowVisible: true,
															otherVisible : false
														};
																
														
														resultd.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
														,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
														,"Access-Control-Max-Age":'86400'
														,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
														});
																
														resultd.write(JSON.stringify(tempData));
														resultd.end();
														
														/*getDataForAdminThreeArgs(undefined,undefined).then((primaryObject)=>{
															if(primaryObject == false)
															{
																dummyResponseSimple(resultd);
																return;
															}
																//console.log("This guy is a ternary admin");	
															let tempLocation = getLocation(primaryObject,userAuthentification.IDBureau);
															tempLocation = Object.fromEntries(tempLocation.entries());
																
															let tempData =
															{
																selected_name: 0,
																container : [tempLocation],
																nowVisible: true,
																otherVisible : false
															};
																
															notIDDecreaseAll(tempLocation,userAuthentification.ID);
															resultd.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
															,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
															,"Access-Control-Max-Age":'86400'
															,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
															});
																
															resultd.write(JSON.stringify(tempData));
															resultd.end();
															return;
															
														},(error)=>
														{
															console.log("Error");console.log(error);
														});*/
													}
													else if(othertempResult.third )
													{
														if(commandArg == "all"||commandArg == "update")
														{
															if(primaryObject == undefined)
															{
																dummyResponseSimple(resultc);
															}
															else
															{
																let tempLocation = getLocation(primaryObject,userAuthentification.locationID);
																
																//let newtempLocation = Object.fromEntries(Object.entries(tempLocation.first));
																let newtempLocation = JSON.parse(JSON.stringify(tempLocation.first));
																
																notIDDecreaseAll(newtempLocation,userAuthentification.ID);
																
																let tempData =
																{
																	selected_name: 0,
																	container : [newtempLocation],
																	nowVisible: true,
																	otherVisible : false
																};
																
																resultd.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
																	,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
																	,"Access-Control-Max-Age":'86400'
																	,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
																});
																resultd.write(JSON.stringify(tempData));
																resultd.end();
															}
															
															/*
															getDataForAdmin(undefined,undefined,undefined,userAuthentification,undefined,undefined,undefined).then((primaryObject)=>
															{	
																if(primaryObject == false)
																{
																	dummyResponseSimple(resultc);
																}
																else
																{
																	resultd.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
																	,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
																	,"Access-Control-Max-Age":'86400'
																	,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
																	});
																	resultd.write(JSON.stringify(primaryObject));
																	resultd.end();
																}
															},(otherError)=>
															{
																console.log(otherError);
																console.log("Error");
															});*/
														}
														else if(commandArg == "update")
														{
																let command = getCommandGivenID(userAuthentification.ID);
																//console.log("-------------------Passed Command----------------------")
																//console.log(command);
																resultc.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
																,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
																,"Access-Control-Max-Age":'86400'
																,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
																});
																resultd.write(JSON.stringify(command));
																resultd.end();
																return;
														}
													}
													else
													{
														//console.log("No answer");
														dummyResponseSimple(resultd);
													}	
												},(error)=>
												{
													console.log(error);
												});
											}
											else
											{
												dummyResponseSimple(resultd);
												return;
											}
										} ,
										(ex)=>
										{
											
										});
								}
								else
								{
									//console.log("You are at area with response 500");
									result.writeHead(500, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
												,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
												,"Access-Control-Max-Age":'86400'
												,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
												});
									result.end();
								}
							}	
						});
					}
				}
			});
	
	function whileFunction(startingTag)
	{
		try
		{
			server.listen(3034)
			try
			{
				add_all_users();
				var func = async()=>
				{
					let length = -1;
					let length_count = 0;
					let errorBoolean = false;
					
					/*do
					{
						try
						{
							length = await kvUser.get("primaryObjectsLength");
							errorBoolean = false;							
						}
						catch(err)
						{
							errorBoolean = true;
							++length_count;
						}
					}while(errorBoolean && length_count <= 2);*/
					
					console.log("PrimaryObject in KV's length is "+length);
							if(length  == -1 || length  == undefined)
							{		
								await getDataForAdminFiveArgs();
							}
							else
							{
								let allAddedUp = "";
								let done = true;
									
									let problem = false;
									let startDate = new Date();
									for(let count = 0; count < length && !problem; ++count)
									{
										let tryCount = 0;
										do 
										{
											++tryCount;
											try 
											{
												let strElement = await kvUser.get("primaryObjects"+count);
												allAddedUp += strElement;
												problem = false;
											}catch(err)
											{
												problem = true;
											}
										}
										while(problem && tryCount < 2);
									}
									
									if(problem == false)
									{
										try
										{
											primaryObject = JSON.parse(allAddedUp);
											reorganizeKv(primaryObject);
											let endDate = new Date()
											console.log("primaryObject has been successfully initialized...after"+((endDate-startDate)/1000)+" seconds" );
											try
											{
												console.log(primaryObject.container[primaryObject.selected_name]);
												let primarydate = new Date(primaryObject.container[primaryObject.selected_name].currentDate);
												
												console.log(primarydate.getMonth());console.log((new Date()).getMonth());
												console.log(primarydate.getDate());console.log((new Date()).getDate());
												console.log(primarydate.getFullYear());console.log((new Date()).getFullYear());
												
												if(primarydate.getMonth() != (new Date()).getMonth() || primarydate.getDate() != (new Date()).getDate() ||
												primarydate.getFullYear() != (new Date()).getFullYear() )
												{
													primaryObject = undefined;
													await getDataForAdminFiveArgs();	
												}
											}catch(err)
											{
												console.log(err);
												primaryObject = undefined;
												await getDataForAdminFiveArgs();
											}
										}
										catch(err)
										{
											console.log(err.message.substring(0,1000));
											console.log(err);
											problem = true;
											primaryObject = undefined;
										}
										//console.log(primaryObject);
										
									}
									
									if(problem)
									{				
										await getDataForAdminFiveArgs();
									}
							}
				};
				func();
				
				//console.log(startingTag);
				ofUpdate();
				setTimeout(each5Minutes,300000);
				//'fr-FR',
				baseInit = true;
			}
			catch(ex)
			{
				//console.log(ex);
			}
			
		}
		catch(ex)
		{
			//console.log(ex);
		}
	}
	
	whileFunction("Starting Server....");//update
	async function insertEntryandExitIntoEmployees(ID,date,startTime,endTime,empHoursObj,res)
	{
		
		let nomdelaTable = "";
		let datereversed = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
		let query = "Select * from \"manuel des tables d'entrées et de sorties\" where \"manuel des tables d'entrées et de sorties\".Année = '"+date.getFullYear()+"'";
		let results  = await faire_un_simple_query(query);
							
		
		if(results.first.length > 0 )
		{
			//console.log(results.second);
			//console.log(results.first);
			nomdelaTable = results.first[0][results.second[2].name];
		}
		else
		{
			dummyResponseSimple(res);
			return;
		}
		
		if(empHoursObj.typicalupdate == "true")
		{
			query = "update table \""+nomdelaTable+"\" set entrées = '"+empHoursObj["oldentry"]+"' , sorties = '"
			+empHoursObj["oldexit"]+"' where idindividu = '"+ID+"' AND entrées = '"+empHoursObj["entry"]+"' AND sorties = '"
			+empHoursObj["exit"]+"' AND date = '"+datereversed+"';";
		}
		else
		{	
			query = "insert into \""+nomdelaTable+"\" values ('"
			+ ID+"','"+datereversed+"','"+startTime+"',"+((endTime == undefined)?null:"'"+endTime+"'")+")"
			+" ON CONFLICT (IdIndividu,Date,Entrées) "+((endTime == undefined)?(" WHERE Sorties = null DO UPDATE SET Sorties = null;\n") : (" WHERE Sorties = null OR Sorties <= '"+endTime+"'" + " DO UPDATE SET Sorties ='"+endTime+"';\n") );
		}
		
		console.log(query);
		results  = await faire_un_simple_query(query);
		console.log(results);
		if(results.second == false && !results.second instanceof Array)
		{
			dummyResponseSimple(res);
			return;
		}

		//console.log(empHoursObj);
		
		/*if(res = undefined)
		{
			res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
								,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
								,"Access-Control-Max-Age":'86400'
								,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
								});
			res.write(JSON.stringify("OK"));
			res.end();
			console.log("Basic Response");
		}*/
		
		/* if(result == false)
		{
			//console.log("Dummy Response");
			dummyResponse(res,"ajout impossible");
			return;
		} */
		//console.log("Basic Response");
		
 	}
	
	async function formidableFileUpload(req,path,res)
	{
		var form = new formidable.IncomingForm();
		//console.log("Inside formidable");
    	await form.parse(req, async function (err, fields, files) 
		{
			
			let command = fields.command;
			//console.log(fields);
			//console.log(command);
			//console.log(files);
			let filesDup = files;
			//console.log(filesDup);
			
			if(filesDup.imgfile instanceof Array)
				filesDup = filesDup.imgfile[0];
			//console.log(filesDup);
			

			let mp = new Map();
			let urlObject = undefined;

			if(command instanceof Array)
			{
				for(const [key, value] of Object.entries(fields))
				{
					mp.set(key,value);
				}
				urlObject = Object.fromEntries(mp);
			}
			else
			{
				urlObject = fields;
			}
			
			/*blob.url;
			blob.contentDisposition;
			blob.contentType;
			*/
			if(primaryObject == undefined)
			{
				//console.log("Your response should be with the 200 code");
				res.writeHeader(200,{"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
					,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
					,"Access-Control-Max-Age":'86400'
					,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
				});
				res.write(JSON.stringify({first: undefined,res:"Call index is "+callIndex+"\n"
					+"Charging pourcentage "+ charging_percentage+"",third:true,text:"Still Charging",charging:true}));
					res.end();
					return;
			} 
			
			if(command === "update" || (command instanceof Array && command[0] === "update"))
			{
					let dealingWithArray = command instanceof Array;
					let commandArg = fields.cmdArg;
					console.log(commandArg);
					//console.log(fields.cmdArg);
					let tablename = "";
					let querySQL = "";
					let doubleQuerySQL = "";
					let thirdQuerySQL = "";
					let url_query = "";
					let yearParam = undefined;
					let monthParam = undefined;
					let dayParam = undefined;
					let skip_authentification = false;
					let tempResult = false; 
					let userPresenceObject = {};

					if (commandArg === "offices" || (dealingWithArray && commandArg[0] === "offices"))
					{
						tablename = "\"location du bureau\"";
						if(!dealingWithArray)
						{
							querySQL =  "insert into "+tablename+" values ('"+fields.ID+ "',$$" + fields.officeName+"$$,$$";
							querySQL += fields.address +"$$,$$"+fields.region+"$$,'"+fields.latittude+"','"+fields.longitude;
							querySQL += "');";
						}
						else
						{
							querySQL =  "insert into "+tablename+" values ('"+fields.ID[0]+ "',$$" +  fields.officeName[0]+"$$,$$";
							querySQL += fields.address[0] +"$$,$$"+fields.region[0]+"$$,'"+fields.latittude[0]+"','"+fields.longitude[0];
							querySQL += "');";
						}
						console.log(querySQL);
						//console.log(fields);
					}
					else if (commandArg  === "events" || (dealingWithArray && commandArg[0] === "events") )
					{
						let tempuserAuthentification = {ID:urlObject.authID,Prenom:urlObject.authPrenom,Nom:urlObject.authNom,genre:urlObject.authGenre,naissance:urlObject.authnaissance,pass:urlObject.authpass};
						if(dealingWithArray)
						{
							querySQL += "insert into \""+fields.year[0]+" jours de fêtes et de non travail\" values ($$" + fields.name[0]+"$$,$$"+fields.date[0]+"$$);";
						}
						else
						{
							querySQL += "insert into \""+fields.year+" jours de fêtes et de non travail\" values ($$"  + fields.name+"$$,$$"+fields.date+"$$);"
						}
						console.log(querySQL);
					}
					else if(commandArg === "employees" || (dealingWithArray && commandArg[0] === "employees"))
					{
						let image_url = undefined;
						let blob = true;
						if(filesDup != undefined && filesDup.imgfile != undefined || ( filesDup.originalFilename != undefined))
						{
								//console.log(fs.readFileSync(filesDup.filepath));
								try
								{			
									//not decodeURI for the originalFilename risk taken even if percentages are introduced however urls must be processed
									const blob = await vercelBlob.put("assets/images/profile-pictures/"+decodeURI(filesDup.originalFilename),fs.readFileSync(filesDup.filepath),{
										access: 'public',
										contentType: filesDup.mimetype, 
										token: blob_stuff
									});
									
									image_url = decodeURI(blob.url);
								}
								catch(ex)
								{
									url_query = "insert into blobsholder (Url, bytesvalue) values ('https://msa-pointage-server.vercel.app/";
									url_query += decodeURI(filesDup.originalFilename)+"','";
									url_query += "\\x"+fs.readFileSync(filesDup.filepath).toString('hex')+"');";
									image_url = "https://msa-pointage-server.vercel.app/"+decodeURI(filesDup.originalFilename);
									blob = false;
									console.log(ex);
								}
						}
						
						if(dealingWithArray)
						{
							//in place of image url fields.imagename[0]
							tablename = "individu";
							querySQL = "insert into "+tablename+" values ($$"+image_url+"$$,$$"+fields.ID[0]+"$$,$$"+fields.first[0]+"$$,$$";
							querySQL += fields.second[0] +"$$,'"+fields.gender[0]+"','"+fields.birthdate[0]+"',$$"+fields.function[0]+"$$,'";
							querySQL += fields.start[0]+"','"+fields.end[0]+"');";
							tablename = "appartenance";
							doubleQuerySQL = "insert into "+ tablename+" values ('"+fields.ID[0]+"',"+fields.officeID[0]+");";
							tablename = "login";
							thirdQuerySQL += "insert into "+tablename+" values ('"+fields.ID[0]+"',$$"+fields.password[0]+"$$,"+((fields.type[0] == 1)?true:false)+","+((fields.type[0] == 2)?true:false)+","+((fields.type[0] == 4)?true:false)+","+((fields.type[0] == 3)?true:false)+");";
						}
						else
						{
							tablename = "individu";
							querySQL = "insert into "+tablename+" values ($$"+image_url+"$$,'"+fields.ID+"',$$"+fields.first+"$$,'";
							querySQL += fields.second +"','"+fields.gender+"','"+fields.birthdate+"',$$";
							querySQL += fields["function"]+"$$,'"+fields.start+"','"+fields.end+"');";
							tablename = "appartenance";
							doubleQuerySQL = "\ninsert into "+ tablename+" values ('"+fields.ID+"',"+fields.officeID+");";
							tablename = "login";
							thirdQuerySQL += "insert into "+tablename+" values ('"+fields.ID+"',$$"+fields.password+"$$,"+((fields.type == 1)?true:false)+","+((fields.type == 2)?true:false)+","+((fields.type == 4)?true:false)+","+((fields.type == 3)?true:false)+");";
						} 
						
						console.log(querySQL);	
						console.log(doubleQuerySQL);
						console.log(thirdQuerySQL);
					
					}
					else if(commandArg === "reasonsforabsences" || (dealingWithArray && commandArg[0] === "reasonsforabsences"))
					{
						let day ;
						let startDay ;
						let endDay ;
						let reason ;
						let IDEmployee ;
						let Year;
						let IDOffice;
						skip_authentification = true;
						console.log(fields);
						
						if(dealingWithArray)
						{
							day = fields["Jour"];
							day =(day != undefined)? new Date(day[0]): undefined;	
							startDay = fields["Début"];
							startDay =(startDay != undefined)? new Date(startDay[0]): undefined;
							endDay = fields["Fin"];
							endDay =(endDay != undefined)? new Date(endDay[0]): undefined;
							reason = fields["raison"][0];
							IDEmployee = fields["IDEmployee"][0];
							Year = fields["Année"][0];
							IDOffice = fields["IDOffice"][0];
						}
						else
						{
							day = fields["Jour"];day =(day != undefined)? new Date(day): undefined;
							startDay = fields["Début"];startDay =(startDay != undefined)? new Date(startDay): undefined;
							endDay = fields["Fin"];endDay =(endDay != undefined)? new Date(endDay): undefined;
							reason = fields["raison"];
							IDEmployee = fields["IDEmployee"];
							Year = fields["Année"];
							IDOffice = fields["IDOffice"];
						}
						
						userPresenceObject.day = day;
						userPresenceObject.startDay = startDay;
						userPresenceObject.endDay = new Date(endDay.getFullYear(),endDay.getMonth(),endDay.getDate()-1);
						userPresenceObject.ID = IDEmployee;
						userPresenceObject.IDOffice = IDOffice;
						userPresenceObject.year =  Year;
						
						let tempuserAuthentification = {ID:urlObject.authID,Prenom:urlObject.authPrenom,Nom:urlObject.authNom,genre:urlObject.authGenre,naissance:urlObject.authnaissance,pass:urlObject.authpass};
						tempResult = await forced_authentification_query(tempuserAuthentification,undefined);
						
						if(tempResult)
						{
							querySQL = "select \"Etat de l'individu\" from \"manuel des tables d'entrées et de sorties\" where Année= "+Year+";";
							await kvUser.set("primaryObjectsLength",-1);
							let res = await faire_un_simple_query(querySQL);
							console.log(querySQL);
							if(res.second != false && res.second instanceof Array )
							{
									tablename = "\""+res.first[0][res.second[0].name]+"\"";
									let values = "";
											
									if(day != undefined)
									{
										values = (reason == "mission")?",false,false,true,false)":(reason == "congès")?",false,false,false,true)":(reason == "maladie")?",true,false,false,false)":false;
										let updateArray = (reason == "mission")?[false,false,true,false]:(reason == "congès")?[false,false,false,true]:(reason == "maladie")?[true,false,false,false]:[false,false,false,false];
										//old current.getDay() != 6 && current.getDay() != 0 || reason == "mission"
										if(values != false && current.getDay() != 6 && current.getDay() != 0 )
										{
											let queryvalues = "('"+IDEmployee+"','"+((day.getMonth()+1)+"-"+day.getDate()+"-"+day.getFullYear())+"'"+values;
											querySQL = "insert into "+tablename+" values "+queryvalues+" ON CONFLICT (IdIndividu,Date) DO Update Set absence ="+updateArray[0]+",maladie = "+updateArray[1]+",mission="+updateArray[2]+",congès="+updateArray[3]+";"; 
										}
									}
									if(startDay != undefined && endDay != undefined)
									{
										let current = startDay;
										values = (reason == "mission")?",false,false,true,false)":(reason == "congès")?",false,false,false,true)":(reason == "maladie")?",true,false,false,false)":false;
										let updateArray = (reason == "mission")?[false,false,true,false]:(reason == "congès")?[false,false,false,true]:(reason == "maladie")?[true,false,false,false]:[false,false,false,false];
																				
										while(values != false && (current < endDay || startDay == endDay)  )
										{
											//old current.getDay() != 6 && current.getDay() != 0 || reason == "mission"
											let vacation_available = false;
											if(reason == "congès")
											{
												let year = current.getFullYear();
												vacation_available = vacationsAvailable(year,IDOffice,IDEmployee); 
											}
											
											if(current.getDay() != 6 && current.getDay() != 0 )
											{
												if(values != false && vacation_available)
												{
													let queryvalues = "('"+IDEmployee+"','"+((current.getMonth()+1)+"-"+current.getDate()+"-"+current.getFullYear())+"'"+values;
													querySQL += "insert into "+tablename+" values "+queryvalues+" ON CONFLICT (IdIndividu,Date) DO Update Set absence ="+updateArray[0]+",maladie = "+updateArray[1]+",mission="+updateArray[2]+",congès="+updateArray[3]+";\n"; 
												}
											}
											
											if(current.getDate() == (new Date(current.getYear(),current.getMonth(),0)).getDate())
											{
												if(current.getMonth() == 11)
												{
													current = new Date(current.getFullYear()+1,0,1);
												}
												else
												{
													current = new Date(current.getFullYear(),(current.getMonth()+1),1);
												}
											}
											else
											{
												current = new Date(current.getFullYear(),(current.getMonth()),current.getDate()+1);
												console.log(current);
											}
										}
									}
							}
						}
						
					}

					let tempuserAuthentification = {ID:urlObject.authID[0],Prenom:urlObject.authPrenom[0],Nom:urlObject.authNom[0],genre:urlObject.authGenre[0],naissance:urlObject.authnaissance[0],pass:urlObject.authpass[0]};
					if(skip_authentification == false)
						tempResult = await forced_authentification_query(tempuserAuthentification,undefined);
					userPresenceObject.userAuthentification = tempuserAuthentification;
					//console.log(tempuserAuthentification);
					//console.log(tempResult);
					//console.log(querySQL);
					//console.log("-----------------------Result of authentification----------------------");
					
					if(tempResult != false)
					{
						try
						{
							console.log(querySQL);
							
							await kvUser.set("primaryObjectsLength",-1);
							let aresult = await faire_un_simple_query(querySQL);
							//console.log(aresult);
							console.log("aresult.second "+(aresult.second != false || (aresult.second instanceof Array))+" "+aresult.second);
							if(aresult.second != false || (aresult.second instanceof Array))
							{
								let userTimeObject = undefined;
								let userOfficeObject = undefined;
								let userAdditionObject = undefined;
								//console.log(commandArg[0]);
								//console.log(commandArg);
								//console.log(dealingWithArray);
								if(commandArg == "events")
								{
									res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
																	,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
																	,"Access-Control-Max-Age":'86400'
																	,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
																	});
										
									res.write(JSON.stringify({customtext:"OK"}));
									console.log("no problems");
									res.end();
									let date = new Date((dealingWithArray)?fields.date:fields.date[0]);
									await getDataForAdmin(undefined,undefined,undefined,undefined,date.getFullYear(),date.getMonth()+1,date.getDate(),false);
								}
								
								if (commandArg === "reasonsforabsences" || (dealingWithArray && commandArg[0] === "reasonsforabsences"))
								{
									console.log("Passed reasonsforabsences");
									console.log("Inside response");
										
									if(res.writableEnded)
									{	
										console.log("Response writable ended ..."+res.writableEnded);	
										return;
									}

									res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
																	,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
																	,"Access-Control-Max-Age":'86400'
																	,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
																	});
										
									res.write(JSON.stringify({customtext:"OK"}));
									console.log("no problems");
									res.end();
									await getDataForAdmin(undefined,undefined,undefined,userPresenceObject,undefined,undefined,undefined,false);
								}
								
								if(commandArg === "offices" || (dealingWithArray && commandArg[0] === "offices") )
								{
										//let okresult = //console.log("after offices getDataForAdmin");
										//console.log("res writable ended is " +res.writableEnded);
										//console.log(primaryObject.container);
										
										if(res.writableEnded)
												return;
										res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
																	,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
																	,"Access-Control-Max-Age":'86400'
																	,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
																	});
										
										res.write(JSON.stringify({customtext:"OK"}));
											//console.log("no problems");
										res.end();
										await getDataForAdmin(undefined,userOfficeObject,undefined,undefined,undefined,undefined,undefined,false);
										
										/*	
										if(okresult)
										{
											
										}
										else
										{
											dummyResponse(res,"Error");
											//console.log("errors problems");
										}*/
								}
								

								if(commandArg === "employees" || (dealingWithArray && commandArg[0] === "employees"))
								{
									await kvUser.set("primaryObjectsLength",-1);
									let bresult = await faire_un_simple_query(doubleQuerySQL);
									if(bresult.second != false || bresult.second instanceof Array)
									{
										let cresult = await faire_un_simple_query(thirdQuerySQL);
										if(cresult.second != false || cresult.second instanceof Array)
										{
											let dresult = await faire_un_simple_query(url_query);
											res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
																	,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
																	,"Access-Control-Max-Age":'86400'
																	,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
																	});
											
											res.write(JSON.stringify({customtext:"OK"}));
											res.end();
												
											if (dresult.second != false || dresult.second instanceof Array)
											{
												userAdditionObject = urlObject;
												//let fs = require('fs');
												//await fs.rename(filesDup.filepath, path + filesDup.originalFilename,function(err_){});
												await getDataForAdmin(undefined,undefined,userAdditionObject,undefined,undefined,undefined,undefined,false);
											}
											else
											{
												dummyResponse(res,"Erreur Interne.");	
												console.log(dresult.first);	
											}
										}
										else
										{
											dummyResponse(res,"Erreur Interne.");	
											//console.log(cresult.first);	
										}
									}
									else
									{
										dummyResponse(res,"IDExistant");
										//console.log(bresult.first);
									}
								}
							}
							else
							{
								//console.log(aresult.first);
								dummyResponse(res,"IDExistant");
							}
						}catch(ex)
						{
							//console.log(ex);
							dummyResponse(res,"IDExistant");
						}
					}
					else
					{
						await fs.unlink(filesDup.filepath,function(err,data)
						{});
						dummyResponse(res,"error");
					}
				}
				else
				{
					let fs = require('fs');
					if(filesDup.imgfile != undefined)
					{
						await fs.unlink(filesDup.filepath,function(err,data)
						{});
					}
					dummyResponse(res,"Authentification error");
				}
			});
			
			
	}
	
	async function exigencebasededonnée()
	{	
		try 
		{	
			let postgresConnection = new postgres.Client("postgres://default:kN2CwOSMv4Xf@ep-flat-hall-85299716.us-east-1.postgres.vercel-storage.com:5432/verceldb"+"?sslmode=require");
			await postgresConnection.connect();
			return new Promise ((resolve,reject) => 
			{
				//console.log("Database connection successfull.");
				resolve(postgresConnection);	
			});
		}
		catch(ex)
		{
			console.log("Erreur");
			//console.log(postgresConnection);
			console.log(ex);
			return new Promise ((resolve,reject) => 
			{
				//console.log("Database connection not  successfull.");
				resolve(undefined);	
			});
		}
	}

	async function faire_un_simple_query(queryString)
	{
		let sql = undefined;	
		//console.log(queryString);
		while(sql == undefined)
		{
			try
			{
				sql = await exigencebasededonnée();
			}
			catch(ex)
			{
				
			};
		};
		
		try
		{
			
			let result = await sql.query(queryString);
			
			try
			{
				await sql.end();
			}
			catch(ex){}
			
			return new Promise ((resolve,reject) => 
			{
						
				if(result == undefined)
				{
					reject({first:result,second:false});
				}
				else
				{
					if(result.rows == undefined)
					{
						let tempfirst = [];
						result.forEach((element)=>
						{
							tempfirst.push({first: element.rows,second:element.fields});
						});
						
						resolve(tempfirst);
					}
					else
					{
						resolve({first:result.rows,second:result.fields});
					}
				}
						
			});
		}
		catch(ex)
		{
			
			console.log(ex);
			console.log("Exception caught");
			console.log(ex.message);
			
			try
			{
				await sql.end();
			}
			catch(e)
			{
			}
			
			return new Promise((resolve,reject)=>{resolve({first:ex,second:false});});
		}		
	}
	
	async function add_all_users()
	{
		let query = "SELECT  * FROM individu inner join login on individu.ID = login.IDIndividu inner join "
		query += "appartenance on individu.ID = appartenance.IDIndividu inner join \"location du bureau\" as A on A.ID = ";
		query += "appartenance.IDBureau;"; 
		let tempResult = await faire_un_simple_query(query);
		
		for(let i = 0; i < tempResult.first.length; ++i)
		{
				//console.log(tempResult.first[i]);
				let addResult = addUser(tempResult.first[i].idindividu,tempResult.first[i]["prenom"],tempResult.first[i].nom,
								tempResult.first[i].genre,tempResult.first[i]['Date de naissance'].toLocaleString(undefined,{day:'numeric',month:'numeric',year:'numeric'}),tempResult.first[i]["début"],tempResult.first[i].fin
								,tempResult.first[i].password,tempResult.first[i].idbureau,tempResult.first[i]['Nom du Bureau'],
								tempResult.first[i].latitude,tempResult.first[i].longitude,tempResult.first[i].admin
								,tempResult.first[i].superadmin,tempResult.first[i].User,tempResult.first[i]["Key Admin"]);
				return {first:true,second:undefined,element:addResult.userAuthentification};
		}
	}
	
	async function forced_authentification_query_login(userAuthentification,res)
	{
		
		let returnValue = findUserShort(userAuthentification.ID,userAuthentification.pass);
		
		if( returnValue.found )
		{
			return {first:true,second:undefined,element:returnValue.element.userAuthentification};
		}
		
		let query = "SELECT  * FROM individu inner join login on individu.ID = login.IDIndividu inner join "
		query += "appartenance on individu.ID = appartenance.IDIndividu inner join \"location du bureau\" as A on A.ID = ";
		query += "appartenance.IDBureau;"; 
					
		let tempResult = await faire_un_simple_query(query);
				
		if(!(tempResult.second == false))
		{	
						if(tempResult.first.length == 0)
						{
							if(res != undefined)
								dummyResponseSimple(res);
							return {first:false,second:undefined};
						}
						else
						{
							for(let i = 0; i < tempResult.first.length; ++i)
							{
								if( tempResult.first[i].idindividu == userAuthentification.ID && tempResult.first[i].password == userAuthentification.pass) 
								{
									//console.log("This guy is logged in.");
									let addResult = addUser(tempResult.first[i].idindividu,tempResult.first[i]["prenom"],tempResult.first[i].nom,
										tempResult.first[i].genre,tempResult.first[i]['Date de naissance'].toLocaleString(undefined,{day:'numeric',month:'numeric',year:'numeric'}),tempResult.first[i]["début"],tempResult.first[i].fin
										,tempResult.first[i].password,tempResult.first[i].idbureau,tempResult.first[i]['Nom du Bureau'],
										tempResult.first[i].latitude,tempResult.first[i].longitude,tempResult.first[i].admin
										,tempResult.first[i].superadmin,tempResult.first[i].User,tempResult.first[i]["Key Admin"]);
									
									return {first:true,second:undefined,element:addResult.userAuthentification};
								}

							}
							//console.log("This guy is not logged in");
							if(res != undefined)
								dummyResponseSimple(res);
							return {first:false,second:undefined,third:false};
						}
		}
		else 
		{
			console.log("Error from query " +error);
			if(res != undefined)
				dummyResponseSimple(res);
			return {first:false,second:undefined,third:true};
		}
	}
			
	async function forced_authentification_query(userAuthentification,res)
	{
		let returnValue = findUserShort(userAuthentification.ID,userAuthentification.pass);
		if( returnValue.found )
		{
			return true;
		}
					
		let query = "SELECT  * FROM individu inner join login on individu.ID = login.IDIndividu;"; 
		let tempResult = await faire_un_simple_query(query);
					
		if(!(tempResult.second == false))
		{		
			if(tempResult.first.length == 0)
			{
				if(res != undefined)
				dummyResponseSimple(res);
				return false;
			}
			else
			{
				for(let i = 0; i < tempResult.first.length; ++i)
				{
					//console.log("ID "+tempResult.first[i].id +" Password "+tempResult.first[i].password);
					//console.log("ID "+userAuthentification.ID+" Password "+userAuthentification.pass);
								
					if( tempResult.first[i].id == userAuthentification.ID && tempResult.first[i].password == userAuthentification.pass) 
					{
						//console.log("This guy is logged in.");
						return true;
					}
								
				}
				//console.log("This guy is not logged in");
				if(res != undefined)
					dummyResponseSimple(res);
					return false;
			}
		}
		else 
		{
			console.log("Error from query " +error);
			dummyResponseSimple(res);
			return false;
		}
	}
			
			function findTypeofAdminShort(ID,password)
			{
				for(let loginGuysCount = 0; loginGuysCount < connectedguys.length;++loginGuysCount)
				{
					if(connectedguys[loginGuysCount].ID == ID  )
					{
						if( connectedguys[loginGuysCount].admin )
							return {found:true,index:loginGuysCount,admin:true,element:connectedguys[loginGuysCount]};
						if( connectedguys[loginGuysCount].superadmin )
							return {found:true,index:loginGuysCount,superadmin:true,element:connectedguys[loginGuysCount]};
						if( connectedguys[loginGuysCount].user )
							return {found:true,index:loginGuysCount,user:true,element:connectedguys[loginGuysCount]};
						if( connectedguys[loginGuysCount]["Key Admin"]  )
							return {found:true,index:loginGuysCount,"Key Admin":true,element:connectedguys[loginGuysCount]};
					}
				}
				return {found:false,index:-1};
			}
			
			function findUserShort(ID,password)
			{
				for(let loginGuysCount = 0; loginGuysCount < connectedguys.length;++loginGuysCount)
				{
					if(connectedguys[loginGuysCount].ID == ID && connectedguys[loginGuysCount].pwd == password)
					{
						return {found:true,index:loginGuysCount,element:connectedguys[loginGuysCount]};
					}
				}
				return {found:false,index:-1};
			}
			
			function findUser(ID,first,second,gender,birthdate,begin,end,pwd,locID,locName,admin,superadmin,user,keyadmin)
			{
				for(let loginGuysCount = 0; loginGuysCount < connectedguys.length;++loginGuysCount)
				{
					if(connectedguys[loginGuysCount].ID == ID && connectedguys[loginGuysCount].first == first 
						&& connectedguys[loginGuysCount].second == second && connectedguys[loginGuysCount].gender == gender
						&& connectedguys[loginGuysCount].birthdate == birthdate && connectedguys[loginGuysCount].begin == begin
						&& connectedguys[loginGuysCount].locationID == locID && connectedguys[loginGuysCount].locationName == locName
						&& connectedguys[loginGuysCount].end == end && connectedguys[loginGuysCount].pwd == pwd
						&& connectedguys[loginGuysCount].admin == admin && connectedguys[loginGuysCount].superadmin == superadmin
						&& connectedguys[loginGuysCount].user == user && connectedguys[loginGuysCount].keyadmin == keyadmin )
					{
						return {found:true,index:loginGuysCount,element:connectedguys[loginGuysCount]};
					}
				}
				return {found:false,index:-1};
			}
			
			function findLink(commandName)
			{
				for(let loginGuysCount = 0; loginGuysCount < filesdirectories.length;++loginGuysCount)
				{
					if( filesdirectories[loginGuysCount].command == commandName )
					{
						return filesdirectories[loginGuysCount].path;
					}
				}
				return "";
			}

			function addUser (IDparam,firstparam,secondparam,genderparam,
				birthdateparam,beginparam,endparam,pwdparam,
				IDLoc,NameLoc,latitude,longitude,
				adminparam,superadminparam,userparam,keyadminparam)
			{
				
				let aconnecedGuy = 
				{ 
					ID: IDparam,first:firstparam,second:secondparam,gender:genderparam,
					birthdate:birthdateparam,begin:beginparam,end:endparam,pwd:pwdparam,
					locationID:IDLoc,locationName:NameLoc,lati:latitude,longi:longitude,
					admin:adminparam,superadmin:superadminparam,user:userparam,"Key Admin":keyadminparam,
					userAuthentification: {ID:IDparam,Prenom:firstparam,Nom:secondparam,genre:genderparam,naissance:birthdateparam,pass:pwdparam,
					locationID:IDLoc,locationName:NameLoc,lati:latitude,longi:longitude,superadmin:superadminparam,admin:adminparam,user:userparam,"Key Admin":keyadminparam}
					,commands:[]
				};
				
				let findResult = !findUser(IDparam,firstparam,secondparam,genderparam,birthdateparam,beginparam,endparam,
					pwdparam,IDLoc,NameLoc,adminparam,superadminparam,userparam,keyadminparam);
				
				if(!findResult.found)
				{
					connectedguys.push(aconnecedGuy); 
					return aconnecedGuy;
				}

				return findResult.element;

			}
			
			async function check_super_admin(userAuthentification,aconnection,res)
			{
				let result = findTypeofAdminShort(userAuthentification.ID,userAuthentification.pass);
				if(result.found)
				{
					return {first:result.element.userAuthentification.superadmin,second:result.element.userAuthentification.admin,
					third:result.element.userAuthentification.user,fourth:result.element.userAuthentification["Key Admin"]};
				}
				
				let query = "SELECT IDIndividu,SuperAdmin, Admin, \"User\",\"Key Admin\",Password FROM login inner join ";
				query+= "individu ON individu.ID = login.IDIndividu;"; 
					
				let notAnError = await faire_un_simple_query(query);
				
				if(!(notAnError.second == false))
				{
					let authenticated = false;
					console.log(query);
					console.log(userAuthentification);
					console.log(notAnError.first);
					
					if(notAnError.first.length == 0)
					{
						//console.log(notAnError);
						//console.log({first:false,second:false,third:false,fourth:false});
						return {first:false,second:false,third:false,fourth:false};
					}
					else
					{
						//console.log(notAnError);
						for(let u = 0; u < notAnError.first.length; u++)
						{	
							//console.log("Super Admin "+notAnError.first[u].superadmin);
							//console.log("Admin "+notAnError.first[u].admin);
							//console.log("User "+notAnError.first[u].User);
							//console.log("ID "+userAuthentification.ID);
							//console.log(notAnError.first[u].idindividu+" == "+userAuthentification.ID);
							//console.log(userAuthentification.pass+" == "+userAuthentification.pass);
							
							/*if(u == 1)
							{
								console.log(notAnError.first[u].idindividu == userAuthentification.ID);
								console.log(notAnError.first[u].password == userAuthentification.pass);
							}*/
							
							if(notAnError.first[u].superadmin == 1 && notAnError.first[u].idindividu == userAuthentification.ID
							&& notAnError.first[u].password == userAuthentification.pass)
							{
								//console.log({first:true,second:false,third:false,fourth:false});
								return {first:true,second:false,third:false,fourth:false};
							}
							
							if(notAnError.first[u].admin == 1 && notAnError.first[u].idindividu == userAuthentification.ID
							&& notAnError.first[u].password == userAuthentification.pass)
							{
								//console.log({first:false,second:true,third:false,fourth:false});
								return {first:false,second:true,third:false,fourth:false};
							}
								
							if(notAnError.first[u].User == 1 && notAnError.first[u].idindividu == userAuthentification.ID
							&& notAnError.first[u].password == userAuthentification.pass)
							{
								//console.log({first:false,second:false,third:true,fourth:false});
								return {first:false,second:false,third:true,fourth:false};
							}
							
							if(notAnError.first[u].keyadmin == 1 && notAnError.first[u].idindividu == userAuthentification.ID
							&& notAnError.first[u].password == userAuthentification.pass)
							{
								//console.log({first:false,second:false,third:false,fourth:true});
								return {first:false,second:false,third:false,fourth:true};
							}
							
						}	
						
						return {first:false,second:false,third:false,fourth:false};
					}
						
				}
				else
				{
					//console.log(notAnError);
					return {first:false,second:false,third:false,fourth:false};
				}
				
			}
			
			
			
			function dummyResponseSimple(res)
			{
				if(res === undefined || res.writableEnded)
					return;
				res.writeHead(500, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
					,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
					,"Access-Control-Max-Age":'86400'
					,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
					});
				res.write(JSON.stringify(
				{
					XLength : 0,
					YLength : 0,
					error: true,
					desc: "wrong credentials for such request"
				}
				));
				res.end();
			}	

			function dummyResponse(res,ares)
			{
				if(res === undefined || res.writableEnded)
					return;
				res.writeHead(500, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
					,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
					,"Access-Control-Max-Age":'86400'
					,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
					});
				res.write(JSON.stringify(ares));
				res.end();
			}	

			function createEmployeeDailyObject(stringsStuff,imgsrc,missionBoolean,vacationBoolean,absenceBoolean,retardBoolean,maladieBoolean,criticalretardBoolean,presenceBoolean,dateValue)
			{
				let employeeContentModel 
				=
				{
					strings:stringsStuff,
					img: {exists: (imgsrc == undefined || imgsr == null ),src: (imgsrc == undefined)? undefined: ((imgsrc == null)? undefined:imgsrc)}, 
					imgClass: "smallandRoundImg",
					wrapperParragraph: "flexible",
					wrapperLi: "clickable",
					mission: missionBoolean,
					missionstr: "MISSION",
					vacation: vacationBoolean,
					vacationstr: "VACANCE",
					absence: absenceBoolean,
					absencestr: "ABSENCE",							
					retard: retardBoolean,
					retardstr: "RETARD",
					maladie : maladieBoolean,
					sicknessestr: "MALADIE",
					presence: presenceBoolean,
					present: "PRESENT",
					presenceHours: [],
					entries:[],
					exits:[],
					retardCritical: criticalretardBoolean,
					retardCriticalStr: "RETARD CRITIQUE",
					date: dateValue
				};
											
				return employeeContentModel;
			}
			
			async function getDataForAdminThreeArgs(response,locationArgObj)
			{
				 return await getDataForAdmin(response,locationArgObj,undefined,undefined,undefined,undefined,undefined,false);
			}

			async function getDataForAdminFourArgs(response,locationArgObj,empObj)
			{
				return await getDataForAdmin(response,locationArgObj,empObj,undefined,undefined,undefined,undefined,false);
			}
			
			async function getDataForAdminFiveArgs() 
			{
				return await getDataForAdmin(undefined,undefined,undefined,undefined,undefined,undefined,undefined,true);
			}
			
			async function hoursToEmp(response,empHoursObj)
			{
				if(hoursLocker == undefined)
				{
					hoursLocker = {};
				}
				//console.log(empHoursObj);
				if(hoursLocker[empHoursObj.userAuthentification.ID] == undefined)
				{
					console.log("Inside");
					hoursLocker[empHoursObj.userAuthentification.ID] = {inside:false,object:[]};
					hoursLocker[empHoursObj.userAuthentification.ID].object.push({value:empHoursObj,time: new Date()});
				}
				else 
				{
					console.log("element not found yet");
					let count = 0;
					while(hoursLocker[empHoursObj.userAuthentification.ID])
					{
						if(count == 3)
							break;
						console.log("Sleeping for 500 ms");
						LocalSleep(500);
						++count;
					}
					
					hoursLocker[empHoursObj.userAuthentification.ID].object.forEach((element)=>
					{
						if(element.date == empHoursObj.userAuthentification.date)
						{
							if(element.start == empHoursObj.userAuthentification.start)
							{
								if(element.end == empHoursObj.userAuthentification.end)
								{
									console.log("element found");
									return;
								}
							}	
						}
					});
					
					console.log("Calling getDataForAdmin");
					hoursLocker[empHoursObj.userAuthentification.ID].object.push({value:empHoursObj,time: new Date()});
	
				}
					
				
			
			}
			
			function each5Minutes()
			{
				if(hoursLocker == undefined)
					return;
				if(hoursLocker.keys == undefined)
					return;
				else
					console.log(hoursLocker);
				hoursLocker.keys.forEach((key_element)=>
				{
					deleteElementFromDicsArrayWithTwoArgumentsSecondisDate(key_element,hoursLocker,"object","time")
				});
			}
			
			function deleteElementFromDicsArrayWithTwoArgumentsSecondisDate(ID,dic,first,second)
			{
				let elements = [];
				if(dic[ID] == undefined)return;
				if(dic[ID][first] == undefined) return;
				
				dic[ID][first].forEach((element)=>
				{
					if((new Date()) - element[second] > 300000)
					{
						elements.push(element);
					} 
				});
				
				elements.forEach((element)=>
				{
					dic[ID][first].splice(dic[ID][first].indexOf(element),1);
				});
				
			}
			
			async function getDataForAdmin(response,locationArgObj,empObj,empHoursObj,paramyear,parammonth,paramday,setDateofToday)
			{
				console.trace("Inside getDataForAdmin");
				//console.log(" paramyear "+paramyear+" other paramday "+paramday+" other parammonth "+parammonth);
				//console.log("Location argument "+locationArgObj+" employee argument "+empObj);
				console.log("set date of today "+setDateofToday);
				const updating = (paramyear || parammonth || paramday || empHoursObj || empObj || locationArgObj )
				/*let primSet = false; let count = 2;
				do
				{
					try
					{
						await kvUser.set("primaryObjectsLength",-1);
						primSet = true;
						console.log("PrimaryObjectsLength is set");
					}
					catch(ex)
					{
						console.log(ex);
						primSet = false;
					}
				}
				while(!primSet && count-- >=0);
				*/
				let data = 
				{
					selected_name: 0,
					container : [],
					yearsDic: {},
					nowVisible: false,
					otherVisible : false
				};	
				
				if(primaryObject !== undefined)
					data = primaryObject;
					
				let stopDate = undefined;
				if(empHoursObj != undefined)
				{
					
					if(empHoursObj["day"] != undefined)
					{
						stopDate = empHoursObj["day"];
						empHoursObj["date"] = stopDate;
					}
					else 
					{
						if(empHoursObj["startDay"] != undefined)
						{
							stopDate = empHoursObj["startDay"];
							empHoursObj["date"] = stopDate;
						}
							
						if(empHoursObj["endDay"] != undefined)
						{
							stopDate = empHoursObj["endDay"];
							if(empHoursObj["date"] == undefined)
							{
								empHoursObj["date"] = empHoursObj["endDay"];
							}
						}
					}

					console.log("Stop date");
					console.log(stopDate);
				}

				try
				{
					let totalQuery = "";
					let query = "Select * from \"location du bureau\" ORDER BY Id;";

					if(locationArgObj != undefined)
					{
						//console.log(locationArgObj);
						query = "Select * from \"location du bureau\" where \"location du bureau\".ID = "+locationArgObj.ID+" ORDER BY Id;";
					}
					else if(empObj != undefined)
					{
						query = "Select * from \"location du bureau\" where \"location du bureau\".ID = "+empObj.officeID+" ORDER BY Id;";
					}
					
					
					let checkfornewCommand = false;
					if(locationArgObj != undefined || empObj != undefined || empHoursObj != undefined 
					|| paramday != undefined || parammonth != undefined || paramday != undefined)
					{
						checkfornewCommand = true;
					}

					let result = await faire_un_simple_query(query);
					if(result.second == false ) 
					{
						//console.log(result);
						dummyResponseSimple(response);
						return false;
					}

					let location_index = 0;
					let foundValueForLocation = undefined;

					let dateNow = new Date(Date.now());
					console.log(dateNow.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"}));
					console.log(dateNow);
					//console.log("Date today is "+dateNow.toLocaleString());
					
					let day = Number.parseInt(dateNow.toLocaleString().split("/")[0]);
					let amonth = Number.parseInt(dateNow.toLocaleString().split("/")[1])-1;
					let ayear = Number.parseInt(dateNow.toLocaleString().split("/")[2]);
					//console.log(day+"-"+amonth+"-"+ayear);
					day = dateNow.getDate();
					amonth = dateNow.getMonth();
					ayear = dateNow.getFullYear();
					//console.log(day+"-"+amonth+"-"+ayear);
					let dateToday = new Date(ayear,amonth,day);
					if(stopDate == undefined)
					{
						//stopDate = dateToday;
						stopDate = new Date(ayear,11,31);
						
						if(!setDateofToday && (paramyear && parammonth && paramday))
						{
							stopDate = new Date(paramyear,parammonth-1,paramday);
						}
					}
					amonth += 1;
					//console.log("new date today is "+ dateToday.toLocaleString());
					
					//console.log("Date today is "+dateToday);
					//console.log("Info about response for officeInfo");
					//console.log(result);
					
					for(let i = 0; i < result.first.length; ++i)
					{
						let officeID = result.first[i][result.second[0].name];
						let officeName = result.first[i][result.second[1].name];
						let officeAddresse = result.first[i][result.second[2].name];
						let officeRegion = result.first[i][result.second[3].name];
						let officeLatitude = result.first[i][result.second[4].name];
						let officeLongitude = result.first[i][result.second[5].name];
						let passed = true;
						//console.log(i);
						//console.log(officeName);
						//waitFunction(5000);
						
						var unitLocation = 
						{
							name: officeName,
							ID: officeID,
							OfficeAddresse: officeAddresse,
							OfficeRegion: officeRegion,
							OfficeLatitude: officeLatitude,
							OfficeLongitude: officeLongitude,
							yearsContent: [],
							now: dateNow.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"}),
							setIn:"initialization",
							currentDate: dateNow,
							yearIndex: 0,
							monthIndex: 0,
							weekIndex: 0,
							dayIndex: 0,
							nowVisible: false
						};//done
						
						let foundValueForLocationTemp = getLocation(data,officeID);
						foundValueForLocation = foundValueForLocationTemp.first;
						if(foundValueForLocationTemp.second != undefined)
							location_index = foundValueForLocationTemp.second;
						data.nowVisible = true;
						
						if( foundValueForLocation == undefined )
						{
							location_index = data.container.length;
							data.container.push(unitLocation);
							commands.push({paths:[{path:"container",index:""}], commandObj:{command:"push",value:unitLocation}});
							//console.log("data now contains new location");
						}
						else
						{
							unitLocation = foundValueForLocation;
						}
						

						let locationvalue = "";
						query = "Select * from \"manuel des tables d'entrées et de sorties\";";
						
						if( !( paramyear === undefined  )) 
						{
							query = "Select * from \"manuel des tables d'entrées et de sorties\" where Année = "+paramyear+";";
						}																																		
						else if (empHoursObj != undefined)
						{
							query = "Select * from \"manuel des tables d'entrées et de sorties\" where Année = "+empHoursObj.date.getFullYear()+";";
						}
						
						let result_ = await faire_un_simple_query(query);
						let to_complete = false;

						if(result_.first instanceof Array)
						{	
							let temp_results = FilterElementNotFoundFunction(result_,"année",ayear);
							//console.log(temp_results);
							if(temp_results.first.length == 0)
							{
								to_complete = true;
							}
						}
						else if(result.first == undefined)
						{
							to_complete = true;
						}
						
						if(to_complete)
						{
							let aquery = "create table \""+ayear+" entrées et sorties\" (IDIndividu varchar(255),Date Date,Entrées Time NOT NULL,Sorties VARCHAR(10) DEFAULT NULL, PRIMARY KEY(Date,Entrées,IDIndividu));\n";
							aquery += "create table \""+ayear+" état de l'individu\"  (IDIndividu varchar(255),Date Date,Absence BOOLEAN,Maladie BOOLEAN,Mission BOOLEAN,Congès BOOLEAN,PRIMARY KEY(Date,IDIndividu));\n";
							aquery += " insert into \"manuel des tables d'entrées et de sorties\" values("+ayear+","+"$$"+ayear+" état de l'individu$$" +","+"$$"+ayear+" entrées et sorties$$);\n";
							aquery += "create table \""+ayear+" jours de fêtes et de non travail\" (Name varchar(255),Date Date);"
							aquery += "insert into \"manuel des tables d'entrées et de sorties\" values("+ayear+","+"$$"+ayear+" jours de fêtes et de non travail$$);";
							await faire_un_simple_query(aquery);
							result_ = await faire_un_simple_query(query);
						}
						
						if(result_.second == false && !(result_.second instanceof Array)) 
						{
							dummyResponseSimple(response);
							return false;
						}
						//console.log(query);
						//delete from "manuel des tables d'entrées et de sorties" where  "Etat De L'individu" = '2023 jours de fêtes et de non travail';

						let monthCounts = 0;
						if( (parammonth === undefined) === false)
						{
							monthCounts = parammonth-1;
						}

						if(empHoursObj != undefined)
						{
							monthCounts = empHoursObj.date.getMonth();
						}
						
						let prevMonthCounts = monthCounts;
						
						unitLocation.yearIndexes = [];
						//console.log(result_.first);
						//console.log(0 < result_.first.length);
						//console.log("--------------------------------------------------------------");
						//waitFunction(10000);
						for (let l = 0; l < result_.first.length; ++l)
						{
							//waitFunction(5000);
							monthCounts = prevMonthCounts;
							unitLocation.yearIndex = l; 
							unitLocation.yearIndexes.push(l);
							
							let year = result_.first[l][result_.second[0].name];
							let state = result_.first[l][result_.second[1].name];
							let table = result_.first[l][result_.second[2].name];
							let events = result_.first[l][result_.second[3].name];
							let param_year_month_day = (paramday != undefined && parammonth != undefined && paramyear != undefined)?paramyear+"-"+parammonth+"-"+paramday : undefined;
							let query = "Select * from individu inner join appartenance";
							
							query += " ON appartenance.IDIndividu =  individu.ID";
							query += " inner join \"location du bureau\" ON  appartenance.IDBureau =";
							query += " \"location du bureau\".ID AND EXTRACT(YEAR FROM individu.Début) <= ";
							query += year + " AND EXTRACT(YEAR FROM individu.Fin) >="+year;
							query +=(empObj != undefined)?" AND individu.ID = '"+empObj.ID+"';":((empHoursObj != undefined)?" AND individu.ID = '"+empHoursObj.userAuthentification.ID+"';":";");
							
							query += "Select * FROM";
							query += " \""+state+"\" as A";
							query += (param_year_month_day != undefined)?(" WHERE A.Date ='"+param_year_month_day+"'"):(empObj != undefined)?" WHERE Idindividu = '"+empObj.ID+"'":(empHoursObj != undefined)? " WHERE IdIndividu = '"+empHoursObj.userAuthentification.ID+((empHoursObj.startDay == undefined && empHoursObj.endDay == undefined)?("' AND Date ='"+empHoursObj.date.getFullYear()+"-"+(empHoursObj.date.getMonth()+1)+"-"+empHoursObj.date.getDate()+"'"):(empHoursObj.startDay != undefined && empHoursObj.endDay == undefined)?("' AND Date >='"+empHoursObj.startDay.getFullYear()+"-"+(empHoursObj.startDay.getMonth()+1)+"-"+empHoursObj.startDay.getDate()+"'"):("' AND Date >='"+empHoursObj.startDay.getFullYear()+"-"+(empHoursObj.startDay.getMonth()+1)+"-"+empHoursObj.startDay.getDate()+"' AND Date <='"+empHoursObj.endDay.getFullYear()+"-"+(empHoursObj.endDay.getMonth()+1)+"-"+empHoursObj.endDay.getDate()+"'")):"";
							query += " ORDER BY A.Date ASC;";
							
							query += "Select Case WHEN MIN(\""+table+"\".Entrées) >= '10:00:00' then 1 "; 
							query += "WHEN MIN(\""+table+"\".Entrées) < '10:00:00' then 0 END as CaseOne,";
							query += "Case WHEN  MIN(\""+table+"\".Entrées) > '8:30:00' then 1 ";
							query += "WHEN MIN(\""+table+"\".Entrées) <= '8:30:00' then 0 END as CaseTwo,";
							query += "MIN(\""+table+"\".Entrées), Date ,Idindividu FROM \""+table+"\"";
							query += (param_year_month_day != undefined)?" WHERE Date ='"+param_year_month_day+"'":(empHoursObj== undefined)? ((empObj != undefined)?" WHERE Idindividu = '"+empObj.ID+"'":""):" WHERE Idindividu = '"+empHoursObj.userAuthentification.ID+((empHoursObj.startDay == undefined && empHoursObj.endDay == undefined)?("' AND Date ='"+empHoursObj.date.getFullYear()+"-"+(empHoursObj.date.getMonth()+1)+"-"+empHoursObj.date.getDate()+"'"):(empHoursObj.startDay != undefined && empHoursObj.endDay == undefined)?(" AND Date >='"+empHoursObj.startDay.getFullYear()+"-"+(empHoursObj.startDay.getMonth()+1)+"-"+empHoursObj.startDay.getDate()+"'"):("' AND Date >='"+empHoursObj.startDay.getFullYear()+"-"+(empHoursObj.startDay.getMonth()+1)+"-"+empHoursObj.startDay.getDate()+"' AND Date <='"+empHoursObj.endDay.getFullYear()+"-"+(empHoursObj.endDay.getMonth()+1)+"-"+empHoursObj.endDay.getDate()+"'"));
							query += " GROUP BY Date, Idindividu ORDER BY Date ASC;";
							
							/*When employee hours object is used for fulfilling missions
							and the like the date must be changing not fixed to one value.*/
							query += "Select * FROM";
							query += " \""+table+"\" as A";
							query += (empObj == undefined)?((empHoursObj == undefined)?"":" where A.Idindividu ='"+empHoursObj.userAuthentification.ID+"'"):" where A.Idindividu ='"+empObj.ID+"'";
							query += " GROUP BY Entrées,Date,Idindividu ORDER BY Date ASC;";
							query += "Select * from \""+events+"\";";
							
							if(empHoursObj)
							{console.log(query);}
							//console.log(empHoursObj);
							let threeResults = await faire_un_simple_query(query);
							let resultTwo = threeResults[0];
							let aresult = threeResults[2];
							let bresult = threeResults[1];
							let cresult = threeResults[3];
							let dresult = threeResults[4];
							
							let currentDateOfYear =  new Date(year,monthCounts,(paramday == undefined)?(empHoursObj != undefined? empHoursObj.date.getDate():1):paramday);		
							let weekIndex = -1;
							let monthFound = -1;
							let monthIndex = -1;
							let yearIndex = -1;
							let employeeContentModelIndex = -1;
							
							if(empHoursObj != undefined)
							{
								//console.log(query);
								//console.log(bresult);
							}
							
							if(paramyear == undefined)
							{
								if(currentDateOfYear > stopDate )
								{
									//console.log("breaking");
									break;
								}
							}

							let dupMonthCount = 0;
							let dupStartDate = new Date(year,dupMonthCount,1);
							
							let yearsElements = [];
							if( data['yearsDic'][year] == undefined)
							{
								while(dupMonthCount < 12)
								{
									let dayCount = 1;
									let monthEndDate = new Date(year,dupMonthCount+1,0);	
									let date = monthEndDate.getDate();
									console.log(monthEndDate);

									let amonth = 
									{
										elements: [],
										name: monthEndDate.toLocaleString('fr-FR',{month:"long"}),
										index: monthEndDate.getMonth()
									}

									let dupCurrentDate = new Date(year,dupMonthCount,dayCount);
									let startDay = dupCurrentDate.getDay();
									startDay =(startDay == 0)? 6: startDay;
									let backCount = 1;
									while(backCount < startDay)
									{
										let day = 
										{
											name: "",
											month: "",
											day: "",
											year: "",
											empty: true
										}
										amonth.elements.push(day);
										++backCount;
									}
	 
									while(dayCount <= date)
									{
										dupCurrentDate = new Date(year,dupMonthCount,dayCount);
										let filteredValue = FilterDateNotFoudFunction(dresult,"date",dayCount+"-"+(dupMonthCount+1)+"-"+year);
										
										let str = "";
										
										let day = 
										{
											name: dupCurrentDate.toLocaleString('fr-FR',{day:"numeric"})+" "+dupCurrentDate.toLocaleString('fr-FR',{month:"long"}),
											month: dupCurrentDate.getMonth()+1,
											day: dupCurrentDate.getDate(),
											year: dupCurrentDate.getFullYear(),
											empty: false
										}
										amonth.elements.push(day);
										
										
										filteredValue.first.forEach((element)=>
										{
											str += element["name"]+"\n";
											day["eventsname"] = str;
										});
										
										++dayCount;
									}
		
									yearsElements.push(amonth);	
									dupMonthCount++;
								}
								
								data['yearsDic'][year] = yearsElements;
							}

							let yearContentModel = undefined;
							let start_day = 1;
							
							if(paramyear !== undefined )
							{
								let yearContentModelalpha = getYear(unitLocation,paramyear);
								yearContentModel = yearContentModelalpha.first; 
								yearIndex = yearContentModelalpha.second;
							}
							else
							{
								let yearContentModelalpha = getYear(unitLocation,year);
								yearContentModel = yearContentModelalpha.first;
								yearIndex = yearContentModelalpha.second;
							}
							
							if( yearContentModel == undefined)						
							{
								yearContentModel = 
								{
									year: year,
									index: l,
									employees:[],
									empDic:{},
									employeesCount: 0,
									months: [],
									employeeHours: {},
									monthsDetailed: data['yearsDic'][year],
									missions: 0,
									vacations:0,
									absences: 0,
									retards: 0,
									simpleRetards: 0,
									sicknesses: 0,
									presence: 0,
									retardsCritical: 0
								};

								yearIndex = unitLocation.yearsContent.length;
								let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex}], commandObj:{command:"push",value:yearContentModel} };
								pushCommands(command);
								unitLocation.yearsContent.push(yearContentModel);
							}
							
							let testCount = (parammonth == undefined)? 0: parammonth;
							if(empHoursObj != undefined)
							{	
								if(empHoursObj["startDay"] != undefined || empHoursObj["endDay"] != undefined || empHoursObj["day"] != undefined)
								{
									testCount = dateToday.getMonth();
									
									if (empHoursObj["day"] != undefined && empHoursObj["day"] < dateToday)
									{
										testCount = empHoursObj["day"].getMonth();
									}
									else if(empHoursObj["startDay"] != undefined && empHoursObj["startDay"] < dateToday)
									{
										testCount = empHoursObj["startDay"].getMonth();
									}
									else if (empHoursObj["endDay"] != undefined && empHoursObj["endDay"] < dateToday)
									{
										testCount = empHoursObj["endDay"].getMonth();
									}
								}
								else 
								{
									testCount = empHoursObj.date.getMonth();									
								}
							}
								
							let going_yearly_count = (parammonth == undefined)? 12: parammonth + 1;
							if(empHoursObj != undefined)
							{
								if(empHoursObj["startDay"] != undefined || empHoursObj["endDay"] != undefined || empHoursObj["day"] != undefined)
								{
									going_yearly_count = stopDate.getMonth()+1;
								}
								else
									going_yearly_count = empHoursObj.date.getMonth()+1;
							}
							
							//console.log("Test count "+testCount+" year_count "+going_yearly_count+" year "+year);
							//waitFunction(3000);
									
							while( testCount < going_yearly_count )
							{
								
								//console.log("Test count "+testCount+" year_count "+going_yearly_count+" year "+year);
								//waitFunction(1000);
								
								++monthCounts;
								if(locationArgObj == undefined && empObj == undefined && empHoursObj == undefined
								&& paramyear == undefined && parammonth == undefined && paramday == undefined)
								{
									charging_percentage = (testCount)*100 / going_yearly_count;
									//console.log("Monthly charging pourcentage "+ charging_percentage);
								}
								
								var astart = false;
								let startDateOfMonth = new Date(year,monthCounts-1,1);
								//console.log(year);
								//console.log(startDateOfMonth);
								currentDateOfYear = new Date(year,monthCounts-1,(paramday == undefined)?(empHoursObj != undefined? empHoursObj.date.getDate():1):paramday);//I put lower date element of empHours's brace inside date to remain consistent.
								//console.log(currentDateOfYear);
								
								if(paramyear != undefined && parammonth != undefined && paramday != undefined)
								{
									//console.log("Current year "+ year+" current month "+monthCounts-1);
									//console.log("Year passed ="+paramyear+" month passed "+parammonth+" day passed "+paramday);
								}		
								
								if(parammonth == undefined)
								{
									//console.log("Current month "+ (monthCounts));
									//console.log("Count of TestCount "+ testCount++);
									//console.log("Début year loop for month "+(monthCounts+1)+" passing date "+currentDateOfYear+" starting date "+startDateOfMonth);
									++testCount;
								}
								else
								{
									testCount++;
								}
								
								if(parammonth == undefined && currentDateOfYear > stopDate )
								{
									console.log(currentDateOfYear+" > to "+ dateToday);
									console.log("breaking");
									break;
								}
								else if(parammonth == undefined)
								{
									//console.log("Both equal "+ (currentDateOfYear.getMonth() == startDateOfMonth.getMonth())+" Start month "+currentDateOfYear.getMonth()+" end month "+ startDateOfMonth.getMonth());
									//console.log(currentDateOfYear+" not > to "+ dateToday);
								}
								
								let k = 0;
								start_day = 1;
								
								if( !(paramday == undefined) )
								{
									start_day = paramday;
								}
								
								if(empHoursObj != undefined)
								{
									start_day = empHoursObj.date.getDate();
									if(empHoursObj["startDay"] != undefined || empHoursObj["endDay"] != undefined || empHoursObj["day"] != undefined)
									{
										if (empHoursObj["day"] != undefined && empHoursObj["day"] < dateToday)
										{
											start_day = empHoursObj["day"].getDate();
										}
										else if(empHoursObj["startDay"] != undefined && empHoursObj["startDay"] < dateToday)
										{
											start_day = empHoursObj["startDay"].getDate();
										}
										else if (empHoursObj["endDay"] != undefined && empHoursObj["endDay"] < dateToday)
										{
											start_day = empHoursObj["endDay"].getDate(); 
										}
									}
								}
								
								let monthly =  
								{
									month: testCount,
									yearCount: l+1,
									name: startDateOfMonth.toLocaleString('fr-FR',{month:"long"}),
									weeks: [],
									employeeHours: {},
									missions: 0,
									vacations:0,
									absences: 0,
									retards: 0,
									simpleRetards: 0,
									sicknesses: 0,
									presence: 0,
									retardsCritical: 0
								};

								let monthFoundAlpha = undefined;
								let monthSearchIndex = testCount;
								
								if(parammonth != undefined)
								{
									monthSearchIndex = parammonth;//ex prammonth+1 remember date is 11/23/2023 not getMonth() == 10
								}	

								monthFoundAlpha = getMonth(yearContentModel,monthSearchIndex);
								monthFound = monthFoundAlpha.first;
								
								/*if(currentDateOfYear.getDate() == 24 && currentDateOfYear.getMonth() == 3 && currentDateOfYear.getFullYear() == 2024)
								{
									console.log(currentDateOfYear);
									console.log("monthSearchIndex:"+monthSearchIndex);
									console.log(monthFoundAlpha);
									console.log(monthly);
									waitFunction(40000);
								}*/
								
								if( monthFound == undefined && parammonth != undefined )
								{
									//console.log(yearContentModel.months);
									//console.log("The value of paramonth is "+parammonth);
									//console.log("The length of months is "+yearContentModel.months.length)
								}
								
								if(parammonth != undefined && monthFound == undefined)
								{
									monthIndex = yearContentModel.months.length;
									let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex}], commandObj:{command:"push",value:monthly} };
									pushCommands(command);
									yearContentModel.months.push(monthly);
								}
								else if (parammonth == undefined && monthFound == undefined)
								{	
									monthIndex = yearContentModel.months.length;
									let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex}], commandObj:{command:"push",value:monthly} };
									pushCommands(command);
									yearContentModel.months.push(monthly);
								}
								else
								{
									monthIndex = monthFoundAlpha.second;
								}
								
								//console.log("MonthIndex is "+monthIndex);
								//console.log("Month found is?");
								//console.log(monthFound);
								//console.log("Month search index is "+monthSearchIndex);
								
								let weekNo = 1;
								let weekDayIndex = 0;
								
								let value = currentDateOfYear.getMonth() === startDateOfMonth.getMonth();
								let nombre_de_jours = (new Date(currentDateOfYear.getFullYear(),currentDateOfYear.getMonth()+1,0)).getDate();
								
								//console.log(currentDateOfYear);
								//console.log("Month is "+currentDateOfYear.getMonth());
								//console.log("Nombre de jours "+(new Date(currentDateOfYear.getFullYear(),currentDateOfYear.getMonth()+1,0)).getDate());
								
								if(paramday != undefined)
									nombre_de_jours = paramday;
								if( empHoursObj != undefined ) 
								{
									if(empHoursObj["startDay"] == undefined && empHoursObj["endDay"] == undefined && empHoursObj["day"] == undefined)
									{
										nombre_de_jours  = stopDate.getDate();
									}
								}

								//console.log(" What is the result of the comparison " + value);
								let dateTransformer = [6,0,1,2,3,4,5];
								let offset = dateTransformer[startDateOfMonth.getDay()]-1;
								//console.log(" Day based on offset is "+currentDateOfYear.getDay()+" date is "+currentDateOfYear);
								//console.log("Waw! we are corrupted");
								
								if( monthIndex == 9 )
								{
									//console.log("Jour de début " + start_day);
									//console.log("Nombre de jours " + nombre_de_jours);
									//console.log("Month counts " + monthCounts);
									//console.log("Current month " + currentDateOfYear.getMonth());
								}
								
								if(empHoursObj)
								{
									console.log("Jour de début " + start_day);
									console.log("Nombre de jours " + nombre_de_jours);
								}	
								
								while( start_day <= nombre_de_jours)
								{
									currentDateOfYear = new Date(year,monthCounts-1,start_day);
									if( empHoursObj )
									{
										console.log("Employee Hours...");
										//console.log(currentDateOfYear);console.log(bresult);
									}
									
									if( monthIndex == 9 )
									{
										//console.log("Jour de début "+start_day);
										//console.log("Nombre de jours "+nombre_de_jours);
										//console.log(currentDateOfYear);
										//console.log(monthCounts);
									}
									
									if(monthCounts-1 > dateNow.getMonth())
									{
										//console.log(currentDateOfYear.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"}));
										//console.log(year+"-"+monthCounts+"-"+start_day);
									}
									
									/* if(currentDateOfYear.getMonth() >= 9 && monthIndex == 9 && currentDateOfYear.getDate() > 27)
									{
										console.log(currentDateOfYear.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"}));
										console.log(year+"-"+monthCounts+"-"+start_day);
									} */
									
									/* if(currentDateOfYear.getMonth() == 9)
									{
										console.log("astart "+astart);
										console.log("weekNo "+weekNo);
										console.log("<=?"+( Math.floor((start_day + offset)/ 7) + 1));
									} */
									
									let aresultFiltered = FilterDateNotFoudFunction(aresult,"date",currentDateOfYear.getDate()+"-"+(currentDateOfYear.getMonth()+1)+"-"+currentDateOfYear.getFullYear());
									let bresultFiltered = FilterDateNotFoudFunction(bresult,"date",currentDateOfYear.getDate()+"-"+(currentDateOfYear.getMonth()+1)+"-"+currentDateOfYear.getFullYear());
									
									//console.log("bresultFiltered  by date "+currentDateOfYear.getDate()+"-"+(currentDateOfYear.getMonth()+1)+"-"+currentDateOfYear.getYear());
									//console.log(bresultFiltered);
									let cresultFiltered = FilterDateNotFoudFunction(cresult,"date",currentDateOfYear.getDate()+"-"+(currentDateOfYear.getMonth()+1)+"-"+currentDateOfYear.getFullYear());
									let dresultFiltered = FilterDateNotFoudFunction(dresult,"date",currentDateOfYear.getDate()+"-"+(currentDateOfYear.getMonth()+1)+"-"+currentDateOfYear.getFullYear());
									//console.log(currentDateOfYear);
									
									
									if(paramday != undefined || empHoursObj != undefined)
									{
										if( start_day + offset >= 7)
										{
											weekDayIndex = (start_day + offset)%7 ;
										}
										else
										{
											weekDayIndex = start_day -1;
										}
									}
									else
									{
										if( start_day + offset >= 7)
										{
											weekDayIndex = (start_day + offset)%7 ;
										}
										else
										{
											weekDayIndex = start_day -1;
										}
									}
									
									if(currentDateOfYear > stopDate)
									{	
										console.log(currentDateOfYear+" > to "+ stopDate);
										console.log("breaking");
										break;
									}
									
									
									let tempdate = currentDateOfYear.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"});
									let queryDate = currentDateOfYear.toLocaleString('fr-FR',{year:"numeric",month:"numeric",day:"numeric"});
									
									queryDate = queryDate.split("/");
									queryDate = queryDate[2]+"-"+queryDate[1]+"-"+queryDate[0];
									//console.log("Date passing is "+tempdate+" date today is "+dateToday);
									
									let nowDate = undefined;
									let nowDateStr = "";
									
									let currentday = start_day;
									let currentmonth = monthCounts;
									let currentYear = year;
									
									//console.log("Start day is "+ start_day);
									if( monthCounts == 7 || monthCounts-1 == 0)
									{
										//console.log("This day "+currentDateOfYear+" in week no "+ weekNo +" but the start day is "+start_day);
										//console.log("Offset is "+offset+" weekNo current is calculated "+Math.floor((start_day+offset)/ 7));
									}
									
									
									if( astart == false || weekNo < (Math.floor((start_day + offset)/ 7) + 1))
									{
										if(paramday != undefined || empHoursObj != undefined)
										{
											if( start_day + offset >= 7)
											{
												weekDayIndex = (start_day + offset) % 7 ;
											}
											else
											{
												weekDayIndex = start_day -1;
											}
										}
										else
										{ 
											if( start_day + offset >= 7)
											{
												weekDayIndex = (start_day + offset)%7 ;
											}
											else
											{
												weekDayIndex = start_day -1;
											}
										}
										
										astart = true;
										weekNo = Math.floor((start_day + offset)/ 7)+1;
										//console.log("start of day "+start_day+" + offset "+offset+" Updated week no "+ weekNo);
										
										let week = 
										{
											weekNo: weekNo,
											employeeHours: {},
											days: [],
											missions: 0,
											vacations:0,
											absences: 0,
											retards: 0,
											simpleRetards: 0,
											sicknesses: 0,
											presence: 0,
											retardsCritical: 0
										};
										
										let weekFoundAlpha = getWeek(yearContentModel.months[monthCounts-1],weekNo);
										let weekFound = weekFoundAlpha.first;

										if(empObj != undefined)
										{
											//console.log(weekNo);
											//console.log(weekFound);		
										}
										
										if(currentDateOfYear == todaysDate)
										{
											//console.log(weekFound);
										}

										if( weekFound == undefined )
										{	
											
											weekIndex = yearContentModel.months[monthIndex].weeks.length;
											yearContentModel.months[monthIndex].weeks.push(week);
											let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex}], commandObj:{command:"push",value:week} };
											pushCommands(command);
											
											//if(currentDateOfYear.getMonth() == 9 && monthIndex == 9)												
											//{
												//console.log("new week added "+weekIndex);
												//console.log("month index is "+ monthIndex);
												//console.log("month is "+ yearContentModel.months[monthIndex].month+" month name is "+yearContentModel.months[monthIndex].name);
												//console.log(yearContentModel.months);
											//}
										
										}
										else
										{
											weekIndex = weekFoundAlpha.second;
											//if(currentDateOfYear == todaysDate)
												//console.log("old weekIndex found "+weekIndex);
										}
									}
									
									
									//console.log(currentmonth); console.log(currentday); console.log(currentYear);
									//console.log(amonth); console.log(day); console.log(ayear);
									//console.log(currentDateOfYear);
									
									
									if( currentmonth == amonth
										&& currentday == day && currentYear == ayear && setDateofToday)
									{	
										nowDate = currentDateOfYear;
										nowDateStr = day+"-"+amonth+"-"+ayear;
										//console.log("Current time is current time "+currentDateOfYear.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"}));
										//console.log(nowDateStr);
										//console.log(currentDateOfYear);
										//console.log(dateNow);
										unitLocation.now = currentDateOfYear.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"});
										unitLocation.setIn = "ElementSetInDaily "+currentDateOfYear.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"});
										unitLocation.currentDate = currentDateOfYear;
										unitLocation.nowVisible = true;
										unitLocation.yearIndex = l;
										unitLocation.monthIndex = monthCounts-1;
										unitLocation.dayIndex = weekDayIndex;
										unitLocation.weekIndex = weekNo-1;
									}
									
									
									let options = { year: "numeric", month: "long", day: "numeric"};
									let days = 
									{
										date: currentDateOfYear.toLocaleString('fr-FR',options),
										day: currentDateOfYear.getDate(),
										identities:{},
										empDicofAbsences:{},
										empDicofMissions:{},
										empDicofPresences:{},
										empDicofSicknesses:{},
										empDicofCritical:{},
										empDicofRetards:{},
										empDicofVacances:{}, 
										absences: 0,
										employeeHours: {},
										absencesdates: [],
										missions: 0,
										missionsdates: [],
										presence: 0,
										presencedates: [],
										sicknesses: 0,
										sicknessesdates: [],
										retards: 0,
										simpleRetardsdates: [],
										simpleRetards: 0,
										retardsdates:[],
										retardsCritical: 0,
										retardsCriticaldates:[],
										vacations:0,
										vacationsdates:[]
									};
									
									//console.log("month "+monthIndex+" week no is "+weekNo+" weekDayIndex "+ weekDayIndex+" weeks data length is "+yearContentModel.months[monthIndex].weeks.length);
									let daySearchIndex = start_day;
									
									if(paramday != undefined)
									{
										daySearchIndex = paramday;
									}
									
									let dayFoundAlpha = getDay(yearContentModel.months[monthIndex].weeks[weekIndex],daySearchIndex);
									let dayFound = dayFoundAlpha.first; 
									let dayIndex = -1;

									if( dayFound === undefined)
									{
										dayIndex = yearContentModel.months[monthIndex].weeks[weekIndex].days.length;
										yearContentModel.months[monthIndex].weeks[weekIndex].days.push(days);
										let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:dayIndex}], commandObj:{command:"push",value:days} };
										pushCommands(command);
									}
									else
									{
										dayIndex = dayFoundAlpha.second;
									}
									
									
									if(resultTwo.second == false ) 
									{
										base_init_exiting = true;
										return false;
									}

									if(resultTwo.second !== false)
									{
										for( let m = 0; m < resultTwo.first.length; ++m)
										{
											let IDIndividu = resultTwo.first[m][resultTwo.second[9].name];
											let debut = resultTwo.first[m][resultTwo.second[7].name];
											let end = resultTwo.first[m][resultTwo.second[8].name];
											let profession = resultTwo.first[m][resultTwo.second[6].name];
											let IDBureau = resultTwo.first[m][resultTwo.second[10].name];
											//console.log("Inside m which is "+m);
											//console.log(IDIndividu);
											//console.log(debut);
											//console.log(end);
											//console.log(profession);
											if(unitLocation.ID != IDBureau)
												continue;
											
											let employeeContentModel = getEmployeeContentModel(yearContentModel.months[monthIndex].weeks[weekIndex].days[weekDayIndex],IDIndividu);
											let employeeDescribed = undefined;

											let imgsrc = resultTwo.first[m].img;
											let empModeldefined = false;
											if(employeeContentModel == undefined)
											{	
												empModeldefined = true;
												employeeContentModel = 
												{
													strings:[],
													ID: IDIndividu,
													img: {exists: undefined,src: undefined}, 
													imgClass: "smallandRoundImg",
													wrapperParragraph: "flexible",
													wrapperLi: "clickable",
													mission: false,
													missionstr: "MISSION",
													vacation: false,
													vacationstr: "VACANCE",
													absence: false,
													absencestr: "ABSENCE",
													retard: false,
													retardstr: "RETARD",
													maladie : false,
													sicknessestr: "MALADIE",
													presence: false,
													present: "PRESENT",
													entriesexitsCouples: [],
													presenceHours: [],
													entries:[],
													exits:[],
													retardCritical: false,
													retardCriticalStr: "RETARD CRITIQUE", 
													date: ""
												};
											}

												employeeDescribed = 
												{
													img: {exists: undefined,src: undefined},  
													imgClass: "smallandRoundImg", 
													wrapperParragraph: "flexible",
													wrapperLi: "clickableBasic",
													ID: IDIndividu,
													strings: [],
													profession: profession,
													startdate: debut.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"}),
													enddate: end.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"}),
													vacationsDaysAllowed: 20,
													vacationsDaysLeft: 20,
													missiondates:{count:0,other:[]},
													sicknessdates:{count:0,other:[]},
													vacationdates:{count:0,other:[]},
													absencedates:{count:0,other:[]},
													presencedates:{count:0,other:[]},
													retarddates:{count:0,other:[]},
													criticalretarddates:{count:0,other:[]},
													overallretarddates:{count:0,other:[]},
													months: [
														{
															month:"Janvier",
															missiondates:{count:0,other:[]},
															presencedates:{count:0,other:[]},
															vacationdates:{count:0,other:[]},
															absencedates:{count:0,other:[]},
															sicknessdates:{count:0,other:[]},
															retarddates:{count:0,other:[]},
															criticalretarddates:{count:0,other:[]},
															overallretarddates:{count:0,other:[]},
															weeks:[]
														},
														{
															month:"Février",
															missiondates:{count:0,other:[]},
															presencedates:{count:0,other:[]},
															vacationdates:{count:0,other:[]},
															absencedates:{count:0,other:[]},
															sicknessdates:{count:0,other:[]},
															retarddates:{count:0,other:[]},
															criticalretarddates:{count:0,other:[]},
															overallretarddates:{count:0,other:[]},
															weeks:[]
														},
														{
															month:"Mars",
															missiondates:{count:0,other:[]},
															presencedates:{count:0,other:[]},
															vacationdates:{count:0,other:[]},
															absencedates:{count:0,other:[]},
															sicknessdates:{count:0,other:[]},
															retarddates:{count:0,other:[]},
															criticalretarddates:{count:0,other:[]},
															overallretarddates:{count:0,other:[]},
															weeks:[]
														},
														{
															month:"Avril",
															missiondates:{count:0,other:[]},
															presencedates:{count:0,other:[]},
															vacationdates:{count:0,other:[]},
															absencedates:{count:0,other:[]},
															sicknessdates:{count:0,other:[]},
															retarddates:{count:0,other:[]},
															criticalretarddates:{count:0,other:[]},
															overallretarddates:{count:0,other:[]},
															weeks:[]
														},
														{
															month:"Mai",
															missiondates:{count:0,other:[]},
															presencedates:{count:0,other:[]},
															vacationdates:{count:0,other:[]},
															absencedates:{count:0,other:[]},
															sicknessdates:{count:0,other:[]},
															retarddates:{count:0,other:[]},
															criticalretarddates:{count:0,other:[]},
															overallretarddates:{count:0,other:[]},
															weeks:[]
														},
														{
															month:"Juin",
															missiondates:{count:0,other:[]},
															presencedates:{count:0,other:[]},
															vacationdates:{count:0,other:[]},
															absencedates:{count:0,other:[]},
															sicknessdates:{count:0,other:[]},
															retarddates:{count:0,other:[]},
															criticalretarddates:{count:0,other:[]},
															overallretarddates:{count:0,other:[]},
															weeks:[]
														},
														{
															month:"Juillet",
															missiondates:{count:0,other:[]},
															presencedates:{count:0,other:[]},
															vacationdates:{count:0,other:[]},
															absencedates:{count:0,other:[]},
															sicknessdates:{count:0,other:[]},
															retarddates:{count:0,other:[]},
															criticalretarddates:{count:0,other:[]},
															overallretarddates:{count:0,other:[]},
															weeks:[]
														},
														{
															month:"Août",
															missiondates:{count:0,other:[]},
															presencedates:{count:0,other:[]},
															vacationdates:{count:0,other:[]},
															absencedates:{count:0,other:[]},
															sicknessdates:{count:0,other:[]},
															retarddates:{count:0,other:[]},
															criticalretarddates:{count:0,other:[]},
															overallretarddates:{count:0,other:[]},
															weeks:[]
														},
														{
															month:"Septembre",
															missiondates:{count:0,other:[]},
															presencedates:{count:0,other:[]},
															vacationdates:{count:0,other:[]},
															absencedates:{count:0,other:[]},
															sicknessdates:{count:0,other:[]},
															retarddates:{count:0,other:[]},
															criticalretarddates:{count:0,other:[]},
															overallretarddates:{count:0,other:[]},
															weeks:[]
														},
														{
															month:"Octobre",
															missiondates:{count:0,other:[]},
															presencedates:{count:0,other:[]},
															vacationdates:{count:0,other:[]},
															absencedates:{count:0,other:[]},
															sicknessdates:{count:0,other:[]},
															retarddates:{count:0,other:[]},
															criticalretarddates:{count:0,other:[]},
															overallretarddates:{count:0,other:[]},
															weeks:[]
														},
														{
															month:"Novembre",
															missiondates:{count:0,other:[]},
															presencedates:{count:0,other:[]},
															vacationdates:{count:0,other:[]},
															absencedates:{count:0,other:[]},
															sicknessdates:{count:0,other:[]},
															retarddates:{count:0,other:[]},
															criticalretarddates:{count:0,other:[]},
															overallretarddates:{count:0,other:[]},
															weeks:[]
														},
														{
															month:"Décembre",
															missiondates:{count:0,other:[]},
															presencedates:{count:0,other:[]},
															vacationdates:{count:0,other:[]},
															absencedates:{count:0,other:[]},
															sicknessdates:{count:0,other:[]},
															retarddates:{count:0,other:[]},
															criticalretarddates:{count:0,other:[]},
															overallretarddates:{count:0,other:[]},
															weeks:[]
														}]
												};

												if(imgsrc == undefined)
												{
													if(empModeldefined)
														employeeContentModel.img = {exists: false,src:""};
													employeeDescribed.img = {exists: false,src:""};	
												}
												else
												{
													if(empModeldefined)
														employeeContentModel.img = {exists: true,src:imgsrc};
													employeeDescribed.img = {exists: true,src:imgsrc};
												}

												if(empModeldefined)
												{
													employeeContentModel.strings.push(resultTwo.first[m][resultTwo.second[9].name]);
													employeeContentModel.strings.push(resultTwo.first[m][resultTwo.second[2].name]);
													employeeContentModel.strings.push(resultTwo.first[m][resultTwo.second[3].name]);
													employeeContentModel.strings.push(resultTwo.first[m][resultTwo.second[4].name]);
													employeeContentModel.strings.push(resultTwo.first[m][resultTwo.second[13].name]);
												}

												employeeDescribed.strings.push(resultTwo.first[m][resultTwo.second[9].name]);
												employeeDescribed.strings.push(resultTwo.first[m][resultTwo.second[2].name]);
												employeeDescribed.strings.push(resultTwo.first[m][resultTwo.second[3].name]);
												employeeDescribed.strings.push(resultTwo.first[m][resultTwo.second[4].name]);
												employeeDescribed.strings.push(resultTwo.first[m][resultTwo.second[13].name]);
												
												let existing_element = false;
												for(let i = 0; i < yearContentModel.employees.length && !existing_element;++i)
												{
													if(yearContentModel.employees[i].ID == employeeDescribed.ID 
														&& yearContentModel.employees[i].startdate == employeeDescribed.startdate && employeeDescribed.enddate == yearContentModel.employees[i].enddate)
													{
														let allFound = true;
														for( let k = 0; k < employeeDescribed.strings.length;++k)
														{
															if(employeeDescribed.strings[k] !== yearContentModel.employees[i].strings[k])
															{
																allFound = false;
															}
														}
														
														if(allFound)
														{
															existing_element = true;
														}
													}
												}

												if(existing_element == false)
												{
													//console.log("New Element added");
													if(updating)
													{
														let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"employees"}], commandObj:{command:"push",value:employeeDescribed} };
														pushCommands(command);
														command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"empDic"}], commandObj:{command:"setKeyValue",value:employeeDescribed} };
														pushCommands(command);
														command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"employees"}], commandObj:{command:"inc",path:"employeesCount"} };
														pushCommands(command);
													}
													yearContentModel.employees.push(employeeDescribed);
													yearContentModel.empDic[employeeDescribed.ID] = employeeDescribed;
													yearContentModel.employeesCount++;
												}
												
												let prevyearContentModelalpha = getYear(unitLocation,year-1);
												let prevyearContentModel = prevyearContentModelalpha.first;
												let prevyearContentModelindex = prevyearContentModelalpha.second;
												
												
												if(prevyearContentModelindex != undefined)
												{
													if( prevyearContentModel.empDic[employeeDescribed.ID] != undefined && prevyearContentModel.empDic[employeeDescribed.ID].vacationsDaysAllowed > 0)
													{
														if(updating)
														{
															command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"empDic",index:employeeDescribed.ID},{path:"vacationsDaysLeft"}], commandObj:{command:"add",value:prevyearContentModel.empDic[employeeDescribed.ID].vacationsDaysLeft} };
															pushCommands(command);
															command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"empDic",index:employeeDescribed.ID},{path:"vacationsDaysAllowed"}], commandObj:{command:"add",value:prevyearContentModel.empDic[employeeDescribed.ID].vacationsDaysLeft} };
															pushCommands(command);
														
															command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex-1},{path:"empDic",index:employeeDescribed.ID},{path:"movedTo"}], commandObj:{command:"set",value:0} };
															pushCommands(command);
															command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex-1},{path:"empDic",index:employeeDescribed.ID},{path:"vacationsDaysLeft"}], commandObj:{command:"set",value:{year:year-1,numberofVacations:prevyearContentModel.empDic[employeeDescribed.ID].vacationsDaysLeft}} };
															pushCommands(command);
														}
														yearContentModel.empDic[employeeDescribed.ID].vacationsDaysLeft += prevyearContentModel.empDic[employeeDescribed.ID].vacationsDaysLeft;
														yearContentModel.empDic[employeeDescribed.ID].vacationsDaysAllowed += prevyearContentModel.empDic[employeeDescribed.ID].vacationsDaysLeft;
														prevyearContentModel.empDic[employeeDescribed.ID].movedTo = {year:year-1,numberofVacations:prevyearContentModel.empDic[employeeDescribed.ID].vacationsDaysLeft};
														prevyearContentModel.empDic[employeeDescribed.ID].vacationsDaysLeft = 0;
													}
												}
												
											if(aresult.second == false ) 
											{	
												base_init_exiting = true;
												dummyResponseSimple(response);console.log(2855);
												return false;
											}

											if(bresult.second == false ) 
											{
												base_init_exiting = true;
												dummyResponseSimple(response);console.log(2861);
												return false;
											}

											
											if(cresult.second == false ) 
											{
												base_init_exiting = true;
												dummyResponseSimple(response);console.log(2870);
												return false;
											}

											let secondresult = {first:[],second:[]};
											//console.log(aresult.first);
												
											let date = new Date();
											let aresultFilteredb = FilterNotFoundEqualsFunction(aresultFiltered,"idindividu",IDIndividu);
											let bresultFilteredb = FilterNotFoundEqualsFunction(bresultFiltered,"idindividu",IDIndividu);
											let cresultFilteredb = FilterNotFoundEqualsFunction(cresultFiltered,"idindividu",IDIndividu);
											let date2 = new Date();
											//console.log("done filtering "+ (date2 -date)%1000);
		
											secondresult.first.push(aresultFilteredb.first);
											secondresult.first.push(bresultFilteredb.first);
											secondresult.first.push(cresultFilteredb.first);
											
											secondresult.second.push(aresultFilteredb.second);
											secondresult.second.push(bresultFilteredb.second);
											secondresult.second.push(cresultFilteredb.second);
											
											if(yearContentModel.months[monthIndex].weeks[weekIndex].days[dayIndex].employeeHours[employeeContentModel.ID] == undefined)
											{
												if(updating)
												{
													let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:dayIndex},{path:"employeeHours",index:employeeContentModel.ID}], commandObj:{command:"set",value:"00:00:00"} };
													pushCommands(command);
												}		
												yearContentModel.months[monthIndex].weeks[weekIndex].days[dayIndex].employeeHours[employeeContentModel.ID] = "00:00:00";
											}
											if(yearContentModel.months[monthIndex].weeks[weekIndex].employeeHours[employeeContentModel.ID] == undefined)
											{
												if(updating)
												{
													let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"employeeHours",index:employeeContentModel.ID}], commandObj:{command:"set",value:"00:00:00"} };
													pushCommands(command);
												}
												yearContentModel.months[monthIndex].weeks[weekIndex].employeeHours[employeeContentModel.ID] = "00:00:00";
											}
											if(yearContentModel.months[monthIndex].employeeHours[employeeContentModel.ID] == undefined)
											{
												if(updating)
												{
													let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"employeeHours",index:employeeContentModel.ID}], commandObj:{command:"set",value:"00:00:00"} };
													pushCommands(command);
												}
												yearContentModel.months[monthIndex].employeeHours[employeeContentModel.ID] = "00:00:00";
											}
											if(yearContentModel.employeeHours[employeeContentModel.ID] == undefined)
											{
												if(updating)
												{
													let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"employeeHours",index:employeeContentModel.ID}], commandObj:{command:"set",value:"00:00:00"} };
													pushCommands(command);
												}
												yearContentModel.employeeHours[employeeContentModel.ID] = "00:00:00";
											}
											// console.log("*****************************");
											//console.log(aresult);
											//console.log("*********************************");
											
											//beginning of events or holiday
											if( dresultFiltered.first.length > 0 )
											{
												//console.log("Inside d result");
												//console.log(dresultFiltered);
												let str = "";
												dresultFiltered.first.forEach((element)=>
												{
													str += element["name"]+"\n";
													findElementIntoArray(data.yearsDic[year][monthIndex].elements,"day","eventsname",element["date"].getDate(),str);
												});
																								
												if(employeeContentModel.mission)//mission section
												{
													employeeContentModel.mission = false;
													if(updating)
													{
														let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex},{path:"mission"}], commandObj:{commands:[{command:"find",index:employeeContentModel.ID},{command:"set",value:false}]} };
														pushCommands(command,employeeContentModel.ID);
													}
													calculateMission(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
												}
												if(employeeContentModel.absence)//absence section
												{
													employeeContentModel.absence = false;
													if(updating)
													{
														let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex},{path:"absence"}],commandObj:{commands:[{command:"find",index:employeeContentModel.ID},{command:"set",value:false}]} };
														pushCommands(command,employeeContentModel.ID);
													}
													if(currentDateOfYear.getDay() != 0 && currentDateOfYear.getDay() != 6)
													calculateAbsence(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
												}
												if(employeeContentModel.congès)//congès section
												{
													employeeContentModel.congès = false;
													if(updating)
													{
														let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex},{path:"congès"}], commandObj:{commands:[{command:"find",index:employeeContentModel.ID},{command:"set",value:false}]} };
														pushCommands(command,employeeContentModel.ID);
													}
													calculateCongès(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
												}
												if(employeeContentModel.retard)//retards section
												{
													employeeContentModel.retard = false;
													if(updating)
													{
														let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex},{path:"retard"}],commandObj:{commands:[{command:"find",index:employeeContentModel.ID},{command:"set",value:false}]} };
														pushCommands(command,employeeContentModel.ID);
													}
													calculateRetards(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
												}
												if(employeeContentModel.retardCritical)//retards critiques section
												{
													employeeContentModel.retardCritical = false;
													if(updating)
													{
														let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex},{path:"absence"}], commandObj:{commands:[{command:"find",index:employeeContentModel.ID},{command:"set",value:false}]} };
														pushCommands(command,employeeContentModel.ID);
													}
													calculateCriticalRetards(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
												}
											}
											
											if(secondresult.second !== false)//beginning of attendance
											{	
												let dateNowOther = new Date(Date.now());
												let criticallylate = false; 
												let retard = false;
												
												if(secondresult.first[0].length > 0)
												{
													if( secondresult.first[0][0][secondresult.second[0][0].name] == 1 && dresultFiltered.first.length == 0) 
													{
														
														if(employeeContentModel.retard)
														{
															calculateRetards(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
															employeeContentModel.retard = false;
															if(updating)
															{
																let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex},{path:"retard"}], commandObj:{commands:[{command:"find",index:employeeContentModel.ID},{command:"set",value:false}]} };
																pushCommands(command,employeeContentModel.ID);
															}
														}

														employeeContentModel.retardCritical = true;
														employeeContentModel.date = currentDateOfYear.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"});
														criticallylate = true;
														if(updating)
														{
															let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex},{path:"retardCritical"}], commandObj:{commands:[{command:"find",index:employeeContentModel.ID},{command:"set",value:true}]} };
															pushCommands(command,employeeContentModel.ID);
														}
														calculateCriticalRetards(unitLocation,year,1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														
														if(employeeContentModel.absence)
														{																
															if(updating)
															{
																let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex},{path:"absence"}], commandObj:{commands:[{command:"find",index:employeeContentModel.ID},{command:"set",value:false}]} };
																pushCommands(command,employeeContentModel.ID);
															}
															employeeContentModel.absence = false;
															if(currentDateOfYear.getDay() != 0 && currentDateOfYear.getDay() != 6)
															calculateAbsence(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);	
														}
													}
													else if (secondresult.first[0][0][secondresult.second[0][1].name] == 1 && dresultFiltered.first.length == 0) 
													{
														if(employeeContentModel.retardCritical)
														{			
															if(updating)
															{
																let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex},{path:"retardCritical"}], commandObj:{commands:[{command:"find",index:employeeContentModel.ID},{command:"set",value:false}]} };
																pushCommands(command,employeeContentModel.ID);
															}
															employeeContentModel.retardCritical = false;
															calculateCriticalRetards(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														}

															
														if(updating)
														{
															let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex},{path:"retard"}], commandObj:{commands:[{command:"find",index:employeeContentModel.ID},{command:"set",value:true}]} };
															pushCommands(command,employeeContentModel.ID);
														}
														employeeContentModel.retard = true;
														employeeContentModel.date = currentDateOfYear.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"});
														retard = true;	
														
														if(employeeContentModel.absence)
														{
															employeeContentModel.absence = false;
															if(currentDateOfYear.getDay() != 0 && currentDateOfYear.getDay() != 6)
															calculateAbsence(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);	
														}

														calculateRetards(unitLocation,year,1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
													}
													else if (secondresult.first[0][0][secondresult.second[0][2].name] != undefined && secondresult.first[0][0][secondresult.second[0][2].name] != null ) 
													{
														employeeContentModel.presence = true;
														employeeContentModel.date = currentDateOfYear.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"});
														//console.log(employeeContentModel.date);
														//console.log("monthIndex "+monthIndex+" weekIndex "+weekIndex+" weekDayIndex "+weekDayIndex);
														calculatePresence(unitLocation,year,1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);

														if(employeeContentModel.retard)
														{
															//nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].retardsdates.remove(employeeContentModel);
															calculateRetards(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
															employeeContentModel.retard = false;
														}

														if(employeeContentModel.retardCritical)
														{
															//nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].retardsCriticaldates.remove(employeeContentModel);
															calculateCriticalRetards(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
															employeeContentModel.retardCritical = false;
														}
														
														retard = false;	
														
													}

													let index_of_entries_into = 0;
													let elements_not_found = [];

													employeeContentModel.entries.forEach(element=>
													{
														let temp_found = false;
														for(let tempCount = 0; tempCount < secondresult.first[2].length ; ++tempCount)
														{ 
															let a = secondresult.first[2][tempCount][secondresult.second[2][2].name];
															let b = secondresult.first[2][tempCount][secondresult.second[2][3].name];
															
															if(a == element)
															{
																temp_found = true;
															}
														}

														if(!temp_found)
														{
															elements_not_found.push(element);
														}
														++index_of_entries_into;
													});
												
													elements_not_found.forEach(element=>
													{
														let startIndex = employeeContentModel.entries.indexOf(element);
														employeeContentModel.entries.splice(startIndex,1);
														employeeContentModel.exits.splice(startIndex,1);
													});

													for(let tempCount = 0; tempCount < secondresult.first[2].length ; ++tempCount)
													{ 
												
														let a = secondresult.first[2][tempCount][secondresult.second[2][2].name];
														let b = secondresult.first[2][tempCount][secondresult.second[2][3].name];
																
																let couple = "";
																if(b == null || b == undefined || b == "NULL")
																{
																	//console.log("Trying to complete Hour couple");
																	let entriesIndex = employeeContentModel.entries.length;
																	let existsIndex = employeeContentModel.exits.length;
																	let tempcommand = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"employees",index:employeeContentModelIndex},{path:"entries",index:entriesIndex}], commandObj:{command:"push",value:a} };
																	commands.push(tempcommand);
																	tempcommand = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"employees",index:employeeContentModelIndex},{path:"exits",index:existsIndex}], commandObj:{command:"push",value:" "} };
																	commands.push(tempcommand);
																	b = "non définie";
																	let startIndex = employeeContentModel.entries.indexOf(a);
																	
																	if(startIndex != -1)
																	{
																		employeeContentModel.exits[startIndex] = b;
																		//console.log("Empty Second");
																		//console.log(employeeContentModel.entries);
																		//console.log(employeeContentModel.exits);
																	}
																	else
																	{
																		//console.log("Full Second");	
																		employeeContentModel.entries.push(a);
																		employeeContentModel.exits.push(b);
																		//console.log(employeeContentModel.entries);
																		//console.log(employeeContentModel.exits);
																	}

																}
																else
																{					 
																	//console.log("Trying to update Hour couple");
																	let entriesIndex = employeeContentModel.entries.length;
																	let existsIndex = employeeContentModel.exits.length;
																	let tempcommand = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"employees",index:employeeContentModelIndex},{path:"entries",index:entriesIndex}], commandObj:{command:"push",value:a} };
																	commands.push(tempcommand);
																	tempcommand = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"employees",index:employeeContentModelIndex},{path:"exits",index:existsIndex}], commandObj:{command:"push",value:b} };
																	commands.push(tempcommand);
																	let startIndex = employeeContentModel.entries.indexOf(a);
																	
																	let objTemp = {entry:a,exit:b};
																	let objElements = [];
																	objElements.push(objTemp);

																	let value_to_deal_with = compareHoursOneSuperior(a,b)< 0;
																	if(startIndex != -1)
																	{
																		//console.log("Empty Second");
																		if(value_to_deal_with )
																		{
																			employeeContentModel.exits[startIndex] = b;
																		}
																		else
																		{
																			employeeContentModel.entries.splice(startIndex,1);
																		}
																		//console.log(employeeContentModel.entries);
																		//console.log(employeeContentModel.exits);
																	}
																	else
																	{
																		//console.log("Full Second");
																		if(value_to_deal_with)
																		{
																			employeeContentModel.entries.push(a);
																			employeeContentModel.exits.push(b);
																		}
																		//console.log(employeeContentModel.entries);
																		//console.log(employeeContentModel.exits);
																	}	

																	if(value_to_deal_with)
																	{
																		let count;
																		let tempIndex;

																		employeeContentModel.entriesexitsCouples.forEach((element)=>
																		{
																			count = objElements.length;
																			tempIndex = 0;
																			
																			while(tempIndex < count)
																			{
																				if( compareHoursOneSuperior(objTemp.entry,element.entry) >= 0 && compareHoursOneSuperior(objTemp.entry, element.exit) <= 0)
																				{
																					if(compareHoursOneSuperior(objTemp.exit,element.entry) > 0 && compareHoursOneSuperior(objTemp.exit, element.exit) > 0)
																					{
																						objTemp.entry = element.exit ;			
																						objElements.push({entry:objTemp.entry,exit:objTemp.exit});
																					}
																				}
																				else
																				{
																					if(compareHoursOneSuperior(objTemp.exit,element.entry) >= 0 && compareHoursOneSuperior(objTemp.exit, element.exit) <= 0)
																					{
																						objTemp.exit = element.entry ;	
																						objElements.push({entry:objTemp.entry,exit:objTemp.exit});		
																					}
																					else if (compareHoursOneSuperior(objTemp.exit,element.entry) < 0)
																					{
																						objElements.push({entry:objTemp.entry,exit:objTemp.exit});	
																					}
																					else if (compareHoursOneSuperior(objTemp.entry, element.exit) > 0) 
																					{
																						objElements.push({entry:objTemp.entry,exit:objTemp.exit});
																					}
																					else if (compareHoursOneSuperior(objTemp.entry, element.exit) < 0)
																					{
																						objElements.push({entry:objTemp.entry,exit:element.entry});	
																						objElements.push({entry:element.exit,exit:objTemp.exit});
																					}	
																				}
																				++tempIndex;						
																			}

																			tempIndex = 0;
																			while(tempIndex < count)
																			{
																				objElements.splice(0,1);
																				++tempIndex;
																			}						

																		});
																		
																		tempIndex = 0;
																		count = objElements.length;
																		employeeContentModel.dailyHoursTotal = "00:00:00";
																		
																		while(tempIndex < count)
																		{
																			
																			let first = yearContentModel.months[monthIndex].weeks[weekIndex].days[dayIndex].employeeHours[employeeContentModel.ID];
																			let second = yearContentModel.months[monthIndex].weeks[weekIndex].employeeHours[employeeContentModel.ID];
																			let third = yearContentModel.months[monthIndex].employeeHours[employeeContentModel.ID];
																			let fourth = yearContentModel.employeeHours[employeeContentModel.ID];

																			let loopVar = objElements[tempIndex];
																			yearContentModel.months[monthIndex].weeks[weekIndex].days[dayIndex].employeeHours[employeeContentModel.ID] = AddTwoHours(first,SubstractTwoHours(loopVar.entry,loopVar.exit));
																			yearContentModel.months[monthIndex].weeks[weekIndex].employeeHours[employeeContentModel.ID] = AddTwoHours(second,SubstractTwoHours(loopVar.entry,loopVar.exit));
																			yearContentModel.months[monthIndex].employeeHours[employeeContentModel.ID] =  AddTwoHours(third,SubstractTwoHours(loopVar.entry,loopVar.exit));
																			yearContentModel.employeeHours[employeeContentModel.ID] =  AddTwoHours(fourth,SubstractTwoHours(loopVar.entry,loopVar.exit));
																			++tempIndex;
																		}
																		
																		let found = false;
																		employeeContentModel.entriesexitsCouples.forEach((element)=>
																		{
																			if(element.entry == a && element.exit == b )
																			{
																				found = true;
																			}
																			else if(element.entry == a)
																			{
																				element.exit = b;
																				found = true;
																			}
																		});
																				
																		if(!found)
																			employeeContentModel.entriesexitsCouples.push({entry:a,exit:b});
																
																	}														
																}
													}
													
													
												}//end of hoursSection
												
												/*console.log(currentDateOfYear);
												if(!employeeContentModel.presence && !employeeContentModel.absence && !employeeContentModel.mission
													&& !employeeContentModel.congès && !employeeContentModel.sicknesses)
												{
													console.log(true);
													console.log(secondresult.first[0].length == 0 && secondresult.first[1].length == 0);
													console.log(dateNowOther); console.log(currentDateOfYear);
													console.log(basicDateComparison(dateNowOther ,currentDateOfYear) > 0);
													console.log((currentDateOfYear.getDay() != 0 && currentDateOfYear.getDay() != 6));
													if(!(secondresult.first[0].length == 0 && secondresult.first[1].length == 0))
													{
														console.log(secondresult.first[0]);
														console.log(secondresult.first[1]);
													}
												} test conditionel d'entree passed for absence dates*/

												//start of presenceSection
												if( secondresult.first[0].length == 0 && secondresult.first[1].length == 0 && basicDateComparison(dateNowOther ,currentDateOfYear) > 0 && dresultFiltered.first.length == 0)
												{
													employeeContentModel.absence = true;
													employeeContentModel.retard = false;
													absence = true;
													employeeContentModel.date = currentDateOfYear.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"});
													if(currentDateOfYear.getDay() != 0 && currentDateOfYear.getDay() != 6)
														calculateAbsence(unitLocation,year,1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
												}
												else if(!employeeContentModel.presence && !retard && !criticallylate 
													&& ((dateNowOther.getUTCHours() == 8 && dateNowOther.getUTCMinutes() > 30)
													|| ((dateNowOther.getUTCHours() == 8 && dateNowOther.getUTCMinutes() == 30 && dateNowOther.getUTCSeconds() > 0)) 
													|| (dateNowOther.getUTCHours() > 8) ) && basicDateComparison(dateNowOther ,currentDateOfYear) >= 0 && dresultFiltered.first.length == 0)//not more thant today
												{
														
														
														employeeContentModel.absence = true;
														if(employeeContentModel.retard == true)
														{
															calculateRetards(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
															employeeContentModel.retard = false;
														}

														if(employeeContentModel.retardCritical == true)
														{
															calculateCriticalRetards(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
															employeeContentModel.retardCritical = false;
														}

														employeeContentModel.date = currentDateOfYear.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"});
														if(currentDateOfYear.getDay() != 0 && currentDateOfYear.getDay() != 6)
														try{
														calculateAbsence(unitLocation,year,1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);										
														}catch(ex){console.log(ex);}
												} 
												
												if(secondresult.first[1].length > 0)
												{
													//console.log("Getting to know secondresult ");
													//console.log(secondresult.first[1]);
													//console.log(secondresult.second[1][4].name);
													//console.log(secondresult.first[1][secondresult.second[1][4].name] == 1);
													//console.log(secondresult.first[0]);
													//console.log(secondresult.first[2]);
													//console.log(secondresult.second);
													if( secondresult.first[1][0][secondresult.second[1][3].name] == 1 && dresultFiltered.first.length == 0) 
													{
														if(currentDateOfYear.getDay() != 0 && currentDateOfYear.getDay() != 6)
														{	
															employeeContentModel.maladie = true;	
															console.log("Maladie on "+currentDateOfYear);
															employeeContentModel.date = currentDateOfYear.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"});
															calculateSicknesses(unitLocation,year,1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														}
														if(employeeContentModel.mission)//mission section
														{
															employeeContentModel.mission = false;
															calculateMission(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														}
														if(employeeContentModel.absence)//absence section
														{
															employeeContentModel.absence = false;
															calculateAbsence(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														}
														if(employeeContentModel.congès)//congès section
														{
															employeeContentModel.congès = false;
															calculateCongès(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														}
														if(employeeContentModel.retard)//retards section
														{
															employeeContentModel.retard = false;
															calculateRetards(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														}
														if(employeeContentModel.retardCritical)//retards critiques section
														{
															employeeContentModel.retardCritical = false;
															calculateCriticalRetards(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														}
													}
													
													if( secondresult.first[1][0][secondresult.second[1][4].name] == 1 && dresultFiltered.first.length == 0)
													{
														employeeContentModel.mission = true;
														console.log("Mission on "+currentDateOfYear);
														employeeContentModel.date = currentDateOfYear.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"});
														calculateMission(unitLocation,year,1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														
														if(employeeContentModel.absence)
														{
															employeeContentModel.absence = false;
															if(currentDateOfYear.getDay() != 0 && currentDateOfYear.getDay() != 6)
															calculateAbsence(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														}
														if(employeeContentModel.congès)
														{
															employeeContentModel.congès = false;
															calculateCongès(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														}
														if(employeeContentModel.sicknesses)
														{
															employeeContentModel.sicknesses = false;
															calculateSicknesses(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														}
														if(employeeContentModel.retard)//retards section
														{
															console.log("retards on "+currentDateOfYear+"to be removed");
															employeeContentModel.retard = false;
															calculateRetards(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														}
														if(employeeContentModel.retardCritical)//retards critiques section
														{
															console.log("critical retards on "+currentDateOfYear+"to be removed")
															employeeContentModel.retardCritical = false;
															calculateCriticalRetards(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														}
													}
													
													if( secondresult.first[1][0][secondresult.second[1][5].name] == 1 && dresultFiltered.first.length == 0)
													{
														if(currentDateOfYear.getDay() != 0 && currentDateOfYear.getDay() != 6)
														{
															employeeContentModel.congès = true;
															console.log("Congès on "+currentDateOfYear);
															employeeContentModel.date = currentDateOfYear.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"});
															calculateCongès(unitLocation,year,1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														}
														if(employeeContentModel.mission)
														{
															employeeContentModel.missions = false;
															calculateMission(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														}
														if(employeeContentModel.absence)
														{
															employeeContentModel.absence = false;
															calculateAbsence(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														}
														if(employeeContentModel.sicknesses)
														{
															employeeContentModel.sicknesses = false;
															calculateSicknesses(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														}
														if(employeeContentModel.retard)//retards section
														{
															employeeContentModel.retard = false;
															calculateRetards(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														}
														if(employeeContentModel.retardCritical)//retards critiques section
														{
															employeeContentModel.retardCritical = false;
															calculateCriticalRetards(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														}
													}
													
													if( secondresult.first[1][0][secondresult.second[1][2].name] == 1 && dresultFiltered.first.length == 0)
													{
														if(! employeeContentModel.absence)
														{
															if(currentDateOfYear.getDay() != 0 && currentDateOfYear.getDay() != 6)
															{
																employeeContentModel.absence = true;
																console.log("Absence on "+currentDateOfYear);
																employeeContentModel.date = currentDateOfYear.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"});
																calculateAbsence(unitLocation,year,1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
															}

															if(employeeContentModel.mission)
															{
																employeeContentModel.mission = false;
																calculateMission(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
															}
															if(employeeContentModel.congès)
															{
																employeeContentModel.congès = false;
																calculateCongès(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
															}
															if(employeeContentModel.sicknesses)
															{
																employeeContentModel.sicknesses = false;
																calculateSicknesses(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
															}
															if(employeeContentModel.retard)//retards section
															{
																employeeContentModel.retard = false;
																calculateRetards(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
															}
															if(employeeContentModel.retardCritical)//retards critiques section
															{
																employeeContentModel.retardCritical = false;
																calculateCriticalRetards(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
															}
														}
													}
													
												}
												else if (empHoursObj != undefined)
												{
													//console.log(secondresult.first[1]);
												}
											}
											else
											{	
												baseInit = false;
												base_init_exiting = true;console.log(3393);
												//console.log("Quitting");
												if (!(response === undefined))
												dummyResponseSimple(response);
												return false;
											}
										}
									}
									else
									{	
										base_init_exiting = true;console.log(3403);
										//console.log("Quitting");
										if (!(response === undefined))
										dummyResponseSimple(response);
										return false;
									}
										
									start_day++;
									weekDayIndex = weekDayIndex+1;
									++k;
									astart = true;
									if(empHoursObj && empHoursObj["day"] == undefined && empHoursObj["endDay"] == undefined && empHoursObj["startDay"] == undefined )
										break;	
								}	
								if(empHoursObj && empHoursObj["day"] == undefined && empHoursObj["endDay"] == undefined && empHoursObj["startDay"] == undefined )
										break;	
							}
							
						}
						
					}
					
					if(baseInit)
					{
						primaryObject = data;
					}
					
					console.log("added to kv");
					//console.log("Location argument "+locationArgObj+" employee argument "+empObj);
					//console.log(primaryObject);
					/*let splitelements = splitText(JSON.stringify(primaryObject), 900* 1024);
					if( splitelements.length > 0)
					{
						let error = false;
						do
						{
							try
							{
								let tempIndex = 0;
								let allElements = "";
								for(;tempIndex < splitelements.length ;++tempIndex)
								{
									await kvUser.set("primaryObjects"+tempIndex,splitelements[tempIndex]);
									allElements += tempIndex,splitelements[tempIndex];
								}
								await kvUser.set("primaryObjectsLength",splitelements.length);
								//JSON.parse(allElements);
							}
							catch(err)
							{
								console.log(err.message.substring(0,5000));
								error = true;
							}
						}while(error);
					}
					console.log("done adding "+splitelements.length+" elements to KV ");
					*/
					
					if(updating)
					{
						try
						{
							var func = async ()=>{
								let resUpdating;
								resUpdating = await doGetHTTPRequest("msa-pointage-server-socket.onrender.com",undefined,"command=updateALL");
								if(!resUpdating)
								{
									console.log("Error reaching notifier server ....");
									setTimeout(func,500);
								}
								else
								{
									console.log("Connection to server indication successfully given");
								}
							};
							func();
						}
						catch(err)
						{
							console.log(err);
						}
					}
					else
					{
						try
						{
							var func = async ()=>{
								let resUpdating;
								resUpdating = await doGetHTTPRequest("msa-pointage-server-socket.onrender.com",undefined,"command=updateALL");
								
								if(!resUpdating)
								{
									console.log("Error reaching notifier server ....");
									setTimeout(func,500);
								}
								else
								{
									console.log("Connection to server indication successfully given");
								}
							};
							func();
						}
						catch(err)
						{
							console.log(err);
						}
					}
					
					if (!(response === undefined))
					{
						response.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
										,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
										,"Access-Control-Max-Age":'86400'
										,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
										});
						if(primaryObject != undefined)
						response.write(JSON.stringify(primaryObject));
						response.end();
						return data;
					}
					
					return data;
			}
			catch(ex)
			{
				console.log(ex);
				console.log(ex.message);
				return false;
			}
	} 
	
	
	function notIDDecreaseAll(location,ID)
	{			
		for(let yearLength = 0; yearLength < location.yearsContent.length; ++yearLength)
		{
			let yearContentElement = location.yearsContent[yearLength];
			let keysToRemove = [];
			
			for(let monthLength = 0; monthLength < yearContentElement.months.length; ++monthLength) 
			{
				let monthContent = yearContentElement.months[monthLength];
				//console.log(monthContent);
				let keysToRemove = [];
				
				for(let weekLength = 0; weekLength < monthContent.weeks.length; ++weekLength) 
				{
					let weekContent = monthContent.weeks[weekLength];
					let keysToRemove = [];
					
					Object.keys(weekContent.employeeHours).forEach(element => 
					{
						if(element != ID)
						{
							keysToRemove.push(element);
						}
					});
					
					keysToRemove.forEach(element =>
					{
						weekContent.employeeHours[element] = undefined;
					});
					
					for(let dayLength = 0; dayLength < weekContent.days.length; ++dayLength) 
					{
						let dayContent = weekContent.days[dayLength];
						let tempDeleteStack = [];
						let keysToRemove = [];
					
						Object.keys(weekContent.employeeHours).forEach(element => 
						{
							if(element != ID)
							{
								keysToRemove.push(element);
							}
						});
						
						keysToRemove.forEach(element =>
						{
							weekContent.employeeHours[element] = undefined;
						});
						
						
						let othertempDeleteStack = findElementsNotEquivalentToValueIntoDic(ID,dayContent,"empDicofMissions");
						deleteKeysElementsIntoDic(othertempDeleteStack,dayContent.empDicofMissions);
						othertempDeleteStack = findElementsNotEquivalentToValueIntoDic(ID,dayContent,"empDicofAbsences");
						deleteKeysElementsIntoDic(othertempDeleteStack,dayContent.empDicofAbsences);
						othertempDeleteStack = findElementsNotEquivalentToValueIntoDic(ID,dayContent,"empDicofVacances");
						deleteKeysElementsIntoDic(othertempDeleteStack,dayContent.empDicofVacances);
						othertempDeleteStack = findElementsNotEquivalentToValueIntoDic(ID,dayContent,"empDicofPresences");
						deleteKeysElementsIntoDic(othertempDeleteStack,dayContent.empDicofPresences);
						othertempDeleteStack = findElementsNotEquivalentToValueIntoDic(ID,dayContent,"employeeHours");
						deleteKeysElementsIntoDic(othertempDeleteStack,dayContent,dayContent.empHours);
						othertempDeleteStack = findElementsNotEquivalentToValueIntoDic(ID,dayContent,"empDicofSicknesses");
						deleteKeysElementsIntoDic(othertempDeleteStack,dayContent.empDicofSicknesses);	
						othertempDeleteStack = findElementsNotEquivalentToValueIntoDic(ID,dayContent,"empDicofRetards");
						deleteKeysElementsIntoDic(othertempDeleteStack,dayContent.empDicofRetards);
						othertempDeleteStack = findElementsNotEquivalentToValueIntoDic(ID,dayContent,"employeeHours");
						deleteKeysElementsIntoDic(othertempDeleteStack,dayContent,dayContent.empHours);
						othertempDeleteStack = findElementsNotEquivalentToValueIntoDic(ID,dayContent,"empDicofCritical");
						deleteKeysElementsIntoDic(othertempDeleteStack,dayContent.empDicofCritical);
						
						
						
						for(let itemLength = 0; itemLength < dayContent.absencesdates.length; ++itemLength) 
						{
							let empdaily = dayContent.absencesdates[itemLength];
							if(empdaily.ID != ID)
							{
								dayContent.absences--;
								weekContent.absences--;
								monthContent.absences--;
								yearContentElement.absences--;
								tempDeleteStack.push(empdaily);
							}	
						}
						
						deleteElement(tempDeleteStack,dayContent.absencesdates);
						tempDeleteStack = [];

						for(let itemLength = 0; itemLength < dayContent.missionsdates.length; ++itemLength) 
						{
							let empdaily = dayContent.missionsdates[itemLength];
							
							if(empdaily.ID != ID)
							{
								dayContent.missons--;
								weekContent.missions--;
								monthContent.missions--;
								yearContentElement.missions--;
								tempDeleteStack.push(empdaily);
							}
						}
						
						deleteElement(tempDeleteStack,dayContent.missionsdates);
						tempDeleteStack = [];
						
						for(let itemLength = 0; itemLength < dayContent.vacationsdates.length; ++itemLength) 
						{
							let empdaily = dayContent.vacationsdates[itemLength];
							
							if(empdaily.ID != ID)
							{
								/* dayContent.vacanes--;
								weekContent.vacances--;
								monthContent.vacances--;
								yearContentElement.vacances--; */
								dayContent.vacations--;
								weekContent.vacations--;
								monthContent.vacations--;
								yearContentElement.vacations--;
								tempDeleteStack.push(empdaily);
							}
						}
						
						deleteElement(tempDeleteStack,dayContent.vacationsdates);
						tempDeleteStack = [];

						for(let itemLength = 0; itemLength < dayContent.presencedates.length; ++itemLength) 
						{
							let empdaily = dayContent.presencedates[itemLength];
							if(empdaily.ID != ID)
							{
								dayContent.presence--;
								weekContent.presence--;
								monthContent.presence--;
								yearContentElement.presence--;
								tempDeleteStack.push(empdaily);
							}
						}
						
						deleteElement(tempDeleteStack,dayContent.presencedates);
						tempDeleteStack = [];

						for(let itemLength = 0; itemLength < dayContent.sicknessesdates.length; ++itemLength) 
						{
							let empdaily = dayContent.sicknessesdates[itemLength];
							if(empdaily.ID != ID)
							{
								dayContent.sicknesses--;
								weekContent.sicknesses--;
								monthContent.sicknesses--;
								yearContentElement.sicknesses--;
								tempDeleteStack.push(empdaily);
							}
						}
						
						deleteElement(tempDeleteStack,dayContent.sicknessesdates);
						tempDeleteStack = [];
						
						
						for(let itemLength = 0; itemLength < dayContent.retardsdates.length; ++itemLength) 
						{
							let empdaily = dayContent.retardsdates[itemLength];
							if(empdaily.ID != ID)
							{
								dayContent.retards--;
								weekContent.retards--;
								monthContent.retards--;
								yearContentElement.retards--;
								tempDeleteStack.push(empdaily);
							}
						}
						
						deleteElement(tempDeleteStack,dayContent.retardsdates);
						tempDeleteStack = [];

						for(let itemLength = 0; itemLength < dayContent.retardsCriticaldates.length; ++itemLength) 
						{
							let empdaily = dayContent.retardsCriticaldates[itemLength];
							if(empdaily.ID != ID)
							{
								dayContent.retardsCritical--;
								weekContent.retardsCritical--;
								monthContent.retardsCritical--;
								yearContentElement.retardsCritical--;
								tempDeleteStack.push(empdaily);	
							}
						}
						
						deleteElement(tempDeleteStack,dayContent.retardsCriticaldates);
						tempDeleteStack = [];
						
						for(let itemLength = 0; itemLength < dayContent.simpleRetardsdates.length; ++itemLength) 
						{
							let empdaily = dayContent.simpleRetardsdates[itemLength];
							if(empdaily.ID != ID)
							{
								dayContent.simpleRetards--;
								weekContent.simpleRetards--;
								monthContent.simpleRetards--;
								yearContentElement.simpleRetards--;
								tempDeleteStack.push(empdaily);
							}
						}
						
						deleteElement(tempDeleteStack,dayContent.simpleRetardsdates);
						tempDeleteStack = [];

						
						
						
					}
					
					deleteKeysElementsIntoDic(findElementsNotEquivalentToValueIntoDic(ID,monthContent,"employeeHours"),monthContent.employeeHours);
						
				}	
			}
			
			let employeesListtoDelete = findElementsNotEquivalentToValueIntoArray(ID,yearContentElement,"employees");
			deleteKeysElementsIntoDic(findElementsNotEquivalentToValueIntoDic(ID,yearContentElement,"employeeHours"),yearContentElement.employeeHours);
			deleteKeysElementsIntoArray(employeesListtoDelete,yearContentElement,"employees","employeesCount");
			deleteKeysElementsIntoDic(findElementsNotEquivalentToValueIntoDic(ID,yearContentElement,"empDic"),yearContentElement.empDic);
		}
	}
	
	function deleteElement (elements,arrayContainer) 
	{
		for(let i = 0; i < elements.length;++i )
		{
			let tempJIndex = -1;
			for(let j = 0; j < arrayContainer.length;++j)
			{
				if(elements[i].ID == arrayContainer[j].ID)
				{
					tempJIndex = j;
					break;
				}
			}

			if(tempJIndex != -1)
			{
				arrayContainer.splice(tempJIndex,1);
			}
		}
	}
	
	function deleteElementMinusRepertory (elements,arrayContainer,repertory) 
	{
		for(let i = 0; i < elements.length;++i )
		{
			let tempJIndex = -1;
			for(let j = 0; j < arrayContainer.length;++j)
			{
				if(elements[i].ID == arrayContainer[j].ID)
				{
					tempJIndex = j;
					break;
				}
			}

			if(tempJIndex != -1)
			{
				//arrayContainer[repertory]--;
				arrayContainer.splice(tempJIndex,1);
			}
		}
	}
	
	function deleteKeysElementsIntoDic(keysElements,dicContainer) 
	{
		keysElements.forEach(
		element=>
		{
			dicContainer[element] = undefined;
		});
	}
	
	function deleteKeysElementsIntoArray(keysElements,dicContainer,name,other_decrement_container_name) 
	{
		keysElements.forEach(
		element=>
		{
			let index = dicContainer[name].indexOf(element);
			dicContainer[name].splice(index,1);
			dicContainer[other_decrement_container_name]--;
		});
	}
	
	function findElementsNotEquivalentToValueIntoDic(keyName,dicContainer,repertory)
	{
		let returnKeys = [];
		//console.log(repertory);
		//console.log(dicContainer);
		Object.keys(dicContainer[repertory]).forEach((key_element)=>
		{
			if(key_element != keyName)
			{
				returnKeys.push(key_element);
			}
		});
		
		return returnKeys;
	}
	
	
	function findElementsNotEquivalentToValueIntoArray(keyName,dicContainer,repertory)
	{
		let returnKeys = [];
		
		dicContainer[repertory].forEach((key_element)=>
		{
			if(key_element.ID != keyName)
			{
				returnKeys.push(key_element);
			}
		});
		
		return returnKeys;
	}
	
	function reorganizeKv(bigdeal)
	{
		bigdeal.container.forEach((container)=>
		{
			container.yearsContent.forEach((yearsContainer)=>
			{
				yearsContainer.months.forEach((month)=>
				{
					month.weeks.forEach((week)=>
					{
						week.days.forEach((day)=>
						{
							Object.keys(yearsContainer.empDic).forEach((ID)=>{
								let employeeContentModel = getEmployeeContentModel(day,ID);
								if(employeeContentModel != undefined)
								youWillsetAccordingtoGivenModel(day,employeeContentModel);
							});
						});
					});
				});
			});
		});
	}
	
	function getLocation(content,locationID)
	{
		if(content != undefined)
		{
			for(let i = 0; i < content.container.length ; ++i )
			{
				if(content.container[i].ID == locationID)
					return {first:content.container[i],second:i};
			}
		}
		return {first:undefined,second:undefined};
	}
	
	function getYear(content,year)
	{
		if(content != undefined)
		{
			//console.log(content);
			for(let i = 0; i < content.yearsContent.length ; ++i )
			{
				if(	content.yearsContent[i].year == year )
				{
					return {first:content.yearsContent[i],second:i};
				}
			}
		}
		return {first:undefined,second:undefined};
	}

	function getMonth(content,month)
	{
		if(content != undefined)
		{
			for(let i = 0; i < content.months.length ; ++i )
			{
				if(	content.months[i].month == month )
				{
					return {first:content.months[i],second:i};
				}
			}
		}
		return {first:undefined,second:undefined};
	}		
	
	function getWeek(content,weekNo)
	{
		if(content != undefined)
		{
			for(let i = 0; i < content.weeks.length ; ++i )
			{
				if(	content.weeks[i].weekNo == weekNo )
				{
					return {first:content.weeks[i],second:i};
				}
			}
		}
		return {first:undefined,second:undefined};
	}
	
	function getDay(content,day)
	{
		if(content != undefined)
		{
			for(let i = 0; i < content.days.length ; ++i )
			{
				if(	content.days[i].day == day )
				{
					return {first:content.days[i],second:i};
				}
			}
		}
		return {first:undefined,second:undefined};
	}
	
	function getEmployeeContentModel(days,ID) 
	{
		let elements = [];
		let element_found = undefined;

		if(days != undefined)
		{
			elements.push(days.absencesdates);
			elements.push(days.retardsdates);
			elements.push(days.retardsCriticaldates);
			elements.push(days.missionsdates);
			elements.push(days.sicknessesdates);
			elements.push(days.vacationsdates);
			elements.push(days.presencedates);
			elements.push(days.simpleRetardsdates);
			
			let index = 1;
			
			elements.forEach((element)=>
			{
				//console.log(index++);
				for(let i = 0; i < element.length;++i)
				{
					//console.log("Reaching element ID "+element[i].ID);
					if(element[i].ID == ID)
					{
						//console.log("Element with ID "+ID );
						if(element_found == undefined)
							element_found = element[i];
					}
				}
			});
		}

		//console.log((element_found) == undefined ? "Element with ID "+ID+" not found ":"Element with ID "+ID+" found");
		return element_found;
	}
	
	function youWillsetAccordingtoGivenModel(days,employeeContentModel) 
	{
		let elements = [];
		let element_found = undefined;
		
		if( days.empDicofAbsences[employeeContentModel.ID] != undefined )
		{
			days.empDicofAbsences[employeeContentModel.ID] = employeeContentModel;
		}
		
		if( days.empDicofCritical[employeeContentModel.ID] != undefined )
		{
			days.empDicofCritical[employeeContentModel.ID] = employeeContentModel;
		}
		
		if( days.empDicofMissions[employeeContentModel.ID] != undefined )
		{
			days.empDicofMissions[employeeContentModel.ID] = employeeContentModel;
		}
		
		if( days.empDicofPresences[employeeContentModel.ID] != undefined )
		{
			days.empDicofPresences[employeeContentModel.ID] = employeeContentModel;
		}
		
		if( days.empDicofRetards[employeeContentModel.ID] != undefined )
		{
			days.empDicofRetards[employeeContentModel.ID] = employeeContentModel;
		}
		
		if( days.empDicofSicknesses[employeeContentModel.ID] != undefined )
		{
			days.empDicofSicknesses[employeeContentModel.ID] = employeeContentModel;
		}
		
		if( days.empDicofVacances[employeeContentModel.ID] != undefined )
		{
			days.empDicofVacances[employeeContentModel.ID] = employeeContentModel;
		}
		
		
		if(days != undefined)
		{
			elements.push(days.absencesdates);
			elements.push(days.retardsdates);
			elements.push(days.retardsCriticaldates);
			elements.push(days.missionsdates);
			elements.push(days.sicknessesdates);
			elements.push(days.vacationsdates);
			elements.push(days.presencedates);
			elements.push(days.simpleRetardsdates);
			
			let index = 1;
			elements.forEach((element)=>
			{
				//console.log(index++);
				for(let i = 0; i < element.length;++i)
				{
					//console.log("Reaching element ID "+element[i].ID);
					if(element[i].ID == employeeContentModel.ID)
					{
						//console.log("Element with ID "+ID );
						element[i] = employeeContentModel;
					}
				}
			});
			
		}

		//console.log((element_found) == undefined ? "Element with ID "+ID+" not found ":"Element with ID "+ID+" found");
		return element_found;
	}

	function getDateDetailsFromCorruptJavascript()
	{
		let tempdate = new Date(Date.now());
		let tempday = Number.parseInt(tempdate.toLocaleString().split("/")[0]);
		let tempmonth = Number.parseInt(tempdate.toLocaleString().split("/")[1]);
		let tempyear = Number.parseInt(tempdate.toLocaleString().split("/")[2]);
		return [tempday,tempmonth,tempyear];
	}

	function basicResponse(res)
	{
		//console.log("Inside basic response");
		//console.log("res writable ended is " +res.writableEnded);
		if(res.writableEnded)
			return;
		//console.log("Inside basic response");
			res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
									,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
									,"Access-Control-Max-Age":'86400'
									,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
									});
			//console.log(JSON.stringify({customtext:"OK"}));
			res.write(JSON.stringify({customtext:"OK"}));
			res.end();
	}

	function dummyResponse(res,text)
	{
		if(res === undefined || res.writableEnded)
		return;
		res.writeHead(500, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
								,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
								,"Access-Control-Max-Age":'86400'
								,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
								});
		res.write(JSON.stringify({customtext:text}));
		res.end();
	}


	function mparseForm(reqData)
	{
		let phases = [['C','o','n','t','e','n','t','-','D','i','s','p','o','s','i','t','i','o','n',':',' ','f','o','r','m','-','d','a','t','a',';',' ','n','a','m','e','=']];
		let length = reqData.length;
		let count = 0;
		let map = new Map();
		let phaseIndex = 0;
		let singlephaseElementmatchCount = 0;
		let phase_found = false;
		let value_in_search = false;
		let left_quote_open = false;
		let right_quote_close = false;

		let current_name ="";
		let current_value = "";
		let continue_value = "";
		let found_count = 0;

		while(count < length)
		{
				if(phase_found && !left_quote_open && reqData[count] == "\"")
				{
			
					left_quote_open = true;

					if(singlephaseElementmatchCount > 0)
					{
						singlephaseElementmatchCount = 0;
					}
					
					if(phaseIndex>0)
					{
						phaseIndex = 0;
					}
				}
				else if(phase_found && left_quote_open && !right_quote_close && reqData[count] != "\"")
				{

					current_name +=  reqData[count];
					
					if(singlephaseElementmatchCount > 0)
					{
						singlephaseElementmatchCount = 0;
					}

					if(phaseIndex>0)
					{
						phaseIndex = 0;
					}
					
				}
				else if(phase_found && left_quote_open && reqData[count] == "\"")
				{
					right_quote_close = true;
					left_quote_open = false;
					
					phase_found = false;
					value_in_search = true;
					if(singlephaseElementmatchCount > 0)
					{
						singlephaseElementmatchCount = 0;
					}
					if(phaseIndex>0)
					{
						phaseIndex = 0;
					}
				}
				else if(value_in_search && reqData[count] != phases[phaseIndex][singlephaseElementmatchCount])
				{

					if(continue_value!= "")
					{
						current_value += continue_value;
						continue_value = "";
					}

					current_value +=  reqData[count];
					
					if(singlephaseElementmatchCount > 0)
					{
						singlephaseElementmatchCount = 0;
					}
					
					if(phaseIndex>0)
					{
						phaseIndex = 0;
					}

				}
				else if(reqData[count] == phases[phaseIndex][singlephaseElementmatchCount])
				{
					if(value_in_search)
					{
						continue_value += reqData[count];
					}

					++singlephaseElementmatchCount;
					if(singlephaseElementmatchCount == phases[phaseIndex].length)
					{
						++phaseIndex;
						if(phaseIndex == phases.length)
						{
							if(value_in_search)
							{
								let processed_value = current_value.trim();
								let processed_value_index = processed_value.indexOf("------WebKitFormBoundary");
								if(processed_value_index != -1)
								{
									processed_value = processed_value.substring(0,processed_value.indexOf("------WebKitFormBoundary"));
									current_value = processed_value;
								}
								//console.log("Processed value index "+processed_value_index);
								map.set(current_name,current_value.trim());
								found_count++;
								current_name = "";
								current_value = "";
								value_in_search = false;
							}
							
							phaseIndex = 0;
							phase_found = true;
							right_quote_close = false;
							continue_value = "";
						}
					}
				}
				else
				{
					phaseIndex = 0;
					singlephaseElementmatchCount = 0;
				}
				++count;
		}

		if(value_in_search)
		{
			let processed_value = current_value.trim();
			let processed_value_index = processed_value.indexOf("------WebKitFormBoundary");
			if(processed_value_index != -1)
			{
				processed_value = processed_value.substring(0,processed_value.indexOf("------WebKitFormBoundary"));
				current_value = processed_value;
			}
			map.set(current_name,current_value.trim());		
		}

		const obj = Object.fromEntries(map);
		return obj;
	}
	
	function initializeWeekforEmployeesPrivateReport(nodupTemp,ID,monthIndex,weekIndex)
	{
		if(nodupTemp.empDic[ID].months[monthIndex].weeks.length <= weekIndex)
		{
			let indexCount = nodupTemp.empDic[ID].months[monthIndex].weeks.length;
			while(nodupTemp.empDic[ID].months[monthIndex].weeks.length <= weekIndex)
			{
				nodupTemp.empDic[ID].months[monthIndex].weeks.push(
				{
					index: indexCount,
					missiondates:{count:0,other:[]},
					presencedates:{count:0,other:[]},
					vacationdates:{count:0,other:[]},
					absencedates:{count:0,other:[]},
					sicknessdates:{count:0,other:[]},
					retarddates:{count:0,other:[]},
					criticalretarddates:{count:0,other:[]},
					overallretarddates:{count:0,other:[]}
				});
				indexCount = nodupTemp.empDic[ID].months[monthIndex].weeks.length;
			}
		}
		
		
	}
	
	function vacationsAvailable(year,officeID,IDEmployee)
	{
		
		console.log("Looking for year "+year);
		let unitLocation = getLocation(primaryObject,officeID);
		if(unitLocation.first != undefined)
			unitLocation = unitLocation.first;
		let nodupTempAlpha = getYear(unitLocation,year);
		console.log(nodupTempAlpha);
		let nodupTemp = nodupTempAlpha.first;
		
		if( nodupTemp.empDic[IDEmployee].vacationsDaysLeft > 0 )
			return true;
		
		let spaceAvailable = false; 		
		if( nodupTemp.empDic[IDEmployee].movedTo != undefined )
		{
			let nodeUpNestedAlpha = getYear(nodupTemp.empDic[IDEmployee].movedTo.year);
			let nodeUpNested = nodeUpNestedAlpha.first;
			
			if( nodeUpNestedAlpha.second != -1 ) 
			{
				if( nodeUpNested.empDic[IDEmployee].vacationsDaysLeft > 0 )
				{
					spaceAvailable = true;
				}
				else
				{
					spaceAvailable = false
				}
			}
		}
		
		return spaceAvailable;
	}
	
	function calculateCongès(unitLocation,year,offset,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex)
	{
		let nodupTempAlpha = getYear(unitLocation,year);
		let nodupTemp = nodupTempAlpha.first;
		let found = false;
		nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].vacationsdates.forEach((element)=>{if(dummyIDComparison(element,employeeContentModel)){found = true;}});
		//console.log("Month index "+monthIndex+" Weeks index "+weekIndex+" years Index "+ yearIndex+" year is "+ year);
		//console.log(nodupTemp.months[monthIndex].weeks);
		let passed = (nodupTemp.empDic[employeeContentModel.ID].vacationsDaysLeft > 0 && offset > 0) || offset < 0;
		let elementMovedTo = undefined;
		
		if(passed == false && nodupTemp.empDic[employeeContentModel.ID].movedTo != undefined )
		{
			let nodeUpNestedAlpha = getYear(nodupTemp.empDic[employeeContentModel.ID].movedTo.year);
			let nodeUpNested = nodeUpNestedAlpha.first;
			if( nodeUpNestedAlpha.second != -1 ) 
			{
				elementMovedTo = nodeUpNested.empDic[employeeContentModel.ID];
				if( nodeUpNested.empDic[employeeContentModel.ID].vacationsDaysLeft > 0 )
				{
					passed = true;
				}
				else
				{
					passed = false
				}
			}
		}
		
		if( passed )
		{
			
			if(!found && offset > 0 || found && offset < 0)
			{
				nodupTemp.vacations += offset;
				let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex}], commandObj:{command:((offset>0)?"inc":"dec"),path:"congès"} };
				pushCommands(command);
				nodupTemp.months[monthIndex].vacations += offset;
				command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex}], commandObj:{command:((offset>0)?"inc":"dec"),path:"congès"} };
				pushCommands(command);
				nodupTemp.months[monthIndex].weeks[weekIndex].vacations += offset;
				command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex}], commandObj:{command:((offset>0)?"inc":"dec"),path:"congès"} };
				pushCommands(command);
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].vacations += offset;
				command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex}], commandObj:{command:((offset>0)?"inc":"dec"),path:"congès"} };
				pushCommands(command);
				command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex}], commandObj:{command:((offset>0)?"push":"remove"),path:"vacationsdates",value:employeeContentModel} };
				pushCommands(command);
				
				if(nodupTemp.empDic[employeeContentModel.ID].vacationsDaysLeft > 0 && offset > 0)
				{	
					nodupTemp.empDic[employeeContentModel.ID].vacationsDaysLeft -= offset;
				}
				else if (offset > 0 && elementMovedTo != undefined)
				{
					if(elementMovedTo.vacationsDaysLeft > 0)
					{
						elementMovedTo.vacationsDaysLeft -= offset ;
						elementMovedTo.vacationsDaysAllowed -= offset ;
						nodupTemp.empDic[employeeContentModel.ID].vacationsDaysAllowed += offset;
						nodupTemp.empDic[employeeContentModel.ID].movedTo.numberofVacations -= offset;
					}
				}
				else if (offset < 0)
				{
					nodupTemp.empDic[employeeContentModel.ID].vacationsDaysLeft -= offset;
				}
				
				nodupTemp.empDic[employeeContentModel.ID].vacationdates.count += offset;
				nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].vacationdates.count += offset;
				initializeWeekforEmployeesPrivateReport(nodupTemp,employeeContentModel.ID,monthIndex,weekIndex);
				nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].weeks[weekIndex].vacationdates.count += offset;
			}

			if(offset > -1)
			{
				if(!found)
				{
					nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].vacationsdates.push(employeeContentModel);
					nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofVacances[employeeContentModel.ID] = employeeContentModel;
					nodupTemp.empDic[employeeContentModel.ID].vacationdates.other.push(employeeContentModel.date);
					nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].vacationdates.other.push(employeeContentModel.date);
					nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].weeks[weekIndex].vacationdates.other.push(employeeContentModel.date);
					
					if(nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].identities[employeeContentModel.ID] == undefined)
					{
						nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].identities[employeeContentModel.ID] = employeeContentModel;
					}
				}/*
				else
				{ 
					if(nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofVacances[employeeContentModel.ID]!= employeeContentModel)
					{
						nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofVacances[employeeContentModel.ID] = employeeContentModel
					}
				}*/
			}
			else
			{
				if(found)
				{
					
					let tempValue = nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].vacationsdates;
					if(tempValue.indexOf(employeeContentModel) > -1)
						tempValue.splice(tempValue.indexOf(employeeContentModel),1);
					
					tempValue = nodupTemp.empDic[employeeContentModel.ID].vacationdates.other;
					let temp_index = tempValue.indexOf(employeeContentModel.date);
					if(temp_index > -1)
						tempValue.splice(temp_index,1);
					
					tempValue = nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].vacationdates.other; 
					temp_index = tempValue.indexOf(employeeContentModel.date);
					if(temp_index > -1)
						tempValue.splice(temp_index,1);
					
					tempValue =	nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].weeks[weekIndex].vacationdates.other;
					temp_index = tempValue.indexOf(employeeContentModel.date);
					if(temp_index > -1)
						tempValue.splice(temp_index,1);

					nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofVacances[employeeContentModel.ID] = undefined;
					
				}
			}
		}
	}

	function calculatePresence(unitLocation,year,offset,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex)
	{
		let nodupTempAlpha =  getYear(unitLocation,year);
		let nodupTemp = nodupTempAlpha.first;
		let found = false;
		
		try
		{
			
			nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].presencedates.forEach((element)=>{if(dummyIDComparison(element,employeeContentModel)){found = true;}});
			
			if(!found && offset > 0 || found && offset < 0)
			{
				let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex}], commandObj:{command:((offset>0)?"inc":"dec"),path:"presence"} };
				pushCommands(command);
				nodupTemp.months[monthIndex].presence +=offset;
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].presence+=offset;
				command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex}], commandObj:{command:((offset>0)?"inc":"dec"),path:"presence"} };
				pushCommands(command);
				nodupTemp.months[monthIndex].weeks[weekIndex].presence +=offset;
				nodupTemp.presence +=offset;
				command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex}], commandObj:{command:((offset>0)?"inc":"dec"),path:"presence"} };
				pushCommands(command);
				command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex}], commandObj:{command:((offset>0)?"inc":"dec"),path:"presence"} };
				pushCommands(command);
				command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex}], commandObj:{command:((offset>0)?"push":"remove"),path:"presencedates",value:employeeContentModel} };
				pushCommands(command);
				nodupTemp.empDic[employeeContentModel.ID].presencedates.count += offset;
				nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].presencedates.count += offset;
				initializeWeekforEmployeesPrivateReport(nodupTemp,employeeContentModel.ID,monthIndex,weekIndex);
				nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].weeks[weekIndex].presencedates.count += offset;
			}

			if(offset > 0)
			{
				if(!found)
				{
					nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].presencedates.push(employeeContentModel);
					nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofPresences[employeeContentModel.ID] = employeeContentModel;
					nodupTemp.empDic[employeeContentModel.ID].presencedates.other.push(employeeContentModel.date);
					nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].presencedates.other.push(employeeContentModel.date);
					nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].weeks[weekIndex].presencedates.other.push(employeeContentModel.date);
					
				}/*
				else
				{ 
					if(nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofPresences[employeeContentModel.ID] != employeeContentModel)
					{
						nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofPresences[employeeContentModel.ID] = employeeContentModel
					}
				}*/
			}
			else
			{
				if(found)
				{
					let tempValue = nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].presencedates;
					if(tempValue.indexOf(employeeContentModel) > -1)
						tempValue.splice(tempValue.indexOf(employeeContentModel),1);
					
					tempValue = nodupTemp.empDic[employeeContentModel.ID].presencedates.other;
					let temp_index = tempValue.indexOf(employeeContentModel.date);
					if(temp_index > -1)
						tempValue.splice(temp_index,1);
						
					tempValue = nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].presencedates.other; 
					temp_index = tempValue.indexOf(employeeContentModel.date);
					if(temp_index > -1)
						tempValue.splice(temp_index,1);
					
					tempValue =	nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].weeks[weekIndex].presencedates.other;
					temp_index = tempValue.indexOf(employeeContentModel.date);
					if(temp_index > -1)
						tempValue.splice(temp_index,1)
					
					nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofPresences[employeeContentModel.ID] = undefined;
					
				}
			}
		}
		catch(ex)
		{
			console.log("----------------------------Exception Area-------------------------");
			console.log(nodupTemp.months[monthIndex].weeks[weekIndex].days);
			console.log("Week index "+weekIndex+" month index "+monthIndex+" weekDayIndex "+weekDayIndex);
			
			console.log(ex);
			
			let d1 = new Date();
			let difference = 0;
			let count = 6;
			let prev = 0;
			
			while(count > 0)
			{
				if( (Date.now() - d1) / (5000) > prev)
				{
					++prev;
					console.log("Into "+ (prev*5)+" seconds...");
					--count;
				}
			}
			console.log("----------------------------Exception Area-------------------------");
		}
	}

	function calculateSicknesses(unitLocation,year,offset,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex)
	{
		let nodupTempAlpha = getYear(unitLocation,year);
		let nodupTemp = nodupTempAlpha.first;
		let found = false;
		nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].sicknessesdates.forEach((element)=>{if(dummyIDComparison(element,employeeContentModel)){found = true;}});
		
		if(!found && offset > 0 || found && offset < 0)
		{
			nodupTemp.sicknesses += offset;
			let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex}], commandObj:{command:((offset>0)?"inc":"dec"),path:"sicknesses"} };
			pushCommands(command);
			nodupTemp.months[monthIndex].sicknesses+= offset;
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex}], commandObj:{command:((offset>0)?"inc":"dec"),path:"sicknesses"} };
			pushCommands(command);
			nodupTemp.months[monthIndex].weeks[weekIndex].sicknesses+= offset;
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex}], commandObj:{command:((offset>0)?"inc":"dec"),path:"sicknesses"} };
				pushCommands(command);
			nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].sicknesses+= offset;
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex}], commandObj:{command:((offset>0)?"inc":"dec"),path:"sicknesses"} };
			pushCommands(command);
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex}], commandObj:{command:((offset>0)?"push":"remove"),path:"sicknessesdates",value:employeeContentModel} };
			pushCommands(command);
			nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].sicknessdates.count += offset;
			nodupTemp.empDic[employeeContentModel.ID].sicknessdates.count += offset;
			initializeWeekforEmployeesPrivateReport(nodupTemp,employeeContentModel.ID,monthIndex,weekIndex);
			nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].weeks[weekIndex].sicknessdates.count += offset;
		}

		if(offset>0)
		{
			if(!found)
			{
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].sicknessesdates.push(employeeContentModel);
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofSicknesses[employeeContentModel.ID] = employeeContentModel;
				nodupTemp.empDic[employeeContentModel.ID].sicknessdates.other.push(employeeContentModel.date);
				nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].sicknessdates.other.push(employeeContentModel.date);
				nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].weeks[weekIndex].sicknessesdates.other.push(employeeContentModel.date);
				
				if(nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].identities[employeeContentModel.ID] == undefined)
				{
					nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].identities[employeeContentModel.ID] = employeeContentModel;
				}
			}/*
			else
			{ 
				if(nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofSicknesses[employeeContentModel.ID] != employeeContentModel)
				{
					nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofSicknesses[employeeContentModel.ID] = employeeContentModel
				}
			}*/
		}
		else
		{
			if(found)
			{
				let tempValue = nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].sicknessdates;
				if(tempValue.indexOf(employeeContentModel) > -1)
					tempValue.splice(tempValue.indexOf(employeeContentModel),1);
				
				tempValue = nodupTemp.empDic[employeeContentModel.ID].sicknessdates.other;
				let temp_index = tempValue.indexOf(employeeContentModel.date);
				if(temp_index > -1)
					tempValue.splice(temp_index,1);
						
				tempValue = nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].sicknessdates.other; 
				temp_index = tempValue.indexOf(employeeContentModel.date);
				if(temp_index > -1)
					tempValue.splice(temp_index,1);
				
				tempValue =	nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].weeks[weekIndex].sicknessdates.other;
				temp_index = tempValue.indexOf(employeeContentModel.date);
				if(temp_index > -1)
					tempValue.splice(temp_index,1)

				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofSicknesses[employeeContentModel.ID] = undefined;
				
			}
		}
														
	}

	function calculateAbsence(unitLocation,year,offset,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex)
	{
		let nodupTempAlpha = getYear(unitLocation,year);
		let nodupTemp = nodupTempAlpha.first;
		let found = false;
		nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].absencesdates.forEach((element)=>{if(dummyIDComparison(element,employeeContentModel)){found = true;}});
		
		/*if(monthIndex == 7 && weekDayIndex == 3)
		{
			console.log(nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].absencesdates);	
			console.log(employeeContentModel);
			console.log("Found is "+found);
		}*/

		if(!found && offset > 0 || found && offset < 0)
		{
			nodupTemp.absences += offset;
			let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex}], commandObj:{command:((offset>0)?"inc":"dec"),path:"absence"} };
			pushCommands(command);
			nodupTemp.months[monthIndex].absences += offset;
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex}], commandObj:{command:((offset>0)?"inc":"dec"),path:"absence"} };
			pushCommands(command);
			nodupTemp.months[monthIndex].weeks[weekIndex].absences += offset;
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex}], commandObj:{command:((offset>0)?"inc":"dec"),path:"absence"} };
			pushCommands(command);
			nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].absences += offset;
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex}], commandObj:{command:((offset>0)?"inc":"dec"),path:"absence"} };
			pushCommands(command);
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex}], commandObj:{command:((offset>0)?"push":"remove"),path:"absencesdates",value:employeeContentModel} };
			pushCommands(command);
			//console.log(nodupTemp.empDic);		
			nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].absencedates.count += offset;
			nodupTemp.empDic[employeeContentModel.ID].absencedates.count += offset;
			initializeWeekforEmployeesPrivateReport(nodupTemp,employeeContentModel.ID,monthIndex,weekIndex);
			try
			{
				nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].weeks[weekIndex].absencedates.count += offset;
			}
			catch(ex)
			{
				console.log(ex); console.log(nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].weeks[weekIndex]); console.log(weekIndex);
			}
		}

		if(offset > 0)
		{	
			if(!found)
			{
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofAbsences[employeeContentModel.ID] = employeeContentModel;
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].absencesdates.push(employeeContentModel);
				nodupTemp.empDic[employeeContentModel.ID].absencedates.other.push(employeeContentModel.date);
				nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].absencedates.other.push(employeeContentModel.date);
				nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].weeks[weekIndex].absencedates.other.push(employeeContentModel.date);
				
				if(nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].identities[employeeContentModel.ID] == undefined)
				{
					nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].identities[employeeContentModel.ID] = employeeContentModel;
				}
			}/*
			else
			{ 
				if(nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofAbsences[employeeContentModel.ID] != employeeContentModel)
				{
					nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofAbsences[employeeContentModel.ID] = employeeContentModel
				}
			}*/
		}
		else
		{
			if(found)
			{
				let tempValue = nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].absencesdates;
				
				if(tempValue.indexOf(employeeContentModel) > -1)
				{
					tempValue.splice(tempValue.indexOf(employeeContentModel),1);
					//console.log("Element has been deleted");
				}
				else
				{
					//console.log("Element to be deleted has not been found");
				}
				
				tempValue = nodupTemp.empDic[employeeContentModel.ID].absencedates.other;
				let temp_index = tempValue.indexOf(employeeContentModel.date);
				if(temp_index > -1)
					tempValue.splice(temp_index,1);
						
				tempValue = nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].absencedates.other; 
				temp_index = tempValue.indexOf(employeeContentModel.date);
				if(temp_index > -1)
					tempValue.splice(temp_index,1);

				tempValue =	nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].weeks[weekIndex].absencedates.other;
				temp_index = tempValue.indexOf(employeeContentModel.date);
				if(temp_index > -1)
					tempValue.splice(temp_index,1)

				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofAbsences[employeeContentModel.ID] = undefined;
				
			}
		}

	}

	function calculateRetards(unitLocation,year,offset,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex)
	{
		try{
		let nodupTempAlpha = getYear(unitLocation,year);
		let nodupTemp = nodupTempAlpha.first;
		let found = false;
		nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].retardsdates.forEach((element)=>{if(dummyIDComparison(element,employeeContentModel)){found = true;}});
		
		if(!found && offset > 0 || found && offset < 0)
		{
			let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex}], commandObj:{command:((offset> 0)?"inc":"dec"),path:"retards"} };
			pushCommands(command);
			nodupTemp.retards += offset;
		
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex}], commandObj:{command:((offset> 0)?"inc":"dec"),path:"simpleRetards"} };
			pushCommands(command);
			nodupTemp.simpleRetards += offset;

			nodupTemp.months[monthIndex].retards += offset;
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex}], commandObj:{command:((offset> 0)?"inc":"dec"),path:"retards"} };
			pushCommands(command);

			nodupTemp.months[monthIndex].simpleRetards += offset;
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex}], commandObj:{command:((offset> 0)?"inc":"dec"),path:"simpleRetards"} };
			pushCommands(command);
			
			nodupTemp.months[monthIndex].weeks[weekIndex].retards += offset;
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex}], commandObj:{command:((offset> 0)?"inc":"dec"),path:"retards"} };
			pushCommands(command);

			nodupTemp.months[monthIndex].weeks[weekIndex].simpleRetards += offset;
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex}], commandObj:{command:((offset> 0)?"inc":"dec"),path:"simpleRetards"} };
			pushCommands(command);
				
			nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].retards += offset;
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex}], commandObj:{command:((offset> 0)?"inc":"dec"),path:"retards"} };
			pushCommands(command);

			nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].simpleRetards += offset;
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex}], commandObj:{command:((offset> 0)?"inc":"dec"),path:"simpleRetards"} };
			pushCommands(command);
			
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex}], commandObj:{command:((offset> 0)?"push":"remove"),path:"retardsdates",value:employeeContentModel} };
			pushCommands(command);
			
			nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].retarddates.count += offset;
			nodupTemp.empDic[employeeContentModel.ID].retarddates.count += offset;
			
			initializeWeekforEmployeesPrivateReport(nodupTemp,employeeContentModel.ID,monthIndex,weekIndex);
			nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].weeks[weekIndex].retarddates.count += offset;
			
			nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].overallretarddates.count += offset;
			nodupTemp.empDic[employeeContentModel.ID].overallretarddates.count += offset;
			nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].weeks[weekIndex].overallretarddates.count += offset;
		}
		
		if(offset>0)
		{
			if(!found)
			{
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofRetards[employeeContentModel.ID] = employeeContentModel;
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].retardsdates.push(employeeContentModel);
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].simpleRetardsdates.push(employeeContentModel);
				nodupTemp.empDic[employeeContentModel.ID].retarddates.other.push(employeeContentModel.date);
				nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].retarddates.other.push(employeeContentModel.date);
				nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].weeks[weekIndex].retarddates.other.push(employeeContentModel.date);

				nodupTemp.empDic[employeeContentModel.ID].overallretarddates.other.push(employeeContentModel.date);
				nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].overallretarddates.other.push(employeeContentModel.date);
				nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].weeks[weekIndex].overallretarddates.other.push(employeeContentModel.date);
			
				if(nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].identities[employeeContentModel.ID] == undefined)
				{
					nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].identities[employeeContentModel.ID] = employeeContentModel;
				}
			
			}/*
			else
			{ 
				if(nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofRetards[employeeContentModel.ID] != employeeContentModel)
				{
					nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofRetards[employeeContentModel.ID] = employeeContentModel;
					
					
					//nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].retardsdates.push(employeeContentModel);
					//nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].simpleRetardsdates.push(employeeContentModel);

				}
			}*/
		}
		else
		{
			if(found)
			{
				let tempValue = nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].retardsdates;
				if(tempValue.indexOf(employeeContentModel) > -1)
					tempValue.splice(tempValue.indexOf(employeeContentModel),1);

				tempValue = nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].simpleRetardsdates;
				if(tempValue.indexOf(employeeContentModel) > -1)
					tempValue.splice(tempValue.indexOf(employeeContentModel),1);

				tempValue = nodupTemp.empDic[employeeContentModel.ID].retarddates.other;
				let temp_index = tempValue.indexOf(employeeContentModel.date);
				if(temp_index > -1)
					tempValue.splice(temp_index,1);
				
				tempValue = nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].retarddates.other; 
				temp_index = tempValue.indexOf(employeeContentModel.date);
				if(temp_index > -1)
					tempValue.splice(temp_index,1);
				
				tempValue = nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].weeks[weekIndex].retarddates.other; 
				temp_index = tempValue.indexOf(employeeContentModel.date);
				if(temp_index > -1)
					tempValue.splice(temp_index,1);
				
				tempValue = nodupTemp.empDic[employeeContentModel.ID].overallretarddates.other;
				temp_index = tempValue.indexOf(employeeContentModel.date);
				if(temp_index > -1)
					tempValue.splice(temp_index,1);
						
				tempValue = nodupTemp.empDic[employeeContentModel.ID].overallretarddates.weeks[weekIndex].other;
				temp_index = tempValue.indexOf(employeeContentModel.date);
				if(temp_index > -1)
					tempValue.splice(temp_index,1);

				tempValue = nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].overallretarddates.other; 
				temp_index = tempValue.indexOf(employeeContentModel.date);
				if(temp_index > -1)
					tempValue.splice(temp_index,1);
				
				tempValue = nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].weeks[weekIndex].overallretarddates.other; 
				temp_index = tempValue.indexOf(employeeContentModel.date);
				if(temp_index > -1)
					tempValue.splice(temp_index,1);

				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofRetards[employeeContentModel.ID] = undefined;
			}
		}	
		}
		catch(ex)
		{
			let nodupTempAlpha = getYear(unitLocation,year);
			let nodupTemp = nodupTempAlpha.first;
			console.log(location_index);
			console.log(yearIndex);
			console.log(monthIndex);
			console.log(weekIndex);
			console.log(weekDayIndex);
			console.log(nodupTemp.months[monthIndex].weeks[weekIndex]);
			console.log(ex); throw ex;
		}
	}
	
	function calculateCriticalRetards(unitLocation,year,offset,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex)
	{

		let nodupTempAlpha = getYear(unitLocation,year);
		let nodupTemp = nodupTempAlpha.first;
		let found = false;
		nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].retardsdates.forEach((element)=>{if(dummyIDComparison(element,employeeContentModel)){found = true;}});
		
		if(!found && offset > 0 || found && offset < 0)
		{	
			let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex}], commandObj:{command:((offset> 0)?"inc":"dec"),path:"retardsCritical"} };
			pushCommands(command);
			nodupTemp.retards += offset;
			nodupTemp.retardsCritical += offset;
			nodupTemp.months[monthIndex].retards += offset;
			nodupTemp.months[monthIndex].retardsCritical += offset;
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex}], commandObj:{command:((offset> 0)?"inc":"dec"),path:"retardsCritical"} };
			pushCommands(command);
			nodupTemp.months[monthIndex].weeks[weekIndex].retards += offset;
			nodupTemp.months[monthIndex].weeks[weekIndex].retardsCritical += offset;
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex}], commandObj:{command:((offset> 0)?"inc":"dec"),path:"retardsCritical"} };
			pushCommands(command);
			nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].retards += offset;
			nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].retardsCritical += offset;
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex}], commandObj:{command:((offset> 0)?"inc":"dec"),path:"retardsCritical"} };
			pushCommands(command);
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex}], commandObj:{command:((offset> 0)?"push":"remove"),path:"retardsCriticaldates",value:employeeContentModel} };
			pushCommands(command);
			nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].criticalretarddates.count += offset;
			nodupTemp.empDic[employeeContentModel.ID].criticalretarddates.count += offset;

			nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].overallretarddates.count += offset;
			nodupTemp.empDic[employeeContentModel.ID].overallretarddates.count += offset;
			
			initializeWeekforEmployeesPrivateReport(nodupTemp,employeeContentModel.ID,monthIndex,weekIndex);
			nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].weeks[weekIndex].criticalretarddates.count += offset;
			nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].weeks[weekIndex].overallretarddates.count += offset;
		}

		if(offset > 0)
		{	
			if(!found)
			{
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofRetards[employeeContentModel.ID] = employeeContentModel;
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofCritical[employeeContentModel.ID] = employeeContentModel;
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].retardsdates.push(employeeContentModel);
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].retardsCriticaldates.push(employeeContentModel);

				nodupTemp.empDic[employeeContentModel.ID].criticalretarddates.other.push(employeeContentModel.date);
				nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].criticalretarddates.other.push(employeeContentModel.date);
				nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].weeks[weekIndex].criticalretarddates.other.push(employeeContentModel.date);

				nodupTemp.empDic[employeeContentModel.ID].overallretarddates.other.push(employeeContentModel.date);
				nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].overallretarddates.other.push(employeeContentModel.date);
				nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].weeks[weekIndex].overallretarddates.other.push(employeeContentModel.date);
				
				if(nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].identities[employeeContentModel.ID] == undefined)
				{
					nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].identities[employeeContentModel.ID] = employeeContentModel;
				}
			
			}/*
			else
			{
				if(nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofRetards[employeeContentModel.ID] != employeeContentModel)
				{
					nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofRetards[employeeContentModel.ID] = employeeContentModel;
					nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofCritical[employeeContentModel.ID] = employeeContentModel;
					
					//nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].retardsdates.push(employeeContentModel);
					//nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].retardsCriticaldates.push(employeeContentModel);
				}
			}*/
		}
		else
		{
			if(found)
			{
				let tempValue = nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].retardsdates;
				if(tempValue.indexOf(employeeContentModel) > -1)
					tempValue.splice(tempValue.indexOf(employeeContentModel),1);
				
				tempValue = nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].retardsCriticaldates;
				if(tempValue.indexOf(employeeContentModel) > -1)
					tempValue.splice(tempValue.indexOf(employeeContentModel),1);
					
				tempValue = nodupTemp.empDic[employeeContentModel.ID].criticalretarddates.other;
				temp_index = tempValue.indexOf(employeeContentModel.date);
				if(temp_index > -1)
					tempValue.splice(temp_index,1);
				
				tempValue = nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].criticalretarddates.other; 
				temp_index = tempValue.indexOf(employeeContentModel.date);
				if(temp_index > -1)
					tempValue.splice(temp_index,1);

				tempValue = nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].weeks[weekIndex].criticalretarddates.other;
				temp_index = tempValue.indexOf(employeeContentModel.date);
				if(temp_index > -1)
					tempValue.splice(temp_index,1);

				tempValue = nodupTemp.empDic[employeeContentModel.ID].overallretarddates.other;
				temp_index = tempValue.indexOf(employeeContentModel.date);
				if(temp_index > -1)
					tempValue.splice(temp_index,1);
				
				tempValue = nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].weeks[weekIndex].overallretarddates.other;
				temp_index = tempValue.indexOf(employeeContentModel.date);
				if(temp_index > -1)
					tempValue.splice(temp_index,1);

				tempValue = nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].overallretarddates.other; 
				temp_index = tempValue.indexOf(employeeContentModel.date);
				if(temp_index > -1)
					tempValue.splice(temp_index,1);

				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofRetards[employeeContentModel.ID] = undefined;
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofCritical[employeeContentModel.ID] = undefined;
				
			}
		}						

	}

	function calculateMission(unitLocation,year,offset,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex)
	{
		let nodupTempAlpha = getYear(unitLocation,year);
		let nodupTemp = nodupTempAlpha.first;
		let found = false;
		nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].missionsdates.forEach((element)=>{if(dummyIDComparison(element,employeeContentModel)){found = true;}});
		
		if(!found && offset > 0 || found && offset < 0)
		{
			nodupTemp.missions += offset;
			let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex}], commandObj:{command:((offset> 0)?"inc":"dec"),path:"mission"} };
			pushCommands(command);
			nodupTemp.months[monthIndex].missions += offset;
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex}], commandObj:{command:((offset> 0)?"inc":"dec"),path:"mission"} };
			pushCommands(command);
			nodupTemp.months[monthIndex].weeks[weekIndex].missions += offset;
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex}], commandObj:{command:((offset> 0)?"inc":"dec"),path:"mission"} };
				pushCommands(command);
			nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].missions += offset;
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex}], commandObj:{command:((offset> 0)?"inc":"dec"),path:"mission"} };
			pushCommands(command);
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex}], commandObj:{command:((offset> 0)?"push":"remove"),path:"missionsdates",value:employeeContentModel} };
			pushCommands(command);
			nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].missiondates.count += offset;
			nodupTemp.empDic[employeeContentModel.ID].missiondates.count += offset;
			
			initializeWeekforEmployeesPrivateReport(nodupTemp,employeeContentModel.ID,monthIndex,weekIndex);
			nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].weeks[weekIndex].missiondates.count += offset;
		}

		if(offset > 0)
		{
			if(!found)
			{
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofMissions[employeeContentModel.ID]= employeeContentModel;
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].missionsdates.push(employeeContentModel);
				nodupTemp.empDic[employeeContentModel.ID].missiondates.other.push(employeeContentModel.date);
				nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].missiondates.other.push(employeeContentModel.date);
				nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].weeks[weekIndex].missiondates.other.push(employeeContentModel.date);
			
				if(nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].identities[employeeContentModel.ID] == undefined)
				{
					nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].identities[employeeContentModel.ID] = employeeContentModel;
				}
			}
			/*else
			{
				if(nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofMissions[employeeContentModel.ID] != employeeContentModel)
				{
					nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofMissions[employeeContentModel.ID] = employeeContentModel;
				}
			}*/
		}
		else
		{
			if(found)
			{
				let tempValue = nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].missionsdates;
				if(tempValue.indexOf(employeeContentModel) > -1)
					tempValue.splice(tempValue.indexOf(employeeContentModel),1);
				

				tempValue = nodupTemp.empDic[employeeContentModel.ID].missiondates.other;
				let temp_index = tempValue.indexOf(employeeContentModel.date);
				if(temp_index > -1)
					tempValue.splice(temp_index,1);
						
				tempValue = nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].missiondates.other; 
				temp_index = tempValue.indexOf(employeeContentModel.date);
				if(temp_index > -1)
					tempValue.splice(temp_index,1);
				
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofMissions[employeeContentModel.ID]= undefined;
			}
		}

	}
	

	function dummyIDComparison(aElement,bElement)
	{
		//console.log("IDOne"+aElement.ID +" = IDTwo "+bElement.ID+" is "+ aElement.ID == bElement.ID );
		return aElement.ID == bElement.ID;
	}

	function LocalSleep(time)
	{
		let tempdtOne = new Date();
		let tempdtTwo = new Date();
		while( (tempdtTwo-tempdtOne) < time )
		{
			tempdtTwo = new Date();
		}																		
	} 
	
	function SubstractTwoHours(hour1,hour2)
	{		
		let hoursArray = hour1.split(":");
		let hoursArray2 = hour2.split(":");
		
		let time1 = Number(hoursArray[0])*60*60+Number(hoursArray[1])*60+Number(hoursArray[2]);
		let time2 = Number(hoursArray2[0])*60*60+Number(hoursArray2[1])*60+Number(hoursArray2[2]);

		let time3 = Math.abs(time2-time1);
		let h3 = Math.floor(time3 / 3600); let min3 = Math.floor((time3 % 3600)/60);let sec3 = (time3 % 3600)%60
		if(Number(h3)< 10)
			h3 = "0"+h3;
		if(Number(min3) < 10)
			min3 = "0"+min3;
		if(Number(sec3)< 10)
			sec3 = "0"+sec3;
		return h3+":"+min3+":"+sec3;
	}

	function AddTwoHours(hour1,hour2)
	{
		let hoursArray = hour1.split(":");
		let hoursArray2 = hour2.split(":");
		
		let time1 = Number(hoursArray[0])*60*60+Number(hoursArray[1])*60+Number(hoursArray[2]);
		let time2 = Number(hoursArray2[0])*60*60+Number(hoursArray2[1])*60+Number(hoursArray2[2]);

		let time3 = Math.abs(time2+time1);
		let h3 = Math.floor(time3 / 3600); let min3 = Math.floor((time3 % 3600)/60);let sec3 = (time3 % 3600)%60
		
		if(Number(h3)< 10)
			h3 = "0"+h3;
		if(Number(min3) < 10)
			min3 = "0"+min3;
		if(Number(sec3)< 10)
			sec3 = "0"+sec3;
		return h3+":"+min3+":"+sec3;
	}


	function compareHoursOneSuperior(hour1,hour2)
	{

		let hoursArray = hour1.split(":");
		let hoursArray2 = hour2.split(":");
				
		for(let i = 0; i < hoursArray.length;++i)
		{
			if(Number(hoursArray[i]) > Number(hoursArray2[i]))
				return 1;
			else if (Number(hoursArray[i]) < Number(hoursArray2[i]))
				return -1;
		}

		return 0;
	}
	
	function filterOutElementsThatAreNottheGivenDay(day,objArray,dateColumn,comparatorFunction) 
	{
		return comparatorFunctionBinarySearch(objArray,day,dateColumn,0,objArray.first.length-1,comparatorFunction)
	}
	
	function comparatorFunctionBinarySearch(objArray,value,column,start,end,comparatorFunc)
	{
		let returnValue = {first:[],second:[]};
		if(start > end)
			return returnValue; 			
		
		let middle = Math.floor((start+end)/2);
		//console.log(column);console.log(start);console.log(end);
		
		let comparisonResult = comparatorFunc(middle,objArray,column,value);
		if(comparisonResult == 0)
		{
			return formingValuesAroundElement(objArray,value,column,start,middle,end,comparatorFunc)
		}
		else if(comparisonResult > 0)
		{
			return comparatorFunctionBinarySearch(objArray,value,column,middle+1,end,comparatorFunc);
		}
		else if(comparisonResult < 0)
		{
			return comparatorFunctionBinarySearch(objArray,value,column,start,middle-1,comparatorFunc);
		}
	}
	
	function FilterNotFoundEqualsFunction(objArray,column,value)
	{
		let element_received = value;	
		let arrayElements = {first:[], second:[]};
		let count = 0;
		
		objArray.first.forEach((element)=>
		{
			if(element[column] == element_received)
			{	
				arrayElements.first.push(objArray.first[count]);
				arrayElements.second = objArray.second;
			}
			++count;
		});
		
		//console.log(arrayElements);
		return arrayElements;
	}
	
	function FilterDateNotFoudFunction(objArray,column,value)
	{
		let arrayElements = {first:[], second:[]};
		let count = 0;
		
		objArray.first.forEach((element)=>
		{
			let dateReceived  = value.split("-");
			let dateComparison = element[column].toLocaleString('fr-FR',{day:"numeric",month:"numeric",year:"numeric"}).split("/");
			
			if(Number(dateReceived[2]) == Number(dateComparison[2]) && Number(dateReceived[1]) == Number(dateComparison[1]) && Number(dateReceived[0]) == Number(dateComparison[0]) )
			{
				arrayElements.first.push(objArray.first[count]);
				arrayElements.second = objArray.second;
			}
			++count;
		});
				
		return arrayElements;
	}
	
	function FilterElementNotFoundFunction(objArray,column,value)
	{
		let arrayElements = {first:[], second:[]};
		let count = 0;
		
		objArray.first.forEach((element)=>
		{
			let valueReceived  = value;
			let valueComparison = element[column];
			
			if(value == valueComparison)
			{
				arrayElements.first.push(objArray.first[count]);
				arrayElements.second = objArray.second;
			}
			++count;
		});
				
		return arrayElements;
	}
	
	function dateComparatorFunction(index,objArray,column,value) 
	{
		let dateReceived = objArray.first[index][column].toLocaleString('fr-FR',{day:"numeric",month:"numeric",year:"numeric"}).split("/");
		let dateComparison = value.split("-");
		if( objArray.first[index][column].getDate() == 2 && objArray.first[index][column].getMonth() == 9)
		{
			//console.log(dateReceived);
			//console.log(dateComparison);
			//console.log(Number(dateReceived[2]) +"-"+Number(dateReceived[1])+"-"+ Number(dateReceived[0]));
			//console.log(Number(dateComparison[2]) +"-"+Number(dateComparison[1])+"-"+ Number(dateComparison[0]));
		} 
		
		if(Number(dateReceived[2]) > Number(dateComparison[2]))
		{
			return -1;
		}
		else if (Number(dateReceived[2]) < Number(dateComparison[2]))
		{
			return 1;
		}
		else 
		{
			
			if(Number(dateReceived[1]) > Number(dateComparison[1]))
				return -1;
			else if(Number(dateReceived[1]) < Number(dateComparison[1]))
				return 1;
			else
			{
				if(Number(dateReceived[0]) > Number(dateComparison[0]))
					return -1;
				else if (Number(dateReceived[0]) < Number(dateComparison[0]))
					return 1;
				else
					return 0;
			}
		}
	}
	
	function basicDateComparison(dateOne,dateTwo)
	{
			if(dateOne.getFullYear() > dateTwo.getFullYear()) return 1;
			if(dateOne.getFullYear() < dateTwo.getFullYear()) return -1;
			if(dateOne.getMonth() > dateTwo.getMonth()) return 1;
			if(dateOne.getMonth() < dateTwo.getMonth()) return -1;
			if(dateOne.getDate()> dateTwo.getDate()) return 1;
			if(dateOne.getDate()< dateTwo.getDate()) return -1;
			return 0;
	}
	
	function formingValuesAroundElement(objArray,value,column,start,middle,end,comparatorFunc)
	{
		let returnValue = {first:[],second:undefined};
		let othereturnValue = {first:undefined,second:undefined};
		let left = middle -1;
		let leftOnce = false;
		let rightOnce = false;
		
		returnValue.second = objArray.second;
		othereturnValue.second = objArray.second;
		
		while(left >= start)
		{
			let resultValue = comparatorFunc(left,objArray,column,value);
			if(resultValue == 0)
			{
				returnValue.first.push(objArray.first[left]);
				--left;
			}
			else
			{
				left == start -1;
			}
			
			if(!leftOnce)
				leftOnce = true;
		}
		
		if(leftOnce)
		{
			returnValue.first = returnValue.first.reverse();
		}
		
		returnValue.first.push(objArray.first[middle]);
		othereturnValue.first = objArray.first[middle];
		let right = middle + 1;
		
		while(right <= end)
		{
			let resultValue = comparatorFunc(right,objArray,column,value);
			if(resultValue == 0)
			{
				returnValue.first.push(objArray.first[right]);
				++right;
			}
			else
			{
				right == end;
			}
			if(!rightOnce)
			{
				rightOnce = true;
			}
		}
		
		if(leftOnce || rightOnce)
		{
			return returnValue;
		}
		
		//return othereturnValue;
		return returnValue;
	}
	
	function splitText(textStr,count)
	{
		let returnValue = [];
		let length = textStr.length;
		let index = 0;
		let value = "";
		let set = false;
		
		while(index < length)
		{
			value += textStr[index];
			if(value.length == count )
			{
				returnValue.push(value);
				set = true;
				value = "";
			}
			else
				set = false;
			++index;
		}
		
		if(!set && value.length > 0)
		{
			returnValue.push(value);
		}
		
		return returnValue;
	}
	
	function findElementIntoArray(array,valuesName,valuesNameTwo,othersValue1,othersValue2)
	{
		let length = array.length;
		console.log(valuesName);
		console.log(length);
		console.log(valuesNameTwo);
		
		for (let index = 0; index < length; ++index)
		{
			if( array[index][valuesName] == othersValue1)
			{
				console.log("Found "+valuesName+" == "+othersValue1);
				array[index][valuesNameTwo] = othersValue2;
				console.log(othersValue2);
				break;
			}
		}
	}
	
	
	function waitFunction(time)
	{
		console.log("Waiting function"); 
		if( time )
		{
			let d1 = new Date();
			
			while(( Date.now() - d1) < time);	
			
			console.log("Waiting done");
			
		}	
		else
		{
			while(true);
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	let blob_stuff = "vercel_blob_rw_AhayNnM8BUTRk7li_Pirrs7p4aeFH5cnD9hONM9peBfDhxd";