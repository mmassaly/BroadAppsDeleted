	var http = require("http");
	var url = require("url");
	var postgres = require('pg');
	var sqlModule = require('@vercel/postgres');
	var formidable = require('formidable');
	var fs = require('fs');
	var vercelBlob = require("@vercel/blob");
	var {GlobalsForcedFolding} = require('./Extra.js');	
	let globalForcedFoldingPrime = undefined;
	let connection = undefined;
	let precedentDate = new Date(Date.now());
	let todaysDate = new Date(Date.now());
	let primaryObject = undefined;
	let baseInit = false;
	let schema = "";
	let current= todaysDate;
	let addUser_In_use = false; 
	let commands = [];
	let callIndex = 0;
	//"SET @@lc_time_names = 'fr_FR';"
	let charging_percentage = 0; 	
	let base_init_exiting = false;
	var connectedguys =
	[	
	];
	
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
				function()
				{	
					let currentDatedetails = getDateDetailsFromCorruptJavascript();
					console.log("Done sleeping..............");
					if(precedentDate.getYear() != todaysDate.getYear())
					{
						getDataForAdmin(undefined,undefined,undefined,undefined,currentDatedetails[2],undefined,undefined);
					}
					else if (precedentDate.getMonth() != todaysDate.getMonth())
					{
						getDataForAdmin(undefined,undefined,undefined,undefined,currentDatedetails[2],currentDatedetails[1],undefined);
					}
					else if(precedentDate.getDay() != todaysDate.getDay() )
					{
						getDataForAdmin(undefined,undefined,undefined,undefined,currentDatedetails[2],currentDatedetails[1],currentDatedetails[0]);
					}
					
					ofUpdate();
			},1000);
	}


	function ofUpdate()
	{
		current = new Date(Date.now());
		let totalSeconds = (current.getHours()*60*60 + current.getMinutes()*60+ current.getSeconds())*1000;
		let total = 86400000;
		//total = 180000 + totalSeconds;
		//'fr-FR'(total-totalSeconds)
		setTimeout(caller,total-totalSeconds);
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
				//console.log("You bot are making an image request processed to be "+imageUrlReprocessed);
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
						try
						{
							const blob = await vercelBlob.head(req.url,{
								token: "vercel_blob_rw_70gXoZ4JnkgIVATX_LItRzZnyiVF2IfjUxYT3srgV7mUcTn"
							});
							//console.log(blob);
							res.writeHeader(200,{"Content-Type":blob.contentType});
							res.write(blob);
						}
						catch(ex)
						{
							//console.log(ex);
						}
						res.end();
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
								forced_authentification_query(userAuthentification,undefined).then(( tempresult )=>
								{
									let othertempResult = check_super_admin(userAuthentification,undefined,undefined);
									urlObject.date = new Date(urlObject.date);
									insertEntryandExitIntoEmployees(userAuthentification.ID,urlObject.date,urlObject.start,urlObject.end,urlObject,resultb);	
									getDataForAdmin(res,undefined,undefined,urlObject,undefined,undefined,undefined);
								}
								,(ex) =>
								{
									dummyResponseSimple(resultb);
									return;
								});
							}
							if(command === "login")
							{	
								let resultb = result;
								
								forced_authentification_query_login(urlObject.userAuthentification,result).then((ares)=>
								{
										check_super_admin(urlObject.userAuthentification,undefined,undefined).then((othertempResult)=>
										{
												if(ares.first == true || ares.second == true || ares.third == true)
												{
													//console.log("Inside setting");
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
													//console.log("Sending response");
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
											//console.log(otherError);
											dummyResponse(resultb,ex);
											return;
										});
									}
									,(ex2)=>
									{
										dummyResponse(resultb,ex2);
										return;
									});
							}
							else if(command === "pull") 
							{
								let commandArg = urlObject.cmdArg;
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
												console.log("This guy is authenticated");
												let resultd = resultc;
												check_super_admin(userAuthentification,sqlConnection,undefined).then((othertempResult)=>
												{
													if(othertempResult.first)
													{
														console.log("This guy is a primary admin");
														console.log("responding");
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
														//console.log("This guy is a secondary admin");
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
														if(commandArg == "all")
														{
															if(primaryObject == undefined)
															{
																dummyResponseSimple(resultc);
															}
															else
															{
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
					await getDataForAdminThreeArgs(undefined,undefined);
				};
				func();
				//console.log(startingTag);
				ofUpdate();
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
	
	whileFunction("Starting Server....");
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
				
		query = "insert into \""+nomdelaTable+"\" values ('"
		+ ID+"','"+datereversed+"','"+startTime+"',"+((endTime == undefined)?null:"'"+endTime+"'")+")"
		+" ON CONFLICT (IdIndividu,Date,Entrées) "+((endTime == undefined)?(" WHERE Sorties < '"+((endTime == undefined)? null+"'":"'"+endTime+"'")):"")+" DO UPDATE SET Sorties = "+((endTime == undefined)?null:"'"+endTime+"'")+";\n";
		//console.log(query);
		results  = await faire_un_simple_query(query);
		
		if(results.second == false && !results.second instanceof Array)
		{
			dummyResponseSimple(res);
			return;
		}

		//console.log(empHoursObj);
		
		if(res == undefined)
		{
			res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
								,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
								,"Access-Control-Max-Age":'86400'
								,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
								});
			res.write(JSON.stringify("OK"));
			res.end();
			console.log("Basic Response");
		}
		
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
			
			if(command === "update" || (command instanceof Array && command[0] === "update"))
			{
					let dealingWithArray = command instanceof Array;
					let commandArg = fields.cmdArg;
					//console.log(commandArg);
					//console.log(fields.cmdArg);
					let tablename = "";
					let querySQL = "";
					let doubleQuerySQL = "";
					let thirdQuerySQL = "";
					let yearParam = undefined;
					let monthParam = undefined;
					let dayParam = undefined;
					
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
					else if(commandArg === "employees" || (dealingWithArray && commandArg[0] === "employees"))
					{
						let image_url = undefined;
			
						if(filesDup != undefined && filesDup.imgfile != undefined || ( filesDup.originalFilename != undefined))
						{
								//console.log(fs.readFileSync(filesDup.filepath));
								const blob = await vercelBlob.put("assets/images/"+filesDup.originalFilename,fs.readFileSync(filesDup.filepath),{
									access: 'public',
									contentType: filesDup.mimetype,
									token: process.env.BLOB_READ_WRITE_TOKEN
								});
								image_url = blob.url;
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
					
					let tempuserAuthentification = {ID:urlObject.authID,Prenom:urlObject.authPrenom,Nom:urlObject.authNom,genre:urlObject.authgenre,naissance:urlObject.authnaissance,pass:urlObject.authpass};
					let tempResult = await forced_authentification_query(tempuserAuthentification,undefined);
					
					//console.log(tempuserAuthentification);
					//console.log(tempResult);
					//console.log(querySQL);
					//console.log("-----------------------Result of authentification----------------------");
					
					if(tempResult.second != false)
					{
						try
						{
							let aresult = await faire_un_simple_query(querySQL);
							console.log("aresult.second "+(aresult.second != false)+" "+aresult.second);
							if(aresult.second != false || (aresult.second instanceof Array))
							{
								let userTimeObject = undefined;
								let userOfficeObject = undefined;
								let userAdditionObject = undefined;
								//console.log(commandArg[0]);
								//console.log(commandArg);
								//console.log(dealingWithArray);
								if (commandArg === "offices" || (dealingWithArray && commandArg[0] === "offices"))
								{
									userOfficeObject = urlObject;
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
									await getDataForAdmin(undefined,userOfficeObject,undefined,undefined,undefined,undefined,undefined);
									
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
									let bresult = await faire_un_simple_query(doubleQuerySQL);
									if(bresult.second != false || bresult.second instanceof Array)
									{
										let cresult = await faire_un_simple_query(thirdQuerySQL);
										if(cresult.second != false || cresult.second instanceof Array)
										{
											userAdditionObject = urlObject;
											//let fs = require('fs');
											//await fs.rename(filesDup.filepath, path + filesDup.originalFilename,function(err_){});
											res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
																,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
																,"Access-Control-Max-Age":'86400'
																,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
																});
											res.write(JSON.stringify({customtext:"OK"}));
											//console.log("no problems");
											res.end();
											await getDataForAdmin(undefined,undefined,userAdditionObject,undefined,undefined,undefined,undefined);
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
		/*
		try 
		{	
			var postgresConnection = new postgres.Client("postgres://default:QHiOur92EwzF@ep-patient-darkness-72544749.us-east-1.postgres.vercel-storage.com:5432/verceldb"+ "?sslmode=require");
			await postgresConnection.connect();
			return new Promise ((resolve,reject) => 
			{
				//console.log("Database connection successfull.");
				resolve(postgresConnection);	
			});
		}
		catch(ex)
		{
			console.log(ex);
			return new Promise ((resolve,reject) => 
			{
				//console.log("Database connection not  successfull.");
				resolve(undefined);	
			});
		}*/
		//console.log(postgresConnection);
		return new Promise ((resolve,reject) => 
		{
			resolve(sqlModule.sql);	
		});
	}

	async function faire_un_simple_query(queryString)
	{
		let sql = undefined;	
		sql = await exigencebasededonnée();
		console.log(sql);
		try
		{
			let result = await sql`${queryString}`;
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
			console.log(queryString);
			console.log("Exception caught");
			console.log(ex);
			return new Promise((resolve,reject)=>{reject({first:ex,second:false});});
		}
		/*
		//console.log(queryString);
		while(sql == undefined)
		{
			sql = await exigencebasededonnée();
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
			try
			{
				await sql.end();
			}
			catch(e)
			{
			}
			console.log(queryString);
			console.log("Exception caught");
			console.log(ex);
			return new Promise((resolve,reject)=>{reject({first:ex,second:false});});
		}*/		
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
				
				let query = "SELECT IDIndividu,SuperAdmin, Admin, \"User\",Password FROM login inner join ";
				query+= "individu ON individu.ID = login.IDIndividu;"; 
					
				let notAnError = await faire_un_simple_query(query);
				
				if(!(notAnError.second == false))
				{
					let authenticated = false;
						
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
							//console.log(notAnError.first[u].superadmin);
							//console.log(notAnError.first[u].admin);
							//console.log(notAnError.first[u].User);
							//console.log(userAuthentification.ID);
							//console.log(userAuthentification.pass);
							
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
				 return await getDataForAdmin(response,locationArgObj,undefined,undefined,undefined,undefined,undefined);
			}

			async function getDataForAdminFourArgs(response,locationArgObj,empObj)
			{
				return await getDataForAdmin(response,locationArgObj,empObj,undefined,undefined,undefined,undefined);
			}
			
			async function getDataForAdmin(response,locationArgObj,empObj,empHoursObj,paramyear,parammonth,paramday)
			{
				//console.log(" paramyear "+paramyear+" other paramday "+paramday+" other parammonth "+parammonth);
				//console.log("Location argument "+locationArgObj+" employee argument "+empObj);
				let data = 
				{
					selected_name: 0,
					container : [],
					nowVisible: false,
					otherVisible : false
				};	
				
				if (primaryObject == undefined)
					primaryObject = data;
				else
					data = primaryObject;
				
				try
				{
					
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
							yearIndex: 0,
							monthIndex: 0,
							weekIndex: 0,
							dayIndex: 0,
							nowVisible: false
						};
						
						let foundValueForLocationTemp = getLocation(data,officeID);
						foundValueForLocation = foundValueForLocationTemp.first;
						if(foundValueForLocationTemp.second != undefined)
							location_index = foundValueForLocationTemp.second;
						data.nowVisible = true;
						
						if(foundValueForLocation == undefined)
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
						
						if( !(paramyear === undefined  )) 
						{
							query = "Select * from \"manuel des tables d'entrées et de sorties\" where Année = "+paramyear+";";
						}																																		
						else if (empHoursObj != undefined)
						{
							console.log(empHoursObj);
							query = "Select * from \"manuel des tables d'entrées et de sorties\" where Année = "+empHoursObj.date.getFullYear()+";";
						}
						
						let result_ = await faire_un_simple_query(query);
						if(result_.second == false && !(result_.second instanceof Array)) 
						{
							dummyResponseSimple(response);
							return false;
						}
						//console.log(query);
						let monthCounts = 0;
						if( (parammonth === undefined) === false)
						{
							monthCounts = parammonth;
						}

						if(empHoursObj != undefined)
						{
							monthCounts = empHoursObj.date.getMonth();
						}
						let prevMonthCounts = monthCounts;
						for (let l = 0; l < result_.first.length; ++l)
						{
							monthCounts = prevMonthCounts;
							let year = result_.first[l][result_.second[0].name];
							let state = result_.first[l][result_.second[1].name];
							let table = result_.first[l][result_.second[2].name];
							let param_year_month_day = (paramday != undefined && paramonth != undefined && paramyear != undefined)?paramyear+"-"+paramonth+"-"+paramday : undefined;
							
							let query = "Select * from individu inner join appartenance";
							query += " ON appartenance.IDIndividu =  individu.ID";
							query += " inner join \"location du bureau\" ON  appartenance.IDBureau =";
							query += " \"location du bureau\".ID AND EXTRACT(YEAR FROM individu.Début) <= ";
							query += year + " AND EXTRACT(YEAR FROM individu.Fin) >="+year;
							query +=(empObj != undefined)?" AND individu.ID = '"+empObj.ID+"';":((empHoursObj != undefined)?" AND individu.ID = '"+empHoursObj.userAuthentification.ID+"';":";");
							
							query += "Select * FROM";
							query += " \""+state+"\" as A";
							query += (param_year_month_day != undefined)?(" WHERE A.Date ='"+param_year_month_day+"'"):(empObj != undefined)?" WHERE Idindividu = '"+empObj.ID+"'":(empHoursObj != undefined)? " WHERE IdIndividu = '"+empHoursObj.userAuthentification.ID+"' AND A.Date ='"+empHoursObj.date.getFullYear()+"-"+(empHoursObj.date.getMonth()+1)+"-"+empHoursObj.date.getDate()+"'":"";
							query += " ORDER BY A.Date ASC;";
						
							query += "Select Case WHEN MIN(\""+table+"\".Entrées) >= '10:00:00' then 1 "; 
							query += "WHEN MIN(\""+table+"\".Entrées) < '10:00:00' then 0 END as CaseOne,";
							query += "Case WHEN  MIN(\""+table+"\".Entrées) > '8:30:00' then 1 ";
							query += "WHEN MIN(\""+table+"\".Entrées) <= '8:30:00' then 0 END as CaseTwo,";
							query += "MIN(\""+table+"\".Entrées), Date ,Idindividu FROM \""+table+"\"";
							query += (param_year_month_day != undefined)?" WHERE Date ='"+param_year_month_day+"'":(empHoursObj== undefined)? ((empObj != undefined)?" WHERE Idindividu = '"+empObj.ID+"'":""):" WHERE Idindividu = '"+empHoursObj.userAuthentification.ID+"' AND Date ='"+empHoursObj.date.getFullYear()+"-"+(empHoursObj.date.getMonth()+1)+"-"+empHoursObj.date.getDate()+"'";
							query += " GROUP BY Date, Idindividu ORDER BY Date ASC;";
							
							query += "Select * FROM";
							query += " \""+table+"\" as A";
							query += (empObj == undefined)?((empHoursObj == undefined)?"":" where A.Idindividu ='"+empHoursObj.userAuthentification.ID+"'"):" where A.Idindividu ='"+empObj.ID+"'";
							query += " GROUP BY Entrées,Date,Idindividu ORDER BY Date ASC;";
							
							if(empHoursObj)
							{console.log(query);}
						
							//console.log(empHoursObj);
							let threeResults = await faire_un_simple_query(query);
							let resultTwo = threeResults[0];
							let aresult = threeResults[2];
							let bresult = threeResults[1];
							let cresult = threeResults[3];
							
							let currentDateOfYear =  new Date(year,monthCounts,(paramday == undefined)?(empHoursObj != undefined? empHoursObj.date.getDate():1):paramday);		
							let weekIndex = -1;
							let monthFound = -1;
							let monthIndex = -1;
							let yearIndex = -1;
							let employeeContentModelIndex = -1;

							if(paramyear == undefined)
							{
								if(currentDateOfYear > dateToday )
								{
									//console.log("breaking");
									break;
								}
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
									missions: 0,
									vacations:0,
									absences: 0,
									retards: 0,
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
								testCount = empHoursObj.date.getMonth();
							let going_yearly_count = (parammonth == undefined)? 12: parammonth + 1;
							if(empHoursObj != undefined)
								going_yearly_count = empHoursObj.date.getMonth()+1;
							//console.log("Test count "+testCount+" year_count "+going_yearly_count);
							
							while( testCount < going_yearly_count )
							{
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
								currentDateOfYear = new Date(year,monthCounts-1,(paramday == undefined)?(empHoursObj != undefined? empHoursObj.date.getDate():1):paramday);
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
								
								if(parammonth == undefined && currentDateOfYear > dateToday )
								{
									//console.log(currentDateOfYear+" > to "+ dateToday);
									//console.log("breaking");
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
									sicknesses: 0,
									presence: 0,
									retardsCritical: 0
								};

								let monthFoundAlpha = undefined;
								let monthSearchIndex = testCount;
								
								if(parammonth != undefined)
								{
									monthSearchIndex = parammonth+1;
								}	

								monthFoundAlpha = getMonth(yearContentModel,monthSearchIndex);
								monthFound = monthFoundAlpha.first;
								
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
								
								console.log(currentDateOfYear);
								console.log("Month is "+currentDateOfYear.getMonth());
								console.log("Nombre de jours "+(new Date(currentDateOfYear.getFullYear(),currentDateOfYear.getMonth()+1,0)).getDate());
								
								if(paramday != undefined)
									nombre_de_jours = paramday;
								if( empHoursObj != undefined ) 
								{
									nombre_de_jours  = empHoursObj.date.getDate();
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
									
								while( start_day <= nombre_de_jours)
								{
									currentDateOfYear = new Date(year,monthCounts-1,start_day);
									
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

									if(currentDateOfYear > dateToday )
									{	
										console.log(currentDateOfYear+" > to "+ dateToday);
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
										&& currentday == day && currentYear == year)
									{	
										nowDate = currentDateOfYear;
										nowDateStr = day+"-"+amonth+"-"+ayear;
										//console.log("Current time is current time "+currentDateOfYear.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"}));
										//console.log(nowDateStr);
										//console.log(currentDateOfYear);
										//console.log(dateNow);
										unitLocation.now = currentDateOfYear.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"});
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
										retardsdates:[],
										retardsCritical: 0,
										retardsCriticaldates:[],
										vacations:0,
										vacationsdates:[]
									};
									
									console.log("month "+monthIndex+" week no is "+weekNo+" weekDayIndex "+ weekDayIndex+" weeks data length is "+yearContentModel.months[monthIndex].weeks.length);
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
									
									
									
									if(empObj == undefined)
									{
										postgresqueryArg = [officeID,year,year];
									}
									else
									{
										postgresqueryArg = [officeID,year,year,empObj.ID];
									}
									
									if(resultTwo.second == false ) 
									{
										base_init_exiting = true;
										dummyResponseSimple(response);
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
															overallretarddates:{count:0,other:[]}
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
															overallretarddates:{count:0,other:[]}
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
															overallretarddates:{count:0,other:[]}
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
															overallretarddates:{count:0,other:[]}
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
															overallretarddates:{count:0,other:[]}
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
															overallretarddates:{count:0,other:[]}
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
															overallretarddates:{count:0,other:[]}
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
															overallretarddates:{count:0,other:[]}
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
															overallretarddates:{count:0,other:[]}
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
															overallretarddates:{count:0,other:[]}
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
															overallretarddates:{count:0,other:[]}
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
															overallretarddates:{count:0,other:[]}
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
													let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"employees",index:yearContentModel.employees.length}], commandObj:{command:"push",value:days} };
													pushCommands(command);
													yearContentModel.employees.push(employeeDescribed);
													yearContentModel.empDic[employeeDescribed.ID] = employeeDescribed;
													yearContentModel.employeesCount++;
												}
												
											
											if(aresult.second == false ) 
											{	
												base_init_exiting = true;
												dummyResponseSimple(response);
												return false;
											}

											if(bresult.second == false ) 
											{
												base_init_exiting = true;
												dummyResponseSimple(response);
												return false;
											}

											
											if(cresult.second == false ) 
											{
												base_init_exiting = true;
												dummyResponseSimple(response);
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
												yearContentModel.months[monthIndex].weeks[weekIndex].days[dayIndex].employeeHours[employeeContentModel.ID] = "00:00:00";
											}
											if(yearContentModel.months[monthIndex].weeks[weekIndex].employeeHours[employeeContentModel.ID] == undefined)
											{
												yearContentModel.months[monthIndex].weeks[weekIndex].employeeHours[employeeContentModel.ID] = "00:00:00";
											}
											if(yearContentModel.months[monthIndex].employeeHours[employeeContentModel.ID] == undefined)
											{
												yearContentModel.months[monthIndex].employeeHours[employeeContentModel.ID] = "00:00:00";
											}
											if(yearContentModel.employeeHours[employeeContentModel.ID] == undefined)
											{
												yearContentModel.employeeHours[employeeContentModel.ID] = "00:00:00";
											}
											// console.log("*****************************");
											//console.log(aresult);
											//console.log("*********************************");
											if(secondresult.second !== false)
											{	
												let dateNowOther = new Date(Date.now());
												let criticallylate = false; 
												let retard = false;
												
												if(secondresult.first[0].length > 0)
												{
													if( secondresult.first[0][0][secondresult.second[0][0].name] == 1 ) 
													{
														
														if(employeeContentModel.retard)
														{
															calculateRetards(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
															employeeContentModel.retard = false;
														}

														employeeContentModel.retardCritical = true;
														employeeContentModel.date = currentDateOfYear.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"});
														criticallylate = true;
														calculateCriticalRetards(unitLocation,year,1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														
														if(employeeContentModel.absence)
														{
															employeeContentModel.absence = false;
															calculateAbsence(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);	
														}
													}
													else if (secondresult.first[0][0][secondresult.second[0][1].name] == 1 ) 
													{
														if(employeeContentModel.retardCritical)
														{
															employeeContentModel.retardCritical = false;
															calculateCriticalRetards(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														}

														employeeContentModel.retard = true;
														employeeContentModel.date = currentDateOfYear.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"});
														retard = true;	

														if(employeeContentModel.absence)
														{
															employeeContentModel.absence = false;
															calculateAbsence(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);	
														}

														calculateRetards(unitLocation,year,1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
													}
													else if (secondresult.first[0][0][secondresult.second[0][2].name] != undefined && secondresult.first[0][0][secondresult.second[0][2].name] != null ) 
													{
														employeeContentModel.presence = true;
														employeeContentModel.date = currentDateOfYear.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"});
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
																	}
																	else
																	{
																		//console.log("Full Second");
																		if(value_to_deal_with)
																		{
																			employeeContentModel.entries.push(a);
																			employeeContentModel.exits.push(b);
																		}
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
													
													
												}
												
												if( secondresult.first[0].length == 0 && secondresult.first[1].length == 0 && dateNowOther.getUTCDate() > currentDateOfYear)
												{
													employeeContentModel.absence = true;
													employeeContentModel.retard = false;
													absence = true;
													employeeContentModel.date = currentDateOfYear.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"});
													calculateAbsence(unitLocation,year,1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
												}
												
												if(!employeeContentModel.presence && !retard && !criticallylate 
													&& ((dateNowOther.getUTCHours() == 8 && dateNowOther.getUTCMinutes() > 30)
													|| ((dateNowOther.getUTCHours() == 8 && dateNowOther.getUTCMinutes() == 30 && dateNowOther.getUTCSeconds() > 0)) 
													|| (dateNowOther.getUTCHours() > 8) ) )
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
														calculateAbsence(unitLocation,year,1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
																
												} 
												
												if(secondresult.first[1].length > 0)
												{
													//console.log("Getting to know secondresult ");
													//console.log(secondresult.first[1]);
													//console.log(secondresult.first[0]);
													//console.log(secondresult.first[2]);
													
													if( secondresult.first[1][secondresult.second[1][3].name] == 1 ) 
													{
														employeeContentModel.maladie = true;
														employeeContentModel.date = currentDateOfYear.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"});
														calculateSicknesses(unitLocation,year,1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														if(employeeContentModel.mission)
														{
															calculateMission(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														}
														if(employeeContentModel.absence)
														{
															calculateAbsence(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														}
														if(employeeContentModel.congès)
														{
															calculateCongès(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														}
														
													}
													
													if( secondresult.first[1][secondresult.second[1][4].name] == 1 )
													{
														employeeContentModel.mission = true;
														employeeContentModel.date = currentDateOfYear.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"});
														calculateMission(unitLocation,year,1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														
														if(employeeContentModel.absence)
														{
															calculateAbsence(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														}
														if(employeeContentModel.congès)
														{
															calculateCongès(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														}
														if(employeeContentModel.sicknesses)
														{
															calculateSicknesses(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														}
													}
													
													if( secondresult.first[1][secondresult.second[1][5].name] == 1 )
													{
														employeeContentModel.congès = true;
														employeeContentModel.date = currentDateOfYear.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"});
														calculateCongès(unitLocation,year,1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														if(employeeContentModel.mission)
														{
															calculateMission(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														}
														if(employeeContentModel.absence)
														{
															calculateAbsence(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														}
														if(employeeContentModel.sicknesses)
														{
															calculateSicknesses(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
														}
													}
													
													if( secondresult.first[1][secondresult.second[1][2].name] == 1 )
													{
														if(! employeeContentModel.absence)
														{
															employeeContentModel.absence = true;
															employeeContentModel.date = currentDateOfYear.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"});
															calculateAbsence(unitLocation,year,1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
															if(employeeContentModel.mission)
															{
																calculateMission(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
															}
															if(employeeContentModel.congès)
															{
																calculateCongès(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
															}
															if(employeeContentModel.sicknesses)
															{
																calculateSicknesses(unitLocation,year,-1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
															}
														}
													}
													
												}
											}
											else
											{	
												baseInit = false;
												base_init_exiting = true;
												//console.log("Quitting");
												if (!(response === undefined))
												dummyResponseSimple(response);
												return false;
											}
										}
									}
									else
									{	
										base_init_exiting = true;
										//console.log("Quitting");
										if (!(response === undefined))
										dummyResponseSimple(response);
										return false;
									}
										
									start_day++;
									weekDayIndex = weekDayIndex+1;
									++k;
									astart = true;
									if(empHoursObj != undefined)
										break;	
								}	
								
								if(empHoursObj != undefined)
									break;	
							}
							
						}
						
					}
					
					
					//console.log("Location argument "+locationArgObj+" employee argument "+empObj);
					//console.log(primaryObject);
					
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
		for(let yearLength = 0; yearLength < location.yearsContent; ++yearLength)
		{
			let yearContent = location.yearsContent[yearLength];
			for(let monthLength = 0; monthLength < yearContent.months.length; ++monthLength) 
			{
				let monthContent = yearContent.months[month];
				for(let weekLength = 0; weekLength < monthContent.weeks.length; ++weekLength) 
				{
					let weekContent = monthContent.weeks[weekLength];
					for(let dayLength = 0; dayLength < weekContent.days.length; ++weekLength) 
					{
						let dayContent = weekContent[dayLength].days[dayLength];
						let tempDeleteStack = [];
						
						for(let itemLength = 0; itemLength < dayContent.absencesdates.length; ++itemLength) 
						{
						 	let empdaily = dayContent.absencedates[itemLength];
							if(empdaily.ID != ID)
							{
								dayContent.absences--;
								weekContent.absences--;
								monthContent.absences--;
								yearContent.absences--;
								tempDeleteStack.push(empdaily);
							}
						}
						
						deleteElement(tempDeleteStack,dayContent.absencesdates);
						tempDeleteStack = [];

						for(let itemLength = 0; itemLength < days.missionsdates.length; ++itemLength) 
						{
							let empdaily = dayContent.missionsdates[itemLength];
							if(empdaily.ID != ID)
							{
								dayContent.missons--;
								weekContent.missions--;
								monthContent.missions--;
								yearContent.missions--;
								tempDeleteStack.push(empdaily);
							}
						}
						
						deleteElement(tempDeleteStack,dayContent.missionsdates);
						tempDeleteStack = [];

						for(let itemLength = 0; itemLength < days.absencesdates.length; ++itemLength) 
						{
							let empdaily = dayContent.absencesdates[itemLength];
							if(empdaily.ID != ID)
							{
								dayContent.absences--;
								weekContent.absences--;
								monthContent.absences--;
								yearContent.absences--;
								tempDeleteStack.push(empdaily);
							}
						}
						
						deleteElement(tempDeleteStack,dayContent.absencesdates);
						tempDeleteStack = [];

						for(let itemLength = 0; itemLength < days.presencesdates.length; ++itemLength) 
						{
							let empdaily = dayContent.presencesdates[itemLength];
							if(empdaily.ID != ID)
							{
								dayContent.presence--;
								weekContent.presence--;
								monthContent.presence--;
								yearContent.presence--;
								tempDeleteStack.push(empdaily);
							}
						}
						
						deleteElement(tempDeleteStack,dayContent.presencesdates);
						tempDeleteStack = [];

						for(let itemLength = 0; itemLength < days.sicknessesdates.length; ++itemLength) 
						{
							let empdaily = dayContent.sicknessesdates[itemLength];
							if(empdaily.ID != ID)
							{
								dayContent.sicknesses--;
								weekContent.sicknesses--;
								monthContent.sicknesses--;
								yearContent.sicknesses--;
								tempDeleteStack.push(empdaily);
							}
						}
						deleteElement(tempDeleteStack,dayContent.sicknessesdates);
						tempDeleteStack = [];

						for(let itemLength = 0; itemLength < days.retardsdates.length; ++itemLength) 
						{
							let empdaily = dayContent.retardsdates[itemLength];
							if(empdaily.ID != ID)
							{
								dayContent.retards--;
								weekContent.retards--;
								monthContent.retards--;
								yearContent.retards--;
								tempDeleteStack.push(empdaily);
							}
						}
						
						deleteElement(tempDeleteStack,dayContent.retardsdates);
						tempDeleteStack = [];

						for(let itemLength = 0; itemLength < days.retardsCriticaldates.length; ++itemLength) 
						{
							let empdaily = dayContent.retardsCriticaldates[itemLength];
							if(empdaily.ID != ID)
							{
								dayContent.retardsCritical--;
								weekContent.retardsCritical--;
								monthContent.retardsCritical--;
								yearContent.retardsCritical--;
								tempDeleteStack.push(empdaily);
							}
						}
						
						deleteElement(tempDeleteStack,dayContent.retardsCriticaldates);
						tempDeleteStack = [];
					}
				}
			}
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
				array.splice(tempJIndex,1);
		}
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

	function getDateDetailsFromCorruptJavascript()
	{
		let tempdate = new Date(Date.now());
		let tempday = Number.parseInt(tempdate.toLocaleString().split("/")[0]);
		let tempmonth = Number.parseInt(tempdate.toLocaleString().split("/")[1])-1;
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
	

	function calculateCongès(unitLocation,year,offset,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex)
	{
		let nodupTempAlpha = unitLocation.content.yearsContent[yearIndex];
		let nodupTemp = nodupTempAlpha.first;
		let found = false;
		nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].congèsdates.forEach((element)=>{if(dummyIDComparison(element,employeeContentModel)){result = true;}});
		
		if(!found && offset > 0 || found && offset < 0)
		{
			nodupTemp.congès += offset;
			let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex}], commandObj:{command:((offset>0)?"inc":"dec"),path:"congès"} };
			pushCommands(command);
			nodupTemp.months[monthIndex] += offset;
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex}], commandObj:{command:((offset>0)?"inc":"dec"),path:"congès"} };
			pushCommands(command);
			nodupTemp.months[monthIndex].weeks[weekIndex]+= offset;
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex}], commandObj:{command:((offset>0)?"inc":"dec"),path:"congès"} };
			pushCommands(command);
			nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].congès+= offset;
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex}], commandObj:{command:((offset>0)?"inc":"dec"),path:"congès"} };
			pushCommands(command);
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex}], commandObj:{command:((offset>0)?"push":"remove"),path:"congèsdates",value:employeeContentModel} };
			pushCommands(command);
			nodupTemp.empDic[employeeContentModel.ID].vacationdates.count += offset;
			nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].vacationsdates.count += offset;
		}

		if(offset > -1)
		{
			if(!found)
			{
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].congèsdates.push(employeeContentModel);
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofVacances[employeeContentModel.ID] = employeeContentModel;
				nodupTemp.empDic[employeeContentModel.ID].vacationdates.other.push(employeeContentModel.date);
				nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].vacationdates.other.push(employeeContentModel.date);		
			}
		}
		else
		{
			if(found)
			{
				let tempValue = nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].congèsdates;
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
				
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofVacances[employeeContentModel.ID] = undefined;
				
			}
		}
														l
	}

	function calculatePresence(unitLocation,year,offset,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex)
	{
		let nodupTempAlpha =  getYear(unitLocation,year);
		let nodupTemp = nodupTempAlpha.first;
		let found = false;
		nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].presencedates.forEach((element)=>{if(dummyIDComparison(element,employeeContentModel)){result = true;}});
		
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
		}

		if(offset > 0)
		{
			if(!found)
			{
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].presencedates.push(employeeContentModel);
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofPresences[employeeContentModel.ID] = employeeContentModel;
				nodupTemp.empDic[employeeContentModel.ID].presencedates.other.push(employeeContentModel.date);
				nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].presencedates.other.push(employeeContentModel.date);		
			}
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

				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofPresences[employeeContentModel.ID] = undefined;
				
			}
		}
			
	}

	function calculateSicknesses(unitLocation,year,offset,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex)
	{
		let nodupTempAlpha = getYear(unitLocation,year);
		let nodupTemp = nodupTempAlpha.first;
		let found = false;
		nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].sicknessesdates.forEach((element)=>{if(dummyIDComparison(element,employeeContentModel)){result = true;}});
		
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
		}

		if(offset>0)
		{
			if(!found)
			{
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].sicknessesdates.push(employeeContentModel);
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofSicknesses[employeeContentModel.ID] = employeeContentModel;
				nodupTemp.empDic[employeeContentModel.ID].sicknessdates.other.push(employeeContentModel.date);
				nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].sicknessdates.other.push(employeeContentModel.date);
			}
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
		}

		if(offset > 0)
		{	
			if(!found)
			{
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofAbsences[employeeContentModel.ID] = employeeContentModel;
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].absencesdates.push(employeeContentModel);
				nodupTemp.empDic[employeeContentModel.ID].absencedates.other.push(employeeContentModel.date);
				nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].absencedates.other.push(employeeContentModel.date);
			}
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
			nodupTemp.retards++;
			nodupTemp.months[monthIndex].retards++;
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex}], commandObj:{command:((offset> 0)?"inc":"dec"),path:"retards"} };
			pushCommands(command);
			nodupTemp.months[monthIndex].weeks[weekIndex].retards++;
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex}], commandObj:{command:((offset> 0)?"inc":"dec"),path:"retards"} };
			pushCommands(command);
			nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].retards++;
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex}], commandObj:{command:((offset> 0)?"inc":"dec"),path:"retards"} };
			pushCommands(command);
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex}], commandObj:{command:((offset> 0)?"push":"remove"),path:"retardsdates",value:employeeContentModel} };
			pushCommands(command);
			nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].retarddates.count += offset;
			nodupTemp.empDic[employeeContentModel.ID].retarddates.count += offset;
			
			nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].overallretarddates.count += offset;
			nodupTemp.empDic[employeeContentModel.ID].overallretarddates.count += offset;
		}
		
		if(offset>0)
		{
			if(!found)
			{
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofRetards[employeeContentModel.ID] = employeeContentModel;
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].retardsdates.push(employeeContentModel);
				nodupTemp.empDic[employeeContentModel.ID].retarddates.other.push(employeeContentModel.date);
				nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].retarddates.other.push(employeeContentModel.date);
				
				nodupTemp.empDic[employeeContentModel.ID].overallretarddates.other.push(employeeContentModel.date);
				nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].overallretarddates.other.push(employeeContentModel.date);
			}
		}
		else
		{
			if(found)
			{
				let tempValue = nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].retardsdates;
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

				tempValue = nodupTemp.empDic[employeeContentModel.ID].overallretarddates.other;
				temp_index = tempValue.indexOf(employeeContentModel.date);
				if(temp_index > -1)
					tempValue.splice(temp_index,1);
						
				tempValue = nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].overallretarddates.other; 
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
			nodupTemp.months[monthIndex].retards += offset;
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex}], commandObj:{command:((offset> 0)?"inc":"dec"),path:"retardsCritical"} };
			pushCommands(command);
			nodupTemp.months[monthIndex].weeks[weekIndex].retards += offset;;
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex}], commandObj:{command:((offset> 0)?"inc":"dec"),path:"retardsCritical"} };
			pushCommands(command);
			nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].retards += offset;;
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex}], commandObj:{command:((offset> 0)?"inc":"dec"),path:"retardsCritical"} };
			pushCommands(command);
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex}], commandObj:{command:((offset> 0)?"push":"remove"),path:"retardsCriticaldates",value:employeeContentModel} };
			pushCommands(command);
			nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].criticalretarddates.count += offset;
			nodupTemp.empDic[employeeContentModel.ID].criticalretarddates.count += offset;

			nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].overallretarddates.count += offset;
			nodupTemp.empDic[employeeContentModel.ID].overallretarddates.count += offset;
		}

		if(offset > 0)
		{	
			if(!found)
			{
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofRetards[employeeContentModel.ID] = employeeContentModel;
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].retardsdates.push(employeeContentModel);
				nodupTemp.empDic[employeeContentModel.ID].criticalretarddates.other.push(employeeContentModel.date);
				nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].criticalretarddates.other.push(employeeContentModel.date);
				nodupTemp.empDic[employeeContentModel.ID].overallretarddates.other.push(employeeContentModel.date);
				nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].overallretarddates.other.push(employeeContentModel.date);
			}
		}
		else
		{
			if(found)
			{
				let tempValue = nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].retardsdates;
				if(tempValue.indexOf(employeeContentModel) > -1)
					tempValue.splice(tempValue.indexOf(employeeContentModel),1);
				
				tempValue = nodupTemp.empDic[employeeContentModel.ID].criticalretarddates.other;
				let temp_index = tempValue.indexOf(employeeContentModel.date);
				if(temp_index > -1)
					tempValue.splice(temp_index,1);
						
				tempValue = nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].criticalretarddates.other; 
				temp_index = tempValue.indexOf(employeeContentModel.date);
				if(temp_index > -1)
					tempValue.splice(temp_index,1);

				tempValue = nodupTemp.empDic[employeeContentModel.ID].overallretarddates.other;
				temp_index = tempValue.indexOf(employeeContentModel.date);
				if(temp_index > -1)
					tempValue.splice(temp_index,1);
						
				tempValue = nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].overallretarddates.other; 
				temp_index = tempValue.indexOf(employeeContentModel.date);
				if(temp_index > -1)
					tempValue.splice(temp_index,1);

				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofRetards[employeeContentModel.ID] = undefined;
				
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
			nodupTemp.mission += offset;
			let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex}], commandObj:{command:((offset> 0)?"inc":"dec"),path:"mission"} };
			pushCommands(command);
			nodupTemp.months[monthIndex].mission += offset;
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex}], commandObj:{command:((offset> 0)?"inc":"dec"),path:"mission"} };
			pushCommands(command);
			nodupTemp.months[monthIndex].weeks[weekIndex].mission += offset;
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex}], commandObj:{command:((offset> 0)?"inc":"dec"),path:"mission"} };
				pushCommands(command);
			nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].mission += offset;
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex}], commandObj:{command:((offset> 0)?"inc":"dec"),path:"mission"} };
			pushCommands(command);
			command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex},{path:"days",index:weekDayIndex}], commandObj:{command:((offset> 0)?"push":"remove"),path:"missionsdates",value:employeeContentModel} };
			pushCommands(command);
			nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].missiondates.count += offset;
			nodupTemp.empDic[employeeContentModel.ID].missiondates.count += offset;
		}

		if(offset > 0)
		{
			if(!found)
			{
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].empDicofMissions[employeeContentModel.ID]= employeeContentModel;
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].missionsdates.push(employeeContentModel);
				nodupTemp.empDic[employeeContentModel.ID].missiondates.other.push(employeeContentModel.date);
				nodupTemp.empDic[employeeContentModel.ID].months[monthIndex].missiondates.other.push(employeeContentModel.date);
			}
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