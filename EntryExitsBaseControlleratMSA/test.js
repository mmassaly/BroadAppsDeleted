let schema = "mdatabase";
//var postgres = require('postgres');
var postgres = require('pg');
var queryArgs = [];

/* faire_un_simple_query(18,['appartenance','1-23','1']).then((res)=>{
	faire_un_simple_query(19,['login','1-23','pwd','1','0','0','0']).then((resa)=>
	{
		console.log(resa);
	},(erra)=>
	{
		console.log(erra);
	});
	console.log(res);
},(err)=>
{
	console.log(err);
}); */

faire_un_simple_query("Select * from individu inner join appartenance ON appartenance.IDIndividu =  individu.ID inner join \"location du bureau\" ON  appartenance.IDBureau = \"location du bureau\".ID  where \"location du bureau\".ID = 1 AND to_date(individu.Début,'YYYY') <= 2023 AND to_date(individu.Fin,'YYYY') >=2023;").then((resa)=>
	{
		console.log(resa);
	},(erra)=>
	{
		console.log(erra);
	});

async function exigencebasededonnée()
{		
	var postgresConnection = new postgres.Client("postgres://default:QHiOur92EwzF@ep-patient-darkness-72544749.us-east-1.postgres.vercel-storage.com:5432/verceldb"+ "?sslmode=require");
	await postgresConnection.connect();
	//console.log(postgresConnection);
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

async function faire_un_simple_query(queryString)
{
	let sql = await exigencebasededonnée();	
	let results = undefined;
	
	try
	{
		results = await sql.query(queryString);
		await sql.end();
		
		return new Promise ((resolve,reject) => 
		{
					
			if(results == undefined)
			{
				console.log(results);
				reject({first:results,second:false});
			}
			else
			{
				console.log(results);
				let firstArray = [];
				let secondArray = [];
						
				results.rows.forEach
				((element)=>
				{
					firstArray.push(Object.values(element));
					secondArray.push(Object.keys(element));
				});
						
				resolve({first:firstArray,second:secondArray});
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
		console.log("Query Exception caught");
		return new Promise((resolve,reject)=>{reject({first:ex,second:false});});
	}		
}

async function faire_un_simple_query_inefficient_redo_case_maker_from_postgres_inside_renegade_txt (number,queryArgsParam)
{
		try
		{
			let sql = await exigencebasededonnée();	
			let results = undefined;
			if(number == 1 )
			{
				results = await sql`select id from individu;`;
			}
			else if(number == 2)
			{
				results = await sql`SELECT  * FROM individu inner join login on individu.ID = login.IDIndividu inner join appartenance on individu.ID = appartenance.IDIndividu inner join \"location du bureau\" as A on A.ID = appartenance.IDBureau;`; 
			}
			else if( number == 3)
			{
				results = await sql`Select * from \"manuel des tables d'entrées et de sorties\" where \"manuel des tables d'entrées et de sorties\".Année = '${queryArgsParam[0]}';`
			}
			else if (number == 4)
			{
				results = await sql `SELECT  * FROM individu inner join login on individu.ID = login.IDIndividu inner join appartenance on individu.ID = appartenance.IDIndividu inner join \"location du bureau\" as A on A.ID = appartenance.IDBureau;`;
			}
			else if (number == 5)
			{
				results = await sql`SELECT  * FROM individu inner join login on individu.ID = login.IDIndividu;`;
			}
			else if ( number == 6 )
			{
				results = await sql`SELECT IDIndividu,SuperAdmin, Admin, \"User\",Password FROM login inner join individu ON individu.ID = login.IDIndividu;`;
			}
			else if (number == 7)
			{
				if(queryArgsParam.length == 0)
				{
					results = await sql`Select * from \"location du bureau\";`;
				}
				else
				{
					results = await sql`Select * from \"location du bureau\" where \"location du bureau\".ID = ${queryArgsParam[0]};`;
				}
			}
			else if (number == 8)
			{
				results = await sql ``;
			}
			else if (number == 9)
			{
				results = await sql`Select * from \"manuel des tables d'entrées et de sorties\";`;
			}
			else if (number == 10) 
			{
				results = await sql`Select * from \"manuel des tables d'entrées et de sorties\" where \"Année\" = ${queryArgsParam[0]};`;
			}
			else if (number == 11)
			{				
				results = await sql`Select * from individu inner join appartenance ON appartenance.IDIndividu =  individu.ID inner join \"location du bureau\" ON
				appartenance.IDBureau = \"location du bureau\".ID  where \"location du bureau\".ID = ${queryArgsParam[0]} AND DATE_FORMAT(individu.Début,\"%YYYY\") 
				<=  ${queryArgsParam[1]} AND DATE_FORMAT(individu.Fin,\"%YYYY\") >= ${queryArgsParam[2]};
				`;
			}
			else if(number == 12)
			{
				results = await sql`Select * from individu inner join appartenance ON appartenance.IDIndividu =  individu.ID inner join \"location du bureau\" ON
				appartenance.IDBureau = \"location du bureau\".ID  where \"location du bureau\".ID = ${queryArgsParam[0]} AND DATE_FORMAT(individu.Début,\"%YYYY\") 
				<=  ${queryArgsParam[1]} AND DATE_FORMAT(individu.Fin,\"%YYYY\") >= ${queryArgsParam[2]} AND individu.ID = '${queryArgsParam[3]};';
				`;				
			}
			else if (number == 13)
			{
				results = await sql`Select IF(MIN(A.Entrées) > '10:00:00',1,0),IF(MIN(A.Entrées) > '8:30:00',1,0),MIN(A.Entrées) FROM 
						\"${queryArgsParam[0]}\" as A where A.IDIndividu ='${queryArgsParam[1]}' AND A.Date = '${queryArgsParam[2]}';`;
			}
			else if (number == 14)
			{
				results = await sql `Select * FROM \"${queryArgsParam[0]}\" inner join appartenance ON \"${queryArgsParam[1]}\".IDIndividu =
				appartenance.IDIndividu inner join individu ON \"${queryArgsParam[2]}\".IDIndividu = individu.ID
				where individu.ID = '${queryArgsParam[3]}' AND \"${queryArgsParam[4]}\".Date ='${queryArgsParam[5]}';`;
			}
			else if (number == 15)
			{
				results = await sql `Select * FROM \"${queryArgsParam[0]}\" as A where A.IDIndividu ='${queryArgsParam[1]}' AND A.Date = '${queryArgsParam[2]}';`;
			}
			else if (number == 16)
			{
				results = await sql`insert into ${queryArgsParam[0]} values ('${queryArgsParam[1]}','${queryArgsParam[2]}',
									'${queryArgsParam[3]}','${queryArgsParam[4]}','${queryArgsParam[5]}','${queryArgsParam[6]}',
									'${queryArgsParam[7]}','${queryArgsParam[8]}','${queryArgsParam[9]}');`;
			}
			else if(number == 17)
			{
				console.log(`insert into ${queryArgsParam[0]} values ('${queryArgsParam[1]}','${queryArgsParam[2]}','${queryArgsParam[3]}','${queryArgsParam[4]}','${queryArgsParam[5]}','${queryArgsParam[6]}');`);
				results = await sql`insert into ${queryArgsParam[0]} values ('${queryArgsParam[1]}','${queryArgsParam[2]}','${queryArgsParam[3]}','${queryArgsParam[4]}','${queryArgsParam[5]}','${queryArgsParam[6]}');`;
			}
			else if(number == 18)
			{
				console.log(`insert into ${queryArgsParam[0]} values ('${queryArgsParam[1]}',${queryArgsParam[2]});`);
				results = await sql`insert into ${queryArgsParam[0]} values ('${queryArgsParam[1]}',${queryArgsParam[2]});`;
			}
			else if (number == 19)
			{
				console.log(`insert into ${queryArgsParam[0]} values ('${queryArgsParam[1]}','${queryArgsParam[2]}',${queryArgsParam[3]},
									${queryArgsParam[4]},${queryArgsParam[5]},${queryArgsParam[6]});`);
				results = await sql`insert into ${queryArgsParam[0]} values ('${queryArgsParam[1]}','${queryArgsParam[2]}',${queryArgsParam[3]},
									${queryArgsParam[4]},${queryArgsParam[5]},${queryArgsParam[6]});`;	
			}
			
			await sql.end();
			return new Promise ((resolve,reject) => 
			{
				
				if(results == undefined)
				{
					console.log(results);
					reject({first:results,second:false});
				}
				else
				{
					console.log(results);
					let firstArray = [];
					let secondArray = [];
					
					results.rows.forEach
					((element)=>
					{
						firstArray.push(Object.values(element));
						secondArray.push(Object.keys(element));
					});
					
					resolve({first:firstArray,second:secondArray});
				}
				
			});
		}
		catch(ex)
		{
			console.log("Exception caught");
			return new Promise((resolve,reject)=>{reject({first:ex,second:false});});
		}		
}