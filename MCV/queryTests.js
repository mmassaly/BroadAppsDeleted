

class ImageFilesContainer
{
	urlandValues;
	postgres;
	fs;
	pgConnection;
	
	constructor()
	{
		this.urlandValues = {};
		this.postgres = require('pg');
		this.fs = require('fs');
		this.pgConnection = undefined;
		this.init();
	}
	
	async init()
	{
		let res = await this.query(undefined);
		await this.processRows(res);
		console.log(this.urlandValues);
	}
	
	async  queryGetUrlElement(urlElement,connection)
	{
		let pgConnection = (connection == undefined)?await this.exigencebasededonnée():connection;
		let res = await pgConnection.query('select * from blobsholder where url=\''+urlElement+'\';');
		pgConnection.end();
		return res;
	}
	
	async  query(connection)
	{
		let pgConnection = (connection == undefined)?await this.exigencebasededonnée():connection;
		let res = await pgConnection.query('select * from blobsholder');
		pgConnection.end();
		return res;
	}

	processRows(res)
	{
		res.rows.forEach((element)=>
		{
			this.addUrl(element[res.fields[0].name],element[res.fields[1].name]);
		});
	}
	
	addUrl(elementName,elementValue)
	{
		this.urlandValues[elementName] = elementValue;
	}
	
	async exigencebasededonnée()
	{	
		try 
		{	
			let postgresConnection = new this.postgres.Client("postgres://default:QHiOur92EwzF@ep-patient-darkness-72544749.us-east-1.postgres.vercel-storage.com:5432/verceldb"+ "?sslmode=require");
			await postgresConnection.connect();
			this.pgConnection = postgresConnection;
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
	
	async findUrlBufferValue(url)
	{
		if(this.print_count ==  0)
			++this.print_count;
		try
		{
			let tempValue = this.urlandValues[url];
			if(this.print_count == 1)
			{
				//console.log(url);
				//console.log(this.urlandValues);
				++this.print_count;
			}
			
			if(tempValue == undefined)
			{
				let res = await this.queryGetUrlElement(url,undefined);
				this.processRows(res);
				return this.findUrlBufferValue(url);
			}
			else
			{
				return tempValue;
			}
			
		}
		catch(error)
		{
			console.log(error);
			return error;
		}
	}
	
	print_count = 0;
}	

module.exports = {ImageFilesContainer};