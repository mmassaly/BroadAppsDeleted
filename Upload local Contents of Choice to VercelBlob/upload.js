var vercelBlob = require("@vercel/blob");
var fs = require('fs');
require ('dotenv').config();
var paths = ['C:\\Users\\Mamadou\\Desktop\\WebPages\\Project Timing\\my-app\\src\\assets\\icons'];

async function start(pathsofInterest)
{
	try
	{
		let pathCount = 0;
		do 
		{
			if(pathCount < pathsofInterest.length)
			{
				console.log(pathsofInterest[pathCount]);
				console.log(pathCount);
				console.log(pathsofInterest.length);
				console.log(pathsofInterest);
				fs.opendir(pathsofInterest[pathCount],async function(err,dirstuff)
				{
					if(err)
					{
						console.log(err);
						return;
					}
					else
						console.log(dirstuff);
					
					let pathsInner = [];
					let element = await dirstuff.read();
					while(element != null)
					{
						if(element.isFile())
						{
							console.log(element.name);
							let file_ico = element.name.split(".")[1];
							console.log(file_ico);
							const blob = await vercelBlob.put("assets/images/"+element.name,element, {
										access: 'public',
										contentType:'image/'+file_ico ,
										token: process.env.token
							});
							console.log(blob);
							fs.appendFile("imagefileslocaldb.txt","assets/images/"+element.name+" : "+blob.url+"\n",function(err)
							{
								if (err) throw err;
							});
						}
						
						if(element.isDirectory())
						{
							start([element.path]);
						}
						
						element = await dirstuff.read();
					}
				});
				
				++pathCount;
			}
		}
		while(paths.length > pathCount);
	}
	catch(ex)
	{
		console.log(ex);
	}

}

start(paths);







