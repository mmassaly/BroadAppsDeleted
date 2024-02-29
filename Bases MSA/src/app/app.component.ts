import { Component } from '@angular/core';
import {ChangesAdapter} from './year-employee-model/changes-adapter';
import {Base,UserData,BasicCommands} from './year-employee-model/year-employee-model';
import {DataStorageService} from './data-storage-service/data-storage.service';
import { ToggleLoginService } from './loggin-service/toggle-login.service';
import {Router} from '@angular/router';
import {HttpService} from './http-forced/http.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Bases de données';
  userAuthentification:any = {ID: "",Prenom:"",Nom:"",genre:"",pass:"",superadmin:false,user:false};
  requestCommand:BasicCommands;
  
  
  constructor(private httpservice: HttpService,public data: DataStorageService,private router:Router,public loginToggle :ToggleLoginService)
  {
		this.requestCommand = {command: "pull" , cmdArg: "all",
		userAuthentification:{ID: "",Prenom:"",Nom:"",genre:"",pass:"",superadmin:false,user:false}};
		this.getRequestCallBack(httpservice,this,undefined,5);
		setInterval(this.getRequestCallBack,4000,httpservice,this,undefined,5);
		this.router.navigate(['/']);
  }
  
  setUserAuthentification(value:UserData)
  {
		this.requestCommand.userAuthentification = value;
  }
  
  setUpdateCommands()
  {
		this.requestCommand.cmdArg = "update";
  }
  
  getRequestCallBack(ahttpservice:HttpService,aparent:AppComponent,data:any,count:number)
  {
	
	if(aparent.requestCommand.userAuthentification.ID == "")
	{
		aparent.setUserAuthentification(aparent.data.userAuthentification);
		console.log(aparent.data.userAuthentification);
	}
	if(aparent.data.userAuthentification.ID != "")
	{
		let aRequestCommand ={comeBack:undefined,Box:undefined,Pos:undefined}; 
		if(data != undefined)
		{
			aRequestCommand["comeBack"] = data["comeBack"];
			aRequestCommand["Box"] = data["Box"];
			aRequestCommand["Pos"] = data["Pos"];
			Object.assign(aRequestCommand,aparent.requestCommand);
		}
		console.log(data);
		let newRequestCommand:any = (data == undefined)? Object.assign({},aparent.requestCommand): aRequestCommand;
		console.log(newRequestCommand);
		
		ahttpservice.requestBaseStandardBeta(newRequestCommand).subscribe((response:any)=>
		{	
			/*if(response.comeBack === true && count > 0)
			{
				setTimeout(aparent.getRequestCallBack,500,ahttpservice,aparent,
				{comeBack:response.comeBack,Box:response.Box,Pos:response.Pos}, count);
			}
			else if(response.comeBack)
			{
				return;
			}
			else*/ 
			if(response !== undefined && response !== null)
			{
				aparent.setUpdateCommands();
				aparent.setValues(response);
				//setTimeout(aparent.getRequestCallBack,5000,ahttpservice,aparent,undefined,5);
			}
		}
		,(error) =>
		{
		
		});
	}
  }
  
  setValues(value:any)
  {
		(new ChangesAdapter()).SecondComplementsorSimplifiesFirst(this.data.base,value as Base);
  }
}
