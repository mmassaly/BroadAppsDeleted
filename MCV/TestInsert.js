
let empValues = {typicalupdate:"true",entry:"8:30",exit:"17:30:00",oldentry:"12:30:40",oldexit:"17:00:10"};
function stuff(empHoursObj,ID,nomdelaTable,startTime,endTime)
{
	let query = "";
	let datereversed ="03-05-2024";
	if(empHoursObj.typicalupdate == "true")
		{
			query = "update table \""+nomdelaTable+"\" set entrées = '"+empHoursObj["oldentry"]+"' , sorties = '"+empHoursObj["oldexit"]+"' where ID = '"+ID+"' AND entrées = '"+empHoursObj["entry"]+"' AND sorties = '"+empHoursObj["exit"]+"' AND date = '"+datereversed+"';";
		}
		else
		{	
			query = "insert into \""+nomdelaTable+"\" values ('"
			+ ID+"','"+datereversed+"','"+startTime+"',"+((endTime == undefined)?null:"'"+endTime+"'")+")"
			+" ON CONFLICT (IdIndividu,Date,Entrées) "+((endTime == undefined)?(" WHERE Sorties = null DO UPDATE SET Sorties = null;\n") : (" WHERE Sorties = null OR Sorties <= '"+endTime+"'" + " DO UPDATE SET Sorties ='"+endTime+"';\n") );
		}
	console.log(query);
}

stuff(empValues,"1-23","2024 entrées et sorties","x","y");