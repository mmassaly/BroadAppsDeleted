var http = require("http");

var reqOptions =
{
	hostname: 'https://ahaynnm8butrk7li.public.blob.vercel-storage.com/assets/images/profile-pictures/Mamadou%2520Massaly%2520PF1-SP0Rei9UCPTwgZo1RhNEIH6qJpVUMD.jpg',
	method: "GET",
};

function doRequest(reqOptions)
{
	let req = http.request(reqOptions,function(res)
	{
		let data ="";

		res.on("data",function(chunk)
		{
			data += chunk;
		});
		res.on("end",function()
		{
			let reqObject = JSON.parse(data);
			console.log(reqObject.OK);
		});
	});

	req.on('error', (e) => {
	  console.error(`problem with request: ${e.message}`);
	});

	// write data to request body
	req.end();
}


module.exports = {reqOptions,doRequest};

