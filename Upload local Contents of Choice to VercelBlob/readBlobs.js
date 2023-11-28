require ('dotenv').config();
var vercelBlob = require("@vercel/blob"); 
var doRequest = require('./BlobRequest.js').doRequest;

		
async function getListandReadContent() 
{
		let blobs = [];
		try
		{
			let list = await vercelBlob.list({token:process.env.token}) ;
			await list.blobs.forEach(async (element)=>
			{
				let blob = await vercelBlob.head(element.url,{token:process.env.token});
				console.log(blob);
				let reqOptions = {hostname:element.url,method:"GET"};
				//doRequest(reqOptions); not calling blobrequests element unable to perform the retrieaval
				fetch(element.url,{method:"GET"}).then(data=>{return data.content}).then(res=>(console.log(res)));//logs undefined
				blobs.push(blob);
			});
		}
		catch(ex)
		{
			console.log(ex);
		}
		return blobs;
}

getListandReadContent();