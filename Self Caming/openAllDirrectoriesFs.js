var fs = require("fs");
	

async function start(pathsofInterest,cb)
{
	console.log("Start");
	console.log(cb);
	try
	{
		let pathCount = 0;
			
		if(pathCount < pathsofInterest.length)
		{
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
							cb(element.name);
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
	catch(ex)
	{
		console.log(ex);
	}
}

module.exports = {start};