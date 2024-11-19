var { ImageFilesContainer } = require("C:\\Users\\Mamadou\\Documents\\GitHub\\BroadAppsDeleted\\MCV\\api\\queryTests.js");
let imageDictionary = new ImageFilesContainer();

let query = "create or replace function c() returns table(id text)";
query += "\nLANGUAGE plpgsql\n";
query += "\nAS $$\n";
query += "\nDECLARE\n";
query += "\n    row RECORD;\n";
query += "\nBEGIN\n";
query += "\nfor row in SELECT * from individu\n"; 
query += "   LOOP\n";
query += "        id := row.id;\n";
query += "        RETURN NEXT;\n";
query += "    END LOOP;\n";
query += "END;\n";
query += "$$;\n";
query += "Select * from c();";
//console.log(query);

query = "create or replace function openTables() returns TABLE(A integer, B varchar(255), C varchar(255)) AS\n"
+"$$\n"
+"	DECLARE\n"
+"	row RECORD;\n"
+"	BEGIN\n"
+"	For row in Select * from \"manuel des tables d'entrées et de sorties\" as H (A,B,C)\n"
+"	LOOP\n"
+"		A := row.A;\n"
+"		B := row.B;\n"
+"		C := row.C;\n"
+"		RETURN NEXT;\n"
+"	END LOOP;\n"
+"	END;\n"
+"$$\n"
+"LANGUAGE plpgsql;\n"
+"Select * from openTables();\n";

let queryTwo = "create or replace function openTablesTwo() returns text AS\n"
+"$$\n"
+"	DECLARE\n"
+"	row RECORD;\n"
+"	A text :='';\n"
+"	B text :='';\n"
+"	C text :='';\n"
+"	count int:= 0;\n"
+"	BEGIN\n"
+"	For row in Select * from \"manuel des tables d'entrées et de sorties\" as H (A,B,C)\n"
+"		LOOP\n"
+"			IF count = 0 THEN\n" 
+"				A := CONCAT ('Select * FROM ','\"', row.B,'\"');\n"
+"				B := CONCAT ('Select * FROM ','\"',row.C,'\"');\n"
+"			END IF;\n"
+"			IF count > 0 THEN\n"
+"				A := CONCAT ('union Select * FROM ','\"', row.B,'\"');\n"
+"				B := CONCAT ('union Select * FROM ','\"',row.C,'\"');\n"
+"			END IF;\n"
+"			count := count + 1;\n"
+"		END LOOP;\n"
+"		C := CONCAT(A,';\n',B,';\n');\n"
+"		RETURN C;\n"
+"	END;\n"
+"$$\n"
+"LANGUAGE PLPGSQL;\n"
+"SELECT * FROM openTablesTwo();";

let queryThree = "drop function openTablesTwo;\ncreate or replace function openTablesTwo() returns  TABLE(Année integer,\"Etat de l'individu\" varchar(255),Nom varchar(255)) AS\n"
+"$$\n"
+"	DECLARE\n"
+"	row RECORD;\n"
+"	A text :='';\n"
+"	C text :='';\n"
+"	count int:= 0;\n"
+"	BEGIN\n"
+"	For row in Select * from \"manuel des tables d'entrées et de sorties\" as H (A,B,C)\n"
+"		LOOP\n"
+"			IF count = 0 THEN\n" 
+"				A := CONCAT ('Select * FROM ','\"', row.B,'\"');\n"
+"			END IF;\n"
+"			IF count > 0 THEN\n"
+"				A := CONCAT ('union Select * FROM ','\"', row.B,'\"');\n"
+"			END IF;\n"
+"			count := count + 1;\n"
+"		END LOOP;\n"
+"		C := CONCAT(A,';\n');\n"
+"		EXECUTE C;\n;"
+"	END;\n"
+"$$\n"
+"LANGUAGE PLPGSQL;\n"
+"SELECT * FROM openTablesTwo();";

queryThree = "drop function openTablesThree();create or replace function openTablesThree() returns TABLE(Année integer,\"Etat de l'individu\" varchar(255),Nom varchar(255)) AS\n"
+"$$\n"
+"	DECLARE\n"
+"	row RECORD;\n"
+"	B text :='';\n"
+"	C text :='';\n"
+"	count int:= 0;\n"
+"	BEGIN\n"
+"	For row in Select * from \"manuel des tables d'entrées et de sorties\" as H (A,B,C)\n"
+"		LOOP\n"
+"			IF count = 0 THEN\n" 
+"				B := CONCAT ('\"',row.C,'\"');\n"
+"				Select * FROM row.C;\n"
+"			END IF;\n"
+"			IF count > 0 THEN\n"
+"				B := CONCAT ('\"',row.C,'\"');\n"
+"			END IF;\n"
+"			count := count + 1;\n"
+"		END LOOP;\n"
+"	END;\n"
+"$$\n"
+"LANGUAGE PLPGSQL;\n"
+"Select * from openTablesThree();";

queryThree = "create or replace function a(value text) returns \nTABLE(IDIndividu varchar(255),Date Date,Entrées Time,Sorties VARCHAR(10)) AS\n"
+"$$"
+"BEGIN\n"
+"	RETURN QUERY Select * FROM value;\n"
+"END;\n"
+"$$\n"
+"LANGUAGE PLPGSQL;\n"
+"create or replace function openTablesThree() returns\n TABLE(Année integer,\"Etat de l'individu\" varchar(255),Nom varchar(255)) AS " 
+"\n$$\n"
+"BEGIN\n"
+"	RETURN QUERY Select * FROM \"manuel des tables d'entrées et de sorties\";\n"
+"END;$$\n"
+"LANGUAGE PLPGSQL;\n"
+"rows RECORD;\n"
+"FOR rows IN (Select * from openTablesThree())\n"
+"LOOP\n"
+"	SELECT * From a(rows.Nom);\n"
+"END LOOP;\n"
+"drop function a;\n"
+"drop function openTablesThree;\n";

let queryFour = "drop function openTablesThree();create or replace function openTablesThree() returns TABLE(IDIndividu varchar(255),Date Date,Absence BOOLEAN,Maladie BOOLEAN,Mission BOOLEAN,Congès BOOLEAN) AS\n"
+"$$\n"
+"	DECLARE\n"
+"	row RECORD;\n"
+"	B text :='';\n"
+"	C text :='';\n"
+"	count int:= 0;\n"
+"	BEGIN\n"
+"	For row in Select * from \"manuel des tables d'entrées et de sorties\" as H (A,B,C)\n"
+"		LOOP\n"
+"			IF count = 0 THEN\n" 
+"				B := CONCAT ('Select * FROM ','\"',row.B,'\"');\n"
+"			END IF;\n"
+"			IF count > 0 THEN\n"
+"				B := CONCAT ('union Select * FROM ','\"',row.B,'\"');\n"
+"			END IF;\n"
+"			count := count + 1;\n"
+"		END LOOP;\n"
+"		C := CONCAT(B,';');\n"
+"		RAISE NOTICE '%',C;"
+"		EXECUTE '$1' into  using C;"
+"	END;\n"
+"$$\n"
+"LANGUAGE PLPGSQL;\n";

/*queryThree = "drop function openTablesThree;create or replace function openTablesThree() returns TABLE(IDIndividu varchar(255)) as $$"
+"DECLARE\n"
+"	B text :='SELECT id FROM individu;'\n"
+"BEGIN\n"
+"	EXECUTE '%',B;\n"
+"END;$$\n"
+"LANGUAGE PLPGSQL;\n"
+"	Select * From openTablesThree();";*/
//console.log(queryTwo);
//console.log(queryThree);
//console.log(queryFour);

let empHoursObj = undefined;
let empObj = undefined;
let param_year_month_day = "2023-11-21"; param_year_month_day = undefined;
let paramyear = "2023"; paramyear = undefined;
let locationArgObj = undefined;

if(locationArgObj != undefined)
{
	query += "Select * from \"location du bureau\" where \"location du bureau\".ID = "+locationArgObj.ID+" ORDER BY Id;\n";
}
else if(empObj != undefined)
{
	query += "Select * from \"location du bureau\" where \"location du bureau\".ID = "+empObj.officeID+" ORDER BY Id;\n";
}
else
{
	query += "Select * from \"location du bureau\" ORDER BY Id;\n";
}


if( !(paramyear === undefined  )) 
{
	query = "Select * from \"manuel des tables d'entrées et de sorties\" where Année = "+paramyear+";\n";
}																																		
else if (empHoursObj != undefined)
{
	query = "Select * from \"manuel des tables d'entrées et de sorties\" where Année = "+empHoursObj.date.getFullYear()+";\n";
}
else
{
	query = "Select * from \"manuel des tables d'entrées et de sorties\";\n";
}

query += "Select * from individu inner join appartenance";
query += " ON appartenance.IDIndividu =  individu.ID";
query += " inner join \"location du bureau\" ON  appartenance.IDBureau =";
query += " \"location du bureau\".ID ";
query += (empObj != undefined)?" AND individu.ID = '"+empObj.ID+"';":((empHoursObj != undefined)?" AND individu.ID = '"+empHoursObj.userAuthentification.ID+"';":";");
							
query += "create or replace function c(value text) returns\n"
+"TABLE(IDIndividu varchar(255),Date Date,Absence BOOLEAN,Maladie BOOLEAN,Mission BOOLEAN,Congès BOOLEAN) AS\n"
+"$$\nBEGIN\n"
+"	RETURN QUERY EXECUTE format('Select * FROM %I as A ";
query += ((param_year_month_day != undefined)?(" WHERE A.Date ='"+param_year_month_day+"'"):(empObj != undefined)?" WHERE Idindividu = '"+empObj.ID+"'":(empHoursObj != undefined)? " WHERE IdIndividu = '"+empHoursObj.userAuthentification.ID+"' AND A.Date ='"+empHoursObj.date.getFullYear()+"-"+(empHoursObj.date.getMonth()+1)+"-"+empHoursObj.date.getDate()+"'":"")+" ORDER BY A.Date ASC;',$1);\n"
query += "END;\n"
+"$$\n"
+"LANGUAGE PLPGSQL;\n"
+"\ncreate or replace function d() returns\n"
+"TABLE(IDIndividu varchar(255),Date Date,Absence BOOLEAN,Maladie BOOLEAN,Mission BOOLEAN,Congès BOOLEAN) AS\n"
+"$$"
+"\nDECLARE\n"
+"rows RECORD;\n"
+"\nBEGIN\n"
+"FOR rows IN (Select *  from \"manuel des tables d'entrées et de sorties\")\n"
+"LOOP\n"
+"RETURN QUERY SELECT * FROM c(rows.\"Etat de l'individu\");\n"
+"END LOOP;\n"
+"END;\n"
+"$$\n"
+"LANGUAGE PLPGSQL;\n";

let querybeta = "create or replace function a(value text) returns\n"
+"TABLE(CaseOne integer,CaseTwo integer,MinEntrées Time,Date date,Idindividu varchar(255)) AS\n"
+"$$\nBEGIN\n"
+"	RETURN QUERY EXECUTE format('Select Case WHEN MIN(Entrées) >= %L then 1 " 
+"WHEN MIN(Entrées) < %L then 0 END as CaseOne,"
+"Case WHEN MIN(Entrées) > %L then 1 "
+"WHEN MIN(Entrées) <= %L then 0 END as CaseTwo,"
+"MIN(Entrées), Date ,Idindividu FROM %I";
querybeta += (param_year_month_day != undefined)?" WHERE Date ='"+param_year_month_day+"'":(empHoursObj== undefined)? ((empObj != undefined)?" WHERE Idindividu = '"+empObj.ID+"'":""):" WHERE Idindividu = '"+empHoursObj.userAuthentification.ID+"' AND Date ='"+empHoursObj.date.getFullYear()+"-"+(empHoursObj.date.getMonth()+1)+"-"+empHoursObj.date.getDate()+"'";
querybeta +=" GROUP BY Date, Idindividu ORDER BY Date ASC;"+"','10:00:00','10:00:00','8:30:00','8:30:00',$1);\n"
+"END;\n"
+"$$\n"
+"LANGUAGE PLPGSQL;\n"
+"create or replace function b() returns\n"
+"TABLE(CaseOne integer,CaseTwo integer,MinEntrées Time,Date date,Idindividu varchar(255)) AS\n"
+"$$"
+"\nDECLARE\n"
+"rows RECORD;\n"
+"\nBEGIN\n"
+"FOR rows IN (Select Nom from \"manuel des tables d'entrées et de sorties\")\n"
+"LOOP\n"
+"RETURN QUERY SELECT * FROM a(rows.Nom);\n"
+"END LOOP;\n"
+"END;\n"
+"$$\n"
+"LANGUAGE PLPGSQL;\n"
+"SELECT * FROM b();\n";

query += querybeta;
query += "create or replace function g(value text) returns\n";
query += "TABLE(IDIndividu varchar(255),Date Date,Entrées Time,Sorties VARCHAR(10)) AS\n"
+"$$\nBEGIN\n"
+"	RETURN QUERY EXECUTE format('Select * FROM %I as A ";
query += (empObj == undefined)?((empHoursObj == undefined)?"":" where A.Idindividu ='"+empHoursObj.userAuthentification.ID+"'"):" where A.Idindividu ='"+empObj.ID+"'";
query += " GROUP BY Entrées,Date,Idindividu ORDER BY Date ASC;',$1);\n"
query += "END;\n"
+"$$\n"
+"LANGUAGE PLPGSQL;\n"
+"\ncreate or replace function h() returns\n"
+"TABLE(IDIndividu varchar(255),Date Date,Entrées Time,Sorties VARCHAR(10)) AS\n"
+"$$"
+"\nDECLARE\n"
+"rows RECORD;\n"
+"\nBEGIN\n"
+"FOR rows IN (Select *  from \"manuel des tables d'entrées et de sorties\")\n"
+"LOOP\n"
+"RETURN QUERY SELECT * FROM g(rows.Nom);\n"
+"END LOOP;\n"
+"END;\n"
+"$$\n"
+"LANGUAGE PLPGSQL;\n"
+"SELECT * FROM d();\n"
+"SELECT * FROM h();\n"
+"drop function c;\n"
+"drop function d;\n"
+"drop function g;\n"
+"drop function h;\n";

/* query += "create or replace function e(value text) returns\n"
+"TABLE(IDIndividu varchar(255),Date Date,Absence BOOLEAN,Maladie BOOLEAN,Mission BOOLEAN,Congès BOOLEAN) AS\n"
+"$$\nBEGIN\n"
+"	RETURN QUERY EXECUTE format('Select * FROM %I as A ";
query += ((param_year_month_day != undefined)?(" WHERE A.Date ='"+param_year_month_day+"'"):(empObj != undefined)?" WHERE Idindividu = '"+empObj.ID+"'":(empHoursObj != undefined)? " WHERE IdIndividu = '"+empHoursObj.userAuthentification.ID+"' AND A.Date ='"+empHoursObj.date.getFullYear()+"-"+(empHoursObj.date.getMonth()+1)+"-"+empHoursObj.date.getDate()+"'":"")+" ORDER BY A.Date ASC;',$1);\n";
query += "END;\n"
+"$$\n"
+"LANGUAGE PLPGSQL;\n"
+"\ncreate or replace function f() returns\n"
+"TABLE(IDIndividu varchar(255),Date Date,Absence BOOLEAN,Maladie BOOLEAN,Mission BOOLEAN,Congès BOOLEAN) AS\n"
+"$$"
+"\nDECLARE\n"
+"rows RECORD;\n"
+"\nBEGIN\n"
+"FOR rows IN (Select *  from \"manuel des tables d'entrées et de sorties\")\n"
+"LOOP\n"
+"RETURN QUERY SELECT * FROM e(rows.\"Etat de l'individu\");\n"
+"END LOOP;\n"
+"END;\n"
+"$$\n"
+"LANGUAGE PLPGSQL;\n";
 */


//Statements not longer present caused by duplicated mentioning error.
//+"SELECT * FROM f();\n"
//+"drop function e;\n"
//+"drop function f;\n"
							

async function f (value)
{
	console.log(value);
	let results = await imageDictionary.queryGiven(value);
	if(results instanceof Array)
	{
		results.forEach(element=>
		{
			if(element.command == 'SELECT')
			{
				console.log(element);
				
			}
		});
	}
	else
	{
		results.rows.forEach(el=>{
			//console.log(el);
			Object.keys(el).forEach(el2=>{
				console.log(el[el2]);
			});
		})
		console.log(results);
	}

	let indexes = [];
	/*results.rows.forEach((el,index)=>
	{
		console.log("index--------------"+index);
		results.rows.forEach((el2,index2)=>
		{
			let found = true;
			console.log("index2--------------"+index2);
			results.fields.forEach((keyobj)=>{
				if(index < index2 && (el[keyobj.name] == el2[keyobj.name] || (el[keyobj.name] instanceof Date && el2[keyobj.name] instanceof Date && el[keyobj.name].toLocaleDateString() == el2[keyobj.name].toLocaleDateString()))  )
				{
					console.log("el One-------"+el[keyobj.name]);console.log("el Two-------"+el2[keyobj.name]);
				}
				else if(found)
				{
					console.log("false el One-------"+el[keyobj.name]);console.log("el Two-------"+el2[keyobj.name]);
					found = false;
				}
			});
			
			if(found)
			{
				if(indexes.indexOf(index2) == -1)
				{
					indexes.push(index2);
				}
			}
		});
	});*/
	console.log(indexes);
	let str = "";
	let recoverStr ="";
	
	}

	async function g(value)
	{
		let results = await imageDictionary.queryGiven(value);
		results.rows.forEach((el,index)=>
		{
			/*if(indexes.indexOf(index) > 0)
			{*/
				str +="delete from \"Base plainte PAP\" where ";
				recoverStr += "insert into \"Base plainte PAP\" values ";
				results.fields.forEach((keyobj,curr)=>
				{
					if(curr == 0)
					{
						str += "\""+keyobj.name +"\" = $$"+((el[keyobj.name] instanceof Date)?(el[keyobj.name].getFullYear()+"-"+(el[keyobj.name].getMonth()+1)+"-"+el[keyobj.name].getDate()):el[keyobj.name])+"$$";
						recoverStr += "($$"+((el[keyobj.name] instanceof Date)?(el[keyobj.name].getFullYear()+"-"+(el[keyobj.name].getMonth()+1)+"-"+el[keyobj.name].getDate()):el[keyobj.name])+"$$";
					}
					else
					{
						str += "AND \""+keyobj.name +"\" = $$"+((el[keyobj.name] instanceof Date)?(el[keyobj.name].getFullYear()+"-"+(el[keyobj.name].getMonth()+1)+"-"+el[keyobj.name].getDate()):el[keyobj.name])+"$$";
						recoverStr += ",$$"+((el[keyobj.name] instanceof Date)?(el[keyobj.name].getFullYear()+"-"+(el[keyobj.name].getMonth()+1)+"-"+el[keyobj.name].getDate()):el[keyobj.name])+"$$";
					}
				});
				str+=";\n";
				recoverStr +=");\n";
			/*}*/
		});
		console.log(str);
		console.log(recoverStr);
		f(str+'\n'+recoverStr);
	}
//console.log(querybeta);
/*
query = "insert into \"2023 état de l'individu\" values ('1-24','11-29-2023',false,false,true,false) ON CONFLICT (IdIndividu,Date) DO Update Set absence =false,maladie = false,mission=true,congès=false;";
query += "insert into \"2023 état de l'individu\" values ('1-24','11-28-2023',false,false,true,false) ON CONFLICT (IdIndividu,Date) DO Update Set absence =false,maladie = false,mission=true,congès=false;";
query += "insert into \"2023 état de l'individu\" values ('1-24','11-27-2023',false,false,true,false) ON CONFLICT (IdIndividu,Date) DO Update Set absence =false,maladie = false,mission=true,congès=false;";
query += "insert into \"2023 état de l'individu\" values ('1-24','11-26-2023',false,false,true,false) ON CONFLICT (IdIndividu,Date) DO Update Set absence =false,maladie = false,mission=true,congès=false;";
query += "insert into \"2023 état de l'individu\" values ('1-24','11-25-2023',false,false,true,false) ON CONFLICT (IdIndividu,Date) DO Update Set absence =false,maladie = false,mission=true,congès=false;";
query += "insert into \"2023 état de l'individu\" values ('1-24','11-24-2023',false,false,true,false) ON CONFLICT (IdIndividu,Date) DO Update Set absence =false,maladie = false,mission=true,congès=false;";
query +="Select * from \"2023 état de l'individu\" ";
//works cool
*/
//f("select * from \"2024 entrées et sorties\" where idindividu = '1-25';");

let table = "2024 entrées et sorties";
query = "";
query += "Select Case WHEN MIN(\""+table+"\".Entrées) >= '10:00:00' then 1 "; 
							query += "WHEN MIN(\""+table+"\".Entrées) < '10:00:00' then 0 END as CaseOne,";
							query += "Case WHEN  MIN(\""+table+"\".Entrées) > '8:30:00' then 1 ";
							query += "WHEN MIN(\""+table+"\".Entrées) <= '8:30:00' then 0 END as CaseTwo,";
							query += "MIN(\""+table+"\".Entrées), Date ,Idindividu FROM \""+table+"\"";
							query += (param_year_month_day != undefined)?" WHERE Date ='"+param_year_month_day+"'":(empHoursObj== undefined)? ((empObj != undefined)?" WHERE Idindividu = '"+empObj.ID+"'":""):" WHERE Idindividu = '"+empHoursObj.userAuthentification.ID+((empHoursObj.startDay == undefined && empHoursObj.endDay == undefined)?("' AND Date ='"+empHoursObj.date.getFullYear()+"-"+(empHoursObj.date.getMonth()+1)+"-"+empHoursObj.date.getDate()+"'"):(empHoursObj.startDay != undefined && empHoursObj.endDay == undefined)?(" AND Date >='"+empHoursObj.startDay.getFullYear()+"-"+(empHoursObj.startDay.getMonth()+1)+"-"+empHoursObj.startDay.getDate()+"'"):("' AND Date >='"+empHoursObj.startDay.getFullYear()+"-"+(empHoursObj.startDay.getMonth()+1)+"-"+empHoursObj.startDay.getDate()+"' AND Date <='"+empHoursObj.endDay.getFullYear()+"-"+(empHoursObj.endDay.getMonth()+1)+"-"+empHoursObj.endDay.getDate()+"'"));
							query += " GROUP BY Date, Idindividu ORDER BY Date ASC;";
query = "SELECT  * FROM individu inner join login on individu.ID = login.IDIndividu inner join "
		query += "appartenance on individu.ID = appartenance.IDIndividu inner join \"location du bureau\" as A on A.ID = ";
		query += "appartenance.IDBureau;"; 
query = "delete from appartenance where idindividu = '1-26';";
query += "delete from login where idindividu = '1-26';";
query += "delete from individu where id = '1-26';";

query = "SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT,TABLE_NAME FROM INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = $$Base plainte PAP$$;";

//query = "SELECT * from \"DouDous'individuals\";"; 
//query = "SELECT * from \"Base plainte PAP\"";
//query = "SELECT * FROM \"Base plainte PAP\" inner join  (Select IDIndividu,Prenom,Nom,Genre,Image from \"DouDous'individuals\") as A  on A.IDIndividu = \"Base plainte PAP\".IDIndividu;";
query =	"SELECT *";
query += 'FROM "Base plainte PAP"';
query += 'GROUP BY "Numéro de la réclamation","Emprise","Date","Prénom et Nom du plaignant","Sexe","Quartier ou village","Quartier ou village","Code PAP (si recensée)","Fonction du Plaignant","Parties concernées",'
query += '"Objet de réclamation","Description de la réclamation",';
query += '"Solutions préconisées par le plaignant","Plainte enregistrée par",';
 query += '"Recevabilité de la plainte après examen de l’UGP",';
 query += '"Commentaires","Solutions proposées",';
  query += '"Responsable de l’action",';
  query += '"Echéance",';
  query += '"Actions effectuées par l’entreprise",';
  query += '"Date de clôture de la plainte",id,idindividu';
 query += ' HAVING COUNT(*) > 1;'
/*let results = f('Select * from individu inner join appartenance ON appartenance.IDIndividu =  individu.ID inner join "location du bureau" ON  appartenance.IDBureau = "location du bureau".ID AND EXTRACT(YEAR FROM individu.Début) <= 2023 AND EXTRACT(YEAR FROM individu.Fin) >=2023 AND individu.ID = \'1-23\' union select * from individu inner join appartenance ON appartenance.IDIndividu =  individu.ID inner join "location du bureau" ON  appartenance.IDBureau = "location du bureau".ID AND EXTRACT(YEAR FROM individu.Début) <= 2024 AND EXTRACT(YEAR FROM individu.Fin) >=2024 AND individu.ID = \'1-24\';'
+'Select * FROM "2023 état de l\'individu" as A0 WHERE A0.Date = \'2023-01-12\' AND A0.Idindividu = \'1-23\' union select * FROM "2024 état de l\'individu" as A1 WHERE A1.Date =\'2024-01-12\' AND A1.Idindividu = \'1-24\' ORDER BY Date ASC;');
*/
/*f('Select Date, Case WHEN MIN("2023 entrées et sorties".Entrées) >= \'10:00:00\' then 1 WHEN MIN("2023 entrées et sorties".Entrées) < \'10:00:00\' then 0 END as CaseOne,Case WHEN  MIN("2023 entrées et sorties".Entrées) > \'8:30:00\' then 1 WHEN MIN("2023 entrées et sorties".Entrées) <= \'8:30:00\' then 0 END as CaseTwo,MIN("2023 entrées et sorties".Entrées) FROM "2023 entrées et sorties" WHERE Date =\'2023-01-12\' AND Idindividu = \'1-23\' Group By "2023 entrées et sorties".Date union select Date,Case WHEN MIN("2024 entrées et sorties".Entrées) >= \'10:00:00\' then 1 WHEN MIN("2024 entrées et sorties".Entrées) < \'10:00:00\' then 0 END as CaseOne,Case WHEN  MIN("2024 entrées et sorties".Entrées) > \'8:30:00\' then 1 WHEN MIN("2024 entrées et sorties".Entrées) <= \'8:30:00\' then 0 END as CaseTwo,MIN("2024 entrées et sorties".Entrées) FROM "2024 entrées et sorties" WHERE Date =\'2024-01-12\' AND Idindividu = \'1-24\' Group By "2024 entrées et sorties".Date;')*/
f('Select * from "colones des fichiers des heures"');
/*
f('Select Case WHEN MIN("2023 entrées et sorties".Entrées) >= \'10:00:00\' then 1 WHEN MIN("2023 entrées et sorties".Entrées) < \'10:00:00\' then 0 END as CaseOne,Case WHEN  MIN("2023 entrées et sorties".Entrées) > \'8:30:00\' then 1 WHEN MIN("2023 entrées et sorties".Entrées) <= \'8:30:00\' then 0 END as CaseTwo,MIN("2023 entrées et sorties".Entrées) FROM "2023 entrées et sorties" WHERE Date =\'2023-01-12\' AND Idindividu = \'1-23\' union select Case WHEN MIN("2024 entrées et sorties".Entrées) >= \'10:00:00\' then 1 WHEN MIN("2024 entrées et sorties".Entrées) < \'10:00:00\' then 0 END as CaseOne,Case WHEN  MIN("2024 entrées et sorties".Entrées) > \'8:30:00\' then 1 WHEN MIN("2024 entrées et sorties".Entrées) <= \'8:30:00\' then 0 END as CaseTwo,MIN("2024 entrées et sorties".Entrées) FROM "2024 entrées et sorties" WHERE Date =\'2024-01-12\' AND Idindividu = \'1-24\' ;')
*/

//let results = f(query);
//let results.filter(


/*
	delete from "Base Plainte PAP" where "Emprise" = 'pont et voie d'accés'AND "Numéro de la réclamation" = '1112'AND "Date" = '2024-2-7'AND "Prénom et Nom du plaignant" = 'Hawa Djibi Lo'AND "Sexe" = 'féminin'AND "Quartier ou village" = 'Ndiourbel'AND "Code PAP (si recensée)" = '6892566055'AND "Fonction du Plaignant" = 'mengere'AND "Parties concernées" = 'CILE/PR/UGP'AND "Objet de réclamation" = 'Pas satisfaite de la façon d'indemnisation 'AND "Description de la réclamation" = 'la plaignante dit etre récenssée et impactée d'un terrain nu dans l'emprise, elle a été indemnisée d'unterrain au PK7'AND "Solutions préconisées par le plaignant" = 'la plaignante souhaite indemnisée selon le barreme de l'Administration'AND "Plainte enregistrée par" = 'wilaya'AND "Recevabilité de la plainte après examen de l’UGP" = ''AND "Commentaires" = ''AND "Solutions proposées" = ''AND "Responsable de l’action" = ''AND "Echéance" = '2024-3-18'AND "Actions effectuées par l’entreprise" = ''AND "Date de clôture de la plainte" = '2024-3-18'AND "id" = '1'AND "idindividu" = '4'AND "count" = '2';
delete from "Base Plainte PAP" where "Emprise" = 'Axe Marché Médine-Epicerie Salam'AND "Numéro de la réclamation" = '1055'AND "Date" = '2024-2-6'AND "Prénom et Nom du plaignant" = 'Aminetou  El Id El Atigh'AND "Sexe" = 'F'AND "Quartier ou village" = '7 Km'AND "Code PAP (si recensée)" = '3751934296'AND "Fonction du Plaignant" = 'Ménagère'AND "Parties concernées" = 'CILE/PR - UGP'AND "Objet de réclamation" = 'Omission'AND "Description de la réclamation" = 'La plaignante affirme avoir une table sur le marché et n'a pas été recensé'AND "Solutions préconisées par le plaignant" = 'Souhaite etre recensé'AND "Plainte enregistrée par" = 'Moughataa'AND "Recevabilité de la plainte après examen de l’UGP" = ''AND "Commentaires" = ''AND "Solutions proposées" = ''AND "Responsable de l’action" = ''AND "Echéance" = '2024-3-18'AND "Actions effectuées par l’entreprise" = ''AND "Date de clôture de la plainte" = '2024-3-18'AND "id" = '1'AND "idindividu" = '3'AND "count" = '8';
delete from "Base Plainte PAP" where "Emprise" = 'pont et voie d'accès'AND "Numéro de la réclamation" = '1006'AND "Date" = '2024-2-8'AND "Prénom et Nom du plaignant" = 'Abdellahi Cheikh Sidiya'AND "Sexe" = 'Masculin'AND "Quartier ou village" = 'Escale'AND "Code PAP (si recensée)" = '8362073181'AND "Fonction du Plaignant" = 'Agriculteur'AND "Parties concernées" = 'CILE/PR-UGP'AND "Objet de réclamation" = 'Omission'AND "Description de la réclamation" = 'le plaignant affirme etre indemniser d'un terrain de 300m2 mais avoir être d'environ de 13terrain nu dans l'emprise et ne sont pas pris en compte:et ses activités economiques sont en arrêt par les travaux 'AND "Solutions préconisées par le plaignant" = 'la prise en compte des investissements impactées par le projet pour être indemniser 'AND "Plainte enregistrée par" = 'Seydou Sonko'AND "Recevabilité de la plainte après examen de l’UGP" = ''AND "Commentaires" = ''AND "Solutions proposées" = ''AND "Responsable de l’action" = ''AND "Echéance" = '2024-3-18'AND "Actions effectuées par l’entreprise" = ''AND "Date de clôture de la plainte" = '2024-3-18'AND "id" = '1'AND "idindividu" = '2'AND "count" = '2';
delete from "Base Plainte PAP" where "Emprise" = 'pont et voie d'accés'AND "Numéro de la réclamation" = '1119'AND "Date" = '2024-2-7'AND "Prénom et Nom du plaignant" = 'Mohamed Samba Diallo'AND "Sexe" = 'masculin'AND "Quartier ou village" = 'Ndiourbel'AND "Code PAP (si recensée)" = '31 81115195'AND "Fonction du Plaignant" = 'imam  Mosquée'AND "Parties concernées" = 'CILE/PR/UGP'AND "Objet de réclamation" = 'omission'AND "Description de la réclamation" = 'le plaignant dit être impacté d'un terain (ancien jardin) de famille dans l'emprise; il n'a été recensé ni indemnisé'AND "Solutions préconisées par le plaignant" = 'vérifier et être indemnisé'AND "Plainte enregistrée par" = 'wilaya'AND "Recevabilité de la plainte après examen de l’UGP" = ''AND "Commentaires" = ''AND "Solutions proposées" = ''AND "Responsable de l’action" = ''AND "Echéance" = '2024-3-18'AND "Actions effectuées par l’entreprise" = ''AND "Date de clôture de la plainte" = '2024-3-18'AND "id" = '1'AND "idindividu" = '4'AND "count" = '2';
delete from "Base Plainte PAP" where "Emprise" = ''AND "Numéro de la réclamation" = ''AND "Date" = '2024-3-19'AND "Prénom et Nom du plaignant" = ''AND "Sexe" = ''AND "Quartier ou village" = ''AND "Code PAP (si recensée)" = ''AND "Fonction du Plaignant" = ''AND "Parties concernées" = ''AND "Objet de réclamation" = ''AND "Description de la réclamation" = ''AND "Solutions préconisées par le plaignant" = ''AND "Plainte enregistrée par" = ''AND "Recevabilité de la plainte après examen de l’UGP" = ''AND "Commentaires" = ''AND "Solutions proposées" = ''AND "Responsable de l’action" = ''AND "Echéance" = '2024-3-19'AND "Actions effectuées par l’entreprise" = ''AND "Date de clôture de la plainte" = '2024-3-19'AND "id" = '1'AND "idindividu" = '4'AND "count" = '2';
delete from "Base Plainte PAP" where "Emprise" = 'pont 'AND "Numéro de la réclamation" = '1114'AND "Date" = '2024-2-7'AND "Prénom et Nom du plaignant" = 'Faty Sidi Sarr'AND "Sexe" = 'féminin'AND "Quartier ou village" = 'Guenema'AND "Code PAP (si recensée)" = '0094961837'AND "Fonction du Plaignant" = 'menagere'AND "Parties concernées" = 'CILE PR/UGP'AND "Objet de réclamation" = 'omission'AND "Description de la réclamation" = 'la plaignante  dit etre impactée d'un terrain  nu dans l'emprise à Guenema et a été omise lors du recensement'AND "Solutions préconisées par le plaignant" = 'vérification par la commission'AND "Plainte enregistrée par" = 'wilaya'AND "Recevabilité de la plainte après examen de l’UGP" = ''AND "Commentaires" = ''AND "Solutions proposées" = ''AND "Responsable de l’action" = ''AND "Echéance" = '2024-3-18'AND "Actions effectuées par l’entreprise" = ''AND "Date de clôture de la plainte" = '2024-3-18'AND "id" = '1'AND "idindividu" = '4'AND "count" = '2';
delete from "Base Plainte PAP" where "Emprise" = 'pont et voie d'accés'AND "Numéro de la réclamation" = '1127'AND "Date" = '2024-2-7'AND "Prénom et Nom du plaignant" = 'Seyid Sehlamo Ndiaye'AND "Sexe" = 'M'AND "Quartier ou village" = 'Ndiourbel'AND "Code PAP (si recensée)" = '6273464331'AND "Fonction du Plaignant" = 'élément de sécurité'AND "Parties concernées" = 'CILE/PR/UGP'AND "Objet de réclamation" = 'omission'AND "Description de la réclamation" = 'le plaignant dit etre impacté d'un terrain nu, n'a été récensé ni indemnisé'AND "Solutions préconisées par le plaignant" = 'souhaite etre intégré sur la liste'AND "Plainte enregistrée par" = 'wilaya'AND "Recevabilité de la plainte après examen de l’UGP" = ''AND "Commentaires" = ''AND "Solutions proposées" = ''AND "Responsable de l’action" = ''AND "Echéance" = '2024-3-18'AND "Actions effectuées par l’entreprise" = ''AND "Date de clôture de la plainte" = '2024-3-18'AND "id" = '1'AND "idindividu" = '2'AND "count" = '2';
delete from "Base Plainte PAP" where "Emprise" = 'pont et voie d'accès'AND "Numéro de la réclamation" = '1007'AND "Date" = '2024-2-9'AND "Prénom et Nom du plaignant" = 'Aminetou El Moctar Lehbouss'AND "Sexe" = 'masculin'AND "Quartier ou village" = 'Guénema'AND "Code PAP (si recensée)" = '1744897014'AND "Fonction du Plaignant" = 'Vendeuse voiles (melfés)'AND "Parties concernées" = 'CILE/PR-UGP'AND "Objet de réclamation" = 'Omission'AND "Description de la réclamation" = 'le plaignant affirme etre indemniser d'un terrain au PK7 mais elle avait investi sur le terrain impacté une barraque,hangard etb toillette mais ceete parti n'a pas été couvert par l'indemnisation'AND "Solutions préconisées par le plaignant" = 'il souhaite être indemniser comme ses voisins et que son investissement lui soit rembousé'AND "Plainte enregistrée par" = 'Seydou sonko'AND "Recevabilité de la plainte après examen de l’UGP" = ''AND "Commentaires" = ''AND "Solutions proposées" = ''AND "Responsable de l’action" = ''AND "Echéance" = '2024-3-18'AND "Actions effectuées par l’entreprise" = ''AND "Date de clôture de la plainte" = '2024-3-18'AND "id" = '1'AND "idindividu" = '2'AND "count" = '2';

insert into "Base Plainte PAP" values ('pont et voie d'accés','1112','2024-2-7','Hawa Djibi Lo','féminin','Ndiourbel','6892566055','mengere','CILE/PR/UGP','Pas satisfaite de la façon d'indemnisation ','la plaignante dit etre récenssée et impactée d'un terrain nu dans l'emprise, elle a été indemnisée d'unterrain au PK7','la plaignante souhaite indemnisée selon le barreme de l'Administration','wilaya','','','','','2024-3-18','','2024-3-18','1','4','2');
insert into "Base Plainte PAP" values ('Axe Marché Médine-Epicerie Salam','1055','2024-2-6','Aminetou  El Id El Atigh','F','7 Km','3751934296','Ménagère','CILE/PR - UGP','Omission','La plaignante affirme avoir une table sur le marché et n'a pas été recensé','Souhaite etre recensé','Moughataa','','','','','2024-3-18','','2024-3-18','1','3','8');
insert into "Base Plainte PAP" values ('pont et voie d'accès','1006','2024-2-8','Abdellahi Cheikh Sidiya','Masculin','Escale','8362073181','Agriculteur','CILE/PR-UGP','Omission','le plaignant affirme etre indemniser d'un terrain de 300m2 mais avoir être d'environ de 13terrain nu dans l'emprise et ne sont pas pris en compte:et ses activités economiques sont en arrêt par les travaux ','la prise en compte des investissements impactées par le projet pour être indemniser ','Seydou Sonko','','','','','2024-3-18','','2024-3-18','1','2','2');
insert into "Base Plainte PAP" values ('pont et voie d'accés','1119','2024-2-7','Mohamed Samba Diallo','masculin','Ndiourbel','31 81115195','imam  Mosquée','CILE/PR/UGP','omission','le plaignant dit être impacté d'un terain (ancien jardin) de famille dans l'emprise; il n'a été recensé ni indemnisé','vérifier et être indemnisé','wilaya','','','','','2024-3-18','','2024-3-18','1','4','2');
insert into "Base Plainte PAP" values ('','','2024-3-19','','','','','','','','','','','','','','','2024-3-19','','2024-3-19','1','4','2');
insert into "Base Plainte PAP" values ('pont ','1114','2024-2-7','Faty Sidi Sarr','féminin','Guenema','0094961837','menagere','CILE PR/UGP','omission','la plaignante  dit etre impactée d'un terrain  nu dans l'emprise à Guenema et a été omise lors du recensement','vérification par la commission','wilaya','','','','','2024-3-18','','2024-3-18','1','4','2');
insert into "Base Plainte PAP" values ('pont et voie d'accés','1127','2024-2-7','Seyid Sehlamo Ndiaye','M','Ndiourbel','6273464331','élément de sécurité','CILE/PR/UGP','omission','le plaignant dit etre impacté d'un terrain nu, n'a été récensé ni indemnisé','souhaite etre intégré sur la liste','wilaya','','','','','2024-3-18','','2024-3-18','1','2','2');
insert into "Base Plainte PAP" values ('pont et voie d'accès','1007','2024-2-9','Aminetou El Moctar Lehbouss','masculin','Guénema','1744897014','Vendeuse voiles (melfés)','CILE/PR-UGP','Omission','le plaignant affirme etre indemniser d'un terrain au PK7 mais elle avait investi sur le terrain impacté une barraque,hangard etb toillette mais ceete parti n'a pas été couvert par l'indemnisation','il souhaite être indemniser comme ses voisins et que son investissement lui soit rembousé','Seydou sonko','','','','','2024-3-18','','2024-3-18','1','2','2');
*/