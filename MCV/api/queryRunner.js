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
		console.log(results);
};
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
query = "SELECT * from \"Base plainte PAP\"";
query = "SELECT * FROM \"Base plainte PAP\" inner join  (Select IDIndividu,Prenom,Nom,Genre,Image from \"DouDous'individuals\") as A  on A.IDIndividu = \"Base plainte PAP\".IDIndividu;";
f(query);



