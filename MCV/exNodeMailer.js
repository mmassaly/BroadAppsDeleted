var http = require("http");
//var nodeMailer = require("nodemailer")
var url = require("url");
var fs = require("fs");

function startMailingServer()
{
	console.log("Inside mailing server.");
	var server = http.createServer(function(req,res)
	{
		console.log(req.method);
		if (req.method === 'OPTIONS') 
		{
		  console.log('!OPTIONS');
		  var headers = {};
		  // IE8 does not allow domains to be specified, just the *
		  // headers["Access-Control-Allow-Origin"] = req.headers.origin;
		  headers["Access-Control-Allow-Origin"] = "*";
		  headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
		  headers["Access-Control-Allow-Credentials"] = false;
		  headers["Access-Control-Max-Age"] = '86400'; // 24 hours
		  headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
		  res.writeHead(200, headers);
		  res.end();
		}
		else if(req.method === 'POST')
		{
			var reqData = "";
			req.on("data",function(data)
			{
				reqData += data;
			}).on("end",()=>{
			
				console.log("Inside post..."+reqData+"..."+req.url+"..."+queryObj);
				var queryObj;
				if(reqData == "")
					queryObj = url.parse(req.url).query;
				else
					queryObj = JSON.parse(reqData);
				
				
				var senderMail = queryObj.senderMail;
				var senderPassword = queryObj.senderPassword;
				var senderContent = queryObj.senderContent;
				var senderSubject = queryObj.senderSubject;
				var receiverEmails = queryObj.receiverEmails;
				
				var stage1SenderMail = senderMail.split("@");
				var servicestage1 =(stage1SenderMail.length > 0)?stage1SenderMail[stage1SenderMail.length -1]:"";
				var serviceName = servicestage1.split(".")[0];
				var contenuEnvoye = false;
				console.log("Passed data..."+senderMail + " "+senderPassword+" "+senderContent+" "+senderSubject+" "+receiverEmails);
				
				for(let i = 0; i < receiverEmails.length;++i)
				{
					if(i == 0)
						contenuEnvoye = true;
					//var mailTransporter = nodeMailerCreateTransporter(serviceName,senderMail,senderPassword);
					//sendMail(mailTransporter,senderMail,receiverEmails[i],senderSubject,senderContent);
					/*var promise = new Promise( function(resolve,reject)
					{
						nodeMailerSendMail(mailTransporter,senderMail,receiverEmails[i],senderSubject,senderContent,resolve,reject);
					});
					promise.then(function(value,error)
					{
						if(err)
							contenuEnvoye = contenuEnvoye && false;
						else if(value)
							contenuEnvoye = contenuEnvoye && true;
						console.log((contenuEnvoye)?"Contenu envoyé.":"Contenu non envoyé.");
					});*/
				}
				
				if(contenuEnvoye)
				{
					res.writeHead(200,{'Content-Type':'text/html'});
					res.write("<p>Contenu envoyé avec succès.</p>");
				}
				else
				{
					res.writeHead(500,{'Content-Type':'text/html'});
					res.write("<p>Contenu non envoyé.</p>");
				}
				res.end();
			});
		}
		else
		{
			/*console.log("Inside request method "+req.method);
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
						res.end();
					console.log("Image file does not exist.");
				});*/
				res.end();
			}
			else
			{
				/*fs.readFile("SelfDescription.htm",function(err,data)
				{
					console.log(data);
					if(data != undefined)
					{
						res.writeHeader(200,{"Content-Type":"text/html"});
						res.write(data);
						res.end();
					}
					else
						res.end();
				});*/
				res.writeHeader(200,{"Content-Type":"text/html"});
						res.write("<h1>Hello Mamadou</h1>");
						res.end();
			}
		}
	});
	
	server.listen(process.env.PORT || 3033);
	//server.listen(process.env.PORT||3000);
	//server.listen(3000);
	console.log("Mailing server listening.");
}
/*
function nodeMailerCreateTransporter (serviceSpec,userSpec,passSpec)
{
	var transporterObject = 
	{
			service: serviceSpec,
			secure: true,
			auth: 
			{
				user: userSpec,
				pass : passSpec
			},
			tls:
			{
				rejectUnauthorized: false
			}
	};
	console.log(transporterObject);
	return nodeMailer.createTransport(transporterObject);
}

async function nodeMailerSendMailHTML(mailTransporter,senderMail,receiverEmail,subjectPassed,content,resolve,reject)
{
	var mailObject = 
	{
		from: senderMail,
		to: receiverEmail,
		subject: subjectPassed,
		html: content
	};
	await mailTransporter.sendMail(mailObject,function(err,info)
	{
		if(err)
			return reject(err);
		else
			return resolve(info);
	});
}

async function nodeMailerSendMail(mailTransporter,senderMail,receiverEmail,subjectPassed,content,resolve,reject)
{
	var mailObject = 
	{
		from: senderMail,
		to: receiverEmail,
		subject: subjectPassed,
		text: content
	};
	await mailTransporter.sendMail(mailObject,function(err,info)
	{
		if(err)
			return reject(err);
		else
			return resolve(info);
	});
}

function sendMail(mailTransporter,senderMail,receiverEmail,subjectPassed,content)
{
	var mailObject = 
	{
		from: senderMail,
		to: receiverEmail,
		subject: subjectPassed,
		text: content
	};
	console.log(mailObject);
	mailTransporter.sendMail(mailObject,function(error, info){
	  if (error) {
		console.log('Email not sent '+error);
	  } else {
		console.log('Email sent: ' + info.response);
	  }
	});
}
*/
startMailingServer();
