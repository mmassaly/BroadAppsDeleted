
let objTemp = {entry:'8:00:00',exit:'15:00:00'};
let defValue = {entry:'13:30:00',exit:'14:30:00'};
var objels = [defValue];
																	
var loopArr = [objTemp,[{entry:'7:00:00',exit:'9:00:00'},{entry:'9:10:00',exit:'10:00:00'}]].flatMap(fm=> fm);
	
	intervalFixStart(loopArr, objels);
	function intervalFixStart( inputs ,arrayBucket){
		let arrayBucketDup = arrayBucket;
		inputs.forEach((input)=>
		{
			arrayBucketDup = handleHatefullMethod(input,arrayBucketDup);
		});
		arrayBucket.splice(0,arrayBucket.length);
		arrayBucketDup.forEach(arrBu=> arrayBucket.push(arrBu));
		return arrayBucket;
	}
	/*let indexTemp = -1;
	let foundVal = objels.indexOf(objels.find(val=> val.entry == defValue.entry && val.exit == defValue.exit));
	indexTemp = foundVal?objels.indexOf(foundVal):-1;
	if(indexTemp != -1)
	{
		objels.splice(indexTemp,1);//doing minus 14:30:00 - 13:30:00																
	}
	console.log(objels);	*/																
	function compareHoursOneSuperior(hour1,hour2)
	{
		try{

		let hoursArray = hour1.split(":");
		let hoursArray2 = hour2.split(":");
				
		for(let i = 0; i < hoursArray.length;++i)
		{
			if(Number(hoursArray[i]) > Number(hoursArray2[i]))
				return 1;
			else if (Number(hoursArray[i]) < Number(hoursArray2[i]))
				return -1;
		}
		}catch(ex)
		{
			throw new Error(ex);
		}
		return 0;
	}
	
	function handleHatefullMethod(value,arr)
	{
		
		let count = arr.length;
		let tempIndex = 0;
		let loopStack = [value];
		let loopStackCount = 1;
		if(arr.length == 0)
		{
			return earr.concat(value);
		}
		while(tempIndex < arr.length )
		{ 
			let count = 0;
			let objTemp = arr[tempIndex];
			/*console.log("***************************-----------------");console.log(arr);console.log(objTemp.entry);console.log("***************************-------------");*/
			while(count < loopStackCount )
			{
				let el = loopStack.pop();
				
				if( compareHoursOneSuperior(objTemp.entry,el.entry) >= 0 )
				{
					if(compareHoursOneSuperior(objTemp.entry,el.exit) >= 0)
					{
						loopStack.push({entry:el.entry,exit:el.exit});
					}
					else if(compareHoursOneSuperior(objTemp.exit,el.exit) >= 0)
					{			
						loopStack.push({entry:el.entry,exit:objTemp.entry});
					}
					else  
					{
						loopStack.push({entry:el.entry,exit:objTemp.entry});
						loopStack.push({entry:objTemp.exit,exit:el.exit});
					}
				}
				else
				{
					if(compareHoursOneSuperior(objTemp.exit,el.entry) <= 0)
					{			
						loopStack.push({entry:el.entry,exit:el.exit});
					}
					else if(compareHoursOneSuperior(objTemp.exit,el.exit) <= 0)
					{
						loopStack.push({entry:objTemp.exit,exit:el.exit});
					}
				}
				++count;
			}
			count = 0;
			//console.log(loopStack);
			loopStackCount = loopStack.length;
			++tempIndex;
		}
		
		return arr.concat(loopStack);
	}