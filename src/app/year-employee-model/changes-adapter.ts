export class ChangesAdapter 
{
	constructor(){}
	SecondComplementsorSimplifiesFirst(first:any, second:any)
	{
		if(first instanceof Array && second instanceof Array)
		{
			this.SecondComplementsorSimplifiesFirstArrays(first,second);
			return false;
		}
		else if (first instanceof Object && second instanceof Object)
		{
			this.SecondComplementsorSimplifiesFirstObjects(first,second);
			return false;
		}
		else if(typeof first == typeof second)
		{
			if(!this.areTwoPrimitiveTypesValuesEqual(first,second))
			{
				//set first == second; saying yes return == true
				return true;
			}
			else
				return false;
		}
		else
		{
			return false;
		}
	}

	areTwoPrimitiveTypesValuesEqual(a:any, b:any)
	{
		if(a instanceof Number && b instanceof Number)
		{
			return a == b;
		}
		else if( a instanceof String && b instanceof String)
		{
			return a == b;
		}
		else if(a instanceof Date && b instanceof Date)
		{
			return a.toString() == b.toString() 
		}
		return a == b;
	}

	SecondComplementsorSimplifiesFirstObjects (first:any,second:any)
	{
		
		for (const [key, value] of Object.entries(first)) 
		{
			if(second[key] == undefined)
			{
				first[key] = undefined;
			}
		}

		for (const [key, value] of Object.entries(second)) 
		{
			let found = false;
			if(first[key] != undefined)
			{
				if(this.SecondComplementsorSimplifiesFirst(first[key],value))
				{
					first[key] = value;
				}
			}
			else
			{
				first[key] = value;
			}
		}
	}

	SecondComplementsorSimplifiesFirstArrays (first:any,second:any)
	{
		let start = -1; let end = -1;
		if(first.length > second.length)
		{
			start = second.length;
			end = first.length-1;
		}
		
		for(let i = 0; i < second.length; ++i)
		{
			if(i <= first.length -1)
			{
				if( this.SecondComplementsorSimplifiesFirst(first[i],second[i]) )
				{
					first[i] = second[i];
				}
			}
			else
			{
				first.push(second[i]);
			}
		}

		if(start != -1 && end != -1)
		{
			first.splice(start,end - start + 1)
		}
	}

}
