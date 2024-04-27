function test (nomdelaTable,ID,datereversed,startTime,endTime)	
{	
	let query = "insert into \""+nomdelaTable+"\" values ('"
	+ ID+"','"+datereversed+"','"+startTime+"',"+((endTime == undefined)?null:"'"+endTime+"'")+")"
	+" ON CONFLICT (IdIndividu,Date,Entrées) "+((endTime == undefined)?(" WHERE Sorties = null DO UPDATE SET Sorties = null;\n") : (" WHERE Sorties = null OR Sorties <= '"+endTime+"'" + " DO UPDATE SET Sorties ='"+endTime+"';\n") );
	console.log(query);
}

test("2024 entrées et sorties","1-23","4-26-2024","17:32:06",null);

test("2024 entrées et sorties","1-23","4-26-2024","17:32:06","17:32:07");