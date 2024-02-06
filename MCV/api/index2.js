function splitText(textStr,count)
	{
		let returnValue = [];
		let length = textStr.length;
		let index = 0;
		let value = "";
		let set = false;
		let all ="";
		while(index < length)
		{
			value += textStr[index];
			if(value.length == count )
			{
				all += value;
				returnValue.push(value);
				set = true;
				value = "";
			}
			else
				set = false;
			++index;
		}
		
		if(!set && value.length > 0)
		{
			all +=value;
			returnValue.push(value);
		}
		
		return returnValue;
	}
	
	let value = splitText(JSON.stringify({a:"bombbomb bomb bomb {a:123456,b:6789544}"}),10);
	console.log(value);
	//console.log(JSON.parse(value));
	let allStrAgain = "";
	value.forEach((element)=>
	{
		allStrAgain += element;
	});
	
	console.log(allStrAgain);
	console.log(JSON.parse(allStrAgain));