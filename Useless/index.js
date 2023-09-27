const express = require("express");
var url = require("url");
var fs = require("fs");
var app = express();

app.get('/(|([a-zA-z]|[0-9]|[éçèàêîÂ])*)', function(req,res)
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
			
			console.log("Image type "+imageType);
			
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
								res.set('Content-Type','text/html');
								res.status(200).send("<h1>"+err+"</h1>");
								res.end();
							}
							else if(data)
							{
								res.set("Content-Type","image/"+imageType);
								res.status(200).send(data);
								res.end();
							}
						});
					}
					else
						res.end();
					console.log("Image file does not exist.");
				});
			}
			else
			{*/
				/*fs.readFile("SelfDescription.htm",function(err,data)
				{
					console.log(data);
					if(err != undefined)
					{
						res.set('Content-Type','text/html');
						res.status(200).send("<h1>"+err+"</h1>");
						res.end();
					}
					else
					if(data != undefined)
					{
						res.set("Content-Type","text/html");
						res.status(200).send(data);
						res.end();
					}
					else
						res.end();
				});*/
			//}
			res.set('Content-Type','text/html');
			res.status(200).send("<h1>Hello World</h1>");
			res.end();
} );

app.listen(3033);
