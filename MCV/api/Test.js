function SplitLongString(str,box,pos)
{
	let count = 0;
	let length = str.length;
	let buffer = 30000;
	let position = 0;
	let contents = [];
	let numberOfElements = Math.ceil(length/buffer);
	//console.log(length);
	
	while(position < length)
	{
		let correctValue = buffer > (length-position)?(length-position): buffer;
		let strElement = mSubstring(str,position, correctValue);
		//console.log(strElement);
		let total = "-----Box:"+box+"Pos:"+pos+"Part no:"+count+"Count:"+numberOfElements+"-----"+strElement;
		//total += total;
		//console.log(total);
		contents.push(total);
		position += correctValue;++count;
	}
	return contents;
}

function main(contentStr,box,no)
{
	let elements_split_based_on_buffer_capacity = SplitLongString(contentStr,box,no);	
	store_values_global(elements_split_based_on_buffer_capacity);
}

function store_values(element)
{
	return mFirstOccurenceGetBetweenElements(["-----Box:","Pos:","Part no:","Count:","-----"],element);
	//console.log(returnValue);
}

function store_values_global (elements)
{
	let values = [];
	elements.forEach((element)=>
	{
		let returnValue = 
		mFirstOccurenceGetBetweenElements(["-----Box:","Pos:","Part no:","Count:","-----"],element);
		console.log(returnValue);
		returnValue.forEach((subElement)=>
		{
			values.push(subElement);
		});
	});
	return values;
}

function mSubstring(str,start,end)
{
	let value = "";
	let index = 0;

	while(index < end)
	{
		value += str[start+index];
		++index;
	}
	return value;
}	


function mFirstOccurenceGetBetweenElements(strs,str)
{
	let strLength = str.length;
	let index = 0;
	let elementIndex = 0;
	let done = false;
	let elements_lengths = [];
	let elements_indexes = [];
	let values = [];
	let array_of_values = [];
	strs.forEach((element)=>
	{
		elements_lengths.push(element.length); elements_indexes.push(0);
	});
	
	let element_count = 0;
	let currentValue = "";
	
	let match_start = -1;
	let match_end = -1;
	let str_match_start = -1;
	let str_match_end = -1;
	
	try
	{
		while( index < strLength)
		{
			let difference = 0;
			
			if(match_start == -1)
				match_start = 0;	
			++match_end;
			
			currentValue += str[index];
			
			/* 			
			console.log("index is" +index);
			console.log("strlength is "+ strLength);
			
			console.log("Element index: "+elementIndex);
			console.log("Current elements count "+element_count);
			
			console.log("Current elements index "+strs[elementIndex].length);
			
			console.log(strs[elementIndex]);
			
			console.log(str[index]);
			
			if(elementIndex > strLength)
				console.log(strs[elementIndex][element_count]);
			 
			if(element_count+1 == strs[elementIndex].length)
			{
				console.log("Last element"+strs[elementIndex][element_count]);
			}
			*/
			
			
			if(element_count < strs[elementIndex].length 
				&& str[index] == strs[elementIndex][element_count] )
			{
				//console.log("Inside at element_count = "+element_count );
				//console.log(currentValue);
			
				if(str_match_start == -1)
				{	
					str_match_start = match_end;
				}
				
				str_match_end = match_end;
						
				if( element_count+1 == strs[elementIndex].length ) 
				{
					//console.log("Inside ==  at element_count = "+element_count);
					let capture_value_index = match_start;
					let value_taken_out = "";
					
					while( capture_value_index < str_match_start)
					{		
						value_taken_out += currentValue[capture_value_index];
						++capture_value_index;
					}
					
					//console.log(currentValue);
					
					if(elementIndex > 0)
					{
						values.push(value_taken_out);
					}
					
					element_count = 0;
					
					if(elementIndex == 0 && done)
					{
						values.push(value_taken_out);
						array_of_values.push(values);
						values = [];
						done = false;
					}
					
					++elementIndex;
					
					if(elementIndex == strs.length)
					{
						done = true;
					}
					
					elementIndex %= strs.length;
					match_start = -1; 
					match_end = -1;
					currentValue = "";
					str_match_start = -1;
					str_match_end = -1;
				}
				element_count++;
			}
			else if ( element_count >= strs[elementIndex].length )
			{
				do
				{ 
					values.push("");
					++elementIndex;
					if( elementIndex == strs.length)
						done = true;
					elementIndex %= strs.length;
				}
				while( element_count >= strs[elementIndex].length);
				
				element_count = 0;
				str_match_start = -1;
				str_match_end = -1;
			}
			else if ( str[index] != strs[elementIndex][element_count])
			{
				element_count = 0;
				str_match_start = -1;
				str_match_end = -1;
			}
			
			++index;
		}
		
		if(done)
		{
			values.push(currentValue);
			array_of_values.push(values);
		}
		
		while(values.length < strs.length)
		{
			values.push("");
		}	
	}
	catch(ex)
	{
		console.log(ex);
		console.log(strs);
		console.log(elementIndex);
		console.log(element_count);
	}
	return array_of_values;
}

main("kdgkfvfvffovfodnv;cnovcdovfvnf; ;f",'b',1);

module.exports = {store_values,store_values_global,SplitLongString};