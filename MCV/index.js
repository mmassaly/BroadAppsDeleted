	var http = require("http");
	var url = require("url");
	var postgres = require('postgres');
	var formidable = require('formidable');
	var fs = require('fs');
	
	let connection = undefined;
	let precedentDate = new Date(Date.now());
	let todaysDate = new Date(Date.now());
	let primaryObject = undefined;
	let baseInit = false;
	let schema = "";
	let current= todaysDate;
	let addUser_In_use = false; 
	let commands = [];
	//"SET @@lc_time_names = 'fr_FR';"
		
	var connectedguys =
	[	
	];
	
	var filesdirectories = 
	[
		{command:'update employee',path:'../Project Timing/my-app/src/assets/images/'}
	];
	
	let d = new Date(Date.now());
	console.log(d.getHours()+" "+d.getMinutes()+" "+d.getSeconds());
	
	
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
	
	var server = http.createServer(function(req,res)
	{
		console.log(req.method);
		console.log(req.url);
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
			console.log("Inside request method "+req.method);
			console.log(req.url);
			console.log(req.method);
			
			var imageType = "";
			if(req.url.endsWith(".jpeg"))
				imageType = "jpeg";
			if(req.url.endsWith(".png"))
				imageType = "png";
			if(req.url.endsWith(".jpg"))
				imageType = "jpg";
			
			if(req.url.endsWith(".jpeg") ||req.url.endsWith(".png") || req.url.endsWith(".jpg"))
			{
				var imageUrlReprocessed = req.url.substring(1,req.url.length).replaceAll("%20"," ");
				console.log("You bot are making an image request processed to be "+imageUrlReprocessed);
				fs.exists(imageUrlReprocessed,function(exists)
				{
					if(exists)
					{
						fs.readFile(imageUrlReprocessed,function(err,data)
						{
							if(err)
							{
								console.log(err);
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
						console.log("Image file does not exist.");
					}
				});
			}
			else
			{
				fs.readFile("SelfDescription.htm",function(err,data)
				{
					if(data != undefined)
					{
						res.writeHeader(200,{"Content-Type":"text/html"});
						res.write(data);
						res.end();
					}
					else
						res.end();
				});
			}
		}
		else if(req.method === 'POST')
		{
				var reqData = "";
				if(req.url == "/form")
				{
					console.log("incomming request but primary object is "+primaryObject);
					if(primaryObject == undefined)
					{
						res.end();
						return;
					}
					formidableFileUpload(req,"../Project Timing/my-app/src/assets/images/",res);
				}
				else
				{
						req.on("data",function(data)
						{
							reqData += data;
						}).on("end",()=>
						{
							console.log("incomming request but primary object is "+primaryObject);
							if(primaryObject == undefined)
							{
								res.end();
								return;
							}
							console.log(reqData);
							let urlObject = undefined;
							try
							{
								urlObject = JSON.parse(reqData);	
							}
							catch(ex)
							{
								console.log(ex);
								dummyResponse(res);
								return;
							}

							console.log(reqData);
							console.log(urlObject);
							console.log("Able to continue to step 1");
							
							if(urlObject == undefined)
							{
								console.log("Undefined urlObject");
								dummyResponse(res);
								return;
							}

							console.log("Able to continue to step 2");
							
							let command = urlObject.command;
							console.log("Command is update "+ command == "update");
							
							if(command === "update")
							{
								let commandArg = urlObject.cmdArg;
								if(commandArg == undefined)
								{
									console.log("undefined commandArg");
									dummyResponse(res);
									return;
								}
								else if(commandArg !== "hours")
								{
									console.log("undefined commandArg");
									dummyResponse(res);
									return;
								}
								
								let userAuthentification = urlObject.userAuthentification;
								if(userAuthentification == undefined) 
								{
									console.log("undefined userAuthentification");
									dummyResponse(res);
									return;
								}
								else
								{
									console.log("user authentification request received");
								}
								
								if(userAuthentification.ID == undefined || userAuthentification.Prenom == undefined
									|| userAuthentification.Nom == undefined || userAuthentification.genre == undefined
									|| userAuthentification.naissance == undefined || userAuthentification.pass == undefined)
								{
									console.log("undefined credentials");
									dummyResponse(res);
									return;
								}
								else
								{
									console.log("all credentials received");
								}

								console.log("Trying to authenticate");
								forced_authentification_query(userAuthentification,undefined).
								then(
								(tempResult)=> 
								{
									check_super_admin(userAuthentification,undefined,undefined).then(
									(othertempResult)=>
									{
										urlObject.date = new Date(urlObject.date);
										insertEntryandExitIntoEmployees(userAuthentification.ID,new Date(urlObject.date),urlObject.start,urlObject.end,urlObject,res);	
									},
									(errortempResult)=>
									{
										dummyResponse(res);
										return;
									});
									
								},
								(error)=>
								{
									dummyResponse(res);
									console.log("This guy is not an authenticated admin");
									return;
								});
							}
							if(command === "login")
							{	
								forced_authentification_query_login(urlObject.userAuthentification,res).then(
								(ares)=>
								{
									check_super_admin(urlObject.userAuthentification,undefined,undefined).then(
									(othertempResult)=>
									{
										console.log(othertempResult);
										if(ares.first == true || ares.second == true || ares.third == true)
										{
											if(othertempResult.first)
											{
												ares.element.superadmin = true;
												ares.element.admin = false;
												ares.element.user = false; 
											}
											else if(othertempResult.second)
											{
												ares.element.superadmin = false;
												ares.element.admin = true;
												ares.element.user = false;
											}
											else if(othertempResult.third)
											{
												ares.element.superadmin = false;
												ares.element.admin = false;
												ares.element.user = true;
											}
										}
										
										if(ares.first)
										{
											res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
											,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
											,"Access-Control-Max-Age":'86400'
											,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
											});
											
											res.write(JSON.stringify(ares));
											res.end();

										}
										else if(ares.second || ares.third)
										{
											
											res.writeHead(200,{"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
											,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
											,"Access-Control-Max-Age":'86400'
											,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
											});

											res.write(JSON.stringify(ares));
											res.end();
											
										}

									},(otherError)=>
									{
										dummyResponse(res,otherError);
										return;
									});
								}
								,(aerror)=>
								{
									console.log(aerror);
									dummyResponse(res,aerror);
									return;
								});
							}
							else if(command === "pull") 
							{
								let commandArg = urlObject.cmdArg;
								if(commandArg == undefined)
								{
									console.log("undefined commandArg");
									dummyResponse(res);
									return;
								}
								else
								{
									console.log("pull command received");
								}
								
								let userAuthentification = urlObject.userAuthentification;
								if(userAuthentification == undefined) 
								{
									console.log("undefined userAuthentification");
									dummyResponse(res);
									return;
								}
								else
								{
									console.log("user authentification request received");
								}
								
								if(userAuthentification.ID == undefined || userAuthentification.Prenom == undefined
									|| userAuthentification.Nom == undefined || userAuthentification.genre == undefined
									|| userAuthentification.naissance == undefined || userAuthentification.pass == undefined)
									{
										console.log("undefined credentials");
										dummyResponse(res);
										return;
									}
									else
									{
										console.log("all credentials received");
									}
									
								let queries = [];

								if(commandArg === "all" || commandArg === "update") 
								{
									let sqlConnection = connection;
									console.log("Trying to authenticate");
									forced_authentification_query(userAuthentification,undefined).then((tempResult)=> {
										console.log("Result is "+tempResult);
										if(tempResult)
										{
											console.log("This guy is authenticated");
											check_super_admin(userAuthentification,sqlConnection,undefined).then(
											(othertempResult)=>
											{		
												console.log(othertempResult);
												if(othertempResult.first)
												{
													console.log("This guy is a primary admin");
													if(primaryObject == undefined)
													{
														getDataForAdmin(res,undefined);
													}
													
													res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
													,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
													,"Access-Control-Max-Age":'86400'
													,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
													});
													if(primaryObject != undefined)
													res.write(JSON.stringify(primaryObject));
													res.end();
													
													return;
												}
												else if(othertempResult.second)
												{
													console.log("This guy is a secondary admin");
													if(primaryObject == undefined )
													{
														getDataForAdmin(res,undefined);
													}

													let tempLocation = getLocation(primaryObject,userAuthentification.IDBureau);
													let tempData =
													{
														selected_name: 0,
														container : [tempLocation],
														nowVisible: false,
														otherVisible : false
													};

													res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
													,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
													,"Access-Control-Max-Age":'86400'
													,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
													});
													res.write(JSON.stringify(tempData));
													res.end();		
													
												}
												else if(othertempResult.third)
												{
													if(commandArg == "all")
													{
														if(primaryObject == undefined)
														{
															getDataForAdmin(res,undefined);
														}
													
														console.log("This guy is a ternary admin");
														
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
														res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
														,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
														,"Access-Control-Max-Age":'86400'
														,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
														});
														res.write(JSON.stringify(tempData));
														res.end();
														return;
													}
													else if(commandArg == "update")
													{
														if(primaryObject == undefined)
														{
															getDataForAdmin(res,undefined);
															dummyResponse(res);
															return;
														}
														else
														{
															let command = getCommandGivenID(userAuthentification.ID);
															console.log("-------------------Passed Command----------------------")
															console.log(command);
															res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
															,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
															,"Access-Control-Max-Age":'86400'
															,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
															});
															res.write(JSON.stringify(command));
															res.end();
															return;
														}
													}
												}
												else
												{
													console.log("No answer");
													dummyResponse(res);
												}	
											},
											(error)=> 
											{
												console.log(error);
											});
										}
										else
										{
											dummyResponse(res);
											console.log("This guy is not an authenticated admin");
											return;
										}
									},(error)=>
									{
										console.log(error);
									} );
									
								}
								else
								{
									res.writeHead(500, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
												,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
												,"Access-Control-Max-Age":'86400'
												,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
												});
									res.end();
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

				console.log(startingTag);
				//'fr-FR',
				baseInit = true;
				getDataForAdmin(undefined,undefined);
				ofUpdate();
			}
			catch(ex)
			{
				console.log(ex);
			}
			
		}
		catch(ex)
		{
			console.log(ex);
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
			console.log(results.second);
			console.log(results.first);
			nomdelaTable = results.first[0][results.second[1].name];
		}
		else
		{
			dummyResponse(res);
			return;
		}
				
		query = "insert into \""+nomdelaTable+"\" values ('"
		+ ID+"','"+datereversed+"','"+startTime+"',"+((endTime == undefined)?null:"'"+endTime+"'")+")"
		+" ON DUPLICATE KEY UPDATE \""+nomdelaTable+"\".Sorties="+((endTime == undefined)?null:"'"+endTime+"'")+";\n";
		results  = await faire_un_simple_query(query);
				
		if(results.second == false)
		{
			dummyResponse(res);
			return;
		}

		console.log(empHoursObj);
		result = await getDataForAdmin(undefined,undefined,undefined,empHoursObj,undefined,undefined,undefined);
		if(results == false)
		{
			console.log("Dummy Response");
			dummyResponse(res,"ajout impossible");
			return;
		}
		console.log("Basic Response");

		res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
								,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
								,"Access-Control-Max-Age":'86400'
								,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
								});
						res.write(JSON.stringify("OK"));
						res.end();
 	}
	
	async function formidableFileUpload(req,path,res)
	{
		var form = new formidable.IncomingForm();
		console.log("Inside formidable");
    	
		await form.parse(req, async function (err, fields, files) 
		{
			
			let command = fields.command;
			console.log(fields);
			console.log(command);
			console.log(files);
			let filesDup = files;

			if(filesDup.imgfile instanceof Array)
				filesDup = filesDup.imgfile[0];
			console.log(filesDup);
			

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
			

			if(command === "update" || (command instanceof Array && command[0] === "update"))
			{
					let dealingWithArray = command instanceof Array;
					let commandArg = fields.cmdArg;
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
							querySQL =  "insert into "+tablename+" values ('"+fields.ID+ "','" + fields.officeName+"','";
							querySQL += fields.address +"','"+fields.region+"','"+fields.latittude+"','"+fields.longitude;
							querySQL += "');";
						}
						else
						{
							querySQL =  "insert into "+tablename+" values ('"+fields.ID[0]+ "','" +  fields.officeName[0]+"','";
							querySQL += fields.address[0] +"','"+fields.region[0]+"','"+fields.latittude[0]+"','"+fields.longitude[0];
							querySQL += "');";
						}
						console.log(fields);
					}
					else if(commandArg === "employees" || (dealingWithArray && commandArg[0] === "employees"))
					{
						if(dealingWithArray)
						{
							tablename = "individu";
							querySQL = "insert into "+tablename+" values ('"+fields.imagename[0]+"','"+fields.ID[0]+"','"+fields.first[0]+"','";
							querySQL += fields.second[0] +"','"+fields.gender[0]+"','"+fields.birthdate[0]+"','"+fields.function[0]+"','";
							querySQL += fields.start[0]+"','"+fields.end[0]+"');";
							tablename = "appartenance";
							doubleQuerySQL = "\ninsert into "+ tablename+" values ('"+fields.ID[0]+"',"+fields.officeID[0]+");";
							tablename = "login";
							thirdQuerySQL += "insert into "+tablename+" values ('"+fields.ID[0]+"','"+fields.password[0]+"',"+((fields.type[0] == 1)?1:0)+","+((fields.type[0] == 2)?1:0)+","+((fields.type[0] == 3)?1:0)+","+((fields.type[0] == 4)?1:0)+");";
						}
						else
						{
							tablename = "individu";
							querySQL = "insert into "+tablename+" values ('"+fields.imagename+"','"+fields.ID+"','"+fields.first+"','";
							querySQL += fields.second +"','"+fields.gender+"','"+fields.birthdate+"','";
							querySQL += fields["function"]+"','"+fields.start+"','"+fields.end+"');";
							tablename = "appartenance";
							doubleQuerySQL = "\ninsert into "+ tablename+" values ('"+fields.ID+"',"+fields.officeID+");";
							tablename = "login";
							thirdQuerySQL += "insert into "+tablename+" values ('"+fields.ID+"','"+fields.password+"',"+((fields.type == 1)?1:0)+","+((fields.type == 2)?1:0)+","+((fields.type == 3)?1:0)+","+((fields.type == 4)?1:0)+");";
						}
					}
	
					let tempuserAuthentification = {ID:urlObject.authID,Prenom:urlObject.authPrenom,Nom:urlObject.authNom,genre:urlObject.authgenre,naissance:urlObject.authnaissance,pass:urlObject.authpass};
					let tempResult = await forced_authentification_query(tempuserAuthentification,undefined);
					console.log(tempuserAuthentification);
					console.log(tempResult);
					console.log(querySQL);
					console.log("-----------------------Result of authentification----------------------");
					
					if(tempResult.second != false)
					{
						try
						{
							let aresult = await faire_un_simple_query(querySQL);
							if(aresult.second != false)
							{
								let userTimeObject = undefined;
								let userOfficeObject = undefined;
								let userAdditionObject = undefined;
								
								if (commandArg === "offices" || (dealingWithArray && commandArg[0] === "offices"))
								{
									userOfficeObject = urlObject;
									let okresult = await  getDataForAdmin(undefined,userOfficeObject,undefined,undefined,undefined,undefined,undefined);
									console.log("after offices getDataForAdmin");
									console.log("res writable ended is " +res.writableEnded);
									console.log(primaryObject.container);
									
									if(okresult)
									{
										if(res.writableEnded)
											return;
										res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
																,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
																,"Access-Control-Max-Age":'86400'
																,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
																});
										res.write(JSON.stringify({customtext:"OK"}));
										console.log("no problems");
										res.end();
									}
									else
									{
										dummyResponse(res,"Error");
										console.log("errors problems");
									}
								}

								if(commandArg === "employees" || (dealingWithArray && commandArg[0] === "employees"))
								{
									let bresult = await faire_un_simple_query(doubleQuerySQL);
									if(bresult.second != false)
									{
										let cresult = await faire_un_simple_query(thirdQuerySQL);
										if(cresult.second != false)
										{
											userAdditionObject = urlObject;
											await  getDataForAdmin(undefined,undefined,userAdditionObject,undefined,undefined,undefined,undefined);
											let fs = require('fs');
											await fs.rename(filesDup.filepath, path + filesDup.originalFilename,function(err_){});
											res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
																,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
																,"Access-Control-Max-Age":'86400'
																,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
																});
											res.write(JSON.stringify({customtext:"OK"}));
											console.log("no problems");
											res.end();
										}
										else
										{
											dummyResponse(res,"Erreur Interne.");	
											console.log(cresult.first);	
										}
									}
									else
									{
										dummyResponse(res,"IDExistant");
										console.log(bresult.first);
									}
								}
							}
							else
							{
								console.log(aresult.first);
								dummyResponse(res,"IDExistant");
							}
						}catch(ex)
						{
							console.log(ex);
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
		var postgresConnection = postgres("postgres://default:QHiOur92EwzF@ep-patient-darkness-72544749.us-east-1.postgres.vercel-storage.com:5432/verceldb"+ "?sslmode=require");
		if(postgresConnection == undefined)
		{		
			console.log("Database Connection not successful");	
			reject(postgresConnection);
		}
		else 
		{
			resolve(postgresConnection);
		}
	}

	async function faire_un_simple_query (querydemysql)
	{
			try
			{
				let connectionavecmysql = await exigencebasededonnée();					
				let results = await connectionavecmysql`${query}`;
				return new Promise ((resolve,reject) => {
					connectionavecmysql.close();
					if(results == undefined)
					{
						resolve({first:err,second:false});
					}
					else
					{
						resolve({first:result,second:fields});
					}
				});
			}
			catch(ex)
			{
				console.log("Exception caught");
				console.log(ex);
				return new Promise((resolve,reject)=>{resolve({first:ex,second:false});});
			}
	}
			
			async function forced_authentification_query_login(userAuthentification,res)
			{
					let query = "SELECT  * FROM individu inner join login on individu.ID = login.IDIndividu inner join "
					query += "appartenance on individu.ID = appartenance.IDIndividu inner join \"location du bureau\" as A on A.ID = ";
					query += "appartenance.IDBureau;"; 
					let tempResult = await faire_un_simple_query(query);
					
					if(!(tempResult.second == false))
					{	
						
						if(tempResult.first.length == 0)
						{
							if(res != undefined)
								dummyResponse(res);
							return {first:false,second:undefined};
						}
						else
						{
							for(let i = 0; i < tempResult.first.length; ++i)
							{
								
								if( tempResult.first[i].IDIndividu == userAuthentification.ID && tempResult.first[i].Password == userAuthentification.pass) 
								{
									console.log("This guy is logged in.");
									console.log(tempResult.first[i]);
									let addResult = addUser(tempResult.first[i].IDIndividu,tempResult.first[i]["Prénom"],tempResult.first[i].Nom,
											tempResult.first[i].Genre,tempResult.first[i]['Date de naissance'].toLocaleString(undefined,{day:'numeric',month:'numeric',year:'numeric'}),tempResult.first[i]["Début"],tempResult.first[i].Fin
											,tempResult.first[i].Password,tempResult.first[i].IDBureau,tempResult.first[i]['Nom du Bureau'],tempResult.first[i].Admin
											,tempResult.first[i].SuperAdmin,tempResult.first[i].User);
										console.log(connectedguys); 
									return {first:true,second:undefined,latitude:tempResult.first[i].Latitude,longitude:tempResult.first[i].Longitude,element:addResult.userAuthentification};
								}

							}
							console.log("This guy is not logged in");
							if(res != undefined)
								dummyResponse(res);
							return {first:false,second:undefined,third:false};
						}
					}
					else 
					{
						console.log("Error from query " +error);
						dummyResponse(res);
						return {first:false,second:undefined,third:true};
					}
				
			}
			
			async function forced_authentification_query(userAuthentification,res)
			{
					let query = "SELECT  * FROM individu inner join login on individu.ID = login.IDIndividu;"; 
					let tempResult = await faire_un_simple_query(query);
					
					if(!(tempResult.second == false))
					{	
						
						if(tempResult.first.length == 0)
						{
							if(res != undefined)
								dummyResponse(res);
							return false;
						}
						else
						{
							for(let i = 0; i < tempResult.first.length; ++i)
							{
								console.log("ID "+tempResult.first[i].ID +" Password"+tempResult.first[i].Password);
								console.log("ID"+userAuthentification.ID+" Password "+userAuthentification.pass);
								if( tempResult.first[i].ID == userAuthentification.ID && tempResult.first[i].Password == userAuthentification.pass) 
								{
									console.log("This guy is logged in.");
									return true;
								}
							}
							console.log("This guy is not logged in");
							if(res != undefined)
								dummyResponse(res);
							return false;
						}
					}
					else 
					{
						console.log("Error from query " +error);
						dummyResponse(res);
						return false;
					}
				
			}
			
			function findUser(ID,first,second,gender,birthdate,begin,end,pwd,locID,locName,admin,superadmin,user)
			{
				for(let loginGuysCount = 0; loginGuysCount < connectedguys.length;++loginGuysCount)
				{
					if(connectedguys[loginGuysCount].ID == ID && connectedguys[loginGuysCount].first == first 
						&& connectedguys[loginGuysCount].second == second && connectedguys[loginGuysCount].gender == gender
						&& connectedguys[loginGuysCount].birthdate == birthdate && connectedguys[loginGuysCount].begin == begin
						&& connectedguys[loginGuysCount].locationID == locID && connectedguys[loginGuysCount].locationName == locName
						&& connectedguys[loginGuysCount].end == end && connectedguys[loginGuysCount].pwd == pwd
						&& connectedguys[loginGuysCount].admin == admin && connectedguys[loginGuysCount].superadmin == superadmin
						&& connectedguys[loginGuysCount].user == user)
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
				birthdateparam,beginparam,endparam,pwdparam,IDLoc,NameLoc,
				adminparam,superadminparam,userparam)
			{
				
				let aconnecedGuy = 
				{ 
					ID: IDparam,first:firstparam,second:secondparam,gender:genderparam,
					birthdate:birthdateparam,begin:beginparam,end:endparam,pwd:pwdparam,
					locationID:IDLoc,locationName:NameLoc,admin:adminparam,superadmin:superadminparam,user:userparam,
					userAuthentification: {ID:IDparam,Prenom:firstparam,Nom:secondparam,genre:genderparam,naissance:birthdateparam,pass:pwdparam,
					locationID:IDLoc,locationName:NameLoc,superadmin:false,admin:false,user:false}
					,commands:[]
				};
				
				let findResult = !findUser(IDparam,firstparam,secondparam,genderparam,birthdateparam,beginparam,endparam,
					pwdparam,IDLoc,NameLoc,adminparam,superadminparam,userparam);
				
				if(!findResult.found)
				{
					connectedguys.push(aconnecedGuy); 
					return aconnecedGuy;
				}

				return findResult.element;

			}
			
			async function check_super_admin(userAuthentification,aconnection,res)
			{
				let query = "SELECT IDIndividu,SuperAdmin, Admin, \"User\",Password FROM login inner join ";
				query+= "individu ON individu.ID = login.IDIndividu;"; 
					
				let notAnError = await faire_un_simple_query(query);
				
				if(!(notAnError.second == false))
				{
					let authenticated = false;
						
					if(notAnError.first.length == 0)
					{
						console.log(notAnError);
						console.log({first:false,second:false,third:false});
						return {first:false,second:false,third:false};
					}
					else
					{
						console.log(notAnError);
						for(let u = 0; u < notAnError.first.length; u++)
						{	
							console.log(notAnError.first[u].SuperAdmin);
							console.log(notAnError.first[u].Admin);
							console.log(notAnError.first[u].User);
							console.log(userAuthentification.ID);
							console.log(userAuthentification.pass);
							
							if(notAnError.first[u].SuperAdmin == 1 && notAnError.first[u].IDIndividu == userAuthentification.ID
							&& notAnError.first[u].Password == userAuthentification.pass)
							{
								console.log({first:true,second:false,third:false});
								return {first:true,second:false,third:false};
							}
							
							if(notAnError.first[u].Admin == 1 && notAnError.first[u].IDIndividu == userAuthentification.ID
							&& notAnError.first[u].Password == userAuthentification.pass)
							{
								console.log({first:false,second:true,third:false});
								return {first:false,second:true,third:false};
							}
								
							if(notAnError.first[u].User == 1 && notAnError.first[u].IDIndividu == userAuthentification.ID
							&& notAnError.first[u].Password == userAuthentification.pass)
							{
								console.log({first:false,second:false,third:false});
								return {first:false,second:false,third:true};
							}
							
						}	
						
						return {first:false,second:false,third:false};
					}
						
				}
				else
				{
					console.log(notAnError);
					return {first:false,second:false,third:false};
				}
				
			}
			
			
			
			function dummyResponse(res)
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
			
			async function getDataForAdmin(response,locationArgObj)
			{
				getDataForAdmin(response,locationArgObj,undefined,undefined,undefined,undefined,undefined);
			}

			async function getDataForAdmin(response,locationArgObj,empObj)
			{
				getDataForAdmin(response,locationArgObj,empObj,undefined,undefined,undefined,undefined);
			}
			
			async function getDataForAdmin(response,locationArgObj,empObj,empHoursObj,paramyear,parammonth,paramday)
			{
				console.log(" paramyear "+paramyear+" other paramday "+paramday+" other parammonth "+parammonth);
				console.log("Location argument "+locationArgObj+" employee argument "+empObj);
				let query = "Select * from \"location du bureau\";";
				
				if(locationArgObj != undefined)
				{
					console.log(locationArgObj);
					query = "Select * from \"location du bureau\" where \"location du bureau\".ID = "+locationArgObj.ID+";";
				}
				else if(empObj != undefined)
				{
					query = "Select * from \"location du bureau\" where \"location du bureau\".ID = "+empObj.officeID+";";			
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
					dummyResponse(response);
					return false;
				}

				let location_index = 0;
				let data = undefined;
				let foundValueForLocation = undefined;

				if( locationArgObj != undefined )
				{
					data = primaryObject;
					console.log("----------------------");
					console.log(data);
					let foundValueForLocationTemp = getLocation(data,locationArgObj.ID);
					foundValueForLocation = foundValueForLocationTemp.first;
					if(foundValueForLocationTemp.second != undefined)
						location_index = foundValueForLocationTemp.second;
					console.log("----------------------");
					console.log(data.container);
					console.log(foundValueForLocation);
					console.log(locationArgObj);
					console.log("----------------------");
				}
				else if( primaryObject != undefined )
				{
					data = primaryObject;
				}
				else
				{
					data = 
					{
						selected_name: 0,
						container : [],
						nowVisible: false,
						otherVisible : false
					};
				}
				
				let dateNow = new Date(Date.now());
				console.log("Date today is "+dateNow.toLocaleString());
				
				let day = Number.parseInt(dateNow.toLocaleString().split("/")[0]);
				let amonth = Number.parseInt(dateNow.toLocaleString().split("/")[1])-1;
				let ayear = Number.parseInt(dateNow.toLocaleString().split("/")[2]);
				let dateToday = new Date(ayear,amonth,day);
				amonth += 1;
				console.log("new date today is "+ dateToday.toLocaleString());
				
				console.log("Date today is "+dateToday);
				
				for(let i = 0; i < result.first.length; ++i)
				{
					

					let officeID = result.first[i]["ID"];
					let officeName = result.first[i]["Nom du Bureau"];
					let officeAddresse = result.first[i]["Addresse"];
					let officeRegion = result.first[i]["Région"];
					let officeLatitude = result.first[i]["Latitude"];
					let officeLongitude = result.first[i]["Longitude"];
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
						console.log("data now contains new location");
					}
					else
					{
						unitLocation = foundValueForLocation;
					}
					

					let locationvalue = "";
					query = "Select * from \"manuel des tables d'entrées et de sorties\";";

					if( !(paramyear === undefined  )) 
					{
						query = "Select * from \"manuel des tables d'entrées et de sorties\" where \"Année\" = "+paramyear+";";
					}																																		
					else if (empHoursObj != undefined)
					{
						query = "Select * from \"manuel des tables d'entrées et de sorties\" where \"Année\" = "+empHoursObj.date.getFullYear()+";";
					}
					
					let result_ = await faire_un_simple_query(query);
					if(result_.second == false ) 
					{
						dummyResponse(response);
						return false;
					}

					let monthCounts = 0;
					if( (parammonth === undefined) === false)
					{
						monthCounts = parammonth;
					}

					if(empHoursObj != undefined)
					{
						monthCounts = empHoursObj.date.getMonth();
					}

					for (let l = 0; l < result_.first.length; ++l)
					{
						let year = result_.first[l]["Année"];
						let table = result_.first[l]["Nom"];
						let state = result_.first[l]["Etat de l'individu"];
						
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
								console.log("breaking");
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

						while( testCount < going_yearly_count )
						{
							let astart = false;
							let startDateOfMonth = new Date(year,monthCounts,1);
							currentDateOfYear = new Date(year,monthCounts,(paramday == undefined)?(empHoursObj != undefined? empHoursObj.date.getDate():1):paramday);
							
							if(paramyear != undefined && parammonth != undefined && paramday != undefined)
							{
								console.log("Current year "+ year+" current month "+monthCounts);
								console.log("Year passed ="+paramyear+" month passed "+parammonth+" day passed "+paramday);
							}		
							
							if(parammonth == undefined)
							{
								console.log("Current month "+ (monthCounts+1));
								console.log("Count of TestCount "+ testCount++);
								console.log("Début year loop for month "+(monthCounts+1)+" passing date "+currentDateOfYear+" starting date "+startDateOfMonth);
							}
							else
							{
								testCount++;
							}
							
							if(parammonth == undefined && currentDateOfYear > dateToday )
							{
								console.log(currentDateOfYear+" > to "+ dateToday);
								console.log("breaking");
								break;
							}
							else if(parammonth == undefined)
							{
								console.log("Both equal "+ (currentDateOfYear.getMonth() == startDateOfMonth.getMonth())+" Start month "+currentDateOfYear.getMonth()+" end month "+ startDateOfMonth.getMonth());
								console.log(currentDateOfYear+" not > to "+ dateToday);
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
								month: monthCounts+1,
								name: dateNow.toLocaleString('fr-FR',{month:"long"}),
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
							let monthSearchIndex = monthCounts+1;
							
							if(parammonth != undefined)
							{
								monthSearchIndex = parammonth+1;
							}	

							monthFoundAlpha = getMonth(yearContentModel,monthSearchIndex);
							monthFound = monthFoundAlpha.first;
							console.log("Month found is?"+monthFound);

							if( monthFound == undefined && parammonth != undefined )
							{
								console.log(yearContentModel.months);
								console.log("The value of paramonth is "+parammonth);
								console.log("The length of months is "+yearContentModel.months.length)
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

							let weekNo = 1;
							let weekDayIndex = 0;
							
							let value = currentDateOfYear.getMonth() === startDateOfMonth.getMonth();
							let nombre_de_jours = (new Date(currentDateOfYear.getFullYear(),currentDateOfYear.getMonth(),0)).getDate();
							
							if(paramday != undefined)
								nombre_de_jours = paramday;
							if( empHoursObj != undefined ) 
							{
								nombre_de_jours  = empHoursObj.date.getDate();
							}

							console.log(" What is the result of the comparison " + value);
							let dateTransformer = [6,0,1,2,3,4,5];
							let offset = dateTransformer[startDateOfMonth.getDay()]-1;
							console.log(" Day based on offset is "+currentDateOfYear.getDay()+" date is "+currentDateOfYear);
							//console.log("Waw! we are corrupted");
							
							while( start_day <= nombre_de_jours)
							{

								currentDateOfYear = new Date(year,monthCounts,start_day);
								console.log(currentDateOfYear);
								if(paramday != undefined || empHoursObj != undefined)
								{
									weekDayIndex = dateTransformer[currentDateOfYear.getDay()];
								}
								else
								{
									weekDayIndex = weekDayIndex % 7;
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
								console.log("Date passing is "+tempdate+" date today is "+dateToday);
								
								let nowDate = undefined;
								let nowDateStr = "";
								
								let currentday = start_day;
								let currentmonth = monthCounts+1;
								let currentYear = year;
								
								//console.log("Start day is "+ start_day);
								if( monthCounts + 1 == 7 || monthCounts == 0)
								{
									console.log("This day "+currentDateOfYear+" in week no "+ weekNo +" but the start day is "+start_day);
									console.log("Offset is "+offset+" weekNo current is calculated "+Math.floor((start_day+offset)/ 7));
								}
								
								if( astart == false || weekNo < (Math.floor((start_day + offset)/ 7) + 1))
								{
									if(paramday != undefined || empHoursObj != undefined)
									{
										weekDayIndex = dateTransformer[currentDateOfYear.getDay()];
									}
									else if(weekDayIndex != 0)
										weekDayIndex = 0;
									
									astart = true;
									weekNo = Math.floor((start_day + offset)/ 7) + 1;
									console.log("start of day "+start_day+" + offset "+offset+" Updated week no "+ weekNo);
									
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
									
									let weekFoundAlpha = getWeek(yearContentModel.months[monthCounts],weekNo);
									let weekFound = weekFoundAlpha.first;

									if(empObj != undefined)
									{
										console.log(weekNo);
										console.log(weekFound);		
									}

									if( weekFound == undefined )
									{	
										
										weekIndex = yearContentModel.months[monthIndex].weeks.length;
										yearContentModel.months[monthIndex].weeks.push(week);
										let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"months",index:monthIndex},{path:"weeks",index:weekIndex}], commandObj:{command:"push",value:week} };
										pushCommands(command);console.log("new weekIndex"+weekIndex);
									
									}
									else
									{
										weekIndex = weekFoundAlpha.second;
										console.log("old weekIndex "+weekIndex);
									}

								}
								
									
								console.log(currentmonth); console.log(currentday); console.log(currentYear);
								console.log(amonth); console.log(day); console.log(ayear);
								console.log(currentDateOfYear);
								
								if( currentmonth == amonth
									&& currentday == day && currentYear == year)
								{	
									nowDate = currentDateOfYear;
									nowDateStr = day+"-"+amonth+"-"+ayear;
									console.log("Current time is current time "+currentDateOfYear.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"}));
									unitLocation.now = currentDateOfYear.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"});
									unitLocation.nowVisible = true;
									unitLocation.yearIndex = l;
									unitLocation.monthIndex = monthCounts;
									unitLocation.dayIndex = weekDayIndex;
									unitLocation.weekIndex = weekNo-1;
								}
								
								let options = { year: "numeric", month: "long", day: "numeric"};
								let days = 
								{
									date: currentDateOfYear.toLocaleString('fr-FR',options),
									day: currentDateOfYear.getDate(),
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
								
								
								let query = "Select * from individu inner join appartenance";
								query += " ON appartenance.IDIndividu =  individu.ID";
								query += " inner join \"location du bureau\" ON  appartenance.IDBureau =";
								query += " \"location du bureau\".ID  where \"location du bureau\".ID = ";
								query += officeID+" AND DATE_FORMAT(individu.Début,\"%YYYY\") <= ";
								query += year+" AND DATE_FORMAT(individu.Fin,\"%YYYY\") >="+year+((empObj == undefined)?";":" AND individu.ID = '"+empObj.ID+"';");
								
								let resultTwo = await faire_un_simple_query(query);
								if(resultTwo.second == false ) 
								{
									dummyResponse(response);
									return false;
								}

								if(resultTwo.second !== false)
								{
									for( let m = 0; m < resultTwo.first.length; ++m)
									{
										let IDIndividu = resultTwo.first[m]["IDIndividu"];
										let debut = resultTwo.first[m]["Début"];
										let end = resultTwo.first[m]["Fin"];
										let profession = resultTwo.first[m]["Profession"];
										console.log("Inside m which is "+m);
										
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
												enddate: end.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"})
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
												employeeContentModel.strings.push(resultTwo.first[m].IDIndividu);
												employeeContentModel.strings.push(resultTwo.first[m]["Prénom"]);
												employeeContentModel.strings.push(resultTwo.first[m].Nom);
												employeeContentModel.strings.push(resultTwo.first[m].Genre);
												employeeContentModel.strings.push(resultTwo.first[m].Addresse);
											}

											employeeDescribed.strings.push(resultTwo.first[m].IDIndividu);
											employeeDescribed.strings.push(resultTwo.first[m]["Prénom"]);
											employeeDescribed.strings.push(resultTwo.first[m].Nom);
											employeeDescribed.strings.push(resultTwo.first[m].Genre);
											employeeDescribed.strings.push(resultTwo.first[m].Addresse);
											
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
												console.log("New Element added");
												let command = { paths:[{path:"container",index:location_index},{path:"yearsContent",index:yearIndex},{path:"employees",index:yearContentModel.employees.length}], commandObj:{command:"push",value:days} };
												pushCommands(command);
												yearContentModel.employees.push(employeeDescribed);
												yearContentModel.employeesCount++;
											}
											
										
										query = "Select IF(MIN(A.Entrées) > '10:00:00',1,0),IF(MIN(A.Entrées) > '8:30:00',1,0),MIN(A.Entrées) FROM";
										query += " \""+table+"\" as A";
										query +=" where A.IDIndividu ='"+IDIndividu+"' AND A.Date = '"+queryDate+"';\n";
																															
										let aresult = await faire_un_simple_query(query);
										if(aresult.second == false ) 
										{
											dummyResponse(response);
											return false;
										}

										query = "Select * FROM \""+state+"\"";
										query += " inner join appartenance ON \""+state+"\".IDIndividu ";
										query += "=appartenance.IDIndividu inner join individu";
										query += " ON \""+state+"\".IDIndividu = individu.ID";
										query += " where individu.ID = '"+IDIndividu+"' AND \""+state+"\".Date ='"+queryDate+"';\n";
										
										let bresult = await faire_un_simple_query(query);
										if(bresult.second == false ) 
										{
											dummyResponse(response);
											return false;
										}

										query = "Select * FROM";
										query += " \""+table+"\" as A";
										query += " where A.IDIndividu ='"+IDIndividu+"' AND A.Date = '"+queryDate+"';";
										
										let cresult = await faire_un_simple_query(query);
										if(cresult.second == false ) 
										{
											dummyResponse(response);
											return false;
										}

										let secondresult = {first:[],second:[]};
										console.log(aresult.first);
										
										secondresult.first.push(aresult.first);
										secondresult.first.push(bresult.first);
										secondresult.first.push(cresult.first);
										
										secondresult.second.push(aresult.second);
										secondresult.second.push(bresult.second);
										secondresult.second.push(cresult.second);
										
								
										if(secondresult.second !== false)
										{	
											if(secondresult.first[0].length > 0)
											{
												let criticallylate = false; 
												let retard = false;
												
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
															console.log("Trying to complete Hour couple");
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
																console.log("Empty Second");
																console.log(employeeContentModel.entries);
																console.log(employeeContentModel.exits);
															}
															else
															{
																console.log("Full Second");	
																employeeContentModel.entries.push(a);
																employeeContentModel.exits.push(b);
																console.log(employeeContentModel.entries);
																console.log(employeeContentModel.exits);
															}

														}
														else
														{					 
															console.log("Trying to update Hour couple");
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
																console.log("Empty Second");
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
																console.log("Full Second");
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
																
																employeeContentModel.entriesexitsCouples.push({entry:a,exit:b});
															}														
														}
												}
												
												let dateNowOther = new Date(Date.now());
												if(!employeeContentModel.presence && !retard && !criticallylate && ( (dateNowOther.getUTCHours() == 8 && dateNowOther.getUTCMinutes() > 30)
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
											}
											
											if( secondresult.first[0].length == 0 && secondresult.first[1].length == 0 && dateNowOther.getUTCDate() > date)
											{
												employeeContentModel.absence = true;
												employeeContentModel.retard = false;
												employeeContentModel.date = currentDateOfYear.toLocaleString('fr-FR',{day:"numeric",month:"long",year:"numeric"});
												calculateAbsence(unitLocation,year,1,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex);
											}
											
											
											if(secondresult.first[1].length > 0)
											{
												console.log("Getting to know secondresult ");
												console.log(secondresult.first[1]);
												console.log(secondresult.first[0]);
												console.log(secondresult.first[2]);
												
												let dateStr = secondresult.first[0][0][secondresult.second[0][2].name];
												let newDateStr;
												let month = 1;
												let day = 1;
												let both = true;
												let criticallylate = false; 
												let retard = false;	
												
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
											console.log("Quitting");
											if (!(response === undefined))
											dummyResponse(response);
											return false;
										}
									}
								}
								else
								{
									baseInit = false;
									console.log("Quitting");
									if (!(response === undefined))
									dummyResponse(response);
									return false;
								}
									
								start_day++;
								weekDayIndex = weekDayIndex+1;
								++k;
								astart = true;
								if(empHoursObj != undefined)
									break;	
							}	
							monthCounts++;
							if(empHoursObj != undefined)
								break;	
						}
					}
					console.log("end of the loop month count "+ monthCounts);
					monthCounts = 0;
				}
				
				if(primaryObject === undefined)
					primaryObject = data;

				console.log("Location argument "+locationArgObj+" employee argument "+empObj);
				console.log(primaryObject);
				
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
					return true;
				}

				return true;
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
				console.log(index++);
				for(let i = 0; i < element.length;++i)
				{
					console.log("Reaching element ID "+element[i].ID);
					if(element[i].ID == ID)
					{
						console.log("Element with ID "+ID );
						if(element_found == undefined)
							element_found = element[i];
					}
				}
			});
		}

		console.log((element_found) == undefined ? "Element with ID "+ID+" not found ":"Element with ID "+ID+" found");
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
		console.log("Inside basic response");
		console.log("res writable ended is " +res.writableEnded);
		if(res.writableEnded)
			return;
		console.log("Inside basic response");
			res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
									,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
									,"Access-Control-Max-Age":'86400'
									,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
									});
			console.log(JSON.stringify({customtext:"OK"}));
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
			nodupTemp.congès+= offset;
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
		}

		if(offset > -1)
		{
			if(!found)
			{
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].congèsdates.push(employeeContentModel);
			}
		}
		else
		{
			if(found)
			{
				let tempValue = nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].congèsdates;
				if(tempValue.indexOf(employeeContentModel) > -1)
					tempValue.splice(tempValue.indexOf(employeeContentModel),1);
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
		}

		if(offset > 0)
		{
			if(!found)
			{
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].presencedates.push(employeeContentModel);
			}
		}
		else
		{
			if(found)
			{
				let tempValue = nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].presencedates;
				if(tempValue.indexOf(employeeContentModel) > -1)
					tempValue.splice(tempValue.indexOf(employeeContentModel),1);
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
		}

		if(offset>0)
		{
			if(!found)
			nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].sicknessesdates.push(employeeContentModel);
		}
		else
		{
			if(found)
			{
				let tempValue = nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].sicknessesdates;
				if(tempValue.indexOf(employeeContentModel) > -1)
					tempValue.splice(tempValue.indexOf(employeeContentModel),1);
			}
		}
														
	}

	function calculateAbsence(unitLocation,year,offset,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex)
	{
		let nodupTempAlpha = getYear(unitLocation,year);
		let nodupTemp = nodupTempAlpha.first;
		let found = false;
		nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].absencesdates.forEach((element)=>{if(dummyIDComparison(element,employeeContentModel)){found = true;}});
		console.log("Inside absences...");

		if(monthIndex == 7 && weekDayIndex == 3)
		{
			console.log(nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].absencesdates);	
			console.log(employeeContentModel);
			console.log("Found is "+found);
		}

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
		}

		if(offset > 0)
		{	
			if(!found)
			nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].absencesdates.push(employeeContentModel);
		}
		else
		{
			if(found)
			{
				let tempValue = nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].absencesdates;
				
				if(tempValue.indexOf(employeeContentModel) > -1)
				{
					tempValue.splice(tempValue.indexOf(employeeContentModel),1);
					console.log("Element has been deleted");
				}
				else
				{
					console.log("Element to be deleted has not been found");
				}
			}
		}

	}

	function calculateRetards(unitLocation,year,offset,employeeContentModel,location_index,yearIndex,monthIndex,weekIndex,weekDayIndex)
	{
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
		}
		
		if(offset>0)
		{
			if(!found)
			{
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].retardsdates.push(employeeContentModel);
			}
		}
		else
		{
			if(found)
			{
				let tempValue = nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].retardsdates;
				if(tempValue.indexOf(employeeContentModel) > -1)
					tempValue.splice(tempValue.indexOf(employeeContentModel),1);
			}
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
		}

		if(offset > 0)
		{	
			if(!found)
			{
				nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].retardsdates.push(employeeContentModel);
			}
		}
		else
		{
			if(found)
			{
				let tempValue = nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].retardsdates;
				if(tempValue.indexOf(employeeContentModel) > -1)
					tempValue.splice(tempValue.indexOf(employeeContentModel),1);
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
		}

		if(offset > 0)
		{
			if(!found)
			nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].missionsdates.push(employeeContentModel);
		}
		else
		{
			if(found)
			{
				let tempValue = nodupTemp.months[monthIndex].weeks[weekIndex].days[weekDayIndex].missionsdates;
				if(tempValue.indexOf(employeeContentModel) > -1)
					tempValue.splice(tempValue.indexOf(employeeContentModel),1);
			}
		}

	}
	
	function dummyIDComparison(aElement,bElement)
	{
		console.log("IDOne"+aElement.ID +" = IDTwo "+bElement.ID+" is "+ aElement.ID == bElement.ID );
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