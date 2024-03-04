import { Component } from '@angular/core';
import { HttpResponse,HttpErrorResponse} from '@angular/common/http';
import {HttpService} from '../http-forced/http.service';
import {DataStorageService} from '../data-storage-service/data-storage.service';

@Component({
  selector: 'app-office-form',
  templateUrl: './office-form.component.html',
  styleUrls: ['./office-form.component.css','./basic.css']
})

export class OfficeFormComponent 
{
	public notLinking:boolean = true;
	public displayID:string = "all";
	public fileupload:any = undefined;
	public responseString:string ="";
	public Color:string = "silver";
	public submissionRequests:number = 0;
	public r1_checked:boolean = true;
	public r2_checked: boolean = false;
	public s3_valid:boolean = false;
	public s4_valid:boolean = false;
	public s4_selected_index = 0;
	public onDisplay:AllRowsContainer = {indexofSelection: -1,elements: []};
	public toggled: boolean = false;
	public selectedID:string = "";
	public objectKeysFunction: Function = Object.keys;
	public type_correcter: any = {"text":"Texte","password":"Mot de passe","Integer":"Nombre entier","Date":"Date"};
	public modelDic:any = {ID:"",baseID:""};
	public rowHovered: any = undefined;
	public newBase:boolean = false;
	public baseColumns: any[] = [{value:"",index:0,submitting:false}];
	public dicSubmittedOnDisplay:any = {}; 
	public c1:boolean = true;
	public c2:boolean = false;
	public c3:boolean = false;
	public c3data:any = {submitting:false,responseString:"",response:false};
	
	constructor(private httpservice: HttpService,public data: DataStorageService)
	{
		setInterval(()=>{console.log(data);console.log("Toggle "+this.toggled+"....")},2000);
	}
	
	public submitFunction(formvalue:any,form:any,source:any):void
	{
		let addindividual = this.notLinking;
		let current_row_hovered = this.rowHovered;
		current_row_hovered.submitting = true;
		console.log(source);
		
		if(this.c1)
		{
			//console.log(formvalue);
			
			let formdata = new FormData();
			for (const [key, value] of Object.entries(formvalue)) 
			{
				if( key != "employeeID" && key != "baseIDPrime")
				{
					if(key == "imgname" && this.fileupload != undefined)
					{
						formdata.append("imgfile",this.fileupload,this.fileupload.name);
						formdata.append("imagename","assets/images/"+this.fileupload.name);
					}
					else if( key == "type" )
					{
						formdata.append(key+"1",(value as string) == "1"?'true':'false');
						formdata.append(key+"2",(value as string) == "4"?'true':'false');
					}
					else
						formdata.append(key as string,value as string);
				}
				console.log(key+" "+value);
			}
			
			formdata.append("table","DouDous'individuals");
			formdata.append("table2","DouDous correspondance");	
			formdata.append("command","update");
			formdata.append("cmdArg",(addindividual)?"addindividual":"linkindividualtobase");
			formdata.append("authID",this.data.userAuthentification.ID);
			formdata.append("authPrenom",this.data.userAuthentification.Prenom);
			formdata.append("authNom",this.data.userAuthentification.Nom);
			formdata.append("authGenre",this.data.userAuthentification.genre);
			formdata.append("authpass",this.data.userAuthentification.pass);
			console.log(formdata);
			this.getRequestCallBack(this.httpservice,formdata,this,current_row_hovered);
		}
		else if(this.c2)
		{
			let formdata = new FormData();
			
			for (const [key, value] of Object.entries(formvalue)) 
			{
				if( key != "idDisplayer" )
					formdata.append(key as string,value as string);
					
				console.log(key);
				console.log(value);
			}
			
			if(formdata.get("id") == undefined)
			{
				formdata.append("id",this.selectedID);
			}
			
			if(formdata.get("idindividu") == undefined)
			{
				formdata.append("idindividu",this.data.userAuthentification.ID);
			}
			
			formdata.append("table",this.data.base.tables[this.selectedID].name);
			formdata.append("command","update");
			formdata.append("cmdArg","addrows");
			formdata.append("authID",this.data.userAuthentification.ID);
			formdata.append("authPrenom",this.data.userAuthentification.Prenom);
			formdata.append("authNom",this.data.userAuthentification.Nom);
			formdata.append("authGenre",this.data.userAuthentification.genre);
			formdata.append("authpass",this.data.userAuthentification.pass);
			console.log(this.dicSubmittedOnDisplay[source.submitter.name]);
			this.dicSubmittedOnDisplay[source.submitter.name].submitting = true;
			this.getRequestCallBack(this.httpservice,formdata,this,this.dicSubmittedOnDisplay[source.submitter.name]);
		}
		else if (this.c3)
		{
			let formdata = new FormData();
			this.c3data.submitting = true;
			
			for (const [key, value] of Object.entries(formvalue)) 
			{
				formdata.append(key as string,value as string);
			}
			
			formdata.append("table","DouDous'bases");
			formdata.append("command","update");
			formdata.append("cmdArg","addbase");
			formdata.append("authID",this.data.userAuthentification.ID);
			formdata.append("authPrenom",this.data.userAuthentification.Prenom);
			formdata.append("authNom",this.data.userAuthentification.Nom);
			formdata.append("authGenre",this.data.userAuthentification.genre);
			formdata.append("authpass",this.data.userAuthentification.pass);
			this.getRequestCallBack(this.httpservice,formdata,this,this.c3data);
		}
	}
	
	getRequestCallBack(ahttpservice:HttpService,formvalue:FormData,officefc:OfficeFormComponent,current_row_hovered:any)
	{
		officefc.submissionRequests++;
		console.log("Why are you so stubbordn..."+officefc.submissionRequests);
		ahttpservice.requestBaseInitFormBeta(formvalue).subscribe(
		(responseValue: any) =>
		{
			let response:responsa = responseValue as responsa;
			console.log(responseValue);
			console.log(response);
			try
			{
				if(response.comeBack)
				{
					if( formvalue.get("comeBack") == undefined)
					{
						formvalue.append("comeBack",response.comeBack.toString());
					}
					if(formvalue.get("Box") == undefined) 
					{
						formvalue.append("Box",response.Box.toString());
					}
					if(formvalue.get("Pos") == undefined)
					{
						formvalue.append("Pos",response.Pos.toString());
					}
					
					if(officefc.submissionRequests < 100)
					{
						officefc.responseString = "Le serveur est entrain de charger.Veuillez patienter"+((officefc.submissionRequests<= 30)?".":((officefc.submissionRequests<=60)?"..":((officefc.submissionRequests>60)?"...":"")));
						/*if(officefc.submissionRequests % 50 == 0)
						{
							let d2:Date = new Date();
							let d1:Date = new Date();
							while(d1.getTime() - d2.getTime() < 50)
							{
								d1 = new Date();
							}
						}*/
						setTimeout(officefc.getRequestCallBack,750,officefc.httpservice,formvalue,officefc);
					}
					else
					{
						officefc.submissionRequests = 0;
						//aparent.loginToggle.responseString = "Erreur au niveau du serveur veuillez réessayer plus tard.";
						officefc.responseString = "Erreur au niveau du serveur. Veuillez réessayer encore.";
					}	
				}
				else if(response.third)
				{
						if(officefc.submissionRequests < 100)
						{
							officefc.responseString = "Le serveur est entrain de charger.Veuillez patienter"+((officefc.submissionRequests<= 30)?".":((officefc.submissionRequests<=60)?"..":((officefc.submissionRequests>60)?"...":"")));
							if(officefc.submissionRequests % 50 == 0)
							{
								let d2:Date = new Date();
								let d1:Date = new Date();
								while(d1.getTime() - d2.getTime() < 50)
								{
									d1 = new Date();
								}
							}
							officefc.getRequestCallBack(officefc.httpservice,formvalue,officefc,current_row_hovered);
						}
						else
						{
							officefc.submissionRequests = 0;
							//aparent.loginToggle.responseString = "Erreur au niveau du serveur veuillez réessayer plus tard.";
							officefc.responseString = "Erreur au niveau du serveur. Veuillez réessayer encore.";
						}
				}
				else if(response.customtext == "IDExistant")
				{
					officefc.responseString = "ajout échoué. L'ID choisit existe déja";
				}
				else if(response.customtext == "OK")
				{
					if(!current_row_hovered)
						officefc.responseString = "ajout passé.";
					else
					{
						current_row_hovered.responseString = "ajout passé";
						current_row_hovered.submitting = false;
					}
				}
				else
				{
					if(!current_row_hovered)
						officefc.responseString = response.text as string;
					else
					{
						if( response.customtext == "Error" )
						{
							current_row_hovered.responseString = response.text;
						}
						current_row_hovered.submitting = false;
					}
				}
			}catch(ex){}
		},(responseValue:HttpErrorResponse)=>
		{
			console.log(responseValue);
			if (responseValue.status == 500)
			{
				if(!current_row_hovered)
					officefc.responseString = "ajout échoué.";
				else
				{
					current_row_hovered.responseString = "ajout échoué.";
					current_row_hovered.submitting = false;
				}
			}
			else if (responseValue.status == 504)
			{
				if(!current_row_hovered)
					officefc.responseString = "ajout échoué.Le serveur est entrain de charger..";
				else
				{	
					current_row_hovered.responseString = "ajout échoué.Le serveur est entrain de charger..";
					current_row_hovered.submitting = false;
				}
			}
			else
			{
				if(!current_row_hovered)
					officefc.responseString = "ajout échoué. Il y a un problème de connection.";
				else
				{
					current_row_hovered.responseString = "ajout échoué. Il y a un problème de connection.";					
					current_row_hovered.submitting = false;
				}
			}
		});
	}
	
	fileUpload(eventArgs:any):void
	{
		this.fileupload = eventArgs.target.files[0];
	}
	
	selectValueChanged (value:HTMLSelectElement,value2:HTMLInputElement) : void
	{
		if(value.name == "type" )
		{
			if(value.value == "3")
			value2.value = value.value;
		}
		console.log(value);console.log(value2);
	}
	
	numberReturn (value:any)
	{
		return Number(value.toString());
	}
	
	radioChanged(r:HTMLInputElement,num:Number)
	{
		if(r.checked && num == 1)
		{
			this.r2_checked = false;
			this.r1_checked = true;
		}
		else if(r.checked && num == 2)
		{
			this.r1_checked = false;
			this.r2_checked = true;
		}
	}
	
	
	selectionValid(s:HTMLSelectElement,num:Number)
	{	
		try
		{
			if(Number(s.value) >= 0)
			{	
				if(num == 3)
					this.s3_valid = true;
				else if(num == 4)
					this.s4_valid = true;
			}
			else
			{
				if(num == 3)
					this.s3_valid = false;
				else if(num == 4)
					this.s4_valid = false;
			}
		}
		catch(ex)
		{
			if(num == 3)
				this.s3_valid = false;
			else if(num == 4)
				this.s4_valid = false;
		}
	}
	getKeys(objectGiven:any):any
	{
		return Object.keys(objectGiven);
	}
	selectedIndex(s:HTMLSelectElement,num:Number,index:number)
	{
		if(num == 4 && index != this.s4_selected_index)
		{
			this.s4_selected_index = index;
			console.log("Indexes:" +index);
		}
	}
	
	addUp(length:number,selectedID:string,ID:string)
	{
		let values:string[] = [];
		for(let index = 0; index < length; ++index)
		{
			if(index +1 == length-1)
			{
				values.push(ID);
			}
			else if (index + 1 ==length)
			{
				values.push(selectedID);
			}
			else
			{
				values.push("");
			}
		}
		
		console.log(values);
		
		if(this.onDisplay == undefined)
		{
			this.onDisplay = {indexofSelection: 0, elements:[]}
		}
		let object_value:any = {values:values,responseString:"",class:"notdisplayed",done:false,index:this.onDisplay.elements.length,flipped:false,submitting:false};
		this.onDisplay.elements.push(object_value);
		this.onDisplay.indexofSelection = this.onDisplay.elements.length-1; 	
		this.dicSubmittedOnDisplay["b"+(this.onDisplay.elements.length-1)] = object_value;
	}
	
	deleteElement(givenindex:number)
	{
		let found_elements_index = -1;
		this.onDisplay.elements.forEach((element,index,array)=>
		{
			if(element.index == givenindex)
			{
				found_elements_index = index;;
			}
		});
		
		if(found_elements_index != -1)
		{
			this.onDisplay.elements.splice(1,found_elements_index);
			this.resetSelectedIndex();
		}
		
	}
	
	resetSelectedIndex()
	{
		this.onDisplay.elements.forEach((element,index,array)=>
		{
			if(!element.done)
			{
				this.onDisplay.indexofSelection = index;
			}
		});
	}
	
	setSelectedID(key:string)
	{
		this.selectedID  = key;
	}
	
	toggle(value1:boolean,value2:boolean,value3:boolean)
	{
		this.toggled = !this.toggled;
		this.c1 = value1;
		this.c2 = value2;
		this.c3 = value3;
	}
	
	flipOthers(indexPassed:number,flip:boolean,rowHovered:any)
	{
		console.log(indexPassed+"-----------------");
		if(flip)
		{
			this.rowHovered = rowHovered;
		}
		
		
		this.onDisplay.elements.forEach((element,index)=>
		{
			console.log(index);
			if(index != indexPassed)
			{
				if(!element.flipped && flip)
					element.flipped = true;
				else if(element.flipped && !flip)
					element.flipped = false;		
			}
		});
	}
	
	setSelectorValues(select:HTMLSelectElement,selectedIndex:number,values:any[],elements: any[])
	{
		if(select.name == "employeeID")
		{
			if(selectedIndex == -1)
				this.notLinking = true;
			else
				this.notLinking = false;
			console.log("Linking status");
			console.log(this.notLinking);
		}
		elements.forEach((element,index)=>
		{
			if(!(element instanceof HTMLSelectElement))
			{
				if(selectedIndex == -1)
				{
					if(this.modelDic[element.name]!= undefined )
					{
						this.modelDic[element.name] = "";
					}
					else
						element.value = ""; 
					element.disabled = false;
				}
				else
				{
					if(this.modelDic[element.name]!= undefined )
					{
						this.modelDic[element.name] = values[index];
					}
					element.disabled = true; 
				}
			}
			else if(element instanceof HTMLSelectElement)
			{
				element.selectedIndex= values[index];
			}
		});
	}
	
	clear(sElements:any[],textElements:any[])
	{
		this.notLinking = true;
		sElements.forEach((element1)=>
		{
			element1.selectedIndex = -1; 
		});
		
		textElements.forEach((element)=>
		{
			element.value = "";
			if(element.disabled)
			{
				element.disabled = undefined;
			}
		});
	}
	
	ableInput(s1:any,s2:any,element:any,elementfn1:any,elementsn1:any,elementg1:any,elementpwd1:any,element2:any)
	{
		if(element.disabled)
		{
			element.disabled = undefined;
			elementfn1.disabled = undefined;
			elementsn1.disabled = undefined;
			elementg1.disabled = undefined;
			elementpwd1.disabled = undefined;
		}
		if(element2.disabled)
		{
			element2.disabled = undefined;
		}
	}
	
	disableInput(s1:any,s2:any,element:any,elementfn1:any,elementsn1:any,elementg1:any,elementpwd1:any,element2:any)
	{
		if(s1.selectedIndex != -1)
		{
			element.disabled = true;
			elementfn1.disabled = true;
			elementsn1.disabled = true;
			elementg1.disabled = true;
			elementpwd1.disabled = true;
		}
		if(s2.selectedIndex != -1)
		element2.disabled = true;
	}
	
	reduceRowOfValuesbydisplayID(rowValuesArray:any[]):boolean
	{
		console.log(rowValuesArray);
		return rowValuesArray.reduce((acc:boolean,curr:any)=> acc = acc || (curr.value == this.displayID || this.displayID == 'all'),false);
	}
	
	addBase():void
	{
		let current_length = this.baseColumns.length;
		let object_value = {value:"",index:this.baseColumns.length+1,submitting:false};
		this.baseColumns.push(object_value);
	}
	
	fixType(type:string):string
	{
		if(type == "Integer")
		return "number"
		
		return type;
	}
}

interface responsa 
{
	customtext: string;
	third?: boolean;
	text?:string;
	comeBack?:boolean;
	Box?: any;
	Pos?: any;
}

interface rowInterface
{
	values: string[];
	responseString: string;
	class: string;
	done: boolean;
	index: number;
	flipped:boolean;
	submitting:boolean;
}

interface AllRowsContainer
{
	indexofSelection: number;
	elements: rowInterface[];
}


