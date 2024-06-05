let a = {a:1,2:[1,2,3,{k:1,c:""}],3:{a:[1,2,3,{l:"op"}],b:[1,2]}}
let c = {};
function copy(newObj,objRef)
{
	if(objRef instanceof Array)
	{
		objRef.forEach((el)=>
		{
			if(!(el instanceof Array) && !(el instanceof Object))
			{
				newObj.push(el);
			}
			else if ((el instanceof Array))
			{
				const a = [];
				newObj.push(a);
				copy(a,el);
			}
			else if(el instanceof Object)
			{
				
				const a = {};
				newObj.push(a);
				copy(a,el);
			}
		});
	}
	else if(objRef instanceof Object)
	{
		Object.keys(objRef).forEach((key)=>
		{
			if(!(objRef[key] instanceof Array) && !(objRef[key] instanceof Object))
			{
				newObj[key] = objRef[key];
			}
			else if ((objRef[key] instanceof Array))
			{
				const a = [];
				newObj[key] = a;
				copy(a,objRef[key]);
			}
			else if(objRef[key] instanceof Object)
			{
				const a = {};
				newObj[key] = a;
				copy(a,objRef[key]);
			}
		});
	}
	
}

copy(c,a);
console.log(a);
console.log(c);