var url = require("url");
var sessionLib = require("./SessionHandlerClass");
const sessionHandler = new sessionLib.SessionHandlerClass(undefined);
var checks =[];
var peerchecks =[];
var peermessages =[];
var http = require("http");
var url = require("url");
	
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
			res.end();
		}
		var reqDataStr = "";
		if(req.method === 'POST')
		{
			
			req.on('data',(data)=>
			{
				//console.log(typeof data);
				reqDataStr += data;
				
			}).on('end',()=>
			{
				console.log(req.url);
				if( req.url == '/checkParticipants')
				{
					let data = JSON.parse(reqDataStr);
					var sessionName = data["sessionName"];
					var sessionDate = new Date(data["sessionDate"]);
					var sessionParticipant = data["sessionParticipant"];
					var sessionPass = data["sessionPass"];
					var rtrn = sessionHandler.PeerCheckParticipantForUpdate(sessionParticipant,sessionName,sessionDate,sessionPass);
					
					res.writeHead(200,{"Content-Type":'application/json',"Access-Control-Allow-Origin":"*"
					,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
					,"Access-Control-Max-Age":'86400'
					,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
					res.write(JSON.stringify(rtrn));
					res.end();
					
					return;
				}
				if(req.url == '/offer')
				{
					
					let data = JSON.parse(reqDataStr);
					var sessionName = data["sessionName"];
					var sessionDate = new Date(data["sessionDate"]);
					var sessionParticipant = data["sessionParticipant"];
					var sessionPass = data["sessionPass"];
					var offer = data["offer"];
					var offerTo = data["offerTo"];
					
					const ret = sessionHandler.AddOffer(sessionParticipant,offerTo,sessionName,sessionDate,sessionPass,offer);
					
					res.writeHead(200,{"Content-Type":'application/json',"Access-Control-Allow-Origin":"*"
					,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
					,"Access-Control-Max-Age":'86400'
					,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
					res.write(JSON.stringify(ret));
					res.end();
					
					return;
				}
				
				if( req.url == '/new-ice-candidate')
				{
					let data = JSON.parse(reqDataStr);
					var sessionName = data["sessionName"];
					var sessionDate = new Date(data["sessionDate"]);
					var sessionParticipant = data["sessionParticipant"];
					var sessionPass = data["sessionPass"];
					var icecandidateTo = data["icecandidateTo"];
					var icevalue = data['new-ice-candidate'];
					const ret = sessionHandler.AddRoomValue(sessionParticipant,icecandidateTo,sessionName,sessionDate,sessionPass,'new-ice-candidates',icevalue);
					
					res.writeHead(200,{"Content-Type":'application/json',"Access-Control-Allow-Origin":"*"
					,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
					,"Access-Control-Max-Age":'86400'
					,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
					res.write(JSON.stringify(ret));
					res.end();
					
					return;
				}
			
				if(req.url == '/message')
				{
					let data = JSON.parse(reqDataStr);
					var sessionName = data["sessionName"];
					var sessionDate = new Date(data["sessionDate"]);
					var sessionParticipant = data["sessionParticipant"];
					var sessionPass = data["sessionPass"];
					var message = data["message"];
					var answerTo = data["answerTo"];
					
					const ret = sessionHandler.AddMessage(sessionParticipant,answerTo,sessionName,sessionDate,sessionPass,message);
					
					res.writeHead(200,{"Content-Type":'application/json',"Access-Control-Allow-Origin":"*"
					,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
					,"Access-Control-Max-Age":'86400'
					,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
					res.write(JSON.stringify(ret));
					res.end();
					
					return;
				}
				if(req.url == '/checkoffer')
				{
					let data = JSON.parse(reqDataStr);
					var sessionName = data["sessionName"];
					var sessionDate = new Date(data["sessionDate"]);
					var sessionParticipant = data["sessionParticipant"];
					var sessionPass = data["sessionPass"];
					console.log(sessionParticipant+"--"+sessionName+"--"+sessionDate+"--"+sessionPass);
					const ret =  sessionHandler.PeerCheckOffers(sessionParticipant,sessionName,sessionDate,sessionPass);
					console.log(ret);
					console.log('/checkoffer*********************************************************************');
					
					res.writeHead(200,{"Content-Type":'application/json',"Access-Control-Allow-Origin":"*"
					,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
					,"Access-Control-Max-Age":'86400'
					,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
					
					res.write(JSON.stringify(ret));
					res.end();
					return;
				}
				if(req.url == '/checknew-ice-candidate')
				{
					let data = JSON.parse(reqDataStr);
					var sessionName = data["sessionName"];
					var sessionDate = new Date(data["sessionDate"]);
					var sessionParticipant = data["sessionParticipant"];
					var sessionPass = data["sessionPass"];
					const ret =  sessionHandler.PeerCheckRoomForUpdate(sessionParticipant,sessionName,sessionDate,sessionPass,'new-ice-candidates');
					console.log(ret);
					console.log('/checknew-ice-candidate********************************************************************');
					
					res.writeHead(200,{"Content-Type":'application/json',"Access-Control-Allow-Origin":"*"
					,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
					,"Access-Control-Max-Age":'86400'
					,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
					
					res.write(JSON.stringify(ret));
					res.end();
					return;
				}
				if(req.url == '/checkmessage')
				{
					let data = JSON.parse(reqDataStr);
				
					var sessionName = data["sessionName"];
					var sessionDate = new Date(data["sessionDate"]);
					var sessionParticipant = data["sessionParticipant"];
					var sessionPass = data["sessionPass"];
					console.log(sessionParticipant+"--"+sessionName+"--"+sessionDate+"--"+sessionPass);
					
					const ret =  sessionHandler.PeerCheckMessages(sessionParticipant,sessionName,sessionDate,sessionPass);
					console.log(ret);
					console.log('/checkmessage********************************************************************');
					
					res.writeHead(200,{"Content-Type":'application/json',"Access-Control-Allow-Origin":"*"
					,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
					,"Access-Control-Max-Age":'86400'
					,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
					res.write(JSON.stringify(ret));
					res.end();
					
					return;
				}
				if(req.url == '/check')
				{
					console.log(new Date(Date.now()));
					console.log(sessionHandler.getSessionToday(new Date(Date.now())));
					if( reqDataStr == "nostart" )
						checks.push(res);
					else
					{
						
						res.writeHead(200,{"Content-Type":'application/json',"Access-Control-Allow-Origin":"*"
							,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
							,"Access-Control-Max-Age":'86400'
							,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
							res.write(JSON.stringify(sessionHandler.getSessionToday(new Date(Date.now()))));
							res.end();
					}
					return;
				}
				
				if(req.url == '/peer')
				{
					const data = JSON.parse(reqDataStr);
					var sessionName = data["sessionName"];
					var sessionDate = new Date(data["sessionDate"]);
					var sessionParticipant = data["sessionParticipant"];
					var sessionPass = data["sessionPassword"];
					const ret = sessionHandler.AddParticipant(sessionParticipant,{},sessionName,sessionDate,sessionPass);
					console.log(ret);
					
					if( ret )
					{
						console.log(ret);
						res.writeHead(200,{"Content-Type":'application/json',"Access-Control-Allow-Origin":"*"
						,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
						,"Access-Control-Max-Age":'86400'
						,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
						res.write(JSON.stringify({participant:ret}));
						res.end();
					}
					else
					{
						res.writeHead(500,{"Content-Type":'application/json',"Access-Control-Allow-Origin":"*"
						,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
						,"Access-Control-Max-Age":'86400'
						,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
						res.write(JSON.stringify({error:true,participantError:"Server can't add participant"}));
						res.end();
					}
					
					return;
				}	
				
				if(req.url == '/createSession'){
					const data = JSON.parse(reqDataStr);
					var sessionName = data["sessionName"];
					var sessionDate = new Date(data["sessionDate"]);
					var sessionParticipants = data["sessionParticipants"];
					var sessionPass = data["sessionPass"];
					console.log(data);
					
					const session = sessionHandler.CreateSession(sessionName,sessionDate,sessionParticipants,sessionPass);
					if( session )
					{
						console.log(session);
						res.writeHead(200,{"Content-Type":'application/json',"Access-Control-Allow-Origin":"*"
						,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
						,"Access-Control-Max-Age":'86400'
						,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
						res.write(JSON.stringify({session:session}));
						res.end();
						
						const curr = [];
						checks.forEach( ch=>{
							ch.writeHead(200,{"Content-Type":'application/json',"Access-Control-Allow-Origin":"*"
							,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
							,"Access-Control-Max-Age":'86400'
							,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
							ch.write(JSON.stringify(sessionHandler.getSessionToday(sessionDate)));
							ch.end();
							curr.push(ch);
						});
						
						curr.forEach( ch=> checks.splice(checks.indexOf(ch),1));
					}
					else
					{
						res.writeHead(500,{"Content-Type":'application/json',"Access-Control-Allow-Origin":"*"
						,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false
						,"Access-Control-Max-Age":'86400'
						,"Access-Control-Allow-Headers":"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"});
						res.write(JSON.stringify({error:true,sessionError:"Server can't add session"}));
						res.end();
					}
					
					return;
				}
				res.end();
			});
		}
		
	});
	
	server.listen(3037);
