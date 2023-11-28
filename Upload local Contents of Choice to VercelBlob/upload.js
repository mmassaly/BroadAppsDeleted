var vercelBlob = require("@vercel/blob");
var fs = require('fs');
require ('dotenv').config();
var paths = ['C:\\Users\\Mamadou\\Desktop\\WebPages\\Project Timing\\my-app\\src\\assets\\images'];
//paths = ['C:\\Users\\Mamadou\\Desktop\\WebPages\\Project Timing Phone\\TestProject\\platforms\\android\\app\\build\\outputs\\apk\\debug'];
var directories = ["assets/images/profile-pictures/","apks/"];

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
							//console.log(element.name+" element instanceof file is "+(element instanceof File));
							let file_ico = element.name.split(".");
							file_ico = file_ico[file_ico.length-1];
							
							let element_dup = element;
							let data = fs.readFileSync(notGivenPath+"\\"+element_dup.name);
							
							if(data)
							{
								if(file_ico != "json" && file_ico != "txt")
								{
									var directories = ["assets/images/profile-pictures/","apks/"];
									var commandContentTypes = ['image/'+file_ico,"application/vnd.android.package-archive"];
									var txtNames = ["imagefileslocaldb.txt","apks.txt"];
									console.log(element);
									const blob = await vercelBlob.put(directories[0]+element_dup.name,data, {
											access: 'public',
											contentType:commandContentTypes[0] ,
											token: process.env.token
									});
										
									console.log(blob);
									fs.appendFile(txtNames[0],directories[0]+element_dup.name+" : "+blob.url+"\n",function(err)
									{
										if (err) throw err;
									});
								}
							}
							
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







