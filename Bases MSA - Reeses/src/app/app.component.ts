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
		Object.keys(this.data.base.tables).forEach((key)=>
		{
			if(this.data.onDisplay[key] == undefined)
			{
				console.log("changing "+key);
				this.data.onDisplay[key] = {indexofSelection: 0, elements:[]};;
				this.data.onDisplaySaving[key] ={values:[]};
				
				this.data.base.tables[key].rowsInput.forEach((rielem:any)=>
				{
					console.log("Adding");console.log(rielem);
					let copy = JSON.parse(JSON.stringify(rielem));
					let copy2 = JSON.parse(JSON.stringify(rielem));
					let object_value:any = {values:copy,responseString:"",
					class:"notdisplayed",done:false,index:this.data.onDisplay[key].elements.length,flipped:false,submitting:false};
					this.data.onDisplay[key].elements.push(object_value);
					this.data.onDisplaySaving[key].values.push(copy2);					
					this.data.onDisplay[key].indexofSelection = this.data.onDisplay[key].elements.length-1; 	
					this.data.dicSubmittedOnDisplay[key+"b"+(this.data.onDisplay[key].elements.length-1)] = object_value;
				});
			}	
			if(this.data.rowChanges[key] == undefined)
			{
				this.data.rowChanges[key] = {values:[]};
				this.data.base.tables[key].rows.forEach((rielem:any)=>
				{
					this.data.rowChanges[key].values.push({row:JSON.parse(JSON.stringify(rielem)),displays:false});
				});
			}
			else if (this.data.rowChanges[key].values.length < this.data.base.tables[key].rows.length)
			{
				let count = this.data.rowChanges[key].values.length;
				while(count < this.data.base.tables[key].rows.length)
				{
					this.data.rowChanges[key].values.push({row:JSON.parse(JSON.stringify(this.data.base.tables[key].rows[count])),displays:false});++count;
				}
			}
			else if (this.data.base.tables[key].rows.length > 0 && this.data.rowChanges[key].values.length > this.data.base.tables[key].rows.length )
			{
				let count = this.data.rowChanges[key].values.length;
				while(count > this.data.base.tables[key].rows.length)
				{
					this.data.rowChanges[key].values.pop();--count;
				}
			}
			else if (this.data.base.tables[key].rowsInput.length > 0 && this.data.onDisplay[key].elements.length > this.data.base.tables[key].rowsInput.length )
			{
				let notFoundMustGo:any[] = [];
				this.data.onDisplay[key].elements.forEach((el:any)=> 
				{
					let finding_results =this.data.base.tables[key].rowsInput.find((el2:any)=>
					{
						el.values.index.toString() == el2.index.toString() && el.values.id.toString() == el2.id.toString()
					}); 
					
					if(finding_results == undefined)
					{
						notFoundMustGo.push(el);
					}
					
				});
				
				notFoundMustGo.forEach((el:any)=>
				{
					let index = this.data.onDisplay[key].elements.indexOf(el);
					this.data.onDisplay[key].elements.splice(index,1);
				});
			}
		});
  }
}
