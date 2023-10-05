const http = require("http");
var postgres = require('pg');

var connection = http.createServer(function(req,res)
{
	
	res.writeHead(200,{"Content-Type": "text/html","Access-Control-Allow-Origin":"*"
				,"Access-Control-Allow-Methods":"POST, GET, PUT, DELETE, OPTIONS","Access-Control-Allow-Credentials":false});
	faire_un_simple_query("Select prenom,nom from individu").then((results)=>{
		res.write("<h1>"+"Hello "+results.first[results.second[0]]+" "+results.first[results.second[1]]+"</h1>");
		res.end();
	},(error)=>
	{
		res.write("<h1>"+"Hello!"+"</h1>"+"<br>");
		res.write("<h2 style=\"color:red\">"+error.first+"</h2>");
		res.end();
	});
});

connection.listen(process.env.PORT || 3035);
//require('dotenv').config();


async function faire_un_simple_query(queryString)
	{
		let sql = await exigencebasededonnée();	
		console.log(queryString);
		
		try
		{
			
			let result = await sql.query(queryString);
			
			try
			{
				await sql.end();
			}
			catch(ex){}
			
			return new Promise ((resolve,reject) => 
			{
						
				if(result == undefined)
				{
					reject({first:result,second:false});
				}
				else
				{
					if(result.rows == undefined)
					{
						let tempfirst = [];
						result.forEach((element)=>
						{
							tempfirst.push({first: element.rows,second:element.fields});
						});
						
						resolve(tempfirst);
					}
					else
					resolve({first:result.rows,second:result.fields});
				}
						
			});
		}
		catch(ex)
		{
			try
			{
				await sql.end();
			}
			catch(e)
			{
				
			}
			console.log("Exception caught");
			return new Promise((resolve,reject)=>{reject({first:ex,second:false});});
		}		
	}
	
	
	async function exigencebasededonnée()
	{	
		try 
		{	
			var postgresConnection = new postgres.Client("postgres://default:QHiOur92EwzF@ep-patient-darkness-72544749.us-east-1.postgres.vercel-storage.com:5432/verceldb"+ "?sslmode=require");
			await postgresConnection.connect();
			return new Promise ((resolve,reject) => 
			{
				console.log("Database connection successfull.");
				resolve(postgresConnection);	
			});
		}
		catch(ex)
		{
			return new Promise ((resolve,reject) => 
			{
				console.log("Database Connection not successful.");	
				reject(postgresConnection);
			});
		}
		//console.log(postgresConnection);
	}