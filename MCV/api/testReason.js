function a ( param_year_month_day,empHoursObj)
{
	const year = 2023;
	let query = "Select * from \""+year+" raisons des absences\""+(param_year_month_day?" where Date ='"+param_year_month_day+"'":  ((empHoursObj)?" where IdIndividu ='"+(empHoursObj.butPresence||empHoursObj.subAdminRef?empHoursObj.ID:empHoursObj.userAuthentification.ID)+"'"+((empHoursObj.startDay == undefined && empHoursObj.endDay == undefined)?(" AND Date ='"+empHoursObj.date.getFullYear()+"-"+(empHoursObj.date.getMonth()+1)+"-"+empHoursObj.date.getDate()+"'"):((empHoursObj.startDay != undefined && empHoursObj.endDay == undefined)?(" AND Date >='"+empHoursObj.startDay.getFullYear()+"-"+(empHoursObj.startDay.getMonth()+1)+"-"+empHoursObj.startDay.getDate()+"'"):("' AND Date >='"+empHoursObj.startDay.getFullYear()+"-"+(empHoursObj.startDay.getMonth()+1)+"-"+empHoursObj.startDay.getDate()+"' AND Date <='"+empHoursObj.endDay.getFullYear()+"-"+(empHoursObj.endDay.getMonth()+1)+"-"+empHoursObj.endDay.getDate()+"'")) ):''))+";";
	console.log(query);					
}

try{
a('2023-10-1',{});
a(undefined,{ID:'1-23',date:new Date(Date.now()),userAuthentification:{ID:'1-23'}});
a(undefined,{ID:'1-23',date:new Date(Date.now()),userAuthentification:{ID:'1-23'},startDay:new Date(Date.now()),endDay:new Date(Date.now())});
}catch(e)
{
	console.log(e.stackTrace);
	console.log(e.message);
}