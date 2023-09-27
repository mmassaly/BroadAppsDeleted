let schema = "mdatabase";
var postgres = require('postgres');

faire_un_simple_query("select id from individu;").then((res)=>{
	
	console.log(res);
},(err)=>
{
	console.log(err);
});

async function exigencebasededonnée()
{		
	var postgresConnection = postgres("postgres://default:QHiOur92EwzF@ep-patient-darkness-72544749.us-east-1.postgres.vercel-storage.com:5432/verceldb"+ "?sslmode=require");
	console.log(postgresConnection);
	return new Promise ((resolve,reject) => 
	{
		if(postgresConnection == undefined)
		{		
			console.log("Database Connection not successful");	
			reject(postgresConnection);
		}
		else 
		{
			resolve(postgresConnection);
		}
	});
}

async function faire_un_simple_query (querydemysql)
{
	try
	{
		let sql = await exigencebasededonnée();	
		let results = await sql`${querydemysql}`;
		
		return new Promise ((resolve,reject) => 
		{
			
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