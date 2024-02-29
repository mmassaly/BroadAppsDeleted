import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ToggleStateService
{
	public values:ToggleValuesType[];
	public toggleOfficeForm = true;
	public toggleEmployeeForm = false;
	
	constructor() 
	{
		this.values = [];
	}
	
	public getToggleValue(str:string):boolean
	{
		for(let i = 0; i < this.values.length;++i)
		{
			if(this.values[i].name == str)
				return this.values[i].toggled;
		}
		return false;
	}
}

export interface ToggleValuesType 
{
	name:string;
	toggled:boolean;
}
