import { Injectable } from '@angular/core';
import {UserData,Base} from '../year-employee-model/year-employee-model';

@Injectable({
  providedIn: 'root'
})

export class DataStorageService 
{
	
	public userAuthentification:UserData = {ID:"", Prenom:"", Nom: "",genre: "",pass:"",superadmin:false,user:false};
	public base: Base = {individuals:{},tables:{}};
	
	constructor() 
	{
		
	}
	
	setUserData(element:any)
	{
		this.userAuthentification = (element as UserData);
	}
	
}

