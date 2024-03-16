import { Component,Input } from '@angular/core';
import { ToggleLoginService } from '../loggin-service/toggle-login.service'
import {HttpService} from '../http-forced/http.service';
import {DataStorageService} from '../data-storage-service/data-storage.service'
import {LoginResponse,UserData,Base} from '../year-employee-model/year-employee-model';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})

export class LoginPageComponent 
{

	public responseText:string = "";
	loginRequests:number = 0;
	constructor(public toggle:ToggleLoginService,public data:DataStorageService,public httpservice: HttpService)
	{
		
	}
	

	public formOnSubmit(formData:any)
	{
		console.log(formData);
		let result = this.loginRequestInit(formData.value.ID,formData.value.pass,{}) ;
		console.log(result);
	}
	
	public setUserAuthentifiction(value:UserData)
	{
		this.data.userAuthentification = value;
	}
	
	public loginRequestInit(IDParam:string,passParam:string,data:any)
	{
		let reqObj = {command: "login" , cmdArg: "login",comeBack:data.comeBack,Box: data.Box,Pos: data.Pos,userAuthentification:{ID: IDParam,Prenom:"",Nom:"",genre:"",naissance:"",pass:passParam,superadmin:false,admin:false,user:false}};
		console.log(reqObj);
		let aparent:LoginPageComponent = this;
		if(aparent.data.userAuthentification.ID.trim() == "" && aparent.data.userAuthentification.pass.trim() == "")
		aparent.httpservice.requestBaseStandardBeta(reqObj).subscribe((response)=>
		{
			console.log(response);
			aparent.loginRequests = aparent.loginRequests++;
			
			if(response !== undefined && response !== null)
			{
				let castResponse = response as LoginResponse;
				
				if(castResponse.comeBack)
				{
					//comeBack:true,Box: data.Box,Pos: data.Pos
					aparent.responseText = "Le serveur est entrain de charger. Veuillez réessayer ensuite.";
					if(aparent.loginRequests < 25)
					{
						if(aparent.loginRequests % 20 == 0)
						{
							/*
							let d2:Date = new Date();
							let d1:Date = new Date();
							while(d1.getTime() - d2.getTime() < 500)
							{
								d1 = new Date();
							}
							*/
						}
						
						let d2:Date = new Date();
						let d1:Date = new Date();
						while(d1.getTime() - d2.getTime() < 500)
						{
							d1 = new Date();
						}
						
						console.log(IDParam +" IDParam");
						aparent.loginRequestInit(IDParam,passParam,{comeBack:castResponse.comeBack,Box:castResponse.Box,Pos:castResponse.Pos});
					}
					else
					{
						aparent.loginRequests = 0;
						aparent.responseText = "Le serveur est entrain de charger. Veuillez réessayer ensuite.";
					}
				}
				else if(castResponse.first != undefined && castResponse.first)
				{
					/*console.log("Login Sucks!");
					console.log("--------------Log data---------------");
					console.log(aparent.data.userAuthentification);
					console.log("--------------Log data---------------");
					*/
					aparent.data.userAuthentification = castResponse.element;
					if(aparent.data.userAuthentification.superadmin)
					{
						aparent.setUserAuthentifiction(castResponse.element);
						aparent.toggle.toggle = false;
						aparent.responseText = "OK";
					}
					else
					{
						aparent.responseText = "Votre mot de passe et ID n'est pas celui d'un administrateur.Vous n'avez pas l'accés à la page.";
					}
					/*
					console.log("--------------Log data---------------");
					console.log(aparent.data.userAuthentification);
					console.log("--------------Log data---------------");
					*/
					//aparent.getRequestCallBack(aparent.httpservice,aparent));
					//aparent.loginToggle.responseString = "OK";
				}
				else if(!castResponse.first)
				{
					if(castResponse.third)
					{
						if(aparent.loginRequests < 100)
						{
							aparent.responseText = "Le serveur est entrain de charger.Veuillez patienter"+((aparent.loginRequests<= 30)?".":(aparent.loginRequests<=60)?"..":(aparent.loginRequests>60)?"...":"");
							if(aparent.loginRequests % 50 == 0)
							{
								let d2:Date = new Date();
								let d1:Date = new Date();
								while(d1.getTime() - d2.getTime() < 80)
								{
									d1 = new Date();
								}
							}
							aparent.loginRequestInit(IDParam,passParam,{});
						}
						else
						{
							aparent.loginRequests = 0;
						//aparent.loginToggle.responseString = "Erreur au niveau du serveur veuillez réessayer plus tard.";
							aparent.responseText = "Erreur au niveau du serveur. Veuillez réessayer plus tard.";
						}
					}
					else
					{
						//aparent.loginToggle.responseString = "Mauvaise combinaison de mot de passe et ID.";
						aparent.responseText = "Mauvaise combinaison de mot de passe et ID.";
					}
				}
			} 
		}
		,(error) =>
		{
			aparent.responseText = error.error.desc;
			console.log(error);
		});
		else
			aparent.loginRequests = 0;
	}
}
