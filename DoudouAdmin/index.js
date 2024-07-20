var postgres = require('pg');
var http = require("http");
var url = require("url");
var vercelBlob = require("@vercel/blob");
var formidable = require('formidable');
var fs = require('fs');	
var base = {individuals:{}, bytable:{},byId:{}};
var https = require("https");
var connectedguys =
[	
];
var individuals_interest = []; 
const connections = {};
let callIndex = 0;
var max = 0;
const login_id_and_network = {loggins:{},responses:{}};
let blob_stuff = "vercel_blob_rw_AhayNnM8BUTRk7li_Pirrs7p4aeFH5cnD9hONM9peBfDhxd";
let data_type_converter = {'character varying':'text',date:'Date',text:'text',time:'Time',integer:'Integer',boolean:'Boolean',decimal:'Decimal','decimal(3,2)':'Decimal(3,2)','decimal(3,2)':'Decimal(4,2)','decimal(5,2)':'Decimal(5,2)','decimal(6,2)':'Decimal(6,2)'
		,'decimal(7,2)':'Decimal(7,2)','decimal(8,2)':'Decimal(8,2)','decimal(9,2)':'Decimal(9,2)','decimal(9,2)':'Decimal(9,2)','decimal(10,2)':'Decimal(10,2)','decimal(11,2)':'Decimal(11,2)'
		,'decimal(12,2)':'Decimal(12,2)','decimal(13,2)':'Decimal(13,2)','decimal(14,2)':'Decimal(14,2)','decimal(15,2)':'Decimal(15,2)','decimal(16,2)':'Decimal(16,2)'
		,'decimal(17,2)':'Decimal(17,2)','decimal(18,2)':'Decimal(18,2)','decimal(19,2)':'Decimal(19,2)','decimal(20,2)':'Decimal(20,2)','decimal(21,2)':'Decimal(21,2)'};

const IDs = {};
IDs["9999"] = {ID:"9999",password:getPassword(),supadmin:true,admin:true,subadmin:false,collector:false};
const model = {projects:{},employees:{},localities:[],subadmins:{},zones:["PIKINE","SAINT-LOUIS"]};
const password = getPassword();


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
		console.log(req.url);
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
								console.log(ex);
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
							if(req.url == "/themeBase")
							{
								try
								{
									findCommand(urlObject,res,req);
								}
								catch(ex)
								{
									console.log(ex);
								}
							}
							else
							{
								let command = urlObject.command;
								//console.log("Command is update "+ command == "update");
								
								
								if(command === "login")
								{	
									let resultb = res;
									
									forced_authentification_query_login(urlObject.userAuthentification,resultb).then((ares)=>
									{
											//console.log(ares);
											if(JSON.stringify(ares.first) == "false" && JSON.stringify(ares.second) == "false" )
											{
												resultb.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
												,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
												,"Access-Control-Max-Age":'86400'
												,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
												//console.log("Sending response");
												resultb.write(JSON.stringify(ares));
												resultb.end();
												return;
											}
											
											check_super_admin(urlObject.userAuthentification,undefined,undefined).then((othertempResult)=>
											{
												//console.log(othertempResult);
													if(ares.first == true || ares.second == true )
													{
														//console.log("Inside setting");
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
													//console.log("This guy is authenticated");
													let resultd = resultc;
													check_super_admin(userAuthentification,undefined,undefined).then((othertempResult)=>
													{
														//console.log("Inside checking admin type");
														if(othertempResult.first)
														{
															//console.log("This guy is a primary admin");
															///console.log("responding");
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
															//console.log("This guy is a secondary kind of  admin");
															
															resultd.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
															,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
															,"Access-Control-Max-Age":'86400'
															,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
															});
																	
															//resultd.write(JSON.stringify({individuals:[base.individuals[userAuthentification.ID]],tables:base.byId[userAuthentification.ID]}));
															resultd.write(JSON.stringify({individuals:Object.entries(base.individuals),tables:base.bytable}));
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
									else if(command == "vide")
									{
										result.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
													,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
													,"Access-Control-Max-Age":'86400'
													,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
													});
										result.write(JSON.stringify({OK:200}));
										result.end();
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
						}
						});
		}
	}
});

async function start()
{
	await add_all_users();
	Load();	
	server.listen(process.env.PORT || 3035);
	console.log("Listening at port 3035.............");
}
start();
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
						queryStr += "insert into \""+table+"\" values (DEFAULT,$$"+baseTable+"$$,$$"+image_url+"$$);\n";
						queryStr += "create table \""+baseTable+" saisies\" ("+valuesStr+",id integer,idindividu integer,index integer, Primary KEY("+pkvalues+",id,idindividu,index integer))\n;";
						console.log(queryStr);
						
						let tempuserAuthentification = {ID:urlObject.authID[0],Prenom:urlObject.authPrenom[0],Nom:urlObject.authNom[0],genre:urlObject.authGenre[0],pass:urlObject.authpass[0]};
						let tempResult = await forced_authentification_query(tempuserAuthentification,undefined);
						//let tempResult = false;
					
						if(tempResult != false)
						{
							let result = await faire_un_simple_query(queryStr);
							if(result.second != false || (result.second instanceof Array))
							{
								base.bytable[max++] = {name:baseTable,headers:Array.prototype.concat(elements_dic,individuals_interest),rows:[],rowsInput:[],image_url:image_url};
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
				else if(commandArg == "addrows" || commandArg == "addinputrows")
				{
					let tableId = undefined;
					let ADDERSID = undefined;
					let rowsInputFormat = {}
					let index_of_input_row = '-1';
					let deleteStr = "";
					
					Object.keys(fields).forEach(key=>
					{
						if(key == "authID")
						{
							let valueEq = undefined;
							if(fields[key] instanceof Array)
							{
								valueEq = fields[key][0];
							}
							else
								valueEq = fields[key];
							
							ADDERSID = valueEq;
						}
						
						if( key != commandArg && key != command && key != "table" && key != "userAuthentification" && key != "table"  && key !="command"  && key != "cmdArg"
						 && key != "authID"  && key != "authPrenom"  && key != "authNom"  && key !="authGenre"  && key !="authpass")
						{
							console.log(key);
							
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
							
							if(key == 'index' && commandArg == "addinputrows")
							{
								elements_dic.push(obj);
								if(count > 0)
								{
									valuesStr += ",$$"+valueEq+"$$";
								}
								else
								{
									valuesStr += "$$"+valueEq+"$$";
								}
								rowsInputFormat[key] = valueEq;
							}
							else if( (commandArg == "addrows" && key != 'index') || key != 'index')
							{
								elements_dic.push(obj);
								if(count > 0)
								{
									valuesStr += ",$$"+valueEq+"$$";
									deleteStr += " AND "+key+"="+valueEq;
								}
								else
								{
									valuesStr += "$$"+valueEq+"$$";
									deleteStr += " WHERE "+key+"="+valueEq;
								}
								rowsInputFormat[key] = valueEq;
							}
							
							if(key == 'index')
								index_of_input_row = valueEq;
							
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
					
					console.log(count+"----------------");
					let query = "insert into \"" + table + "\" values (" + valuesStr+" );\n";
					if(commandArg == "addrows")
						query += "delete from \""+table+" saisies\""+ deleteStr+"\n" ;
					
					console.log(query);
					console.log(commandArg);
					console.log(tableId);
					console.log(fields);
					
					if(commandArg == "addinputrows" || commandArg == "addrows")
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
									console.log("--------------------base-------------------------");
									
									
									if(base.byId[tempuserAuthentification.ID] == undefined)
									{
										base.byId[tempuserAuthentification.ID] = {};
									}
									
									if(base.byId[tempuserAuthentification.ID][tableId] == undefined)
									{
										base.byId[tempuserAuthentification.ID][tableId] = {name:base.bytable[tableId].name,headers:base.bytable[tableId].headers,rows:[],rowsInput:[]};
										//base.byId[tempuserAuthentification.ID][tableId] = {name:base.bytable[tableId].name,headers:base.bytable[tableId].headers,rows:JSON.parse(JSON.stringify(base.bytable[tableId].rows),rowsInput:[])};
									}
									
									
									let rows = [];
									elements_dic.forEach((k)=>{
										rows.push(k);
									});
									
									let a = undefined;
									let b = undefined;
									
									//console.log(tempuserAuthentification.ID);
									//console.log(base.individuals);
									
									b = {value:base.individuals[tempuserAuthentification.ID].first,img:false};//.prenom
									rows.push(b);
									
									b = {value:base.individuals[tempuserAuthentification.ID].second,img:false};//.nom
									rows.push(b);
									
									b = {value:base.individuals[tempuserAuthentification.ID].gender,img:false};//.genre
									rows.push(b);
									
									a = {value:base.individuals[tempuserAuthentification.ID]["image"], img: true};//["image"]
									rows.push(a);
									
									rowsInputFormat["prenom"] = base.individuals[tempuserAuthentification.ID].first;
									rowsInputFormat["nom"] = base.individuals[tempuserAuthentification.ID].second;
									rowsInputFormat["genre"] = base.individuals[tempuserAuthentification.ID].gender;
									rowsInputFormat["image"] = base.individuals[tempuserAuthentification.ID]["image"];
									
									
									if( commandArg == "addinputrows" )
									{
										base.bytable[tableId].rowsInput.push(rowsInputFormat);
										console.log(base.bytable[tableId].rowsInput);
										console.log("added into rowsInput 622");
									}
									else
									{
										base.bytable[tableId].rows.push(rows);
										if(index_of_input_row != '-1' && base.bytable[tableId].rowsInput.length > 0)
										{
											let value = base.bytable[tableId].rowsInput.find(el=> el.index.toString() == index_of_input_row);
											
											if(value != undefined)
											{
													let found_elements_index = base.bytable[tableId].rowsInput.indexOf(value);
													if(found_elements_index >= 0)
													{
														console.log("old length is"+ base.bytable[tableId].rowsInput.length);
														console.log("Element deleted from table");
														console.log(value);
														base.bytable[tableId].rowsInput.splice(found_elements_index,1);
														console.log("new length is"+ base.bytable[tableId].rowsInput.length);
													}
											}
										}
									}
									console.log(tableId);
									console.log(base.byId[tempuserAuthentification.ID]);
									
									if( commandArg == "addinputrows" )
									{
										console.log(base.byId[tempuserAuthentification.ID][tableId].rowsInput.length+"--------------------------");
										base.byId[tempuserAuthentification.ID][tableId].rowsInput.push(rowsInputFormat);
										console.log(base.byId[tempuserAuthentification.ID][tableId].rowsInput);
										console.log(base.byId[tempuserAuthentification.ID][tableId].rowsInput.length+"--------------------------");
										console.log("added into rowsInput 635");
									}
									else
									{
										console.log(base.byId[tempuserAuthentification.ID][tableId].rows.length+"--------------------------");
										base.byId[tempuserAuthentification.ID][tableId].rows.push(rows);
										
										if(index_of_input_row != '-1' &&  base.byId[tempuserAuthentification.ID][tableId].rowsInput.length > 0)
										{
											let value = base.byId[tempuserAuthentification.ID][tableId].rowsInput.find(el=> el.index.toString() == index_of_input_row);
											if(value != undefined )
											{
													let found_elements_index = base.byId[tempuserAuthentification.ID][tableId].rowsInput.indexOf(value);
													if(found_elements_index >= 0)
													{
														
														console.log("old length is"+ base.byId[tempuserAuthentification.ID][tableId].rowsInput.length);
														console.log("Element deleted from byId");
														console.log(value);
														base.byId[tempuserAuthentification.ID][tableId].rowsInput.splice(found_elements_index,1);
														console.log("new length is"+ base.byId[tempuserAuthentification.ID][tableId].rowsInput.length);
													}
											}
										}
										console.log(base.byId[tempuserAuthentification.ID][tableId].rows.length+"--------------------------");
									}	
									
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
				else if ( commandArg == "modifyrows" || commandArg == "modifyinputrows")
				{
					let valuesStr = ["",""];
					let tableId = undefined;
					let keys = [];
					let elements_dic = [[],[]];
					let oldComparison = {};
					let newComparison = {};
					let tempuserAuthentification = {ID:urlObject.authID[0],Prenom:urlObject.authPrenom[0],Nom:urlObject.authNom[0],genre:urlObject.authGenre[0],pass:urlObject.authpass[0]};
					console.log(commandArg);	
					
					Object.keys(fields).forEach(key=>
					{
						if(key != commandArg && key != command && key != "table" && key != "userAuthentification" && key != "table"  && key !="command"  && key != "cmdArg"
						 && key != "authID"  && key != "authPrenom"  && key != "authNom"  && key !="authGenre"  && key !="authpass")
						{
							keys.push(key);
							let valueEq = ["",""];
							
							oldComparison[key] = fields[key][0];	
							newComparison[key] = fields[key][1];
							
							
							if(fields[key] instanceof Array)
							{
								valueEq[0] = fields[key][0];
								valueEq[1] = fields[key][1];
							}
							
							let obj ={};
							obj["value"] = valueEq[0];
							obj["img"] = false;
							elements_dic[0].push(obj);
							
							obj ={};
							obj["value"] = valueEq[1];
							obj["img"] = false;
							elements_dic[1].push(obj);
							
							if(count > 0)
							{
								valuesStr[0] += ",\""+key+"\"="+"$$"+valueEq[1]+"$$";
								valuesStr[1] += " AND \""+key+"\"="+"$$"+valueEq[0]+"$$";
							}
							else
							{
								valuesStr[0] += "\""+key+"\"="+"$$"+valueEq[1]+"$$";
								valuesStr[1] += "\""+key+"\"="+"$$"+valueEq[0]+"$$";
							}
							++count;
							
							if( key == "id")
							{
								tableId = valueEq[0];
							}
							
						}
						else
						{
							let valueEq = ["",""];
								if(fields[key] instanceof Array)
								{
									valueEq[0] = fields[key][0];
									valueEq[1] = fields[key][1];
								}
							if(key == "table")
								table = valueEq[0];
						}
						console.log(key);
						//
					});
				
					let queryStr = "update \"" + table + "\" SET "+valuesStr[0]+" WHERE "+valuesStr[1]+"\n;";
					console.log(queryStr);
					console.log(commandArg);
					console.log(tableId);
					console.log(fields);
					
					if(commandArg == "modifyrows" || commandArg == "modifyinputrows")
					{
						let tempResult = await forced_authentification_query(tempuserAuthentification,undefined);
						
						if(tempResult != false && tableId != undefined)
						{
							let result = await faire_un_simple_query(queryStr);
							if(result.second != false || (result.second instanceof Array))
							{
									
									let rows = [];
									elements_dic[0].forEach((k)=>{
										rows.push(k);
									});
									
									let rowsbeta = [];
									elements_dic[1].forEach((k)=>{
										rowsbeta.push(k);
									});
									
									let a = undefined;
									let b = undefined;
								
									 
									if( commandArg == "modifyinputrows" )
									{
										
										oldComparison["prenom"] =  base.individuals[tempuserAuthentification.ID].first;
										oldComparison["nom"] =  base.individuals[tempuserAuthentification.ID].second;
										oldComparison["genre"] =  base.individuals[tempuserAuthentification.ID].gender;
										oldComparison["image"] =  base.individuals[tempuserAuthentification.ID]["image"];
										newComparison["prenom"] =  base.individuals[tempuserAuthentification.ID].first;
										newComparison["nom"] =  base.individuals[tempuserAuthentification.ID].second;
										newComparison["genre"] =  base.individuals[tempuserAuthentification.ID].gender;
										newComparison["image"] =  base.individuals[tempuserAuthentification.ID]["image"];
										
										console.log(base.bytable[tableId].rowsInput.length+"--------------------------");
										
										console.log(oldComparison);
										let found_index = -1;
										
										base.byId[tempuserAuthentification.ID][tableId].rowsInput.forEach((rowInput,firstindex)=>
										{
											let all_found = true;
											Object.keys(oldComparison).forEach((keyel,index2)=>
											{
												if(  !((rowInput[keyel] instanceof Date && rowInput[keyel].toISOString() == oldComparison[keyel]) || rowInput[keyel].toString() == oldComparison[keyel] ) )
												{
													all_found = false;
												}
											});
											console.log("All found is "+all_found);
											if(all_found  && Object.keys(oldComparison).length > 0 && found_index == -1)
											{
												found_index = firstindex;
											}
										});
										
										let elementFound = (found_index == -1)? undefined:base.byId[tempuserAuthentification.ID][tableId].rowsInput[found_index];
										console.log("elementfound is "+((elementFound != undefined)? 'defined':'undefined'));
										
										if( found_index != -1 )
										Object.keys(elementFound).forEach((loopkey)=>
										{
											elementFound[loopkey] = newComparison[loopkey];
										});
										else
											console.log(base.byId[tempuserAuthentification.ID][tableId].rowsInput);
										
										console.log(elementFound);
										
										found_index = -1;
										
										base.bytable[tableId].rowsInput.forEach((rowInput,firstindex)=>
										{
											let all_found = true;
											Object.keys(oldComparison).forEach((keyel,index2)=>
											{
												if(  !((rowInput[keyel] instanceof Date && rowInput[keyel].toISOString() == oldComparison[keyel]) || rowInput[keyel].toString() == oldComparison[keyel] ) )
												{
													all_found = false;
												}
											});
											console.log("All found is "+all_found);
											if(all_found  && Object.keys(oldComparison).length > 0 && found_index == -1)
											{
												found_index = firstindex;
											}
										});
										
										elementFound = (found_index == -1)? undefined:base.bytable[tableId].rowsInput[found_index];
										console.log("elementfound is "+((elementFound != undefined)? 'defined':'undefined'));
										
										if( found_index != -1 )
										Object.keys(elementFound).forEach((loopkey)=>
										{
											elementFound[loopkey] = newComparison[loopkey];
										});
										else
											console.log(base.byId[tempuserAuthentification.ID][tableId].rowsInput);
										
										console.log(elementFound);//
										
										console.log(base.bytable[tableId].rowsInput.length+"--------------------------");
									}
									else
									{
										//Getting specific user info is no longer a requirement
										/*
										if(base.individuals[tempuserAuthentification.ID].user)
										{
											oldComparison["prenom"] =  base.individuals[tempuserAuthentification.ID].first;
											oldComparison["nom"] =  base.individuals[tempuserAuthentification.ID].second;
											oldComparison["genre"] =  base.individuals[tempuserAuthentification.ID].gender;
											oldComparison["image"] = base.individuals[tempuserAuthentification.ID].image;
											
											newComparison["prenom"] =  base.individuals[tempuserAuthentification.ID].first;
											newComparison["nom"] =  base.individuals[tempuserAuthentification.ID].second;
											newComparison["genre"] =  base.individuals[tempuserAuthentification.ID].gender;
											newComparison["image"] = base.individuals[tempuserAuthentification.ID].image;
										}
										*/
										console.log(oldComparison);
										let keys_for_comparison = Object.keys(oldComparison);
										console.log(keys_for_comparison);
										let found_index = -1;
										console.log(base.byId[tempuserAuthentification.ID][tableId].rows.length);
										
										base.byId[tempuserAuthentification.ID][tableId].rows.forEach((row,firstindex)=>
										{
											let all_found = true;
											console.log(firstindex);
											Object.keys(oldComparison).forEach((keyel,index2)=>
											{
												if(  !((row[index2].value instanceof Date && row[index2].value.toISOString() == oldComparison[keyel]) || row[index2].value.toString() == oldComparison[keyel] ) )
												{
													all_found = false;
												}
											});
											console.log("All found is "+all_found +" rows length is "+row.length+"-------------"+found_index);
											console.log(all_found  && row.length > 0 && found_index == -1);
											if(all_found  && row.length > 0 && found_index == -1)
											{
												found_index = firstindex;
												console.log("New All found is "+all_found +" rows length is "+row.length+"-------------"+found_index);
											}
										});
										
										let elementFound = (found_index == -1)? undefined:base.byId[tempuserAuthentification.ID][tableId].rows[found_index];
										console.log("elementfound is "+((elementFound != undefined)? 'defined':'undefined'));
										
										if( found_index != -1 )
										Object.keys(newComparison).forEach((loopkey,rowindex)=>
										{
											elementFound[rowindex].value = newComparison[loopkey];
										});
										else
											console.log(base.byId[tempuserAuthentification.ID][tableId].rows);
										
										console.log(elementFound);
										
										keys_for_comparison = Object.keys(oldComparison);
										console.log(keys_for_comparison);
										found_index = -1;
										
										base.bytable[tableId].rows.forEach((row,firstindex)=>
										{
											let all_found = true;
											
											Object.keys(oldComparison).forEach((keyel,index2)=>
											{
												
												if(  !((row[index2].value instanceof Date && row[index2].value.toISOString() == oldComparison[keyel]) || row[index2].value.toString() == oldComparison[keyel] ) )
												{
													all_found = false;
												}
												
											});
											
											if(all_found  && row.length > 0 && found_index == -1)
											{
												found_index = firstindex;
											}
										});
										
										elementFound = (found_index == -1)? undefined:base.bytable[tableId].rows[found_index];
										console.log("elementfound is "+((elementFound != undefined)? 'defined':'undefined'));
										
										if( found_index != -1 )
										Object.keys(newComparison).forEach((loopkey,rowindex)=>
										{
											elementFound[rowindex].value = newComparison[loopkey];
										});
										else
											console.log(base.byId[tempuserAuthentification.ID][tableId].rows);
										
										console.log(elementFound);
										
									}	
									
									goodResponse(res, {text:"Modifications passées",customtext:"OK"});
									
							}
							else
							{
								dummyResponse(res,{text:"Modifications impossibles",customtext:"Error"});
							}
						}
						else
						{
							dummyResponse(res,{text:"Vous n'avez pas l'accés pour modifier.",customtext:"Error"});
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
									base.byId[elements_dic_other["ID"]][elements_dic_other["baseID"]] = {name: base.bytable[elements_dic_other["baseID"]].name,headers: base.bytable[elements_dic_other["baseID"]].headers,rows:[],rowsInput:[]}  ;
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
											"superadmin":elements_dic_other["type1"],"user":elements_dic_other["type2"],"image":image_url};
											
											if( base.byId[elements_dic_other["ID"]] == undefined) 
											{
												base.byId[elements_dic_other["ID"]] = {};
											}
											
											if( base.byId[elements_dic_other["ID"]][elements_dic_other["baseID"]] == undefined)
											{
												if(base.bytable[elements_dic_other["baseID"]] != undefined)
												{
													base.byId[elements_dic_other["ID"]][elements_dic_other["baseID"]] = {name: base.bytable[elements_dic_other["baseID"]].name,headers: base.bytable[elements_dic_other["baseID"]].headers,rows:[],rowsInput:[]}  ;
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
		let query_three = "";
		query = "";
		
		query += "SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT,TABLE_NAME FROM INFORMATION_SCHEMA.COLUMNS";
		query += " where TABLE_NAME = $$DouDous'individuals$$ AND ( Column_name ='prenom'  OR Column_name ='nom' OR Column_name ='genre'"
		query += " OR Column_name ='image' OR Column_name ='idindividu');"			
		
		for(let i = 0; i < tempResult[1].first.length; ++i)
		{
			query += "SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT,TABLE_NAME FROM INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = $$"+tempResult[1].first[i]['name']+"$$;\n";
			base.bytable[tempResult[1].first[i]["id"]] = {name: tempResult[1].first[i]["name"],headers:[],rows:[],rowsInput:[]}; 
			holder[tempResult[1].first[i]["name"]] = base.bytable[tempResult[1].first[i]["id"]] ;
			let arrayFiltered = lastTempResult[1].first.filter((elem)=> elem.id == tempResult[1].first[i]["id"]);
			if(arrayFiltered.length > 0)
			{
				base.bytable[tempResult[1].first[i]["id"]]["image_url"] = arrayFiltered[0]["image_url"];
			}
			query_two += "SELECT * FROM \""+tempResult[1].first[i]['name']+"\" inner join  (Select IDIndividu,Prenom,Nom,Genre,Image from \"DouDous'individuals\") as A  on A.IDIndividu = \""+tempResult[1].first[i]['name']+"\".IDIndividu;\n";
			query_three += "SELECT * FROM \""+tempResult[1].first[i]['name']+" saisies\" inner join  (Select IDIndividu,Prenom,Nom,Genre,Image from \"DouDous'individuals\") as A  on A.IDIndividu = \""+tempResult[1].first[i]['name']+" saisies\".IDIndividu;\n";
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
		console.log(otherResult);
		if( !(otherResult instanceof Array) )
		{
			otherResult = [otherResult];
		}
		
		//console.log(otherResult[0]);
		//console.log(otherResult[0].first.length+".....................");
		console.log(otherResult[0].second.length+".....................");	
		
		console.log(base.byId);
		let baseIDs = [];
		let copy = JSON.parse(JSON.stringify(base.bytable));
		console.log(copy);
		for(let i = 0; i < otherResult.length; ++i)
		{
			
			orderQueryResultByColumnForVisibility (otherResult[i],"id",undefined,"rows","image",undefined,base.bytable,undefined,[]);
			orderQueryResultByColumnForVisibility (otherResult[i],"idindividu","id","rows","image",copy,base.byId,["name","headers","rowsInput"],[]);
		}
		console.log(query_three);
		otherResult = await faire_un_simple_query(query_three);
		
		filter = ["prenom","nom","id","genre"];
		
		if( !(otherResult instanceof Array) )
		{
			otherResult = [otherResult];
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
					headers: base.bytable[lastTempResult[2].first[i]["id"]].headers, rows: [],rowsInput:[]  }; 
				}
			}
		}
		for(let i = 0; i < otherResult.length; ++i)
		{
			console.log(i);
			console.log("--------------Inside saisies---------------------");
			otherResult[i].first.forEach((row,index)=>
			{
				/* Object.keys(row).forEach((key2)=>
				{
					valuesOfRow.push(row[key2]);
				});
				 */
				let rowsCopy = JSON.parse(JSON.stringify(row));
				let rowsCopy2 = JSON.parse(JSON.stringify(row));
				
				//console.log(Object.keys(base.bytable[row["id"]]));
				//console.log(base.bytable[row["id"]]);
				base.bytable[row["id"]].rowsInput.push(rowsCopy);
				if( base.byId[row["idindividu"]] == undefined)
					base.byId[row["idindividu"]] = {};
				if( base.byId[row["idindividu"]][row["id"]] == undefined )
					base.byId[row["idindividu"]][row["id"]] = { name: base.bytable[row["id"]].name,
					headers: base.bytable[row["id"]].headers, rows: [],rowsInput:[]  };;
				base.byId[row["idindividu"]][row["id"]].rowsInput.push(rowsCopy2);
			});	
			console.log("--------------After saisies---------------------");
		}
		
		console.log(base.byId);
		console.log(base.bytable);
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
					//console.log(query);
					//console.log(userAuthentification);
					//console.log(notAnError.first);
					
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
					//console.log(data);
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
	
	setInterval(async () =>{ 
		let awaitres = await doGetHTTPRequest("serveur-de-pointage-de-msa.onrender.com",undefined,"command=vide");
		//console.log(!awaitres?"Bad refreshing result":"Good refreshing result");
		},1000);
		
	function Load()
	{
		
		let employees = read("employees.txt");
		if(employees)
		{
			model.employees = employees;
			console.log(employees);
		}
		
		let localities = read("localities.txt");
		if(localities)
		{
			model.localities = localities;
			console.log(localities);
		}
		
		let projects = read("projects.txt");
		if(projects)
		{
			model.projects = projects;
			console.log(projects);
		}

		let IDsFile = read("IDs.txt");
		if(IDsFile)
		{
			Object.assign(IDs,IDsFile);
			console.log(IDs);
		}
		
		let subadminsFile = read("subadmins.txt");
		if(subadminsFile)
		{
			Object.assign(model.subadmins,subadminsFile);
		}
		deleteTarget()
		//FillOneTheme("Awa Dieye 1",model.projects["6"]);
	}
	function swap(array,prop)
	{
						var count =  array.length -2;
						var value = array[array.length -1];
						var swap;
						while( value[prop].rank < array[count][prop] && count >= 0 )
						{
							var swap = array[count][prop];
							array[count][prop] = array[count+1][prop];
							array[count+1][prop] = swap;
							--count;
						}
	}
	function deleteList(pj,command)
	{
		if(pj)
		{
					const theme = pj.themes.find(theme => theme.rank == command.obj.themeRank);
					if(theme)
					{
						const subtheme = theme.subthemes.find(sub=> sub.rank == command.obj.subthemeRank);
						if( subtheme )
						{
							const question = subtheme.questions.find(qu=> qu.rank == command.obj.questionRank);
							if(question)
							{
								const question_list = question.list.find(lst=> lst.rank == command.obj.listRank);			
								if(question_list)
								{
									const question_list_index = question.list.indexOf(question_list);
									question.list.splice(question_list_index,1);
									let start = question_list_index;
									while( start < question_list.length)
									{
										--question.list[start].rank;
										++start;
									}
								}
							}
						}
					}
		}
	}
	function deleteTarget()
	{
		Object.values(model.projects).forEach( pj => {
			if( pj )
			{
				Object.values(model.employees).forEach( emp => 
				{
					if(emp.reports)
					emp.reports.forEach(rp =>
					{
						if(rp.project.rank == pj.rank)
						{
							rp.project.themes.forEach( th => 
							{
								th.subthemes.forEach( sub => 
								{
									const th2r = pj.themes.find( th2 => th2.rank == th.rank);
									
									if( th2r)
									{
										const sub2r = th2r.subthemes.find(sub2 => sub.rank == sub2.rank )
										if(sub2r)
										{
											var subQ =  sub.questions.filter( q => q.rank > sub2r.questions.length );
											subQ.forEach ( subQus => 
											{
												deleteQuestion(rp.project,{obj:{themeRank:th.rank,subthemeRank:sub.rank,questionRank:subQus.rank}});
											});
										}
									}
								});
							});
							//deleteQuestion(rp.project,{obj:{themeRank:1,subthemeRank:1,questionRank:7}});
						}
					});
				});
			}
		});
	}
	function deleteQuestion(pj,command)
	{
		if(pj)
		{
			const theme = pj.themes.find(theme => theme.rank == command.obj.themeRank);
			if(theme)
			{
					const subtheme = theme.subthemes.find(sub=> sub.rank == command.obj.subthemeRank);
					if( subtheme )
					{
						const question = subtheme.questions.find(qu=> qu.rank == command.obj.questionRank);
						if(question)
						{
							let index = subtheme.questions.indexOf(question);
							subtheme.questions.splice(index,1);
							if( subtheme.questions.length > index)
							{
								let start = index;
								while( start <subtheme.questions.length)
								{
									--subtheme.questions[start].rank ;
									start++;
								}
							}
						}
					}
			}
		}
	}
	
	function deleteSubtheme(pj,command)
	{
		if(pj)
		{
			const theme = pj.themes.find(theme => theme.rank == command.obj.themeRank);
			if(theme)
			{
					const subtheme = theme.subthemes.find(sub=> sub.rank == command.obj.subthemeRank);
					if( subtheme )
					{
							let index = theme.subthemes.indexOf(question);
							theme.subthemes.splice(index,1);
							if( theme.subthemes.length > index)
							{
								let start = index;
								while( start <theme.subthemes.length)
								{
									--theme.subthemes[start].rank ;
									start++;
								}
							}
						
					}
			}
		}
	}
	
	function deleteTheme(pj,command)
	{
		if(pj)
		{
			const theme = pj.themes.find(theme => theme.rank == command.obj.themeRank);
			if(theme)
			{
					let index = pj.themes.indexOf(theme);
					pj.themes.splice(index,1);
					if( pj.themes.length > index)
					{
						let start = index;
						while( start <pj.themes.length)
						{
							--pj.themes[start].rank ;
							start++;
						}
					}
			}
		}
	}
	
	function deleteItems(pj,command)
	{
		if(pj)
		{
			const theme = pj.themes.find(theme => theme.rank == command.obj.themeRank);
			if(theme)
			{
				const subtheme = theme.subthemes.find(sub=> sub.rank == command.obj.subthemeRank);
				if( subtheme )
				{
					const question = subtheme.questions.find(qu=> qu.rank == command.obj.questionRank);
					if(question)
					{
						const question_list = question.items.splice(0,question.items.length);
					}
				}
			}
		}
	} 
	function findCommand(command,res,req)
	{
		
		console.log(command);	
		//set added list element to question during fill up,
		//set added theme of project into references of employee
		if( command && command.obj && command.obj.ID && command.type == "getProjectsFile" )
		{
			res.writeHead(200, {"Content-Disposition":"attachment;filename="+command.fileName,"Content-Type": "text/plain","Access-Control-Allow-Origin":"*"
												,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
												,"Access-Control-Max-Age":'86400'
												,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
												//console.log("Sending response");
			if(fs.existsSync(command.fileName))
			{
				const rStream = fs.createReadStream(command.fileName);
				rStream.pipe(res);
			}
			else
				res.end();
			return;
		}
		
		res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
												,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
												,"Access-Control-Max-Age":'86400'
												,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
												//console.log("Sending response");
		if( command && command.obj  && command.type == "deleteStuff" )
		{
			var changedSome = false;
			var reportRange = false;
			console.log(command.obj);
			if( command.subType == "report" && command.obj.ID)
			{
				const report = model.employees[command.obj.ID].reports.find(rp=> rp.reportRank == command.obj.reportRank);
				console.log(report);
				if(report)
				{
					const reportIndex = model.employees[command.obj.ID].reports.indexOf(report);
					model.employees[command.obj.ID].reports.splice(reportIndex,1);
					reportRange = true;
				}
			}
			
			if( command.subType == "subtheme")
			{
				const pj = model.projects[command.obj.projectRank]; 
				deleteSubtheme(pj,command);
				Object.values(model.employees).forEach(emp=> {
					let empReport = emp.reports.find(rp=> rp.project.rank == command.obj.projectRank);
					changedSome = true;
					if(empReport)
					{
						deleteSubtheme(empReport.project,command);
						//changedReports.push(emp.ID);
						reportRange = true;
					}
				}); 
			}
			
			if( command.subType == "theme")
			{
				const pj = model.projects[command.obj.projectRank]; 
				deleteTheme(pj,command);
				Object.values(model.employees).forEach(emp=> {
					let empReport = emp.reports.find(rp=> rp.project.rank == command.obj.projectRank);
					changedSome = true;
					if(empReport)
					{
						deleteTheme(empReport.project,command);
						//changedReports.push(emp.ID);
						reportRange = true;
					}
				}); 
			}
			
			if( command.subType == "question")
			{
				const pj = model.projects[command.obj.projectRank]; 
				deleteQuestion(pj,command);
				Object.values(model.employees).forEach(emp=> {
					changedSome = true;
					if(emp.reports)
					{
						let empReport = emp.reports.find(rp=> rp.project.rank == command.obj.projectRank);
						if(empReport)
						{
							deleteQuestion(empReport.project,command);
							reportRange = true;
						}
					}
				}); 
			}
			
			if(command.subtype == "questionList")
			{
				const pj = model.projects[command.obj.projectRank]; 
				deleteList(pj,command);
				Object.values(model.employees).forEach(emp=> {
					let empReport = emp.reports.find(rp=> rp.project.rank == command.obj.projectRank);
					changedSome = true;
					if(empReport)
					{
						deleteList(empReport.project,command);
						//changedReports.push(emp.ID);
						reportRange = true;
					}
				}); 
			}
			
			if(command.subtype == "questionItem")
			{
				const pj = model.projects[command.obj.projectRank]; 
				Object.values(model.employees).forEach(emp=> {
					let empReport = emp.reports.find(rp=> rp.project.rank == command.obj.projectRank);
					changedSome = true;
					if(empReport)
					{
						deleteItems(empReport.project,command);
						//changedReports.push(emp.ID);
						reportRange = true;
					}
				});
			}
			
			res.write(JSON.stringify({command:"deleteStuff"}));
			res.end();
			
			const values = Object.values(IDs);
	
			if(values)
			{
					values.forEach(el=> 
					{
						let allValues = connections[el.ID];
						const nvalues = [];
						if(allValues )
						allValues.forEach(temp =>{
							if(temp && !temp.res.writableEnded && (temp.ID != command.userAuthentification.ID || temp.rank != command.userAuthentification.rank) )
							{
								try
								{
									temp.res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
									,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
									,"Access-Control-Max-Age":'86400'
									,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
								}
								catch(problem)
								{
									console.log(problem);
								}													
								temp.res.write(JSON.stringify({command:"deleteStuff","subType":command.subType,obj:command.obj}));
								//connections[el.ID] = undefined;
								console.log("response to "+el.ID);temp.res.end();
								nvalues.push(temp);
							}
							else if(temp.res.writableEnded && (temp.ID != command.userAuthentification.ID || temp.rank != command.userAuthentification.rank))
							{
								console.log("response to "+el.ID+"differed");
								if(login_id_and_network.responses[el.ID] == undefined )
								{
									login_id_and_network.responses[el.ID] = [{first:{command:"deleteStuff","subType":command.subType,obj:command.obj}
									,reqSource:req.headers.host,reqUserAgent : req.headers['user-agent'],date: new Date(),rank:command.userAuthentification.rank}];
								}
								else
								{
									login_id_and_network.responses[el.ID].push({first:{command:"deleteStuff","subType":command.subType,obj:command.obj}
									,reqSource:req.headers.host,reqUserAgent : req.headers['user-agent'],date: new Date(),rank:command.userAuthentification.rank});
									const count = login_id_and_network.responses[el.ID].length-1;
									const value = login_id_and_network.responses[el.ID][count];
									while(count >= 1 && value.date < login_id_and_network.responses[el.ID][count-1].date)
									{
										const swapValue = login_id_and_network.responses[el.ID][count-1];
										login_id_and_network.responses[el.ID][count-1] = value;
										login_id_and_network.responses[el.ID][count] = swapValue;
										++count;
									}
								}
							}
						});
						
						nvalues.forEach(avalue=>
						{
							allValues.splice(allValues.findIndex(bvalue=> bvalue == avalue),1);
						});
					});
			}
			
			if(changedSome)
			{
				save(model.projects,"projects.txt");
			}
			
			if(reportRange) 
			{
				save(model.employees,"employees.txt");
			}
			
			return;
		}
		if( command && command.obj && command.obj.ID && command.type == "wait_for_update" )
		{
			
			console.log(req.headers.host); 
			console.log(req.headers['user-agent']);
			let temp = login_id_and_network.responses[command.obj.ID];
			
			if(temp)
			{
				console.log(command);
				/*login_id_and_network.responses[command.obj.ID].forEach( el => 
				{
					console.log("You ar dsignd to b a liar");
					console.log(el);
				});*/
				
				let tconnectedGuy = login_id_and_network.loggins[command.obj.ID];
				if(tconnectedGuy && command.obj.ID != '9999')
				{
					/* console.log("found guy array ------------------");
					console.log(req.headers.host);
					console.log(req.headers['user-agent']);
					console.log(tconnectedGuy); */
					tconnectedGuy = tconnectedGuy.find(guy=> guy.rank == command.obj.rank && req.headers.host == guy.reqSource && req.headers['user-agent'] == guy.reqUserAgent);
				}
				
				if(tconnectedGuy && command.obj.ID != '9999')
				{
					/* console.log("found guy ------------------");
					console.log(tconnectedGuy); */
				}
				
				const oldTemp = temp;
				temp = temp.find(guy=> guy.rank == command.obj.rank && req.headers.host == guy.reqSource && req.headers['user-agent'] == guy.reqUserAgent); 
				
				if(tconnectedGuy && ( temp && tconnectedGuy.date <= temp.date ) && command.obj.ID != '9999')
				{
					res.write(JSON.stringify(temp.first));
					console.log(" response went to "+command.obj.ID+" it is reportRank ");
					//console.log(temp.first);
					//console.log(temp.first.change_commands);
					res.end();
					const tempIndex = oldTemp.findIndex(guy=>  req.headers.host == guy.reqSource && req.headers['user-agent'] == guy.reqUserAgent && guy.rank == command.obj.rank);
					oldTemp.splice(tempIndex,1);
				}
				else if( temp )
				{
					res.end();
					const tempIndex = temp.findIndex(guy=> guy.rank == command.obj.rank && req.headers.host == guy.reqSource && req.headers['user-agent'] == guy.reqUserAgent);
					temp.splice(tempIndex,1);
				}
				else
				{
					if(!connections[command.obj.ID])
						connections[command.obj.ID] = [];
					connections[command.obj.ID].push({rank:command.obj.rank,ID:command.obj.ID,res:res,reqSource: req.headers.host,reqUserAgent:req.headers['user-agent']}); 
				}
			}
			else
			{
				let tconnectedGuy = login_id_and_network.loggins[command.obj.ID];
				if(!tconnectedGuy)
				{
					tconnectedGuy = login_id_and_network.loggins[command.obj.ID] = [];
				}
				
				if(!tconnectedGuy.find(guy=> req.headers.host == guy.reqSource 
					&& req.headers['user-agent'] == guy.reqUserAgent && command.obj.rank == guy.rank))
				{
					var index = 0;
					do
					{
						++index;
					}
					while(login_id_and_network.loggins[command.obj.ID].find(elx=> elx.rank == index));
					
					login_id_and_network.loggins[command.obj.ID].push({rank:index,reqSource:req.headers.host,reqUserAgent : req.headers['user-agent'],date: new Date()});
					command.obj.rank = index;
				}
				
				if(!connections[command.obj.ID])
					connections[command.obj.ID] = [];
				connections[command.obj.ID].push({rank:command.obj.rank,ID:command.obj.ID,res:res,reqSource: req.headers.host,reqUserAgent:req.headers['user-agent']}); 
				
			}
			return;
		}
		
		if(command &&  command.obj && command.obj.project && command.obj.project.rank  && command.type == "add-project-object")
		{	
				var changeOccured = false;
					
				Object.values(model.employees).forEach( emp=>
				{
					if( emp.reports ) 
					{
						var rps = emp.reports.filter( rp => rp.project.rank == command.obj.project.rank); 
						
						command.obj.project.themes.forEach(th=> 
						{
							var foundIndex = -1;
							rps.forEach(rp => 
							{
								foundIndex = rp.project.themes.findIndex(th2 => th2.rank == th.rank );
								if(foundIndex < 0)
								{
									const currentTheme = JSON.parse(JSON.stringify(th));
									rp.project.themes.push(currentTheme);
									var curr = rp.project.themes.length -1;
									
									while(curr > 0 && rp.project.themes[curr-1].rank > currentTheme.rank ) 
									{
										const swap = currentTheme;
										rp.project.themes[curr] = rp.project.themes[curr-1];
										rp.project.themes[curr-1] = swap;
										--curr;
									}
									foundIndex = curr;
									changeOccured = true;
									return;
								}
							
								var thFound = rp.project.themes[foundIndex];
								
								th.subthemes.forEach( sub => 
								{
									var subFound = undefined;
								
									subFound =  thFound.subthemes.find( sub2 => sub2.rank == sub.rank );
									if( subFound ) 
									{
											
									}
									else 
									{
										const currentSubTheme = JSON.parse(JSON.stringify(sub));
										thFound.subthemes.push(currentSubTheme);
										var curr = thFound.subthemes.length - 1;
										while(curr > 0 && thFound.subthemes[curr-1].rank > currentSubTheme.rank ) 
										{
											const swap = currentSubTheme;
											thFound.subthemes[curr] = thFound.subthemes[curr-1];
											thFound.subthemes[curr-1] = swap;
											--curr;
										}
										changeOccured = true;
										subFound = currentSubTheme;
										return;
									}
									
									sub.questions.forEach(qu => 
									{
										var quFound = undefined;
										changeOccured = true;
										quFound =  subFound.questions.find( qu2 => qu2.rank == qu.rank );
										if( quFound ) 
										{
											if(quFound.title != qu.title )
											{
												quFound.title = qu.title;
											}
											
											if(quFound.quality != "neural" && quFound.quality != "good" && quFound.quality != "bad")
											{
												quFound.quality = qu.quality;
											}
											
											if(quFound.type.list && qu.type.list)
											{
												quFound.list.forEach( (list,listindex) => 
												{
													if(qu.list.length > listindex)
													{
														if( list.quality != "neural" && list.quality != "good" && list.quality != "bad")
														{
															list.quality = qu.list[listindex].quality;
														}
													}
												});
											}
										}
										else 
										{
											const currentQu = JSON.parse(JSON.stringify(qu));
											subFound.questions.push(currentQu);
											
											var curr = subFound.questions.length - 1;
											while(curr > 0 && subFound.questions[curr-1].rank > currentQu.rank ) 
											{
												const swap = currentQu;
												subFound.questions[curr] = subFound.questions[curr-1];
												subFound.questions[curr-1] = swap;
												--curr;
											}
											quFound = currentQu;
											return;
										}
									});
								});
							});
						});
					}
				});
			if(changeOccured)
			{
				console.log("change occured......................***************");
				save(model.employees,"employees.txt");
			}
			if( model.projects[command.obj.project.rank] == undefined )
			{
				
				model.projects[command.obj.project.rank] = command.obj.project;
				save(model.projects,"projects.txt");
				console.log("model project "+command.obj.project.rank+" set to given project ......................***************");
					
				
				res.write(JSON.stringify({command:"update_added_projects"}));
				res.end();
				
				
				const values = Object.values(IDs);
				
				if(values)
				{
					values.forEach(el=> 
					{
						let allValues = connections[el.ID];
						const nvalues = [];
						if(allValues )
						allValues.forEach(temp =>{
							if(temp && !temp.res.writableEnded && (temp.ID != command.userAuthentification.ID || temp.rank != command.userAuthentification.rank) )
							{
								try
								{
															temp.res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
															,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
															,"Access-Control-Max-Age":'86400'
															,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
								}
								catch(problem)
								{
									console.log(problem);
								}						
								temp.res.write(JSON.stringify({command:"update_added_projects",obj:command.obj.project}));
								nvalues.push(temp);
								//connections[el.ID] = undefined;
								console.log("response to "+el.ID);temp.res.end()
							}
							else if(temp.res.writableEnded && (temp.ID != command.userAuthentification.ID || temp.rank != command.userAuthentification.rank))
							{
								console.log("response to "+el.ID+"differed");
								if(login_id_and_network.responses[el.ID] == undefined )
								{
									login_id_and_network.responses[el.ID] = [{first:{command:"update_added_projects",obj:command.obj.project}
									,reqSource:req.headers.host,reqUserAgent : req.headers['user-agent'],date: new Date(),rank:command.userAuthentification.rank}];
								}
								else
								{
									login_id_and_network.responses[el.ID].push({first:{command:"update_added_projects",obj:command.obj.project}
									,reqSource:req.headers.host,reqUserAgent : req.headers['user-agent'],date: new Date(),rank:command.userAuthentification.rank});
									const count = login_id_and_network.responses[el.ID].length-1;
									const value = login_id_and_network.responses[el.ID][count];
									
									while(count >= 1 && value.date < login_id_and_network.responses[el.ID][count-1].date)
									{
										const swapValue = login_id_and_network.responses[el.ID][count-1];
										login_id_and_network.responses[el.ID][count-1] = value;
										login_id_and_network.responses[el.ID][count] = swapValue;
										++count;
									}
								}
							}
						});
						nvalues.forEach(avalue=>
						{
							allValues.splice(allValues.findIndex(bvalue=> bvalue == avalue),1);
						});
					});
				}
				
				return;
			}
			else
			{	
				console.log("inside");
				model.projects[command.obj.project.rank] = command.obj.project;
				save(model.projects,"projects.txt");
				
				res.write(JSON.stringify({command:"update_added_projects"}));
				res.end();
				
				const values = Object.values(IDs);
				
				if(values)
				{
					values.forEach(el=> 
					{
						let allValues = connections[el.ID];
						const nvalues = [];
						if(allValues && el.ID != command.obj.employee_ID)
						allValues.forEach(temp =>{
							if(temp && !temp.res.writableEnded && (temp.ID != command.userAuthentification.ID || temp.rank != command.userAuthentification.rank) )
							{
								nvalues.push(temp);
								try
								{
									temp.res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
									,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
									,"Access-Control-Max-Age":'86400'
									,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
								}
								catch(problem)
								{
									console.log(problem);
								}															
								temp.res.write(JSON.stringify({command:"update_added_projects",obj:command.obj.project}));
								//connections[el.ID] = undefined;
								console.log("response to "+el.ID);temp.res.end()
							}
							else if(temp.res.writableEnded && (temp.ID != command.userAuthentification.ID || temp.rank != command.userAuthentification.rank) )
							{
								console.log("response to "+el.ID+"differed");
								
								if(login_id_and_network.responses[el.ID] == undefined )
								{
									login_id_and_network.responses[el.ID] = [{first:{command:"update_added_projects",obj:command.obj.project}
									,reqSource:req.headers.host,reqUserAgent : req.headers['user-agent'],date: new Date(),rank:command.userAuthentification.rank}];
								}
								else
								{
									login_id_and_network.responses[el.ID].push({first:{command:"update_added_projects",obj:command.obj.project}
									,reqSource:req.headers.host,reqUserAgent : req.headers['user-agent'],date: new Date(),rank:command.userAuthentification.rank});
									const count = login_id_and_network.responses[el.ID].length-1;
									const value = login_id_and_network.responses[el.ID][count];
									while(count >= 1 && value.date < login_id_and_network.responses[el.ID][count-1].date)
									{
										const swapValue = login_id_and_network.responses[el.ID][count-1];
										login_id_and_network.responses[el.ID][count-1] = value;
										login_id_and_network.responses[el.ID][count] = swapValue;
										++count;
									}
								}
							}
						});
						nvalues.forEach(avalue=>
						{
							allValues.splice(allValues.findIndex(bvalue=> bvalue == avalue),1);
						});
					});
				}
				
				return;
			}
		}
		
		if(command  && command.type == "update_report"  && command.obj && command.obj.ID)
		{
			const emp = model.employees[command.obj.ID];
			const rpI = emp.reports.findIndex(rp => rp.reportRank == command.obj.reportRank);
			if(rpI > -1)
			{
				emp.reports[rpI] = command.obj.report;
				res.write(JSON.stringify({command:"update_report"}));
				res.end();
				save(model.employees,"employees.txt");
				const values = Object.values(IDs);
		
				if(values)
				{
						values.forEach(el=> 
						{
							let allValues = connections[el.ID];
							const nvalues = [];
							if(allValues )
							allValues.forEach(temp =>{
								if(temp && !temp.res.writableEnded && (temp.ID != command.userAuthentification.ID || temp.rank != command.userAuthentification.rank) )
								{
									try
									{
										temp.res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
										,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
										,"Access-Control-Max-Age":'86400'
										,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
									}
									catch(problem)
									{
										console.log(problem);
									}													
									temp.res.write(JSON.stringify({command:"update_report",obj:command.obj}));
									//connections[el.ID] = undefined;
									console.log("response to "+el.ID);temp.res.end()
									nvalues.push(temp);
								}
								else if(temp.res.writableEnded && (temp.ID != command.userAuthentification.ID || temp.rank != command.userAuthentification.rank))
								{
									console.log("response to "+el.ID+"differed");
									if(login_id_and_network.responses[el.ID] == undefined )
									{
										login_id_and_network.responses[el.ID] = [{first:{command:"update_report",obj:command.obj}
										,reqSource:req.headers.host,reqUserAgent : req.headers['user-agent'],date: new Date(),rank:command.userAuthentification.rank}];
									}
									else
									{
										login_id_and_network.responses[el.ID].push({first:{command:"update_report",obj:command.obj}
										,reqSource:req.headers.host,reqUserAgent : req.headers['user-agent'],date: new Date(),rank:command.userAuthentification.rank});
										const count = login_id_and_network.responses[el.ID].length-1;
										const value = login_id_and_network.responses[el.ID][count];
										while(count >= 1 && value.date < login_id_and_network.responses[el.ID][count-1].date)
										{
											const swapValue = login_id_and_network.responses[el.ID][count-1];
											login_id_and_network.responses[el.ID][count-1] = value;
											login_id_and_network.responses[el.ID][count] = swapValue;
											++count;
										}
									}
								}
							});
							nvalues.forEach(avalue=>
							{
								allValues.splice(allValues.findIndex(bvalue=> bvalue == avalue),1);
							});
						});
				}
				return;
			}
		}
		
		if(command  && command.obj && command.obj.project && command.obj.project.rank && command.type == "update-theme-quest")
		{	
			if( command.obj && model.projects[command.obj.project.rank] == undefined )
			{
				let result = model.projects[command.obj.project.rank].themes.find(th => th.rank == command.obj.rank);
				if(result)
				{
					update(result,command.commandArg);
					save(model.projects,"projects.txt");
					let otherThemes = [];
					let empsThemes  =  [];
					Object.Values(model.employees).forEach(emp =>
					{
						emp.themes.forEach(el => {
							if(el.rank == command.obj.rank)
							{
								let theme = el.locality.theme;
								update(theme,command.commandArg);
								save(result,"employee"+emp.ID+".txt");
								otherThemes.push({empID: emp.ID,theme:theme});
								empsThemes.push(el);
							}
						});
					});
					
					res.write(JSON.stringify({command:"update_theme",main:result,empsTheme:empsThemes,empsLocalityThemes:otherThemes}));
					res.end();
					return;
				}
				else
				{						
					res.write(JSON.stringify({res:"No changes"}));
					res.end();
					return;
				}
			}
		}
		
		if(command &&  command.type == "update_project_desc" && command.obj)
		{
			let change = false;
			console.log(command);
			Object.values(model.employees).forEach(el=>{
				if( el.ID == command.obj.employee_ID )
				{
						const foundtheme = emp.themes.find(th=> th.rank == command.obj.themeRank);
						if( foundtheme )
						{
							//console.log("foundtheme");
							const foundSubtheme = foundtheme.subthemes.find(subth=> subth.rank == command.obj.subthemeRank);
							if( foundSubtheme )
							{	
								//console.log("foundsubtheme");
								const question = foundSubtheme.questions.find(qu => qu.rank == command.obj.questionRank);
								if( question )
								{
									question[command.obj.key] = command.obj.value;
									change = true;
								}
							}
						}
				}
			});
			
			if(change)
			{
				const values = Object.values(IDs);
				if(values)
				{
					values.forEach(el=> 
					{
						let allValues = connections[el.ID];
						const nvalues = [];
						if(allValues && el.ID != command.obj.employee_ID)
						allValues.forEach(temp =>{
							if(temp && !temp.res.writableEnded && (temp.ID != command.userAuthentification.ID || temp.rank != command.userAuthentification.rank))
							{
								try
														{
															temp.res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
															,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
															,"Access-Control-Max-Age":'86400'
															,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
														}
														catch(problem)
														{
															console.log(problem);
														}temp.res.write(JSON.stringify({command:"update_project_desc",obj:command.obj}));
								nvalues.push(temp);
								//connections[el.ID] = undefined;
								console.log("response to "+el.ID);temp.res.end();
							}
							else if(temp.res.writableEnded && (temp.ID != command.userAuthentification.ID || temp.rank != command.userAuthentification.rank))
							{
								console.log("response to "+el.ID+"differed");
								
								if(login_id_and_network.responses[el.ID] == undefined )
								{
									login_id_and_network.responses[el.ID] = [{first:{command:"update_project_desc",obj:command.obj}
									,reqSource:req.headers.host,reqUserAgent : req.headers['user-agent'],date: new Date(),rank:command.userAuthentification.rank}];
								}
								else
								{
									login_id_and_network.responses[el.ID].push({first:{command:"update_project_desc",obj:command.obj}
									,reqSource:req.headers.host,reqUserAgent : req.headers['user-agent'],date: new Date(),rank:command.userAuthentification.rank});
									const count = login_id_and_network.responses[el.ID].length-1;
									const value = login_id_and_network.responses[el.ID][count];
									while(count >= 1 && value.date < login_id_and_network.responses[el.ID][count-1].date)
									{
										const swapValue = login_id_and_network.responses[el.ID][count-1];
										login_id_and_network.responses[el.ID][count-1] = value;
										login_id_and_network.responses[el.ID][count] = swapValue;
										++count;
									}
								}
							}
						});
						
						nvalues.forEach(avalue=>
						{
							allValues.splice(allValues.findIndex(bvalue=> bvalue == avalue),1);
						});
					});
				}
				
				res.write(JSON.stringify({command:"update_project_desc",obj:command.obj}));
				res.end();
				
				save(model.employees,"employees.txt");
				return;
			}
		}
		if(command && command.type == "add_list_category_item")
		{
			let changed = false;
			const emp = model.employees[command.obj.employee_ID];
			const account = model.employees[command.userAuthentification.ID]?model.employees[command.userAuthentification.ID]:IDs[command.userAuthentification.ID];
			if(emp)
			{
				const rp = emp.reports.find(rp=>  rp.reportRank == command.obj.reportRank);
					console.log(rp);console.log("responseRank");
					if(rp)
					{
						const foundtheme = rp.project.themes.find(th=> th.rank == command.obj.themeRank);
						if( foundtheme )
						{
							console.log("foundtheme");
							const foundSubtheme = foundtheme.subthemes.find(subth=> subth.rank == command.obj.subthemeRank);
							if( foundSubtheme )
							{	
								console.log("foundsubtheme");
								const question = foundSubtheme.questions.find(qu => qu.rank == command.obj.questionRank);
								if( question )
								{
									console.log("question");
									const listFound = question.list.find(li=> li.rank == command.obj.listRank);
									let tempIndex = 0;
									while(listFound.items.length < command.obj.targetLength)
									{
										listFound.items.push({title:{basic:""},rank:listFound.items.length+1+tempIndex,value:
										{
											textual: "",
											numeric: undefined,
											decimal: undefined,
											birthdate: "",
											password: "",
											GPS1: undefined,
											GPS2: undefined,
											GPS3: undefined,
											GPS1Any: undefined,
											GPS2Any: undefined,
											GPS3Any: undefined,
											email:"",
											checked: false,
											quality:""
										}});
										console.log("list count is "+listFound.items.length);
										console.log("list item added ");
										changed = true;
										//save(model.employees,"employees.txt");
										++tempIndex;
									}
								}
							}
						}
					}
			}		
			if(changed)
			{
				save(model.employees,"employees.txt");
				res.write(JSON.stringify({command:"update_list_category_item"}));
				res.end();
										
				let values = [];
				let account = model.employees[command.userAuthentification.ID]?model.employees[command.userAuthentification.ID]:IDs[command.userAuthentification.ID];
				Object.values(IDs).forEach(curremp => 
				{ 
					if( curremp.admin || (curremp.subadmin && curremp.zone == emp.zone)
					|| (curremp.collector && curremp.ID == emp.ID) )
					{
						values.push(curremp);
					}
											
				});
				console.log(values);
				
				if(values)
				{
					values.forEach(el=> 
					{
												//console.log(el);
											
												let allValues = connections[el.ID]; 
												const nvalues = [];
												
												console.log("Before all values");
												//console.log(allValues);
												//console.log(connections);
												if(allValues)
													allValues.forEach(temp =>{
													console.log(el.ID);
													if(temp && !temp.res.writableEnded && (temp.ID != command.userAuthentification.ID || temp.rank != command.userAuthentification.rank))
													{
														try
														{
															temp.res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
															,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
															,"Access-Control-Max-Age":'86400'
															,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
														}
														catch(problem)
														{
															console.log(problem);
														}const newCommand = {command:"update_list_category_item"};
														Object.assign(newCommand,command);
														console.log(newCommand);
														temp.res.write(JSON.stringify(newCommand));
														//connections[el.ID] = undefined;
														console.log("response to "+el.ID);temp.res.end();
														nvalues.push(temp);
													}																			
													else if(temp.res.writableEnded && (temp.ID != command.userAuthentification.ID || temp.rank != command.userAuthentification.rank))
													{
														console.log("response to "+el.ID+"differed");
								
														const newCommand = {command:"update_list_category_item"};
														Object.assign(newCommand,command);
														
														temp.res.write(JSON.stringify(newCommand ));
														if(login_id_and_network.responses[el.ID] == undefined )
														{
															login_id_and_network.responses[el.ID] = [{first:newCommand 
															,reqSource:req.headers.host,reqUserAgent : req.headers['user-agent'],date: new Date(),rank:command.userAuthentification.rank}];
														}
														else
														{
															login_id_and_network.responses[el.ID].push({first:newCommand 
															,reqSource:req.headers.host,reqUserAgent : req.headers['user-agent'],date: new Date(),rank:command.userAuthentification.rank});
															const count = login_id_and_network.responses[el.ID].length-1;
															const value = login_id_and_network.responses[el.ID][count];
															while(count >= 1 && value.date < login_id_and_network.responses[el.ID][count-1].date)
															{
																const swapValue = login_id_and_network.responses[el.ID][count-1];
																login_id_and_network.responses[el.ID][count-1] = value;
																login_id_and_network.responses[el.ID][count] = swapValue;
																++count;
															}
														}
													}
													
													nvalues.forEach(avalue=>
													{
														allValues.splice(allValues.findIndex(bvalue=> bvalue == avalue),1);
													});
												});
					});
					
					return;					
				}
			}
					
		}
		if(command && command.type == "update_flll_anwer_to_question" && command.obj)
		{
			console.log(command.obj);
			
			let change_command = {};
			const employee = model.employees[command.obj.employee_ID];
			var emps = [employee];
			if(command.obj.All)
			{
				emps = Object.values(model.employees);
			}
			const empBoss = (model.employees[command.userAuthentification.ID])?(model.employees[command.userAuthentification.ID]):IDs[command.userAuthentification.ID];
			console.log("Employee.................");
			console.log(employee);
			change_command["empID"] = command.obj.employee_ID;
			change_command["reportRank"] = command.obj.reportRank;
			change_command["themeRank"] = command.obj.themeRank;
			change_command["subthemeRank"] = command.obj.subthemeRank;
			change_command["questionRank"] = command.obj.questionRank;
			let onceChangedTemp = false;
			for(let i = 0; i < emps.length; ++i)
			{
				let emp = emps[i];
				change_command["changes"] =[];
				console.log(emps.length);
				if( emp )
				{
					if( !emp.reports )
						continue;
					
					const rps = [];
					
					emp.reports.forEach(rp=> 
					{	
						if( ((rp.project.rank == command.obj.projectRank) && command.obj.All) || rp.reportRank == command.obj.reportRank ) 
						{
							rps.push(rp);
							console.log("pushed a report");
						}
					});
					
					console.log(command.obj);
					console.log(rps.length+"***********************************************"+emp.first+"-"+emp.second);
					rps.forEach( (rp,rpindex) =>
					{
							console.log("responseRank must send report "+rp.reportRank);
							
							if(rp)
							{
								const foundtheme = rp.project.themes.find(th=> th.rank == command.obj.themeRank);
								change_command["changes"] =[];
							if( foundtheme )
							{
								console.log("foundtheme");
								const foundSubtheme = foundtheme.subthemes.find(subth=> subth.rank == command.obj.subthemeRank);
								if( foundSubtheme )
								{	
									console.log("foundsubtheme");
									const question = foundSubtheme.questions.find(qu => qu.rank == command.obj.questionRank);
									if( question )
									{
										console.log("question");
									
										let changedTemp = false;
										
										if(command.obj.sliderType)
										{
											change_command["changes"].push({single_value_change:true,change:"value",
											sliderValue:command.obj.sliderValue,sliderType:command.obj.sliderType});
											question.answered = command.obj.sliderValue;
											console.log("answered question");
											changedTemp = true;
										}
										else if(command.obj.changeQuestionType)
										{
											question.type = command.obj.questionType;
											changedTemp = true;
											console.log("changed question type...");
											change_command["changes"].push({changeQuestionType:true,change:"type",questionType:command.obj.questionType});
										}
										else if(command.obj.valueQuestion && command.obj.yesnoType)
										{
											change_command["changes"].push({single_value_change:true,change:"yesno",
											yesnoValue:command.obj.yesnoValue,yesnoType:command.obj.yesnoType});
											question.yes = command.obj.yesnoValue;
											console.log("answered question");
											changedTemp = true;
										}
										else if( command.obj.valueQuestion && !command.obj.multipleValuesReference )
										{
											question.value = command.obj.value;
											changedTemp = true;
											console.log("valueQuestion");
											change_command["changes"].push({single_value_change:true,change:"value",into:command.obj.value});
										}
										else if ( command.obj.valueQuestion && command.obj.multipleValuesReference ) 
										{
											if( question.type.singleChoice)
											{
												if(command.obj.checkedValue)
												{
													const ref = {change:"values",each:[],into:[]};
													change_command["changes"].push(ref);
													question.values.forEach(el=>
													{
														el.checked = false;
														ref.each.push("checked");
														ref.into.push(false);
													});
												}
											}
											
											console.log("valueQuestion with multiple refs");
											question.values[command.obj.index] = command.obj.value;	
											changedTemp = true;	
										}
										else if(command.obj.radioValue)
										{
											if(command.obj.fromRefValues)
											{
												console.log("radioValue with fromRefValues");
												if(command.obj.checkedValue)
												{
													question.values.forEach(item,aindex=> 
													{
														const ref = {change:"values",each:[],into:[],indexedSpecially: true,specialIndex:command.obj.index,indexedSpeciallyValue:command.obj.value};
														change_command["changes"].push(ref);
														if(item.checked)
														{
															item.checked = false;
															changedTemp = true;
															//ref.each.push("checked");
															//ref.into.push(false);
														}
													});
												}
												question.values[command.obj.index] = command.obj.modelValue;	
												changedTemp = true;
											}
											else
											{
												
												console.log("radioValue without fromRefValues");
												console.log(command.obj);
												console.log(2397);
												if(command.obj.checkedValue)
												{
													console.log("Inside checkedValue");
													console.log(question.items[command.obj.index]);
													const ref = {change:"items",each:[],into:[],indexedSpecially: true,specialIndex:command.obj.index,
													indexedSpeciallyValue:command.obj.value};
													change_command["changes"].push(ref);
													
													if(command.obj.modelValue.checked)
													{
														question.items.forEach(item=> 
														{
															item.checked = false;
															changedTemp = true;		
															//ref.each.push("checked");
															//ref.into.push(false);	
														});
													}
												}
												question.items[command.obj.index] = command.obj.modelValue;
												console.log(command.obj.modelValue);
												console.log("Item given");changedTemp = true;
											}
										}
										else if(command.obj.checkValue)
										{
											if(command.obj.fromRefValues)
											{
												console.log("checkValue with fromRefValues");
												question.values[command.obj.index] = command.obj.modelValue;	
												change_command["changes"].push({change:"values",indexed:true,index:command.obj.index,into:command.obj.modelValue});
											}
											else
											{
												question.items[command.obj.index] = command.obj.modelValue;	
												console.log(command.obj);
												console.log("checkValue without fromRefValues");
												console.log(question.items[command.obj.index] );
												change_command["changes"].push({change:"items",indexed:true,index:command.obj.index,into:command.obj.modelValue});
											}
											changedTemp = true;
										}
										else if (command.obj.listQuestion) 
										{
											console.log(question.list[command.obj.outterIndex].items.length); console.log("****************************");
											question.list[command.obj.outterIndex].items[command.obj.index].value = command.obj.value;			
											change_command["changes"].push({nested:[{prop:"list",index:command.obj.outterIndex},{prop:"items",index:command.obj.index,value:"value",into:command.obj.value}]});
											changedTemp = true;
										}
										
										
										if(changedTemp)
										{
											if(!onceChangedTemp)
											{
												onceChangedTemp = true;
												res.write(JSON.stringify({command:"updated_flll_anwer_to_question"}));
												res.end();
											}
											console.log("saved to model");
											save(model.employees,"employees.txt");
											
											let values = [];
											Object.values(IDs).forEach(curremp => 
											{ 
												if( curremp.admin || (curremp.subadmin && curremp.zone == emp.zone)
													|| (curremp.collector && curremp.ID== emp.ID) )
												{
													values.push(curremp);
												}
												
											});
											//console.log(values);
											if(values)
											{
												values.forEach(el=> 
												{
													//console.log(el);
												
													let allValues = connections[el.ID]; 
													//console.log("Before all values");
													const nvalues = [];
													//console.log(allValues);
													//console.log(connections);
													if( login_id_and_network.loggins[el.ID] )
													{
														//rank:command.obj.rank,reqSource:req.headers.host,reqUserAgent : req.headers['user-agent'],date: new Date()
														login_id_and_network.loggins[el.ID].forEach( el2 => 
														{
															const foundValue = (allValues)?allValues.find( val => val.rank == el2.rank && val.ID == el2.ID ):undefined;
															if( !foundValue ) 
															{
																const change_command_copy = JSON.parse(JSON.stringify(change_command));
																if(command.obj.All)
																{
																	change_command_copy["empID"] = el.ID;
																	change_command_copy["reportRank"] = rp.reportRank;
																}
																
																if(login_id_and_network.responses[el.ID] == undefined )
																{
																	login_id_and_network.responses[el.ID] = [{first:{command:"updated_flll_anwer_to_question",change_commands:change_command_copy}
																	,reqSource:el2.reqSource,reqUserAgent : el2.reqUserAgent,date: new Date(),rank:el2.rank}];
																	
																	setTimeout(()=>{ login_id_and_network.responses[el.ID].splice(login_id_and_network.responses[el.ID].indexOf(login_id_and_network.responses[el.ID]),1);},30000);
																}
																else
																{
																	login_id_and_network.responses[el.ID].push({first:{command:"updated_flll_anwer_to_question",change_commands:change_command_copy}
																	,reqSource:el2.reqSource,reqUserAgent : el2.reqUserAgent,date: new Date(),rank:el2.rank});
																	const count = login_id_and_network.responses[el.ID].length-1;
																	const value = login_id_and_network.responses[el.ID][count];
																	while(count >= 1 && value.date < login_id_and_network.responses[el.ID][count-1].date)
																	{
																		const swapValue = login_id_and_network.responses[el.ID][count-1];
																		login_id_and_network.responses[el.ID][count-1] = value;
																		login_id_and_network.responses[el.ID][count] = swapValue;
																		++count;
																	}
																	setTimeout(()=>{ login_id_and_network.responses[el.ID].splice(login_id_and_network.responses[el.ID].indexOf(login_id_and_network.responses[el.ID]),1);},30000);
																}
																console.log("loggedIn guy added");
																console.log(" report "+change_command_copy["reportRank"]+" saved for "+ change_command_copy["empID"]);
																	
															}
														});
													}
													
													if(allValues)
													{
														allValues.forEach(temp =>{
															console.log(el.ID);
															//console.log(temp.ID);
															//console.log(command.userAuthentification.ID);
															console.log(temp.rank);
															console.log(command.userAuthentification.rank);
															if(temp && !temp.res.writableEnded && (temp.ID != command.userAuthentification.ID || temp.rank != command.userAuthentification.rank))
															{
																try
																{
																	temp.res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
																	,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
																	,"Access-Control-Max-Age":'86400'
																	,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
																}
																catch(problem)
																{
																	console.log(problem);
																}
																
																if(command.obj.All)
																{
																	change_command["empID"] = el.ID;
																	change_command["reportRank"] = rp.reportRank;
																}
																
																temp.res.write(JSON.stringify({command:"updated_flll_anwer_to_question",change_commands:change_command}));
																//connections[el.ID] = undefined;
																console.log("response to "+temp.ID);temp.res.end();
																nvalues.push(temp);
															}																			
															else if(temp.res.writableEnded && (temp.ID != command.userAuthentification.ID || temp.rank != command.userAuthentification.rank))
															{
																console.log("response to "+temp.ID+" differed");
																if(command.obj.All)
																{
																	change_command["empID"] = temp.ID;
																	change_command["reportRank"] = rp.reportRank;
																}
																if(login_id_and_network.responses[temp.ID] == undefined )
																{
																	login_id_and_network.responses[temp.ID] = [{first:{command:"updated_flll_anwer_to_question",change_commands:change_command}
																	,reqSource:temp.reqSource,reqUserAgent : temp.reqUserAgent,date: new Date(),rank:temp.rank}];
																}
																else
																{
																	login_id_and_network.responses[temp.ID].push({first:{command:"updated_flll_anwer_to_question",change_commands:change_command}
																	,reqSource:temp.reqSource,reqUserAgent : temp.reqUserAgent,date: new Date(),rank:temp.rank});
																	const count = login_id_and_network.responses[temp.ID].length-1;
																	const value = login_id_and_network.responses[temp.ID][count];
																	while(count >= 1 && value.date < login_id_and_network.responses[temp.ID][count-1].date)
																	{
																		const swapValue = login_id_and_network.responses[temp.ID][count-1];
																		login_id_and_network.responses[temp.ID][count-1] = value;
																		login_id_and_network.responses[temp.ID][count] = swapValue;
																		++count;
																	}
																}
																
															}});
														
														nvalues.forEach(avalue=>
														{
															allValues.splice(allValues.findIndex(bvalue=> bvalue == avalue),1);
															console.log("splicing don2");
														});
													}
													
												});
											}
										}
										else
										{
											res.write(JSON.stringify({command:"no changes"}));
											res.end();
										}
										
									}
								}
							}
						}
					});
				}
			}
			
			if(onceChangedTemp)
			{
				return;
			}
		}
		
		if(command && command.type == "link-employee-report-to-locality")
		{
			let emp = model.employees[command.obj.emp.ID];
			if(emp)
			{
				const projectResult = model.projects.find(pj=> pj.rank == command.obj.reportRank);
				if(projectResult)
				{
					emp.reports.projectLocality = command.obj.projectLocality;
					save(model.employees,"employees.txt");
					res.write(JSON.stringify({command:"link-employee-report-to-locality"}));
					res.end();
					const values = Object.values(IDs).filter(emp => emp.admin || (emp.subadmin && emp.zone == model.employees[emp.ID].zone) || emp.ID == command.obj.emp.ID );
					
					if(values)
					{
							values.forEach(el=> 
							{
								let allValues = connections[el.ID];
								const nvalues = [];
								if(allValues)
								allValues.forEach(temp =>{
									if(temp && !temp.res.writableEnded && (temp.ID != command.userAuthentification.ID || temp.rank != command.userAuthentification.rank))
									{
										try
														{
															temp.res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
															,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
															,"Access-Control-Max-Age":'86400'
															,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
														}
														catch(problem)
														{
															console.log(problem);
														}
										temp.res.write(JSON.stringify({command:"link-employee-report-to-locality",obj:{emp:command.obj.emp,reportLocality:command.obj.projectLocality,reportRank:command.obj.reportRank}}));
										//connections[el.ID] = undefined;
										console.log("response to "+el.ID);
										temp.res.end();
										nvalues.push(temp);
									}
									else if(temp.res.writableEnded && (temp.ID != command.userAuthentification.ID || temp.rank != command.userAuthentification.rank))
									{
										console.log("response to "+el.ID+"differed");
								
										if(login_id_and_network.responses[el.ID] == undefined )
										{
											login_id_and_network.responses[el.ID] = [{first:{command:"link-employee-report-to-locality",obj:{emp:command.obj.emp,reportLocality:command.obj.projectLocality,reportRank:command.obj.reportRank}}
											,reqSource:req.headers.host,reqUserAgent : req.headers['user-agent'],date: new Date(),rank:command.userAuthentification.rank}];
										}
										else
										{
											login_id_and_network.responses[el.ID].push({first:{command:"link-employee-report-to-locality",obj:{emp:command.obj.emp,reportLocality:command.obj.projectLocality,reportRank:command.obj.reportRank}}
											,reqSource:req.headers.host,reqUserAgent : req.headers['user-agent'],date: new Date(),rank:command.userAuthentification.rank});
											const count = login_id_and_network.responses[el.ID].length-1;
											const value = login_id_and_network.responses[el.ID][count];
											while(count >= 1 && value.date < login_id_and_network.responses[el.ID][count-1].date)
											{
												const swapValue = login_id_and_network.responses[el.ID][count-1];
												login_id_and_network.responses[el.ID][count-1] = value;
												login_id_and_network.responses[el.ID][count] = swapValue;
												++count;
											}
										}
									}
							
															
								});
								nvalues.forEach(avalue=>
								{
									allValues.splice(allValues.findIndex(bvalue=> bvalue == avalue),1);
								});
							});
					}
					return;
				}
			}
		}
		
		if(command && command.type == "link-employee-to-project")
		{
			let emp = model.employees[command.obj.emp.ID];
			console.log(command.obj.emp.ID);
			console.log(emp);
			if(emp)
			{
				const projectResult = Object.values(model.projects).find(pj=> pj.rank == command.obj.projectRank);
				if(projectResult)
				{
					if(!emp.reports)
					{
						emp.reports = [];
					}
					const rank_of_projects = emp.reports.length+1;
					emp.reports.push( {reportRank: rank_of_projects, projectLocality:undefined,project: JSON.parse(JSON.stringify(projectResult)) });
					res.write(JSON.stringify({command:"update-link-employee-to-project",obj:{reportRank:rank_of_projects,projectRank:command.obj.projectRank}}));
					res.end();
					console.log("link-employee-to-project successfull");
					save(model.employees,"employees.txt");
					const values = Object.values(IDs).filter(newemp => newemp.admin || (newemp.subadmin && model.employees[newemp.ID]  && newemp.zone 
					==  model.employees[newemp.ID].zone) || emp.ID == command.obj.emp.ID );
					
					if(values)
					{
							values.forEach(el=> 
							{
								let allValues = connections[el.ID];
								const nvalues = [];
								if(allValues)
								allValues.forEach(temp =>{
									if(temp && !temp.res.writableEnded && (temp.ID != command.userAuthentification.ID || temp.rank != command.userAuthentification.rank))
									{
										try
														{
															temp.res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
															,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
															,"Access-Control-Max-Age":'86400'
															,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
														}
														catch(problem)
														{
															console.log(problem);
														}
										temp.res.write(JSON.stringify({command:"update-link-employee-to-project",obj:{emp:command.obj.emp,reportRank:rank_of_projects,projectRank:command.obj.projectRank}}));
										//connections[el.ID] = undefined;
										console.log("response to "+el.ID);
										temp.res.end();
										nvalues.push(temp);
									}
									else if(temp.res.writableEnded && (temp.ID != command.userAuthentification.ID || temp.rank != command.userAuthentification.rank))
									{
										console.log("response to "+el.ID+"differed");
								
										if(login_id_and_network.responses[el.ID] == undefined )
										{
											login_id_and_network.responses[el.ID] = [{first:{command:"update-link-employee-to-project",obj:{emp:command.obj.emp,reportRank:rank_of_projects,projectRank:command.obj.projectRank}}
											,reqSource:req.headers.host,reqUserAgent : req.headers['user-agent'],date: new Date(),rank:command.userAuthentification.rank}];
										}
										else
										{
											login_id_and_network.responses[el.ID].push({first:{command:"update-link-employee-to-project",obj:{emp:command.obj.emp,reportRank:rank_of_projects,projectRank:command.obj.projectRank}}
											,reqSource:req.headers.host,reqUserAgent : req.headers['user-agent'],date: new Date(),rank:command.userAuthentification.rank});
											const count = login_id_and_network.responses[el.ID].length-1;
											const value = login_id_and_network.responses[el.ID][count];
											while(count >= 1 && value.date < login_id_and_network.responses[el.ID][count-1].date)
											{
												const swapValue = login_id_and_network.responses[el.ID][count-1];
												login_id_and_network.responses[el.ID][count-1] = value;
												login_id_and_network.responses[el.ID][count] = swapValue;
												++count;
											}
										}
									}
								});
								
								nvalues.forEach(avalue=>
								{
									allValues.splice(allValues.findIndex(bvalue=> bvalue == avalue),1);
								});
							});
					}
					return;
				}				
			}
		}
		
		if( command && command.type == "link-employee-theme-location" && command.obj && command.obj.emp
			&& command.obj.theme && command.obj.locality)
		{
			let result = model.employees[command.obj.emp.ID];
			let account = model.employees[command.obj.emp.ID];
			if(result)
			{
				let resulttheme = result.themes.find(th=> 
				th.rank == command.obj.theme.rank && ( th.locality.country == command.obj.theme.country && th.locality.region == command.obj.theme.region
				&& th.locality.department == command.obj.theme.department && th.locality.commune == command.obj.theme.commune && th.locality.street == command.obj.theme.street) );
				
				if(resulttheme)
				{
					console.log("Theme already existant");
					result.themes[result.themes.indexOf(resulttheme)] = command.obj.theme;
					command.obj.theme.locality = command.obj.locality; 
					save(model.employees,"employees.txt");
					res.write(JSON.stringify({command:"update_employee_projects",obj:{thRank:command.obj.theme.rank,locality:resulttheme.locality,ID:command.obj.emp.ID}}));
					res.end();
					
					const values = Object.values(IDs).filter(emp => emp.admin || emp.subadmin || model.employees[emp.ID].find(aEmp=>   aEmp.themes.find(th=>  th.rank == command.obj.themeRank) != undefined) != undefined );
					
					if(values)
					{
						values.forEach(el=> 
						{
							let allValues = connections[el.ID];
							const nvalues = [];
							if(allValues )
							allValues.forEach(temp =>{
								if(temp && !temp.res.writableEnded && (temp.ID != command.userAuthentification.ID || temp.rank != command.userAuthentification.rank))
								{
									try
														{
															temp.res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
															,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
															,"Access-Control-Max-Age":'86400'
															,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
														}
														catch(problem)
														{
															console.log(problem);
														} 
									temp.res.write(JSON.stringify({command:"update_employee_projects",obj:{theme: command.obj.theme,thRank:command.obj.theme.rank,locality:command.obj.locality,ID:command.obj.emp.ID}}));
									//connections[el.ID] = undefined;
									console.log("response to "+el.ID);temp.res.end();
									nvalues.push(temp);
								}
								else if(temp.res.writableEnded && (temp.ID != command.userAuthentification.ID || temp.rank != command.userAuthentification.rank))
								{
									console.log("response to "+el.ID+"differed");
								
									if(login_id_and_network.responses[el.ID] == undefined )
									{
											login_id_and_network.responses[el.ID] = [{first:{command:"update_employee_projects",obj:{theme: command.obj.theme,thRank:command.obj.theme.rank,locality:command.obj.locality,ID:command.obj.emp.ID}}
											,reqSource:req.headers.host,reqUserAgent : req.headers['user-agent'],date: new Date(),rank:command.userAuthentification.rank}];
									}
									else
									{
											login_id_and_network.responses[el.ID].push({first:{command:"update_employee_projects",obj:{theme: command.obj.theme,thRank:command.obj.theme.rank,locality:command.obj.locality,ID:command.obj.emp.ID}}
											,reqSource:req.headers.host,reqUserAgent : req.headers['user-agent'],date: new Date(),rank:command.userAuthentification.rank});
											const count = login_id_and_network.responses[el.ID].length-1;
											const value = login_id_and_network.responses[el.ID][count];
											while(count >= 0 && value.date < login_id_and_network.responses[el.ID][count-2].date)
											while(count >= 1 && value.date < login_id_and_network.responses[el.ID][count-1].date)
											{
												const swapValue = login_id_and_network.responses[el.ID][count-1];
												login_id_and_network.responses[el.ID][count-1] = value;
												login_id_and_network.responses[el.ID][count] = swapValue;
												++count;
											}
									}
								}
							});
							nvalues.forEach(avalue=>
							{
								allValues.splice(allValues.findIndex(bvalue=> bvalue == avalue),1);
							});
						});
					}
					return;
									
				}
				else
				{
					let copy = JSON.parse(JSON.stringify(command.obj.theme));
					command.obj.theme.locality = command.obj.locality; 
					command.obj.theme.locality.theme = copy; 
					console.log("Theme not already existant");
					result.themes.push(command.obj.theme);
					save(model.employees,"employees.txt");
					res.write(JSON.stringify({command:"update_employee_projects",obj:{theme: command.obj.theme,thRank:command.obj.theme.rank,locality:command.obj.theme.locality,ID:command.obj.emp.ID}}));
					res.end();
					
					const values =[];
					Object.values(IDs).forEach(emp => 
					{
						console.log(emp);
						if(emp.admin || emp.subadmin || (model.employees[emp.ID] && model.employees[emp.ID].themes && model.employees[emp.ID].themes.find(th=>  th.rank == command.obj.themeRank) != undefined)  )
						{
							values.push(emp);
						}
					});
					
					if(values)
					{
						values.forEach(el=> 
						{
							let allValues = connections[el.ID];
							const nvalues = [];
							if(allValues)
							allValues.forEach(temp =>{
								if(temp && !temp.res.writableEnded && (temp.ID != command.userAuthentification.ID || temp.rank != command.userAuthentification.rank) )
								{
									try
														{
															temp.res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
															,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
															,"Access-Control-Max-Age":'86400'
															,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
														}
														catch(problem)
														{
															console.log(problem);
														}
									temp.res.write(JSON.stringify({command:"update_employee_projects",obj:{theme: command.obj.theme,
									thRank:command.obj.theme.rank,locality:command.obj.locality,ID:command.obj.emp.ID}}));
									//connections[el.ID] = undefined;
									console.log("response to "+el.ID);temp.res.end();
									nvalues.push(temp);
								}
								else if(temp.res.writableEnded && (temp.ID != command.userAuthentification.ID || temp.rank != command.userAuthentification.rank))
								{
									console.log("response to "+el.ID+"differed");
								
									if(login_id_and_network.responses[el.ID] == undefined )
									{
										login_id_and_network.responses[el.ID] = [{first:{command:"update_employee_projects",obj:{theme: command.obj.theme,
										thRank:command.obj.theme.rank,locality:command.obj.locality,ID:command.obj.emp.ID}}
										,reqSource:req.headers.host,reqUserAgent : req.headers['user-agent'],date: new Date(),rank:command.userAuthentification.rank}];
									}
									else
									{
											login_id_and_network.responses[el.ID].push({first:{command:"update_employee_projects",obj:{theme: command.obj.theme,
											thRank:command.obj.theme.rank,locality:command.obj.locality,ID:command.obj.emp.ID}}
											,reqSource:req.headers.host,reqUserAgent : req.headers['user-agent'],date: new Date(),rank:command.userAuthentification.rank});
											const count = login_id_and_network.responses[el.ID].length-1;
											const value = login_id_and_network.responses[el.ID][count];
											while(count >= 1 && value.date < login_id_and_network.responses[el.ID][count-1].date)
											{
												const swapValue = login_id_and_network.responses[el.ID][count-1];
												login_id_and_network.responses[el.ID][count-1] = value;
												login_id_and_network.responses[el.ID][count] = swapValue;
												++count;
											}
									}
								}
							});
							
							nvalues.forEach(avalue=>
							{
								allValues.splice(allValues.findIndex(bvalue=> bvalue == avalue),1);
							});
							
						});
					}
									
					return;
				}
			}
			else
			{
				res.write(JSON.stringify({res:"No changes"}));
				res.end();
				return;
			}
			
			res.write(JSON.stringify({res:"No changes"}));
			res.end();
			return;
		}
		
		if(command.type == "login-quest")
		{	
			if(IDs[command.obj.ID] && command.obj.pass == getPassword())
			{
				if(!login_id_and_network.loggins[command.obj.ID])
				{
					login_id_and_network.loggins[command.obj.ID] = [];
				}	
				
				var index = 0;
				do
				{
					++index;
				}
				while(login_id_and_network.loggins[command.obj.ID].find(el=> el.rank == index));
				
				login_id_and_network.loggins[command.obj.ID].push({rank:index,
				reqSource:req.headers.host,
				reqUserAgent : req.headers['user-agent'],
				date: new Date(),ID:command.obj.ID});
				console.log(login_id_and_network.loggins);
				res.write(JSON.stringify({loggedIn:true,obj:IDs[command.obj.ID],rank:index}));
				res.end();
				return;
			}
			
			res.write(JSON.stringify({loggedIn:false}));
			res.end();
			return;
		}
		
		if(command.type == "add-locality-object" && command.obj)
		{
			if(!model.localities.find( loc => 
			
				loc.country == command.obj.country && loc.region == command.obj.region && loc.department == command.obj.department 
				&& loc.commune == command.obj.commune && loc.street == command.obj.street
			))
			{
				model.localities.push(command.obj);
				save(model.localities,"localities.txt");
				
				
				res.write(JSON.stringify({command:"update_localities"}));
				res.end();
				
				const values = Object.values(IDs).filter(emp => emp.admin );
				
				if(values)
				{
					values.forEach(el=> 
					{
						const temp = connections[el.ID];
						let allValues = connections[el.ID];
						const nvalues = [];
						if(allValues && el.ID != command.obj.employee_ID)
							allValues.forEach(temp => {
								
							if(temp && !temp.res.writableEnded && (temp.ID != command.userAuthentification.ID || temp.rank != command.userAuthentification.rank))
							{
								try
														{
															temp.res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
															,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
															,"Access-Control-Max-Age":'86400'
															,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
														}
														catch(problem)
														{
															console.log(problem);
														}
								temp.res.write(JSON.stringify({command:"add-locality-object",obj:command.obj}));
								
								connections[el.ID] = undefined;
								console.log("response to "+el.ID);temp.res.end();
								nvalues.push(temp);
							}
							else if(temp.res.writableEnded && (temp.ID != command.userAuthentification.ID || temp.rank != command.userAuthentification.rank))
							{
								console.log("response to "+el.ID+"differed");
								
								if(login_id_and_network.responses[el.ID] == undefined )
								{
									login_id_and_network.responses[el.ID] = [{first:{command:"add-locality-object",obj:command.obj}
									,reqSource:req.headers.host,reqUserAgent : req.headers['user-agent'],date: new Date(),rank:command.userAuthentification.rank}];
								}
								else
								{
									login_id_and_network.responses[el.ID].push({first:{command:"add-locality-object",obj:command.obj}
									,reqSource:req.headers.host,reqUserAgent : req.headers['user-agent'],date: new Date(),rank:command.userAuthentification.rank});
									const count = login_id_and_network.responses[el.ID].length-1;
									const value = login_id_and_network.responses[el.ID][count];
									while(count >= 1 && value.date < login_id_and_network.responses[el.ID][count-1].date)
									{
										const swapValue = login_id_and_network.responses[el.ID][count-1];
										login_id_and_network.responses[el.ID][count-1] = value;
										login_id_and_network.responses[el.ID][count] = swapValue;
										++count;
									}
								}
							}
							
							});
							
							nvalues.forEach(avalue=>
							{
								allValues.splice(allValues.findIndex(bvalue=> bvalue == avalue),1);
							});
					});
				}
									
				
				return;
			}
			else
			{
				res.write(JSON.stringify({res:"No changes"}));
				res.end();
				return;
			}
		}
		if(command.type == "assign_to_subadmin" && command.obj)
		{
			if(!model.employees[command.obj.ID])
			{
				const emp = model.subadmins[command.obj.subadmin.ID];
				if(IDs[command.obj.subadmin.ID].subadmin)
				{
					console.log(command.obj.subadmin.ID+" found");
					if(!emp.employees)
					{
						emp.employees = [];
						emp.employees.push(command.obj.newemp);
						save(model.subadmins,"subadmins.txt");
					}
					else if (!emp.employees.find(emp=> emp.ID == command.obj.newemp.ID))
					{
						emp.employees.push(command.obj.newemp);
						save(model.subadmins,"subadmins.txt");
					}
					
					const values = Object.values(IDs).filter(emp => emp.admin || ( emp.subadmin && emp.ID == command.obj.subadmin.ID ) ) ;
					
					if(values)
					{
						console.log(values);
						values.forEach(el=> 
						{
							const allValues = connections[el.ID];
							const nvalues = [];
							if(allValues)
							{
								allValues.forEach(temp => {
									if(temp && !temp.res.writableEnded &&  (temp.ID != command.userAuthentification.ID || temp.rank != command.userAuthentification.rank))
									{
										console.log(el.ID);
										try
														{
															temp.res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
															,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
															,"Access-Control-Max-Age":'86400'
															,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
														}
														catch(problem)
														{
															console.log(problem);
														}
										temp.res.write(JSON.stringify({command:"assign_to_subadmin",obj:command.obj}));
										
										connections[el.ID] = undefined;
										temp.res.end();
										nvalues.push(temp);
									}											
									else if(temp.res.writableEnded && (temp.ID != command.userAuthentification.ID || temp.rank != command.userAuthentification.rank))
									{
										console.log("response to "+el.ID+"differed");
								
										if(login_id_and_network.responses[el.ID] == undefined )
										{
											login_id_and_network.responses[el.ID] = [{first:{command:"assign_to_subadmin",obj:command.obj}
											,reqSource:req.headers.host,reqUserAgent : req.headers['user-agent'],date: new Date(),rank:command.userAuthentification.rank}];
										}
										else
										{
											login_id_and_network.responses[el.ID].push({first:{command:"assign_to_subadmin",obj:command.obj}
											,reqSource:req.headers.host,reqUserAgent : req.headers['user-agent'],date: new Date(),rank:command.userAuthentification.rank});
											while(count >= 1 && value.date < login_id_and_network.responses[el.ID][count-1].date)
											{
												const swapValue = login_id_and_network.responses[el.ID][count-1];
												login_id_and_network.responses[el.ID][count-1] = value;
												login_id_and_network.responses[el.ID][count] = swapValue;
												++count;
											}
										}
									}
								});
								
								nvalues.forEach(avalue=>
								{
										allValues.splice(allValues.findIndex(bvalue=> bvalue == avalue),1);
								});
							}
						});
					}
									
					return;
				}
				else
				{
					console.log(command.obj.subadmin.ID+" not found");
					res.write(JSON.stringify({res:"No changes"}));
					res.end();
					return;
				}
			}
		}
		if(command.type == "add-emp-object" && command.obj)
		{
			if(!model.employees[command.obj.ID])
			{
				let guy = {ID:command.obj.ID,password:password,first: command.obj.first, second: command.obj.second,
				gender:command.obj.gender ,admin:command.obj.admin == "admin",
				subadmin:command.obj.admin == "subadmin",collector:command.obj.admin == "collector"};
				guy.zone = command.obj.zone;
				/*
				command.obj.admin = guy.admin;
				command.obj.subadmin = guy.subadmin;
				command.obj.collector = guy.collector;
				command.obj.themes = [];
				*/
				
				add(guy);
				console.log(command.obj);
				console.log(guy);
				model.employees[command.obj.ID] = guy;
				
				if(guy.collector)
				{
					guy.reports = [];
				}
				
				save(model.employees,"employees.txt");
				save(IDs,"IDs.txt");
				
				if(guy.subadmin)
				{
					if(!model.subadmins[command.obj.ID])
					{
						model.subadmins[command.obj.ID] = guy;
					}
					save(model.subadmins,"subadmins.txt");	
				}
				
				guy.themes = [];
				res.write(JSON.stringify({command:"update_employees",collector:guy.collector,obj:guy}));
				res.end();
				
				const values = Object.values(IDs).filter(emp => emp.admin );
				
				if(values)
				{
					values.forEach(el=> 
					{
						const allValues = connections[el.ID];
						const nvalues = [];
						if(allValues)
						{
							allValues.forEach(temp => {
								if(temp && !temp.res.writableEnded && (temp.ID != command.userAuthentification.ID || temp.rank != command.userAuthentification.rank))
								{
									try
														{
															temp.res.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
															,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
															,"Access-Control-Max-Age":'86400'
															,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
														}
														catch(problem)
														{
															console.log(problem);
														}
									temp.res.write(JSON.stringify({command:"update_employees",obj:guy}));
									
									connections[el.ID] = undefined;
									console.log("response to "+el.ID);temp.res.end();
									nvalues.push(temp);
								}
								else if(temp.res.writableEnded && (temp.ID != command.userAuthentification.ID || temp.rank != command.userAuthentification.rank))
								{
										console.log("response to "+el.ID+"differed");
								
										if(login_id_and_network.responses[el.ID] == undefined )
										{
											login_id_and_network.responses[el.ID] = [{first:{command:"update_employees",obj:guy}
											,reqSource:req.headers.host,reqUserAgent : req.headers['user-agent'],date: new Date(),rank:command.userAuthentification.rank}];
										}
										else
										{
											login_id_and_network.responses[el.ID].push({first:{command:"update_employees",obj:guy}
											,reqSource:req.headers.host,reqUserAgent : req.headers['user-agent'],date: new Date(),rank:command.userAuthentification.rank});
											while(count >= 0 && value.date < login_id_and_network.responses[el.ID][count-2].date)
											{
												const swapValue = login_id_and_network.responses[el.ID][count-2];
												login_id_and_network.responses[el.ID][count-2] = value;
												login_id_and_network.responses[el.ID][count-1] = swapValue;
												--count;
											}
										}
								}
							});
							nvalues.forEach(avalue=>
								{
									allValues.splice(allValues.findIndex(bvalue=> bvalue == avalue),1);
								});
						}
					});
				}
									
				
				return;
			}
			
			res.write(JSON.stringify({res:"No changes"}));
			res.end();
			return;
		}
		
		if(command.type == "update-quest" && command.obj.pass == getPassword())
		{
			const startDate = new Date();
			if(IDs[command.obj.ID].admin)
			{
				res.write(JSON.stringify({obj:{ employees:Object.values(model.employees),
					localities:Object.values(model.localities),
					projects: Object.values(model.projects),
					subadmins: Object.values(model.subadmins),
					zones: model.zones
				}}));
			}
			else
			{
			
				//projects: Object.values(model.projects).filter(el=> el.themes.find(th=>  model.employees[command.obj.ID].themes.find(th2 => th2.rank == th.rank) != undefined) != undefined ), 
					
				const response = {obj:{ employees:Object.values(model.employees),
					localities: Object.values(model.localities),
					projects: Object.values(model.projects), 
					subadmins: Object.values(model.subadmins),
					zones: model.zones
				}};
				
				if(!response.projects)
				{
					response.projects = [];
				}
				
				res.write(JSON.stringify(response));
			}
			
			if(login_id_and_network.responses[command.obj.ID])
			{
				var respValues = login_id_and_network.responses[command.obj.ID].filter(el=> el.reqSource != req.headers.host || req.headers['user-agent'] != el.reqUserAgent || el.date > startDate ); 
				login_id_and_network.responses[command.obj.ID] = respValues;
			}
				
			res.end();
			return;
		}
		
		res.write(JSON.stringify({res:"Hey Looser..."}));
		res.end();
		
	}


	function add(guy)
	{
		let result = Object.keys(IDs).find(el => (IDs[el].password == password == guy.password) &&  el == guy.ID);
		if(!result && guy.password == password)
		{
			IDs[guy.ID] = guy;
		}
	}

	function update(given,commands)
	{
		let curr = given;
		commands.forEach( el => 
		{
			if( el.set )
			{
				curr[el.setKey] = el.setValue;
			}
			else if( el.find)
			{
				curr = curr[el.findKey];
			}
		});
	}

	function save(object,fname)
	{
		fs.writeFile(fname,JSON.stringify(object),(err,res)=>
		{
			if(err)
			{
				console.log(err);
				setTimeout(save,1000,object,fname);
			}
		});
	}

	function read(fname)
	{
		if(fs.existsSync(fname))
		{
			let data = fs.readFileSync(fname,'utf8');
			if(data.length > 0)
			{
				const object = JSON.parse(data);
				console.log(object);
				return object;
			}
		}
		return undefined;
	}
	
	function getPassword() 
	{
			return "ADOBE";
	}
	
	function FillOneTheme(ID,project)
	{
		const rps = model.employees[ID].reports.filter( rp => rp.project.rank == project.rank );
		var change = false;
		rps.forEach(rp=>
		{
			rp.project.themes = JSON.parse(JSON.stringify(project.themes));
			rp.themes = undefined;
			console.log("Found report");
			change = true;
		});
		
		if( change === true )
		{
			save(model.employees,"employees.txt");
		}
		
	}