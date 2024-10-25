const express = require('express');
var url = require("url");
var sessionLib = require("./SessionHandlerClass");
const cors = require('cors');
const sessionHandler = new sessionLib.SessionHandlerClass(undefined);
var app = express();

const corsOptions = {
    origin: '*', // Allow only this origin
    methods: ['GET', 'POST','UPDATE'], // Allow only these methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow only these headers
};

app.use(cors(corsOptions));
app.use(express.json());

app.post('/createSession',function(req,res){
	
	var sessionName = req.body["sessionName"];
	var sessionDate = new Date(req.body["sessionDate"]);
	var sessionParticipants = req.body["sessionParticipants"];
	var sessionPass = req.body["sessionPass"];
	console.log(req.body);
	
	const session = sessionHandler.CreateSession(sessionName,sessionDate,sessionParticipants,sessionPass);
	if( session )
	{
		//res.send("Done addind session");
		res.status(200);
		res.set('Content-Type', 'application/json')
		//res.send(JSON.stringify({session:session}));
		res.send(JSON.stringify({session:session}));
		res.end();
		console.log(session);
		
	}
	else
	{
		res.set('Content-Type', 'application/json')
		res.json({error:true,sessionError:"Server can't add session"});
		res.status(500);
		res.end();
	}
});

app.listen(3037, () => {
console.log('Server is running on port 3037')});
