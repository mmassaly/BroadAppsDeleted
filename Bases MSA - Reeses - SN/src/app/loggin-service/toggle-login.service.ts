import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ToggleLoginService 
{

  public toggle:boolean = true;
  public responseText:string = "";
  
  constructor() 
  {
  }
  
  public setResponseText(str:string):void
  {
		this.responseText = str;
  }
}
