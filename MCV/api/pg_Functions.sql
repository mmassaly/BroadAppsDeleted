delete from login where idIndividu = '1-24';
delete from individu where id = '1-24';
delete from appartenance where idIndividu = '1-24';
delete from blobsholder where Url='http://msa-pointage-server.vercel.app/MrAmath.jpg';



select idIndividu from appartenance union (json_to_recordset('[{"idIndividu":"1","other":1}]') as (idIndividu varchar,other varchar)); 



totalQuery += "For row in (Select * from \"manuel des tables d'entrées et de sorties\") LOOP (Select * FROM row.\"Etat De L'individu\" as A where"+(param_year_month_day != undefined)?(" WHERE A.Date ='"+param_year_month_day+"'")
					:(empObj != undefined)?" WHERE Idindividu = '"+empObj.ID+"'":(empHoursObj != undefined)?
					" WHERE IdIndividu = '"+empHoursObj.userAuthentification.ID+"' AND A.Date ='"+
					empHoursObj.date.getFullYear()+"-"+(empHoursObj.date.getMonth()+1)+"-"+empHoursObj.date.getDate()+"'":""; +") END LOOP;";
					totalQuery += "Select * from individu inner join appartenance";
					totalQuery += " ON appartenance.IDIndividu =  individu.ID";
					totalQuery += " inner join \"location du bureau\" ON  appartenance.IDBureau =";
					totalQuery += " \"location du bureau\".ID;"

************************************
CREATE TYPE MANUEL AS (Année integer,"Etat de l'individu" varchar(255),Nom varchar(255));

create or replace function openTables(tb text,col text) returns MANUEL AS
$$
	DECLARE
	all_text text := '';
	acount int := 1;
	r Manuel%ROWTYPE;
	BEGIN
	For r in Select * from tb
	LOOP
		IF acount = 1 THEN
			all_text := CONCAT('r.',col);
		END IF;
		IF acount > 1 THEN
			all_text := CONCAT(all_text,' union r.',col);
                END IF;
		acount := acount + 1;
	END LOOP;
	Select * FROM all_text;
	END;
$$
LANGUAGE plpgsql;
Select * from openTables("manuel des tables d'entrées et de sorties","Etat De L'individu");
************************************
CREATE TYPE MANUEL AS (Année integer,"Etat de l'individu" varchar(255),Nom varchar(255));

create or replace function openTables() returns MANUEL AS
$$
	DECLARE
	all_text text := '';
	acount int := 1;
	r Manuel%ROWTYPE;
	BEGIN
	For r in Select * from "manuel des tables d'entrées et de sorties"
	LOOP
		IF acount = 1 THEN
			all_text := "r.\"Etat De L'individu\"";
		END IF;
		IF acount > 1 THEN
			all_text := CONCAT(all_text," union r.\"Etat De L'individu\"");
        raise notice '%', r;
		END IF;
		acount := acount + 1;
	END LOOP;
	Select * FROM all_text;
	END;
$$
LANGUAGE plpgsql;
Select * from openTables();
************************************


create function openTables(table text,column) returns SET AS
$$
DECLARE
	all_text text := '';
BEGIN
	For r in Select * from $1 
	LOOP
		count := count + 1;
		IF count == 1 THEN
			all_text := r[column] ;
		END IF
		IF count > 1
			all_text := all_text +' union '+r[column];
	END LOOP
	
	return Select * FROM all_text;
END
$$
LANGUAGE plpgsql;

************************************
CREATE TYPE MANUEL AS (Année integer,"Etat de l'individu" varchar(255),Nom varchar(255));

create or replace function openTables() returns MANUEL AS
$$
	DECLARE
	all_text text := '';
	acount int := 1;
	r Manuel%ROWTYPE;
	BEGIN
	For r in Select * from "manuel des tables d'entrées et de sorties"
	LOOP
		IF acount = 1 THEN
			all_text := "r.\"Etat De L'individu\"";
		END IF;
		IF acount > 1 THEN
			all_text := CONCAT(all_text," union r.\"Etat De L'individu\"");
        raise notice '%', r;
		END IF;
		acount := acount + 1;
	END LOOP;
	Select * FROM all_text;
	END;
$$
LANGUAGE plpgsql;
Select * from openTables();

********************************

CREATE TYPE MANUEL AS (Année integer,"Etat de l'individu" varchar(255),Nom varchar(255));

create or replace function openTables() returns TABLE(Année integer,"Etat de l'individu" varchar(255),Nom varchar(255)) AS
$$
	DECLARE
	all_text text := '';
	acount int := 1;
	r Manuel%ROWTYPE;
	BEGIN
	For r in Select * from "manuel des tables d'entrées et de sorties"
	LOOP
		IF acount = 1 THEN
			all_text := "r.\"Etat De L'individu\"";
		END IF;
		IF acount > 1 THEN
			all_text := CONCAT(all_text," union r.\"Etat De L'individu\"");
		END IF;
		acount := acount + 1;
		raise notice '%', r;
	END LOOP;
	raise notice '%', all_text;
	Select * FROM "manuel des tables d'entrées et de sorties"
	END;
$$
LANGUAGE plpgsql;
Select * from openTables();

********************************

create or replace function openTables() returns TABLE(A integer, B varchar(255), C varchar(255)) AS
$$
	DECLARE
	r RECORD;
	BEGIN
	For r in Select * from "manuel des tables d'entrées et de sorties" as H (A,B,C);
	LOOP
		A := r.A;
		B := r.B;
		C := r.C;
		RETURN NEXT;
	END LOOP;
	END;
$$
LANGUAGE plpgsql;
Select * from openTables();

********************************
create or replace function openTables() returns TABLE(A integer, B varchar(255), C varchar(255)) AS
$$
	DECLARE
	row RECORD;
	BEGIN
	For row in Select * from "manuel des tables d'entrées et de sorties" as H (A,B,C)
	LOOP
		A := row.A;
		B := row.B;
		C := row.C;
		RETURN NEXT;
	END LOOP;
	END;
$$
LANGUAGE plpgsql;
Select * from openTables();
********************************
create or replace function c() returns table(id text)
LANGUAGE plpgsql
AS $$
DECLARE
    row RECORD;
BEGIN
    for row in SELECT * from individu 
    LOOP
        id := row.id;
        RETURN NEXT;
    END LOOP;
END;
$$;
Select* from c();