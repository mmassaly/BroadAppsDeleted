var postgres = require('pg');
var http = require("http");
var url = require("url");
var vercelBlob = require("@vercel/blob");
var formidable = require('formidable');
var fs = require('fs');	
var base = {individuals:{}, bytable:{},byId:{}};
var connectedguys =
[	
];
var individuals_interest = []; 

let callIndex = 0;
var max = 0;
add_all_users();
let blob_stuff = "vercel_blob_rw_AhayNnM8BUTRk7li_Pirrs7p4aeFH5cnD9hONM9peBfDhxd";
let data_type_converter = {'character varying':'text',date:'Date',text:'text',time:'Time',integer:'Integer',boolean:'Boolean',decimal:'Decimal','decimal(3,2)':'Decimal(3,2)','decimal(3,2)':'Decimal(4,2)','decimal(5,2)':'Decimal(5,2)','decimal(6,2)':'Decimal(6,2)'
		,'decimal(7,2)':'Decimal(7,2)','decimal(8,2)':'Decimal(8,2)','decimal(9,2)':'Decimal(9,2)','decimal(9,2)':'Decimal(9,2)','decimal(10,2)':'Decimal(10,2)','decimal(11,2)':'Decimal(11,2)'
		,'decimal(12,2)':'Decimal(12,2)','decimal(13,2)':'Decimal(13,2)','decimal(14,2)':'Decimal(14,2)','decimal(15,2)':'Decimal(15,2)','decimal(16,2)':'Decimal(16,2)'
		,'decimal(17,2)':'Decimal(17,2)','decimal(18,2)':'Decimal(18,2)','decimal(19,2)':'Decimal(19,2)','decimal(20,2)':'Decimal(20,2)','decimal(21,2)':'Decimal(21,2)'};
//msa-beesas		
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
	else if( req.method == "GET")
	{
		res.end();
	}
	else if( req.method == "POST" )
	{
		callIndex++;
		var reqData = "";
		if(req.url == "/form")
		{
			//console.log("incomming request but primary object is "+primaryObject);
			formidableFileUpload(req,"../Project Timing/my-app/src/assets/images/",res);
		}
		else
		{
			req.on("data",function(data)
						{
							reqData += data;
						}).on("end",()=>
						{
							//console.log("incomming request but primary object is "+primaryObject);
							 
							//console.log(reqData);
							let urlObject = undefined;
							try
							{
								urlObject = JSON.parse(reqData);	
							}
							catch(ex)
							{
								//console.log(ex);
								dummyResponseSimple(res);
								return;
							}

							//console.log(reqData);
							//console.log(urlObject);
							//console.log("Able to continue to step 1");
							
							if(urlObject == undefined)
							{
								//console.log("Undefined urlObject");
								dummyResponseSimple(res);
								return;
							}

							//console.log("Able to continue to step 2");
							
							let command = urlObject.command;
							//console.log("Command is update "+ command == "update");
							
							
							if(command === "login")
							{	
								let resultb = res;
								
								forced_authentification_query_login(urlObject.userAuthentification,resultb).then((ares)=>
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
												if(ares.first == true || ares.second == true )
												{
													console.log("Inside setting");
													if (othertempResult.first)
													{
														ares.element.superadmin = true;
														ares.element.user = false; 
													}
													else if(othertempResult.second)
													{
														ares.element.superadmin = false;
														ares.element.user = true;
													}
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
												else if(ares.second)
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
													dummyResponse(resultb,{text:"NOT LOGGED IN"});
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
								if(commandArg == undefined)
								{
									//console.log("undefined commandArg");
									dummyResponseSimple(result);
									return;
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
									|| userAuthentification.pass == undefined)
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
									let resultc = res;
									
									forced_authentification_query(userAuthentification,undefined).then((tempResult)=>
									{
											if(tempResult)
											{
												console.log("This guy is authenticated");
												let resultd = resultc;
												check_super_admin(userAuthentification,undefined,undefined).then((othertempResult)=>
												{
													console.log("Inside checking admin type");
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
														resultd.write(JSON.stringify({individuals:Object.entries(base.individuals),tables:base.bytable}));
														resultd.end();
													}
													else if(othertempResult.second)
													{
														console.log("This guy is a secondary kind of  admin");
														
														resultd.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
														,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
														,"Access-Control-Max-Age":'86400'
														,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
														});
																
														resultd.write(JSON.stringify({individuals:[base.individuals[userAuthentification.ID]],tables:base.byId[userAuthentification.ID]}));
														resultd.end();
														
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
												dummyResponseSimple(resultc);
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

server.listen(process.env.PORT || 3035);
console.log("Listening at port 3035.............");


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
			console.log(filesDup);
			
			
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
			
			let image_url = undefined;
			let blob = false;
			
			if(filesDup.imgfile instanceof Array)
				filesDup = filesDup.imgfile[0];
			
			
			console.log(command);
			
			if(command === "update" || (command instanceof Array && command[0] === "update"))
			{
				let commandArg = (fields.cmdArg instanceof Array )?fields.cmdArg[0]:fields.cmdArg;
				console.log(commandArg);
				
				let valuesStr = "";
				let values2Str = "";
				let valuesDouble = "";
				let pkvalues = "";
				let count = 0;
				let count2 = 0;
				let table = "";
				let table2 = "";
				let elements_dic = [];
				let elements_dic_other = {};
				
				console.log(fields);
				if(commandArg == "addbase")
				{
					if( filesDup != undefined && filesDup.imgfile != undefined || ( filesDup.originalFilename != undefined) )
					{
						console.log("inside file reading");
						//console.log(fs.readFileSync(filesDup.filepath));
						try
						{			
							//not decodeURI for the originalFilename risk taken even if percentages are introduced however urls must be processed
							const blob = await vercelBlob.put("assets/images/doudousbases/base-icon/"+decodeURI(filesDup.originalFilename),fs.readFileSync(filesDup.filepath),{
								access: 'public',
								contentType: filesDup.mimetype, 
								token: blob_stuff
							});
											
							image_url = decodeURI(blob.url);
						}
						catch(ex)
						{
							console.log(ex);
							image_url = null;
						}
					}
					
					let tableId = undefined;
					let prev = ""; let baseTable ="";
					Object.keys(fields).forEach(key=>
					{
						if(key != commandArg && key != command && key != "table" && key != "userAuthentification"  && key !="command" && key != "newBaseName" && key != "cmdArg"
						 && key != "authID"  && key != "authPrenom"  && key != "authNom"  && key !="authGenre"  && key !="authpass" && key != "imgfile" && key != "imagename" && key != "imgname")
						{
							
							let valueEq = "";
							if(fields[key] instanceof Array)
							{
								valueEq = fields[key][0];
							}
							else
								valueEq = fields[key];
							
							if(count > 0 && (count+1) % 2 == 0)
							{
								let obj ={};
								obj["validate"] = true;								
								obj["type"] = valueEq;
								obj["name"] = prev;
								elements_dic.push(obj);
								valuesStr += " "+valueEq;
							}
							else
							{
								valuesStr += ((count>0)?",":"")+"\""+valueEq+"\"";
								prev = valueEq;
								if(count > 0)
									pkvalues += ",";
								pkvalues += "\""+valueEq+"\"";
								
							}
							++count;
							
						} 
						else
						{
							
							let valueEq = "";
							if(fields[key] instanceof Array)
							{
								valueEq = fields[key][0];
							}
							else
								valueEq = fields[key];
								
							if( key == "table" )
								table = valueEq;
							if( key == "newBaseName" )
							{
								baseTable = valueEq;
							}
						}
					});
						
						let obj ={};
						obj["validate"] = true;								
						obj["type"] = "Integer";
						obj["name"] = "id";
						elements_dic.push(obj);
						
						let queryStr = "create table \""+baseTable+"\" ("+valuesStr+",id integer,idindividu integer, Primary KEY("+pkvalues+",id,idindividu))\n;";
						queryStr += "insert into \""+table+"\" values (DEFAULT,$$"+baseTable+"$$,$$"+image_url+"$$);";
						console.log(queryStr);
						let tempuserAuthentification = {ID:urlObject.authID[0],Prenom:urlObject.authPrenom[0],Nom:urlObject.authNom[0],genre:urlObject.authGenre[0],pass:urlObject.authpass[0]};
						let tempResult = await forced_authentification_query(tempuserAuthentification,undefined);
						//let tempResult = false;
					
						if(tempResult != false)
						{
							let result = await faire_un_simple_query(queryStr);
							if(result.second != false || (result.second instanceof Array))
							{
								base.bytable[max++] = {name:baseTable,headers:Array.prototype.concat(elements_dic,individuals_interest),rows:[],image_url:image_url};
								goodResponse(res, {text:"Base ajoutée",customtext:"OK"});
							}
							else
							{
								dummyResponse(res,{text:result.first,customtext:"Error"});
							}
						}
						else
						{
							dummyResponse(res,{text:"Ajout impossible",customtext:"Error"});
						}
				}
				else if(commandArg == "addrows" || commandArg == "modifyrows")
				{
					let tableId = undefined;
					Object.keys(fields).forEach(key=>
					{
						if(key != commandArg && key != command && key != "table" && key != "userAuthentification" && key != "table"  && key !="command"  && key != "cmdArg"
						 && key != "authID"  && key != "authPrenom"  && key != "authNom"  && key !="authGenre"  && key !="authpass")
						{
							
							let valueEq = "";
							if(fields[key] instanceof Array)
							{
								valueEq = fields[key][0];
							}
							else
								valueEq = fields[key];
							
							let obj ={};
							obj["value"] = valueEq;
							
							obj["img"] = false;
							elements_dic.push(obj);
							
							if(count > 0)
							{
								valuesStr += ",$$"+valueEq+"$$";
							}
							else
							{
								valuesStr += "$$"+valueEq+"$$";
							}
							++count;
							
							if( key == "id")
							{
								tableId = valueEq;
							}
							
						}
						else
						{
							let valueEq = "";
								if(fields[key] instanceof Array)
								{
									valueEq = fields[key][0];
								}
								else
									valueEq = fields[key];
								
							if(key == "table")
								table = valueEq;
						}
						console.log(key);
						
					});

					let query = "insert into \"" + table + "\" values (" + valuesStr+" );\n";
					console.log(query);
					console.log(commandArg);
					console.log(tableId);
					console.log(fields);
					
					if(commandArg == "addrows")
					{
						let tempuserAuthentification = {ID:urlObject.authID[0],Prenom:urlObject.authPrenom[0],Nom:urlObject.authNom[0],genre:urlObject.authGenre[0],pass:urlObject.authpass[0]};
						let tempResult = await forced_authentification_query(tempuserAuthentification,undefined);
						
						if(tempResult != false && tableId != undefined)
						{
							let result = await add(table,valuesStr);
							console.log(typeof result.first == 'object');
							if(!(result.second instanceof Array))
							{
								console.log(result.first);
								if(result.first.code  == '23505')
								{
									goodResponse(res, {text:"Ajout passé",customtext:"OK"});
								}
								else
								{
									dummyResponse(res,{text:"Ajout impossible",customtext:"error"});
								}	
							} 
							else
							if(result.second != false || (result.second instanceof Array))
							{
									console.log("--------------------base-------------------------");
									console.log(base);
									console.log("--------------------base-------------------------");
									
									
									if(base.byId[tempuserAuthentification.ID] == undefined)
									{
										base.byId[tempuserAuthentification.ID] = {};
									}
									
									if(base.byId[tempuserAuthentification.ID][tableId] == undefined)
									{
										base.byId[tempuserAuthentification.ID][tableId] = {name:base.bytable[tableId].name,headers:base.bytable[tableId].headers,rows:JSON.parse(JSON.stringify(base.bytable[tableId].rows))};
									}
									
									
									let rows = [];
									elements_dic.forEach((k)=>{
										rows.push(k);
									});
									
									let a = undefined;
									let b = undefined;
									
									console.log(tempuserAuthentification.ID);
									console.log(base.individuals);
									
									b = {value:base.individuals[tempuserAuthentification.ID].first,img:false};//.prenom
									rows.push(b);
									
									b = {value:base.individuals[tempuserAuthentification.ID].second,img:false};//.nom
									rows.push(b);
									
									b = {value:base.individuals[tempuserAuthentification.ID].gender,img:false};//.genre
									rows.push(b);
									
									a = {value:base.individuals[tempuserAuthentification.ID]["image"], img: true};//["image"]
									rows.push(a);
									
									base.bytable[tableId].rows.push(rows);
									
									console.log(base.bytable[tableId].rows.length+"--------------------------");
									base.byId[tempuserAuthentification.ID][tableId].rows.push(rows);
									
									console.log(base.bytable[tableId].rows.length+"--------------------------");
										
									goodResponse(res, {text:"Ajout passé",customtext:"OK"});
									
							}
							else
							{
								dummyResponse(res,{text:"Ajout impossible",customtext:"Error"});
							}
						}
						else
						{
							dummyResponse(res,{text:"Vous n'avez pas l'accés",customtext:"Error"});
						}
					}
				}
				else if(commandArg == "linkindividualtobase")
				{
					
					Object.keys(fields).forEach(key=>
					{
						if(key != commandArg && (key == "ID" || key == "baseID") && key != "userAuthentification" && key != "table2"  && key !="command"  && key != "cmdArg"
						 && key != "authID"  && key != "authPrenom"  && key != "authNom"  && key !="authGenre"  && key !="authpass" && key != "imgfile" && key != "imagename")
						{
							let valueEq = "";
							if(fields[key] instanceof Array)
							{
								valueEq = fields[key][0];
							}
							else
								valueEq = fields[key];
							
							elements_dic_other[key] = valueEq;	
							
							if(count == 0)
							{
								valuesStr = ",$$"+valueEq+"$$";
							}
							else
							{
								valuesStr = "$$"+valueEq +"$$"+ valuesStr;
							}
							++count;
						}
						else
						{
							let valueEq = "";
							if(fields[key] instanceof Array)
							{
								valueEq = fields[key][0];
							}
							else
								valueEq = fields[key];
								
							if(key == "table2")
								table = valueEq;
								
							elements_dic_other[key] = valueEq;
						}
					});
					
					valuesStr = "insert into \"" + table + "\" values (" + valuesStr+" );\n";
					console.log(valuesStr);
					let tempuserAuthentification = {ID:urlObject.authID[0],Prenom:urlObject.authPrenom[0],Nom:urlObject.authNom[0],genre:urlObject.authGenre[0],pass:urlObject.authpass[0]};
					let tempResult = await forced_authentification_query(tempuserAuthentification,undefined);
					//let tempResult = false;
					
					if(tempResult != false)
					{
						let result = await add(table,valuesStr);
						if(result.second != false || (result.second instanceof Array))
						{
										
							if( data.byId[elements_dic_other["ID"]] == undefined) 
							{
								base.byId[elements_dic_other["ID"]] = {};
							}
										
							if( base.byId[elements_dic_other["ID"]][elements_dic_other["baseID"]] == undefined)
							{
								if(base.bytable[elements_dic_other["baseID"]] != undefined)
								{
									base.byId[elements_dic_other["ID"]][elements_dic_other["baseID"]] = {name: base.bytable[elements_dic_other["baseID"]].name,headers: base.bytable[elements_dic_other["baseID"]].headers,rows:[]}  ;
								}
							}
							
							goodResponse(res, {text:"Liaison passée",customtext:"OK"});
						}
						else
							dummyResponse(res,{text:"Ajout impossible",customtext:"Error"});
					}
					else
					{
						dummyResponse(res,{text:"Ajout impossible",customtext:"Error"});
					}
				}
				else if(commandArg == "addindividual")
				{
					let valueOne = "";
					let valueTwo = "";
					
					if( filesDup != undefined && filesDup.imgfile != undefined || ( filesDup.originalFilename != undefined) )
					{
						console.log("inside file reading");
						//console.log(fs.readFileSync(filesDup.filepath));
						try
						{			
							//not decodeURI for the originalFilename risk taken even if percentages are introduced however urls must be processed
							const blob = await vercelBlob.put("assets/images/doudousindividuals/profile-pictures/"+decodeURI(filesDup.originalFilename),fs.readFileSync(filesDup.filepath),{
								access: 'public',
								contentType: filesDup.mimetype, 
								token: blob_stuff
							});
											
							image_url = decodeURI(blob.url);
						}
						catch(ex)
						{
							console.log(ex);
							image_url = undefined;
						}
					}
					
					Object.keys(fields).forEach(key=>
					{
							if(key != "table"  && key != "table2" && key != "userAuthentification" && key != "table2"  && key !="command"  && key != "cmdArg"
							 && key != "authID"  && key != "authPrenom"  && key != "authNom"  && key !="authGenre"  && key !="authpass" && key != "baseID" && key != "imgfile" && key != "imagename" && key != "imgname")
							{
								let valueEq = "";
								if(fields[key] instanceof Array)
								{
									valueEq = fields[key][0];
								}
								else
									valueEq = fields[key];
								
								elements_dic_other[key] = valueEq;
								
								if(count > 0)
								{
									valuesStr += ",$$"+valueEq+"$$";
								}
								else
								{
									valuesStr += "$$"+valueEq+"$$";
								}
								++count;
								
								if(key == "ID" )
								{
									values2Str = "$$"+valueEq +"$$"+ values2Str;
									valueOne = valueEq;
								}
							}
							else
							{
								let valueEq = "";
								if(fields[key] instanceof Array)
								{
									valueEq = fields[key][0];
								}
								else
									valueEq = fields[key];
									
								if(key == "table")
									table = valueEq;
								if(key == "table2")
									table2 = valueEq;
								
								if(key  == "baseID")
								{
									valueTwo = valueEq;
									values2Str += ",$$"+valueEq+"$$";
								}
								elements_dic_other[key] = valueEq;
									
							}
						});
						
						
						if( image_url == undefined )
						{
							image_url =  'https://70gxoz4jnkgivatx.public.blob.vercel-storage.com/assets/images/doudousindividuals/profile-pictures/humain-7SV4HWrHl7K7GzOEwhE6QeR0hTzBGa.png';	
							
						}
						
						if(count > 0)
						{
							valuesStr += ",$$"+image_url+"$$";
						}
						else
						{
							valuesStr += "$$"+image_url+"$$";
						}
						
						console.log(valuesStr);
						console.log(values2Str);
						
						
						valuesStr = "insert into \"" + table + "\" values (" + valuesStr+");\n";
						valuesStr += "insert into \"" + table2 + "\" values (" + values2Str+");\n";
						
						if(commandArg == "addindividual")
						{
							let tempuserAuthentification = {ID:urlObject.authID[0],Prenom:urlObject.authPrenom[0],Nom:urlObject.authNom[0],genre:urlObject.authGenre[0],pass:urlObject.authpass[0]};
							let tempResult = await forced_authentification_query(tempuserAuthentification,undefined);
							//tempResult = false;
						
							if(tempResult != false)
							{
								let result = await faire_un_simple_query(valuesStr);
								console.log(result);
								if(result.second != false || (result.second instanceof Array) || (result instanceof Array))
								{
									
										if(elements_dic_other["ID"] != undefined)
										{
											console.log(elements_dic_other);
											base.individuals[elements_dic_other["ID"] ] = 
											{ID:elements_dic_other["ID"],"first":elements_dic_other["first"],"second":elements_dic_other["second"],
											"gender":elements_dic_other["gender"],"pwd":elements_dic_other["password"],
											"superadmin":elements_dic_other["type1"],"user":elements_dic_other["type2"]};
											
											if( base.byId[elements_dic_other["ID"]] == undefined) 
											{
												base.byId[elements_dic_other["ID"]] = {};
											}
											
											if( base.byId[elements_dic_other["ID"]][elements_dic_other["baseID"]] == undefined)
											{
												if(base.bytable[elements_dic_other["baseID"]] != undefined)
												{
													base.byId[elements_dic_other["ID"]][elements_dic_other["baseID"]] = {name: base.bytable[elements_dic_other["baseID"]].name,headers: base.bytable[elements_dic_other["baseID"]].headers,rows:[]}  ;
												}
												console.log("Added to byId");
												console.log(base.byId[elements_dic_other["ID"]]);
											}
											
										}
										goodResponse(res, {text:"Ajout passé",customtext:"OK"});
								}
								else
								{
									dummyResponse(res,{text:"Ajout impossible ",customtext:"Error"});
								}
							}
							else
							{
								dummyResponse(res,{text:"Vous n'avez pas l'accés",customtext:"Error"});
							}
						}
					}
					else if(commandArg  == "del")
					{
						dummyResponse(res,{text:"Not yet implemented",customtext:"Error"});
					}
					else
					{
						dummyResponse(res,{text:"Vous n'avez pas l'accés",customtext:"Error"});
					}
				}
			
		});
}

async function add(table,values) 
{
	let insertValues = "insert into \"" +table+"\" values("+ values +");";
	console.log(insertValues);
	return faire_un_simple_query(insertValues);
}

async function forced_authentification_query_login(userAuthentification,res)
{
		
		let returnValue = findUserShort(userAuthentification.ID,userAuthentification.pass);
		
		if( returnValue.found )
		{
			return {first:true,second:undefined,element:returnValue.element.userAuthentification};
		}
		
		let query = "SELECT  * FROM \"DouDous'individuals\";";
					
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
										tempResult.first[i].genre,tempResult.first[i].password,tempResult.first[i].superadmin,tempResult.first[i].User);
									
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
					
		let query = "SELECT  * FROM \"DouDous'individuals\";";
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
		let query = "SELECT  * FROM \"DouDous'individuals\";\n";
		query += "SELECT  * FROM \"DouDous'bases\";\n";
		query += "SELECT  * FROM \"DouDous'bases\" inner join \"DouDous correspondance\" on \"DouDous'bases\".id = \"DouDous correspondance\".idproject inner join \"DouDous'individuals\" on \"DouDous'individuals\".idindividu = \"DouDous correspondance\".idindividu;";
		query += "SELECT Max(ID)+1 AS NEWID FROM \"DouDous'bases\"";
		
		let tempResult = await faire_un_simple_query(query);
		max = tempResult[3].first[0][tempResult[3].second[0].name];
		
		let lastTempResult = tempResult;
		for(let i = 0; i < tempResult[0].first.length; ++i)
		{
			console.log(tempResult[0].first[i]);
			let addResult = addUser(tempResult[0].first[i].idindividu,tempResult[0].first[i]["prenom"],tempResult[0].first[i].nom,
				tempResult[0].first[i].genre,tempResult[0].first[i].password
				,tempResult[0].first[i].superadmin,tempResult[0].first[i].User);
			base.individuals[tempResult[0].first[i].idindividu] = addResult;
			base.individuals[tempResult[0].first[i].idindividu].image = tempResult[0].first[i].image;
		}
		
		var holder = {};
		let query_two =  "";
		query = "";
		
		query += "SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT,TABLE_NAME FROM INFORMATION_SCHEMA.COLUMNS";
		query += " where TABLE_NAME = $$DouDous'individuals$$ AND ( Column_name ='prenom'  OR Column_name ='nom' OR Column_name ='genre'"
		query += " OR Column_name ='image' OR Column_name ='idindividu');"			
		
		for(let i = 0; i < tempResult[1].first.length; ++i)
		{
			query += "SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT,TABLE_NAME FROM INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = $$"+tempResult[1].first[i]['name']+"$$;\n";
			base.bytable[tempResult[1].first[i]["id"]] = {name: tempResult[1].first[i]["name"],headers:[],rows:[]}; 
			holder[tempResult[1].first[i]["name"]] = base.bytable[tempResult[1].first[i]["id"]] ;
			let arrayFiltered = lastTempResult[1].first.filter((elem)=> elem.id == tempResult[1].first[i]["id"]);
			if(arrayFiltered.length > 0)
			{
				base.bytable[tempResult[1].first[i]["id"]]["image_url"] = arrayFiltered[0]["image_url"];
			}
			query_two += "SELECT * FROM \""+tempResult[1].first[i]['name']+"\" inner join  (Select IDIndividu,Prenom,Nom,Genre,Image from \"DouDous'individuals\") as A  on A.IDIndividu = \""+tempResult[1].first[i]['name']+"\".IDIndividu;\n";
		}
		
		console.log(query);
		tempResult = await faire_un_simple_query(query);
		console.log(tempResult.length);
		
		tempResult[0].first.forEach((el)=>
		{
				let value = {};
				value['validate'] = false;
				value.type = data_type_converter[el. data_type];
				value.name =  el. column_name;
				individuals_interest.push(value);
		});	
		
		console.log(tempResult[0].second.splice(0,1));		
		console.log(tempResult[0].first.splice(0,1));
		
		for(let count = 1; count < tempResult.length; ++count)
		{ 
			let table_name_temp = tempResult[count].first[0]["table_name"];
			console.log("----------------------------------------------------------");
			console.log(table_name_temp);
			
			tempResult[0].first.forEach((el)=>
			{
				el["table_name"] = table_name_temp;
				el["validate"] = false;
				console.log(el);
				tempResult[count].first.push(el);
			});
					
			tempResult[0].second.forEach((el)=>
			{
				tempResult[count].second.push(el);
			});
			
			let something_storage = tempResult[count];
			if( !(something_storage instanceof Array) )
			{
				something_storage = [something_storage];
			}
			
			for(let i = 0; i < something_storage.length; ++i)
			{
				for(let j = 0; j < something_storage[i].first.length; ++j)
				{
					console.log(something_storage[i].first[j]["table_name"]);
					//]console.log("inside....................."+tempResult[i].first[j]["table_name"]+" "+tempResult[i].first[j]["column_name"]);
					holder[something_storage[i].first[j]["table_name"]].headers.push( {validate: (something_storage[i].first[j]["validate"] == undefined)?true:something_storage[i].first[j].validate , type: data_type_converter[something_storage[i].first[j]["data_type"]], name: something_storage[i].first[j]["column_name"]}) ; 	
				}
			}
		
		}
		//console.log(max);
		//console.log(query);console.log(query_two);
		console.log(query_two);
		let otherResult = await faire_un_simple_query(query_two);
		
		let filter = ["prenom","nom","id","genre"];
		//console.log(otherResult);
		if( !(otherResult instanceof Array) )
		{
			otherResult = [otherResult];
		}
		
		//console.log(otherResult[0]);
		//console.log(otherResult[0].first.length+".....................");
		//console.log(otherResult[0].second.length+".....................");	
		
		for(let i = 0; i < otherResult.length; ++i)
		{
			let copy = JSON.parse(JSON.stringify(base.bytable));
			orderQueryResultByColumnForVisibility (otherResult[i],"id",undefined,"rows","image",undefined,base.bytable,undefined,[]);
			orderQueryResultByColumnForVisibility (otherResult[i],"idindividu","id","rows","image",copy,base.byId,["name","headers"],[]);
		}
		
		
		for(let i = 0; i < lastTempResult[2].first.length; ++i)
		{
			if (base.byId[lastTempResult[2].first[i]["idindividu"]] == undefined ) 
			{
				base.byId[lastTempResult[2].first[i]["idindividu"]] = {};
			}
			
			if( base.byId[lastTempResult[2].first[i]["idindividu"]][lastTempResult[2].first[i]["id"]] == undefined )
			{
				if( base.bytable[lastTempResult[2].first[i]["id"]] != undefined )
				{
					base.byId[lastTempResult[2].first[i]["idindividu"]][lastTempResult[2].first[i]["id"]] = { name: base.bytable[lastTempResult[2].first[i]["id"]].name,
					headers: base.bytable[lastTempResult[2].first[i]["id"]].headers, rows: []  }; 
				}
			}
		}
		
		//console.log(base.byId);
		//console.log(base.bytable);
		//console.log(connectedguys);
}

function orderQueryResultByColumnForVisibility (queryResult,columnName,innercolumnName,endContainerName,imgColumnName,fromdic,dic,identities,listColumnstoCompile)
{
	
	let empty = true;
	let listColumnstoCompileValues = {};
	
	queryResult.first.forEach((element)=>
	{
		if(element[columnName] != undefined && innercolumnName == undefined)
		{
			if(dic[element[columnName]] == undefined)
			{
				dic[element[columnName]] = [];
				if(endContainerName != undefined)
				{
					dic[element[columnName]] = {};
					dic[element[columnName]][endContainerName] = [];
				}
			}
			let rowElement = [];
			Object.keys(element).forEach(elementsKey =>
			{
				if(!listColumnstoCompile[elementsKey])
				{
					let visibilityObj = {value: element[elementsKey]};
					visibilityObj["img"] = false;
					empty = false;
					if(elementsKey == imgColumnName)
						visibilityObj["img"] = true;
					rowElement.push(visibilityObj);
				}
			});
			
			
			let visibilityObjSomething = {};
			let values = "";
			let compile_values_found = false;	
			
			listColumnstoCompile.forEach((key)=>
			{
				if( element[key] != undefined )
				{
					values += element[key]+" ";
					compile_values_found = true;
				} 
			});
			
			values = values.trimEnd();
			visibilityObjSomething.values = values;
			visibilityObjSomething["img"] = false;
					
			if(compile_values_found)
			{
				rowElement.push(visibilityObjSomething);
				if(endContainerName == undefined)
					dic[element[columnName]].push(visibilityObjSomething);
				else
					dic[element[columnName]][endContainerName].push(visibilityObjSomething);
			}
			
			if(compile_values_found || empty == false)
			{
				if(endContainerName == undefined)
					dic[element[columnName]].push(rowElement);
				else 
				{
					dic[element[columnName]][endContainerName].push(rowElement);
				}
				
				if(fromdic != undefined && identities != undefined && endContainerName != undefined)
				{
					if(fromdic[element[columnName]] != undefined  )
					{
						identities.forEach((identity)=>{
							dic[element[columnName]][identity] = fromdic[element[columnName]][identity];
						});
					}
				}
			}
		}
		
		if(element[columnName] != undefined &&  innercolumnName != undefined )
		{
			if(dic[element[columnName]] == undefined)
			{
				dic[element[columnName]] = {};
			}
			console.log("Inside two nested................");
			let rowElement = [];
			
			if(dic[element[columnName]][element[innercolumnName]] == undefined)
			{
				dic[element[columnName]][element[innercolumnName]] = [];
				
				if(endContainerName != undefined)
				{
					dic[element[columnName]][element[innercolumnName]] = {};
					dic[element[columnName]][element[innercolumnName]][endContainerName] = [];
				}
			}
			
			Object.keys(element).forEach(elementsKey =>
			{
				if( !listColumnstoCompile[elementsKey] )
				{
					let visibilityObj = {value: element[elementsKey]};
					visibilityObj["img"] = false;
					empty = false;
					if(elementsKey == imgColumnName)
						visibilityObj["img"] = true;
					rowElement.push(visibilityObj);
				}
			});	
			
			let visibilityObjSomething = {};
			let values = "";
			let compile_values_found = false;	
			
			listColumnstoCompile.forEach((key)=>
			{
				if( element[key] != undefined )
				{
					values += element[key]+" ";
					compile_values_found = true;
				} 
			});
			
			values = values.trimEnd();
			visibilityObjSomething.values = values;
			visibilityObjSomething["img"] = false;
					
			if(compile_values_found)
			{
				rowElement.push(visibilityObjSomething);
			}
			
			if(compile_values_found || empty == false)
			{
				if(endContainerName == undefined)
					dic[element[columnName]][element[innercolumnName]].push(rowElement);
				else
				{
					dic[element[columnName]][element[innercolumnName]][endContainerName].push(rowElement);
				}
				
				if(fromdic != undefined && identities != undefined && endContainerName != undefined)
				{
					if(fromdic[element[innercolumnName]] != undefined  )
					{
							identities.forEach((identity)=>{
								dic[element[columnName]][element[innercolumnName]][identity] = fromdic[element[innercolumnName]][identity];
							});
					}
				}
			}
		}
	});
	
	if(empty)
		return undefined;
	return dic;
}

function addUser (IDparam,firstparam,secondparam,genderparam,pwdparam,superadminparam,userparam)
{
				
		let aconnecedGuy = 
		{ 
			ID: IDparam,first:firstparam,second:secondparam,gender:genderparam,pwd:pwdparam,
			user:userparam,userAuthentification: {ID:IDparam,Prenom:firstparam,Nom:secondparam,genre:genderparam,pass:pwdparam,
			superadmin:superadminparam,user:userparam}
		};
				
		let findResult = !findUser(IDparam,firstparam,secondparam,genderparam,pwdparam,superadminparam,userparam);
				
		if(!findResult.found)
		{
			connectedguys.push(aconnecedGuy); 
			return aconnecedGuy;
		}

		return findResult.element;

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
			
function findUser(ID,first,second,gender,pwd,superadmin,user)
{
	for(let loginGuysCount = 0; loginGuysCount < connectedguys.length;++loginGuysCount)
	{
		if(connectedguys[loginGuysCount].ID == ID && connectedguys[loginGuysCount].first == first 
			&& connectedguys[loginGuysCount].second == second && connectedguys[loginGuysCount].gender == gender
			&& connectedguys[loginGuysCount].pwd == pwd
			&& connectedguys[loginGuysCount].superadmin == superadmin
			&& connectedguys[loginGuysCount].user == user)
			{
				return {found:true,index:loginGuysCount,element:connectedguys[loginGuysCount]};
			}
	}
	return {found:false,index:-1};
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

function goodResponse(res,data)
{
	if(res === undefined || res.writableEnded)
		return;
		res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
		,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
		,"Access-Control-Max-Age":'86400'
		,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
	});
	res.write(JSON.stringify(data));
	res.end();
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
			error: true,
			desc: "Mauvaise combinaison ENTRE LE MOT DE PASSE ET L'IDENTIFICATION."
		}
	));
	res.end();
}	

async function check_super_admin(userAuthentification,aconnection,res)
{
				let result = findTypeofAdminShort(userAuthentification.ID,userAuthentification.pass);
				if(result.found)
				{
					return {first:result.element.userAuthentification.superadmin,second:result.element.userAuthentification.user};
				}
				
				let query = "SELECT IDIndividu,SuperAdmin, \"User\",Password FROM \"DouDous'individuals\"";
					
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
								return {first:true,second:false};
							}
							
							
							if(notAnError.first[u].User == 1 && notAnError.first[u].idindividu == userAuthentification.ID
							&& notAnError.first[u].password == userAuthentification.pass)
							{
								//console.log({first:false,second:false,third:true,fourth:false});
								return {first:false,second:true};
							}
						
							
						}	
						
						return {first:false,second:false};
					}
						
				}
				else
				{
					//console.log(notAnError);
					return {first:false,second:false,third:false,fourth:false};
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
			