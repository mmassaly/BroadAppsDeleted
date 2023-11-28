var vercelBlob = require("@vercel/blob");
var fs = require('fs');
require ('dotenv').config();

async function getListandDeleteContent() 
{
	try
	{
		let list = await vercelBlob.list({token:process.env.token}) ;
		console.log(list);
		list.blobs.forEach(async (element)=>
		{
			console.log(element);
			await vercelBlob.del(element.url,{token:process.env.token});
		});
	}
	catch(ex)
	{
		console.log(ex);
	}
}

getListandDeleteContent();