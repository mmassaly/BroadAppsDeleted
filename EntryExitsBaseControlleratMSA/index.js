var postgres = require('@vercel/postgres');
require('dotenv').config();
const http = require("http");

var connection = http.createServer(function(req,res)
{
	res.writeHead(200,{"Content-Type": "text/html","Access-Control-Allow-Origin":"*"
				,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false});
	faire_un_simple_query("select id from individu;").then((result)=>{
		res.write("<p>"+result[0]+"</p>");
		res.end();
	},(error)=>
	{
		res.write("<p>"+error.first+"</p>");
		res.end();
	});
});

connection.listen(process.env.PORT || 3035);


async function faire_un_simple_query (querydemysql)
{
	try
	{
		
		let sql = postgres.sql;
		let results = await sql`${querydemysql}`;
		
		return new Promise ((resolve,reject) => 
		{
			sql.close();
			if(results == undefined)
			{
				console.log(results);
				reject({first:err,second:false});
			}
			else
			{
				console.log(results);
				resolve({first:Object.values(results),second:Object.Keys(results)});
			}
			
		});
	}
	catch(ex)
	{
		console.log("Exception caught");
		return new Promise((resolve,reject)=>{reject({first:ex,second:false});});
	}		
}