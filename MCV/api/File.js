	var functions = {};
	var functions_other = {};
	
	function performbaseOperations(filename,content,columnGroups,operations)
	{
		fs.readFile(filename,function(data,err)
		{
			if(err == undefined)
			{
				let containerArray = JSON.parse(data);
				let inner_index_returned = -1;
				let index_returned = comparatorFunctionBinarySearch(containerArray,content,columnGroups,0,containerArray.length-1,OverallMatchingComparator);
				if(index_returned >= 0)
				{
					inner_index_returned = comparatorFunctionBinarySearch(containerArray[index_returned].list,content,columnGroups,0,containerArray[index_returned].list.length-1,OverallMatchingComparator);
					functions[operations](inner_index_returned,content,containerArray[index_returned].list);
				}
				else
				{
					functions_other[operations](index_returned,inner_index_returned,element,parent_container);
				}
			}
		});
	}
	
	function addDistinctElementGivenIndex(index,element,array_something)
	{
		if(index < 0)
		array_something.push(element,index*-1);
	}
	
	function addDistinctElementGivenIndexes(index,inner_index,element,array_something)
	{
		if(index < 0)
		{
			let future_element = {};
			Object.keys(element).forEach((column)=>
			{
				future_element[column] = element[column];
			});
			future_element.list = [element];
			array_something.push(future_element,index*-1);
		}
	}
	
	function addElementGivenIndexes(index,inner_index,element,array_something)
	{			
		if(index < 0)
		{	
			let future_element = {};
			Object.keys(element).forEach((column)=>
			{
				future_element[column] = element[column];
			});
			future_element.list = [element];
			array_something.push(future_element,index*-1);
		}
		else
			array_something[index].list.push(element,(inner_index > 0)?inner_index:inner_index*-1);
	}
	
	function addElementGivenIndex(index,element,array_something)
	{
		if(index < 0)
			array_something.push(element,index*-1);
		else
			array_something.push(element,index);
	}
	
	function deleteElementGivenIndex(index,array_something)
	{
		if(index > 0)
		array_something.splice(index,1);
	}
	
	function deleteElementGivenIndexes(index,inner_index,element,array_something)
	{
		if(index > 0 && inner_index > 0)
		{
			array_something[index].list.splice(inner_index,1);
		}
	}
	
	function changeElementGivenIndex(index,element,array_something)
	{
		if(index > 0)
			changeValues(element,Object.Keys(element),array_something[index]);
		else
			addElementGivenIndex(index,element,array_something);
	}
	
	function changeElementGivenIndexes(index,inner_index,element,array_something)
	{
		if(index < 0)
		{
			addElementGivenIndexes(index,inner_index,element,array_something);
		}
		else 
		{
			if(inner_index < 0)
			{
				addElementGivenIndex(inner_index,element,array_something[index].list);
			}
			else
			{
				changeValues(element,Object.Keys(element),array_something[index].list[inner_index]);
			}
		}
	}
	
	function changeValues(element,columns,target)
	{
		columns.forEach((column) => 
		{
			target[column] = element[column];
		});
	}
	
	funtions["changeElementGivenIndex"] = changeElementGivenIndex; functions["deleteElementGivenIndex"] = deleteElementGivenIndex;
	functions["addElementGivenIndex"] = addElementGivenIndex; functions["addDistinctElementGivenIndex"] = addDistinctElementGivenIndex;
	
	functions_other["changeElementGivenIndex"] = changeElementGivenIndexes; functions_other["deleteElementGivenIndex"] = deleteElementGivenIndexes;
	functions_other["addElementGivenIndex"] = addElementGivenIndexes; functions_other["addDistinctElementGivenIndex"] = addDistinctElementGivenIndexes;
	
	function comparatorFunctionBinarySearch(objArray,value,column,start,end,comparatorFunc)
	{
		let returnValue = -1;
		if(start > end)
		{
			if(end < 0)
				return start*-1;
			else
				return end*-1; 			
		}
		let middle = Math.floor((start+end)/2);
		console.log(column);console.log(start);console.log(end);
		
		let comparisonResult = OverallMatchingComparator(objArray,value,column,middle);
		if(comparisonResult == 0)
		{
			return middle;
		}
		else if(comparisonResult > 0)
		{
			return comparatorFunctionBinarySearch(objArray,value,column,middle+1,end,comparatorFunc);
		}
		else if(comparisonResult < 0)
		{
			return comparatorFunctionBinarySearch(objArray,value,column,start,middle-1,comparatorFunc);
		}
	}
	
	function OverallMatchingComparator(columns_list,values,columns_variable,index)
	{
		let res= 0;
		Object.keys(columns_variable[index]).forEach((element)=>{  
			
			if(columns_variable[index][element].isDate)
			{
				res = dateComparatorFunction(values[element],columns_list[element]);	
			}
			else if(columns_variable[index][element].isTime)
			{
				res =  compareHoursOneSuperior(values[element],columns_list[element]) == 0;
			}
			else if (columns_variable[index][element].isNumber)
			{
				res =  (values[element] > columns_list[element])?1:(values[element] < columns_list[element]) ? -1: 0;
			}
			else
			{
				res =  (values[element] > columns_list[element])?1:(values[element] < columns_list[element]) ? -1: values[element] == columns_list[element] ;
			}
			if(res > 0 || res < 0)
				return res;
		});
		
		return res;
	}
	
	function stringComparison(strOne,strTwo)
	{
		if(strOne > strTwo)
		{
			return 1;
		}
		else if(strTwo > strOne)
		{
			return -1;
		}
		return 0;
	}
	
	function dateComparatorFunction(index,objArray,column,value) 
	{
		let dateReceived = objArray.first[index][column].toLocaleString('fr-FR',{day:"numeric",month:"numeric",year:"numeric"}).split("/");
		let dateComparison = value.split("-");
		if( objArray.first[index][column].getDate() == 2 && objArray.first[index][column].getMonth() == 9)
		{
			console.log(dateReceived);
			console.log(dateComparison);
			console.log(Number(dateReceived[2]) +"-"+Number(dateReceived[1])+"-"+ Number(dateReceived[0]));
			console.log(Number(dateComparison[2]) +"-"+Number(dateComparison[1])+"-"+ Number(dateComparison[0]));
		} 
		
		if(Number(dateReceived[2]) > Number(dateComparison[2]))
		{
			return -1;
		}
		else if (Number(dateReceived[2]) < Number(dateComparison[2]))
		{
			return 1;
		}
		else 
		{
			
			if(Number(dateReceived[1]) > Number(dateComparison[1]))
				return -1;
			else if(Number(dateReceived[1]) < Number(dateComparison[1]))
				return 1;
			else
			{
				if(Number(dateReceived[0]) > Number(dateComparison[0]))
					return -1;
				else if (Number(dateReceived[0]) < Number(dateComparison[0]))
					return 1;
				else
					return 0;
			}
		}
	}
	
	function compareHoursOneSuperior(hour1,hour2)
	{

			let hoursArray = hour1.split(":");
			let hoursArray2 = hour2.split(":");
					
			for(let i = 0; i < hoursArray.length;++i)
			{
				if(Number(hoursArray[i]) > Number(hoursArray2[i]))
					return 1;
				else if (Number(hoursArray[i]) < Number(hoursArray2[i]))
					return -1;
			}

		return 0;
	}