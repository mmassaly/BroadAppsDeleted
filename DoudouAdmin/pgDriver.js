var postgres = require('pg');
var fs = require('fs');

async function exigencebasededonnée()
{	
		try 
		{	
			let postgresConnection = new postgres.Client("postgres://default:kN2CwOSMv4Xf@ep-flat-hall-85299716.us-east-1.postgres.vercel-storage.com:5432/verceldb"+"?sslmode=require");
			await postgresConnection.connect();
			return new Promise ((resolve,reject) => 
			{
				//console.log("Database connection successfull.");
				resolve(postgresConnection);	
			});
		}
		catch(ex)
		{
			console.log("Erreur");
			//console.log(postgresConnection);
			console.log(ex);
			return new Promise ((resolve,reject) => 
			{
				//console.log("Database connection not  successfull.");
				resolve(undefined);	
			});
		}
}

async function faire_un_simple_query(queryString)
{
		let sql = undefined;	
		//console.log(queryString);
		while(sql == undefined)
		{
			try
			{
				sql = await exigencebasededonnée();
			}
			catch(ex)
			{
				
			};
		};
		
		try
		{
			
			let result = await sql.query(queryString);
			
			try
			{
				await sql.end();
			}
			catch(ex){ }
			
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
					{
						resolve({first:result.rows,second:result.fields});
					}
				}
						
			});
		}
		catch(ex)
		{
			
			console.log(ex);
			console.log("Exception caught");
			console.log(ex.message);
			console.log(queryString); 
			try
			{
				await sql.end();
			}
			catch(e)
			{
			}
			
			return new Promise((resolve,reject)=>{resolve({first:ex,second:false});});
		}		
}

function createListOfQueriesFromResults(results,target,indexInsert,indexInsertValue)
{
	let caseResults = results;
	let values = [];
	
	console.log(results.length);
	console.log(results.first.length);
	console.log(results.second.length);
	let query_string = "";

	results.first.forEach( res => 
	{
		let current_query = "insert into \""+target+"\" values (";
		results.second.forEach( (field,index) => 
		{
			if( Object.keys(res).length > 0 && index + 1 < results.second.length)
			{
				if( index > 0 )
				{
					if( index == indexInsert )
					{
						current_query += ",$$"+indexInsertValue+"$$,$$"+getDate(res[field.name])+"$$";
					}
					else 
					{
						current_query += ",$$"+getDate(res[field.name])+"$$";
					}
				}
				else
				{
					if( index == indexInsert )
					{
						current_query += "$$"+indexInsertValue+"$$,$$"+getDate(res[field.name])+"$$";
					}
					else 
					{
						current_query += "$$"+getDate(res[field.name])+"$$";
					}
				}
				
				if((res[field.name] instanceof Date))
					console.log(res[field.name].getFullYear());
			}
		});
		current_query += ");\n";
		query_string += current_query;	
		if( Object.keys(res).length > 0)
		{
			values.push(current_query);	
		}
	});
	writeQueryList(values,"Base plainte PAP 2",query_string);
	return query_string;
}
function getDate(value)
{
	if ( value  instanceof Date )
	{
		const dt = value.toLocaleDateString().split('/');
		console.log(dt);
		console.log(value);
		return dt[2]+"-"+dt[1]+"-"+dt[0];
	}
	return value;
}
function writeQueryList(arrayValues,base,stringValues)
{
	arrayValues.forEach( async (el) => 
	{
		try
		{
			await faire_un_simple_query(el);
		}
		catch(err)
		{
			console.log(err);	
		}
	});
	fs.writeFileSync(base+'.sql',stringValues);
}

async function start()
{
	try
	{
		let dbcreateQuery = "drop table IF EXISTS \"Base plainte PAP 2\";\n";
		dbcreateQuery += 'create table "Base plainte PAP 2"( "Emprise" TEXT,'
		+ '"Numéro de la réclamation" VARCHAR(255),'
		+ '"Date" Date,"Prénom et Nom du plaignant" VARCHAR(255) ,'
		+ '"Sexe" VARCHAR(255),"Quartier ou village" VARCHAR(255),'
		+ '"Code PAP (si recensée)" VARCHAR(255),'
		+ ' "Fonction du Plaignant" VARCHAR(255), "Parties concernées" TEXT,'
		+ '"Objet de réclamation" TEXT,"Description de la réclamation" TEXT,'
		+ '"Solutions préconisées par le plaignant" VARCHAR(255),"Plainte enregistrée par" TEXT,'
		+ ' "Recevabilité de la plainte après examen de l\'UGP" TEXT,'
		+ '"Commentaires" VARCHAR(255),"Solutions proposées" TEXT,'
		+ ' "Responsable de l’action" TEXT,'
		+ ' "Echéance" Date,'
		+ '"Actions effectuées par l’entreprise" TEXT,'
		+ '"Date de clôture de la plainte" Date,"Numéro de Téléphone" varchar(255),"id" integer,"idindividu" integer);'
		await faire_un_simple_query(dbcreateQuery);
		const selectQuery = await faire_un_simple_query("select * from \"Base plainte PAP\";");
		const query_list = createListOfQueriesFromResults(selectQuery,"Base plainte PAP 2",20,"");
		let db = 'alter table "Base plainte PAP 2" ADD PRIMARY KEY("Emprise",'
		+ '"Numéro de la réclamation",'
		+ ' "Date","Prénom et Nom du plaignant","Sexe","Quartier ou village","Code PAP (si recensée)",'
		+ ' "Fonction du Plaignant","Parties concernées",'
		+ '"Objet de réclamation","Description de la réclamation",'
		+ '"Solutions préconisées par le plaignant","Plainte enregistrée par",'
		+ '"Recevabilité de la plainte après examen de l\'UGP",'
		+  '"Commentaires","Solutions proposées",'
		+ ' "Responsable de l’action",'
		+ '"Echéance",'
		+ '"Actions effectuées par l’entreprise",'
		+ '"Date de clôture de la plainte","Numéro de Téléphone",id,idindividu'
		+ ');';
		await faire_un_simple_query(db);
		
	}
	catch(err)
	{
		console.log(err);
	}
}
start();