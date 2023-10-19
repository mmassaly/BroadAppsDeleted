var vercelBlob = require("@vercel/blob");
var fs = require('fs');
require ('dotenv').config();
var paths = ['C:\\Users\\Mamadou\\Desktop\\WebPages\\Project Timing\\my-app\\src\\assets\\images'];

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
				let notGivenPath = pathsofInterest[pathCount];
				
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
							console.log(element.name+" element instanceof BLOB is "+(element instanceof Blob));
							let file_ico = element.name.split(".")[1];
							
							let element_dup = element;
							fs.readFile(notGivenPath+"\\"+element_dup.name,async function(err,data)
							{
								const blob = await vercelBlob.put("assets/images/"+element_dup.name,data, {
										access: 'public',
										contentType:'image/'+element_dup.mimetype ,
										token: process.env.token
								});
								console.log(blob);
								fs.appendFile("imagefileslocaldb.txt","assets/images/"+element_dup.name+" : "+blob.url+"\n",function(err)
								{
										if (err) throw err;
								}); 
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







