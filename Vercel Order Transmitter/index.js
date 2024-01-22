	const net = require('node:net');
	const http = require('http');
	const {SplitLongString,store_values} = require('./Test.js');
	const formidable = require('formidable');
	
	let client = undefined;
	let hostname = "localhost";
	var httpsListDics = {'X':[],'Y':[],'G':[],'L':[]};
	var formshttpsListDics = {'X':[],'Y':[],'G':[],'L':[]};
	var socketConnectionListDics = {'X':[],'Y':[],'G':[],'L':[]};
	var circle_count = 0;
	var circle_value_correspondance = ['X','Y','G','L'];
	var values_received = {};
	var conduitResponses = {};
	var conduitRequests = {};
	var clients =  [];
	var clients_other = [];
	var addresses = {};
	var clients_closed = [];
	var main = undefined;
	var main_third_other = undefined;
	var main_send_form_client = undefined;
	var httpslength = 0;
	var formshttpsLength = 0;
	var ACKS = {};
	var mainServerHTTP = undefined;
	var mainServerHTTPConnectionsLists = {'X':[],'Y':[],'G':[],'L':[]};
	var lengthofHTTPConnectionsLists = 0;
	var all_http = true;
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	var dopePWD = dopePWD = "UIOJJirofjoijjjkjvjhhjkjoihifdddsreduhftygjufyihre7hdtjo;gs4wyjs65ugr7oknf";
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	setInterval(()=>
	{
		Object.keys(mainServerHTTPConnectionsLists).forEach((keyelement)=>
		{
			let initialValue = [];
			try{
				mainServerHTTPConnectionsLists[keyelement].forEach((value)=>
				{
					if(value.writableEnded)
					{
						initialValue.push(value);
					}
				});
				initialValue.forEach((value)=>
				{
					let index = -1;
					index = mainServerHTTPConnectionsLists[keyelement].indexOf(value);
					if(index != -1)
					mainServerHTTPConnectionsLists[keyelement].splice(index,1);
				});
			}
			catch(ex)
			{
				console.log(ex);
				console.log("Node .js is a crasher....");
			}
		});
	},2000);
	
	function setMain()
	{
		let count = 0;
		clients.forEach((client)=>
		{
			if(!clients_closed[count] && (main == undefined || main_third_other == undefined || main_send_form_client == undefined) )
			{
				if(main == undefined || main == client)
				{
					let temp_address = getAddressFromClient(client);
					if(main == undefined)
						main = client;
					main_third_other = addresses[temp_address].clientThirdOther;
					main_send_form_client = addresses[temp_address].clientSendForm;
					console.log((main == undefined)?"main undefined":"main defined");
					console.log((main_third_other == undefined)?"main_third_other undefined":"main_third_other defined");
					console.log((main_send_form_client == undefined)?"main_send_form_client undefined":"main_send_form_client defined");
				}
			}
			++count;
		});
		if(main == undefined)
			setInterval(setMain,300);
		
	}
	
	function resize_afterDisconnection()
	{
		let count = 0;
		let index = 0;
		let elements_to_delete = [];
		
		clients.forEach((element)=>
		{
			if(clients_closed[count])
			{
				elements_to_delete.push(element);
				if(clients[count] == main)
				{	
					main = undefined;
					main_third_other = undefined;
				}
			}
			++count;
		});	
		
			
		elements_to_delete.forEach((element)=>
		{
			let temp_address = getAddressFromClient(element);
			console.log(temp_address);
			deleteGivenElementsFromDicofArrays(addresses[temp_address].clientElements,socketConnectionListDics);
			deleteGivenElementsFromDicofArrays(addresses[temp_address].clientElements,httpsListDics);
			deleteAllElementsFromArray(addresses[temp_address].clientElements);
			let elements_index = clients.indexOf(element);
			clients.splice(elements_index,1);
			clients_closed.splice(elements_index,1);
		});
		
		count = 0;
		clients.forEach((client)=>
		{
			if(!clients_closed[count] && main == undefined)
			{
				let temp_address = getAddressFromClient(client);
				main = client;
				main_third_other = addresses[temp_address].clientThirdOther;
				main_send_form_client = addresses[temp_address].clientSendForm;
			}
			++count;
		});
		
		let httpKeys = Object.keys(httpsListDics);
		let httpElementstoDelete = [];
		count = 0;
		
		httpKeys.forEach((outterElement)=>{
			httpsListDics[outterElement].forEach((element)=>{
			if( element != undefined &&
			element.res != undefined &&
			element.res.writableEnded) 
			{
				httpElementstoDelete.push( element );
				++count;
			}
			});
		});
		
		if(httpElementstoDelete.length > 0)
		deleteGivenElementsFromDicofArraysUsingEquals(httpElementstoDelete,httpsListDics);
		
		deleteAllElementsFromArray(httpElementstoDelete);
		count = 0;
		
		httpKeys = Object.keys(formshttpsListDics);
		httpKeys.forEach((outterElement)=>{
			formshttpsListDics[outterElement].forEach((element)=>{
			if(element != undefined &&
			element.res != undefined &&
			element.res.writableEnded) 
			{
				httpElementstoDelete.push( element );
				++count;
			}
			});
		});
		
		if(httpElementstoDelete.length > 0)
			deleteGivenElementsFromDicofArraysUsingEquals(httpElementstoDelete,formshttpsListDics);
		
		deleteAllElementsFromArray(httpElementstoDelete);
		
		let color = "color:red;font-size: 14px;";
		console.log("%c %s",color,((main==undefined)?"Main is undefined":"Main is defined"));
	}
	
	function deleteGivenElementsFromDicofArraysUsingEquals(givenElements,dic)
	{
		givenElements.forEach( (current_element)=> 
		{
			Object.keys(dic).forEach((key)=>
			{
				let temp_index = dic[key].indexOf(current_element);
				if( temp_index != -1 )
				{
					dic[key].splice(temp_index,1);
				}
			});
		});
	}
	
	function informDone(c)
	{
		let count = 0;
		clients.forEach((element)=>
		{
			if(c == element )
				clients_closed[count] = true;
			++count;
		});	
	}
	
	function addOtherClient(c)
	{
		
		let addressObject = c.address();
		
		if( addressObject == null)
			return;
		if( typeof  addressObject == 'string')
		{
			addressObject = JSON.parse(addressObject);
		}
		else if (typeof  addressObject != 'object')
		{
			return;
		}
		
		if(addresses[addressObject.address] == undefined)
		{
			addresses[addressObject.address] = {client: undefined,clientOther: undefined,clientThirdOther: undefined,clientSendForm: undefined };
		}
		
		addresses[addressObject.address].clientOther = c;
		
	}
	
	function addClient(c)
	{
		clients.push(c);
		clients_closed.push(false);
		
		let addressObject = c.address();
		if( addressObject == null)
			return;
		if( typeof  addressObject == 'string')
		{
			addressObject = JSON.parse(addressObject);
		}
		else if (typeof  addressObject != 'object')
			return;
			
		if(addresses[addressObject.address] == undefined)
		{
			addresses[addressObject.address] = {client: undefined,clientOther: undefined,clientThirdOther: undefined,clientSendForm: undefined };
		}
		
		addresses[addressObject.address].client = c;
		addresses[addressObject.address].clientElements = [];
		
	}
	
	function addThirdPortsClient(c)
	{
		let addressObject = c.address();
		
		if( addressObject == null)
			return;
		
		if( typeof  addressObject == 'string')
		{
			addressObject = JSON.parse(addressObject);
		}
		else if (typeof  addressObject != 'object')
		{
			return;
		}
		
		if(addresses[addressObject.address] == undefined)
		{
			addresses[addressObject.address] = {client: undefined,clientOther: undefined,clientThirdOther: undefined,clientSendForm: undefined };
		}
		
		addresses[addressObject.address].clientThirdOther = c;
	}
	
	function addSendformClient(c)
	{
		
		let addressObject = c.address();
		
		if( addressObject == null)
			return;
		if( typeof  addressObject == 'string')
		{
			addressObject = JSON.parse(addressObject);
		}
		else if (typeof  addressObject != 'object')
		{
			return;
		}
		
		if(addresses[addressObject.address] == undefined)
		{
			addresses[addressObject.address] = {client: undefined,clientOther: undefined,clientThirdOther: undefined,clientSendForm: undefined };
		}
		
		addresses[addressObject.address].clientSendForm = c;
		
	}
	
	function getAddressFromSocket(socket)
	{
		let addressObject = socket.address();
		let address = "";
		//console.log("Address object keys "+Object.keys(addressObject).length);
		
		if(Object.keys(addressObject).length == 0)
		{
			Object.entries(addresses).forEach(([tempkey, value])=>
			{
				console.log(Object.values(value));
				Object.values(value).forEach((element)=>
				{
					if ( element == socket )
					{
						address =  tempkey;
					}
				});
			});
		}
		else
		{
			if( addressObject == null)
				return undefined;
			if( typeof  addressObject == 'string')
			{
				addressObject = JSON.parse(addressObject);
			}
			else if (typeof  addressObject != 'object')
				return undefined;
			
			return addressObject.address;
		}
		
		return address;
	}
	
	function getAddressFromClient(c)
	{
		return getAddressFromSocket(c);
	}
	
	function getOtherFromAddress(c)
	{
		let addressObject = c.address();
		if( addressObject == null)
			return undefined;
		if( typeof  addressObject == 'string')
		{
			addressObject = JSON.parse(addressObject);
		}
		else if (typeof  addressObject != 'object')
			return undefined;
			
		return addresses[addressObject.address].clientOther;
	}
	
	function getAddress(c)
	{
		let addressObject = c.address();
		if( addressObject == null)
			return undefined;
		if( typeof  addressObject == 'string')
		{
			addressObject = JSON.parse(addressObject);
		}
		else if (typeof  addressObject != 'object')
			return undefined;
		
		return addresses[addressObject.address].client;
	}
	
	function deleteAllElementsFromArray(array_container)
	{
		array_container.splice(0,array_container.length);
	} 
	
	function deleteGivenElementsFromDicofArrays (given_elements,dicofarrays)
	{
		if(dicofarrays == undefined)
			return;
		if(given_elements == undefined)
			return;
		//console.log("---------------------------given elements---------------------------------");
			//console.log(given_elements);
		//console.log("---------------------------given elements---------------------------------");
		
		given_elements.forEach((element)=>
		{
			let keys = Object.keys(element);
			//console.log(element);console.log(keys);
			let count = 0;
			let current_ref = dicofarrays;
			//console.log(dicofarrays);
			while(count < keys.length-1)
			{
				current_ref = current_ref[element[keys[count]]];
				++count;
			}
			
			//console.log("Current Ref instance of array");
			//console.log(current_ref instanceof Array);
			//console.log(current_ref);
			
			if(count < keys.length)
			{
				current_ref.splice(element[keys[count]],1);
			}
			
			if( current_ref instanceof Array)
			{
				let temp_elements_to_del = [];
				current_ref.forEach((content_element)=>
				{
					if( content_element[keys[count]] = element[keys[count]] ) 
					{
						temp_elements_to_del.push(content_element);
					}
				});
				deleteElementsFromArray(temp_elements_to_del,current_ref);
			}
			
		});
	}
	
	function deleteElementsFromArray(contents,array)
	{
		contents.forEach((element)=>
		{
			array.splice(array.indexOf(element),1);
		});
	}
	
	function eachElement()
	{
		let keys = Object.keys(mainServerHTTPConnectionsLists);
		let values = [];
		keys.forEach( (xValue)=>
		{
			mainServerHTTPConnectionsLists[xValue].forEach((individual)=>
			{
				let value = Object.assign({},individual);
				value.req = undefined;
				value.res = undefined;
				values.push(value);
			});
		});
		return values;
	}
	
	function findElementInsideListsDictionaryHTTP (xValue,countValue,statusCode,contentType,receivedData)
	{
		let index = -1;
		let count = 0;
		console.log(receivedData.url);
		console.log("Sending request possibly....")	;
		console.log(xValue);
		console.log(countValue);
		mainServerHTTPConnectionsLists[xValue].forEach((individual)=>
		{
			
			console.log("Individual Pos "+individual.Pos);
			if(individual.Pos == countValue)
			{	
				try
				{
					receivedData.Box = undefined; receivedData.Pos = undefined;	
					receivedData.statusCode = undefined; receivedData.resHeaders = undefined;
					
					if(!individual.res.writableEnded)
					{	
						individual.res.writeHead(statusCode,contentType);
						individual.res.write(JSON.stringify(receivedData));
						individual.res.end();
						
						if(individual.req.url == '/form')
							console.log("form response sent...");
						else
							console.log("response sent to client....");
						
					}
					index = count;
				}
				catch(ex)
				{
					console.log(ex);
				}
			}
			++count;
		});	 
		
		if(index !=-1)
		{
			(mainServerHTTPConnectionsLists[xValue]).splice(index,1);
		}
		else
		{
			console.log((receivedData.url == '/form')?"form response not not not sent...........":"response not not not sent to Client...");
		}
	}
	
	
	function findElementInsideListsDictionary (xValue,countValue,statusCode,contentType,receivedData)
	{
		let index = -1;
		let count = 0;
		console.log(receivedData.url);
		console.log("Sending request possibly....")	;
		console.log(xValue);
		console.log(countValue);
		((receivedData.url == '/form')? formshttpsListDics[xValue] : httpsListDics[xValue]).forEach((individual)=>
		{
			
			console.log("Individual Pos "+individual.Pos);
			if(individual.Pos == countValue)
			{	
				try
				{
					receivedData.Box = undefined; receivedData.Pos = undefined;	
					receivedData.statusCode = undefined; receivedData.resHeaders = undefined;
					
					if(!individual.res.writableEnded)
					{	
						individual.res.writeHead(statusCode,contentType);
						individual.res.write(JSON.stringify(receivedData));
						individual.res.end();
						
						if(individual.req.url == '/form')
							console.log("form response sent...");
						else
							console.log("response sent to client....");
					}
					index = count;
				}
				catch(ex)
				{
					console.log(ex);
				}
			}
			++count;
		});	 
		
		if(index !=-1)
		{
			((receivedData.url == '/form')? formshttpsListDics[xValue] : httpsListDics[xValue]).splice(index,1);
		}
		else
		{
			console.log((receivedData.url == '/form')?"form response not not not sent...........":"response not not not sent to Client...");
		}
	}
	
	const formACKserver = net.createServer((c) => {
		  // 'connection' listener.
		  let count = 0;
		  let transmission = [];
		  let transmission_count = 0;
		  let setIntervalLocked = false;
		  console.log('client connected to third port');
		  c.pipe(c);
		  addThirdPortsClient(c);
		  setMain();
		   
		  c.on('end', () => {
			});
			
		  c.on('data',(data)=>{ 
			
			let receivedDataStr = data.toString();
			console.log("Received form acknowlodgement message from  server");
			console.log(receivedDataStr);
		
				receivedDataStr.split("ACK-----").forEach((element)=>{
					if(element != '')
					{
						console.log("ACK received");
						ACKS[element] = true;
					}
				});
			
		  });
			
		  c.on('error',(err)=>
		  { 
		  });
		  
	});

	formACKserver.on('error', (err) => {
	  console.log(err.msg);
	});

	/* formACKserver.listen(process.env.PORT4, () => {
	  console.log('third server bound');
	}); */
	
	
	const sendFormServer = net.createServer((c) => {
		  // 'connection' listener.
		  let count = 0;
		  let transmission = [];
		  let transmission_count = 0;
		  let setIntervalLocked = false;
		  console.log('client connected to sendFormServer');
		  c.pipe(c);
		  addSendformClient(c);
		  setMain();
		   
		  c.on('end', () => {
			console.log('client disconnected');
			informDone(c);
		  });

		  c.on('data',(data)=>{ 
				
			});
		  
		  c.on('error',(err)=>
		  { 
			console.log(err);
			console.log("clients program exited");
			informDone(c);
		  });
		  
	});

	sendFormServer.on('error', (err) => {
	  console.log(err.msg);
	});

	/* sendFormServer.listen(process.env.PORT3, () => {
	  console.log('server bound');
	}); */

	
	const otherserver = net.createServer((c) => {
		  // 'connection' listener.
		  let count = 0;
		  let transmission = [];
		  let transmission_count = 0;
		  let setIntervalLocked = false;
		  console.log('client connected to another port');
		  c.pipe(c);
		  addOtherClient(c);
		  
		  c.on('end', () => {
			});
			
		  c.on('data',(data)=>{ 
		  });
			
		  c.on('error',(err)=>
		  { 
		  });
		  
	});

	otherserver.on('error', (err) => {
	  console.log(err.msg);
	});

	/* otherserver.listen(process.env.PORT2, () => {
	  console.log('second server bound');
	}); */
	
	
	const server = net.createServer((c) => {
		  // 'connection' listener.
		  let count = 0;
		  let transmission = [];
		  let transmission_count = 0;
		  let setIntervalLocked = false;
		  console.log('client connected');
		  c.pipe(c);
		  addClient(c);
		  setMain();
		  
		  c.on('end', () => {
			console.log('client disconnected');
			informDone(c);
			resize_afterDisconnection();
		  });

		  c.on('data',(data)=>{ 
				//console.log(data.toString());
				console.log(data.length);
				console.log("writting ACK");
				
				let ack_client = getOtherFromAddress(c);
				console.log(data.toString().substring(0,20));
				ack_client.write("ACK-----"+data.toString(),()=>{console.log("ACK Flushed");});
				processSocketConnectionRequest(data.toString(),c);
				
			});
		  
		  c.on('error',(err)=>
		  { 
			console.log(err);
			console.log("clients program exited");
			informDone(c);
			resize_afterDisconnection();
		  });
		  
	});

	server.on('error', (err) => {
	  console.log(err.msg);
	});

	/* server.listen(process.env.PORT1, () => {
	  console.log('server bound');
	});
	 */
	const httpServer = http.createServer((request,result)=>
	{
		let dataStr = '';let reqStr = '';
		if (request.method === 'OPTIONS') 
		{
			console.log('!OPTIONS');
			// IE8 does not allow domains to be specified, just the *
			//headers["Access-Control-Allow-Origin"] = req.headers.origin;
			result.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
				,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
				,"Access-Control-Max-Age":'86400'
				,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
			});
			result.end();
		}	
		if(request.method == 'POST')
		{
			console.log(request.url);
			if(request.url == "/test")
			{
				result.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
							,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
							,"Access-Control-Max-Age":'86400'
							,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
				});
				result.write(JSON.stringify({a:"OK"}));
				result.end();
			}
			else if( request.url == '/localServer'+dopePWD)
			{
				request.on('data',(content)=>
				{
					reqStr += content;
				});
				
				request.on('end',()=>
				{
					
					let stack = JSON.parse(reqStr);
					if( !(stack.giveUpdates == true))
					{
						console.log(stack);console.log(",,,,,,,,,,,,,,");
						findElementInsideListsDictionaryHTTP ( stack.Box,stack.Pos,stack.statusCode,
						stack.resHeaders?stack.resHeaders:stack.resHeader,stack,result);
						result.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
							,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
							,"Access-Control-Max-Age":'86400'
							,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
						});
						result.end();
					}
					else
					{
						let dataToForward = eachElement();
						
						result.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
							,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
							,"Access-Control-Max-Age":'86400'
							,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
						});
						result.write(JSON.stringify(dataToForward));
						result.end();
					}
				
				});
			}
			else if(request.url == '/form')
			{
				console.log(request);
				if(!all_http)
				{
					processRequest("",request,result);	
				}
				else
				{
					processRequestHttp("",request,result);
				}
				
				setTimeout((response)=>
				{
					if(response.writableEnded == false)
					{
						response.writeHead(500, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
							,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
							,"Access-Control-Max-Age":'86400'
							,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
						});
						response.write(JSON.parse({res:"Timeout"}));
						response.end();
					}
				},15000,result);
				
			}
			else
			{
				request.on('data',(content)=>
				{
					dataStr += content;
				});
				
				request.on('end',()=>
				{
					/* result.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
						,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
						,"Access-Control-Max-Age":'86400'
						,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
					});
					result.write("{\"OK\":200}");
					result.end(); */
					console.log(dataStr);
					let valueObj = JSON.parse(dataStr);
					if(valueObj.url == "/test")
					{
						result.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
								,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
								,"Access-Control-Max-Age":'86400'
									,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
						});
						result.write(JSON.stringify({a:"OK"}));
						result.end();
					}
					else if(valueObj.url == '/localServer'+dopePWD)
					{
						
						if( !(valueObj.giveUpdates == true))
						{
							console.log(valueObj);console.log(",,,,,,,,,,,,,,");
							findElementInsideListsDictionaryHTTP ( valueObj.Box,valueObj.Pos,valueObj.statusCode,
							valueObj.resHeaders?valueObj.resHeaders:valueObj.resHeader,valueObj,result);
							result.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
								,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
								,"Access-Control-Max-Age":'86400'
								,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
							});
							result.end();
						}
						else
						{
							let dataToForward = eachElement();
							
							result.writeHead(200, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
								,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
								,"Access-Control-Max-Age":'86400'
								,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
							});
							result.write(JSON.stringify(dataToForward));
							result.end();
						}
										
					}
					else
					{
						if(!all_http)
						{
							processRequest(dataStr,request,result);
						}
						else
						{
							processRequestHttp(dataStr,request,result);
						}
					}
				});
				
				setTimeout((response)=>
				{
					if(response.writableEnded == false)
					{
						response.writeHead(500, {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"
							,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
							,"Access-Control-Max-Age":'86400'
							,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
						});
						response.write(JSON.stringify({res:"Timeout"}));
						response.end();
					}
				},15000,result);
				
			}
		}
		else if(request.method == 'GET')
		{
			result.end();
		}
	});
	
	httpServer.listen(3008);
	console.log(httpServer._connectionKey);

	async function processRequest(data,req,res)
	{
		if(req.url != '/form')
		{
			let objectCorrespondance = JSON.parse(data);
			//console.log(objectCorrespondance);
			
			if(objectCorrespondance.Box == undefined && objectCorrespondance.Pos == undefined)
			{
				let value  = circle_value_correspondance[circle_count % (circle_value_correspondance.length)];
				objectCorrespondance.Box = value;
				objectCorrespondance.Pos = httpslength;
				httpsListDics[value].push(objectCorrespondance);
				++httpslength;
				++circle_count;
				//console.log(objectCorrespondance);
				sendToClient(JSON.stringify(objectCorrespondance),main,res);
				objectCorrespondance.req = req;
				objectCorrespondance.res = res;
			}
		}
		else
		{
			formidableFileUpload(req,res);
		}
	}
	
	async function processRequestHttp(data,req,res) 
	{
			
		if(req.url != '/form')
		{
			let objectCorrespondance = JSON.parse(data);
			stockUpDataHTTP(objectCorrespondance,req,res);
			console.log("Data has been stored");
		}
		else 
		{
			formidableFileUploadHttp(req,res);
		}
	}
	
	function stockUpDataHTTP(objectCorrespondance,req,res) 
	{
		let value  = circle_value_correspondance[circle_count % (circle_value_correspondance.length)];
		objectCorrespondance.req = req;
		objectCorrespondance.res = res;
		objectCorrespondance.Box = value;
		objectCorrespondance.Pos = lengthofHTTPConnectionsLists++;
		mainServerHTTPConnectionsLists[value].push(objectCorrespondance);
		++circle_count;
		/* objectCorrespondance.req = req;
		objectCorrespondance.res = res;	 */
	}
	
	function completeAssign(target, ...sources) {
	  sources.forEach((source) => {
		const descriptors = Object.keys(source).reduce((descriptors, key) => {
		  descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
		  return descriptors;
		}, {});

		// By default, Object.assign copies enumerable Symbols, too
		Object.getOwnPropertySymbols(source).forEach((sym) => {
		  const descriptor = Object.getOwnPropertyDescriptor(source, sym);
		  if (descriptor.enumerable) {
			descriptors[sym] = descriptor;
		  }
		});
		Object.defineProperties(target, descriptors);
	  });
	  return target;
	}
	
	function processSocketConnectionRequest(data,client_connected)
	{
		let elements_box = store_values(data);
		//console.log(data);
		elements_box.forEach((all_elements)=>
		{
			let box = all_elements[0];
			let pos = Number(all_elements[1]);
			let part_no = Number(all_elements[2]);
			let count = Number(all_elements[3]);
			let str = all_elements[4];
			
			//console.log("Box: "+ box);
			//console.log("Position no: "+ pos);
			//console.log("Part no: "+ part_no);
			//console.log("Length of part:"+str.length);
			
			let dataObject = 
			{
				Box: box,
				Pos:pos,
				Part_No:part_no,
				Count: count,
				Content: str
			}
			
			addresses[getAddressFromClient(client_connected)].clientElements.push({Box:box,Pos:pos});
			
			if(socketConnectionListDics[box] == undefined)
				socketConnectionListDics[box] = [];
			socketConnectionListDics[box].push(dataObject);
			
			if( part_no + 1 == count )
			{
				reassembleDataObjects(box,pos,count);	
			}
			
		});
	}
	
	async function reassembleDataObjects(box,pos,countParam)
	{
		let elements_in_order = [];
		let count = 0;
		
		socketConnectionListDics[box].forEach((element)=>
		{
			if(element.Pos == pos)
			{
				elements_in_order.push(element);
				let index = count;
				while(index > 0 && element.Part_No < elements_in_order[index-1].Part_No)
				{
					let swap = elements_in_order[index-1];
					elements_in_order[index-1] = element;
					elements_in_order[index] = swap;
					--index;
				}
				++count;
			}
		});
		
		if( count == countParam )
		{
			
			let str = "";
			let reassembledObject = undefined;
			
			elements_in_order.forEach((element)=>
			{
				str += element.Content;
			});
			
			try
			{
				//console.log(str);
				reassembledObject = JSON.parse(str);
				elements_in_order.forEach((element)=>
				{
					let temp_index = socketConnectionListDics[box].indexOf(element);
					if(temp_index != -1 && element.Pos == socketConnectionListDics[box][temp_index].Pos)
					{
						socketConnectionListDics[box].splice(temp_index,1);
					}
				});

			}
			catch(ex)
			{
				console.log(ex);
				console.log("------------------Unassemblable string object--------------------");
				console.log(ex.message);
				console.log("------------------Unassemblable string object closing tag--------------------");
				return;
			}
			
			findElementInsideListsDictionary(box,pos,reassembledObject.statusCode,reassembledObject.resHeaders?reassembledObject.resHeaders:reassembledObject.resHeader,reassembledObject)
		}
		else
		{
			setTimeout(()=>
			{
				reassembleDataObjects(box,pos,countParam);
			},500);
		}
	}
	
	function sendFunction(values,client,content,countparam)
	{
		if(countparam < values.length)
		{
			try
			{
				
				if(client == main_send_form_client)
				{
					console.log("Main send form client is closed is "+client.closed);
				}
				else
				{
					console.log("Client is closed is "+client.closed);
				}
				
				client.write(values[countparam],()=> {
				});
			}
			catch(ex)
			{
				console.log(ex);
				console.log("at SendFunction");
			}
		}
	}
	
	function sendToClient(data,client,res)
	{
		
		if(client == undefined || (client != undefined && client.closed))
		{
			stopRequestReturnFormResponseEmptyHanded (res);
			return;
		}
		
		try
		{
			client.write(data,()=>{console.log("Data has been flushed")});
			//console.log("Done");
		}
		catch(ex)
		{
			console.log(ex);
		}
		
	}
	
	async function formidableFileUpload(req,res)
	{
		var form = new formidable.IncomingForm();
		console.log("Inside formidable");
		
		form.parse(req, function (err, fields, files) 
		{
			console.log(fields); console.log(files);
			var objectCorrespondance;
			objectCorrespondance = {url: '/form',fields: fields,files:files};
			let value  = circle_value_correspondance[circle_count % (circle_value_correspondance.length)];
			objectCorrespondance.Box = value;
			objectCorrespondance.Pos = formshttpsLength;
			formshttpsListDics[value].push(objectCorrespondance);
			let splitElementsMustGo = SplitLongString(JSON.stringify(objectCorrespondance),value,formshttpsLength);
			console.log(splitElementsMustGo);
			sectioned_sending_for_form(main_send_form_client,splitElementsMustGo,undefined,value,formshttpsLength,res);//value undefined
			formshttpsLength++;
			objectCorrespondance.req = req;
			objectCorrespondance.res = res;
		});
	}
	
	async function formidableFileUploadHttp(req,res)
	{
		var form = new formidable.IncomingForm();
		console.log("Inside formidable HTTP");
		
		form.parse(req, function (err, fields, files) 
		{
			console.log(fields); console.log(files);
			var objectCorrespondance;
			objectCorrespondance = {url: '/form',fields: fields,files:files};
			stockUpDataHTTP(objectCorrespondance,req,res) 
		});
	}
	
	
	function sectioned_sending(client,content,Box,pos,res)
	{
		let values = SplitLongString(content,Box,pos);
		verify(client,values,0,content,Box,pos,0,res);
	}
	
	function sectioned_sending_for_form(client,values,content,Box,pos,res)
	{
		verify(client,values,0,content,Box,pos,0,res);
	}
	
	function mSubstring(str,start,end)
	{
		let value = "";
		let index = 0;

		while(index < end)
		{
			value += str[start+index];
			++index;
		}
		return value;
	}
	
	function verify (client,values,count,content,Box,pos,countparam,res)
	{
		console.log("inside verify........");
		console.log("countparam = "+countparam+" and values.length "+values.length);
		console.log("client is undefined is "+ (client == undefined));
		console.log("client is closed "+((client != undefined)?client.closed:"false"));
		
		if(countparam == values.length)
			return;
		
		if(client == main_send_form_client)
			console.log(values[countparam]);
		
		if( client != undefined && client.closed)
		{
			//setTimeout(verify,1,client,values,++count,content,Box,pos,countparam);
			console.log("Sending to server failed because connection is closed...");
			stopRequestReturnFormResponseEmptyHanded(res);
			return;
		}
		
		if(client == undefined )
		{
			console.log("Sending to server failed because server is undefined...");
			stopRequestReturnFormResponseEmptyHanded(res);
			return;
		}
		
		if(ACKS[values[countparam]] == undefined && count < 50 )
		{
			setTimeout(verify,1,client,values,++count,content,Box,pos,countparam,res);
		}
		else if (ACKS[values[countparam]] == undefined)
		{
			/*if(client == undefined && count == 7000)
			{
				stopRequestReturnEmptyHanded(Box,pos);
				return;
			}*/ //stop resending commented
			
			//or force sending uncommented
			sendFunction(values, client, content, countparam);
			verify(client,values,0,content,Box,pos,countparam,res);
		}
		else 
		{
			ACKS[values[countparam]] = undefined;
			delete ACKS[values[countparam]];
			console.log("ACK received");
			let value = sendFunction(values, client, content, ++countparam);
			verify(client,values,0,content,Box,pos,countparam,res);
		}
	}
	
	function stopRequestReturnEmptyHanded (res) 
	{
		console.log("Erreur.Le proxy est incapable de joindre le serveur\n de traitement des formes.");
		dummyResponse(res,"Erreur. Le proxy est incapable de joindre le serveur\n de traitement des formes.");
	}
	
	function stopRequestReturnFormResponseEmptyHanded (res) 
	{
		console.log("Erreur.Le proxy est incapable de joindre le serveur\n de traitement des formes.");
		dummyResponse(res,"Erreur. Le proxy est incapable de joindre le serveur\n de traitement des formes.");
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
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	dopePWD = "UIOJJirofjoijjjkjvjhhjkjoihifdddsreduhftygjufyihre7hdtjo;gs4wyjs65ugr7oknf";