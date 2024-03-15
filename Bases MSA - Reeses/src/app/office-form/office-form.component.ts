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
	public fileupload2:any = undefined;
	public responseString:string ="";
	public Color:string = "silver";
	public submissionRequests:number = 0;
	public r1_checked:boolean = true;
	public r2_checked: boolean = false;
	public s3_valid:boolean = false;
	public s4_valid:boolean = false;
	public s4_selected_index = 0;
	public toggled: boolean = false;
	public selectedID:string = "1";
	public objectKeysFunction: Function = Object.keys;
	public type_correcter: any = {"text":"Texte","password":"Mot de passe","Integer":"Nombre entier","Date":"Date"};
	public modelDic:any = {ID:"",baseID:""};
	public rowHovered: any = undefined;
	public newBase:boolean = false;
	public baseColumns: any[] = [{value:"",index:0,submitting:false}];
	public c1:boolean = false;
	public c2:boolean = true;
	public c3:boolean = false;
	public c3data:any = {submitting:false,responseString:"",response:false};
	public addingRowsDone:any = {count: 0, submitting:true,responseString:""};
	public ourHeaders:any = {};
	public swappingStack:any[] = []; 
	public updatingInputs: any = {count: 0, submitting:true,responseString:""};
	
	constructor(private httpservice: HttpService,public data: DataStorageService)
	{
		setInterval(()=>{console.log(data);console.log("Toggle "+this.toggled+"....")},2000);
	}
	public submitFunctionBasic(b:number,source:any)
	{
		if(this.c2)
		{
			let formdata = new FormData();
			
			for (const [key, value] of Object.entries(this.data.dicSubmittedOnDisplay[source.srcElement.name].values)) 
			{
			
				if( key != "idDisplayer" && key != "id" && key != "idindividu" && key !="prenom" && key !="nom" && key !="genre" && key !="image")
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
			
			formdata.append("index",this.data.dicSubmittedOnDisplay[source.srcElement.name].index);
			formdata.append("table",this.data.base.tables[this.selectedID].name);
			formdata.append("command","update");
			formdata.append("cmdArg","addrows");
			formdata.append("authID",this.data.userAuthentification.ID);
			formdata.append("authPrenom",this.data.userAuthentification.Prenom);
			formdata.append("authNom",this.data.userAuthentification.Nom);
			formdata.append("authGenre",this.data.userAuthentification.genre);
			formdata.append("authpass",this.data.userAuthentification.pass);
			console.log(source.srcElement.name+" ..........submitting");
			console.log(this.data.dicSubmittedOnDisplay[source.srcElement.name]);
			this.data.dicSubmittedOnDisplay[source.srcElement.name].submitting = true;
			this.getRequestCallBack(this.httpservice,formdata,this,this.data.dicSubmittedOnDisplay[source.srcElement.name]);
			//let b = this.data.dicSubmittedOnDisplay[source.srcElement.name].index;
			//this.flipOthers(this.selectedID,b,false,this.data.onDisplay[this.selectedID].elements[b]);
		}
	}
	public submitFunction(formvalue:any,form:any,source:any):void
	{
		let addindividual = this.notLinking;
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
						console.log(value);
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
			
			console.log(formvalue);
			this.getRequestCallBack(this.httpservice,formdata,this,undefined);
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
			
			formdata.append("index",this.data.dicSubmittedOnDisplay[source.srcElement.name].index);
			formdata.append("table",this.data.base.tables[this.selectedID].name);
			formdata.append("command","update");
			formdata.append("cmdArg","addrows");
			formdata.append("authID",this.data.userAuthentification.ID);
			formdata.append("authPrenom",this.data.userAuthentification.Prenom);
			formdata.append("authNom",this.data.userAuthentification.Nom);
			formdata.append("authGenre",this.data.userAuthentification.genre);
			formdata.append("authpass",this.data.userAuthentification.pass);
			console.log(source.srcElement.name+" ..........submitting");
			console.log(this.data.dicSubmittedOnDisplay[source.srcElement.name]);
			this.data.dicSubmittedOnDisplay[source.srcElement.name].submitting = true;
			this.getRequestCallBack(this.httpservice,formdata,this,this.data.dicSubmittedOnDisplay[source.srcElement.name]);
			//let b = this.data.dicSubmittedOnDisplay[source.srcElement.name].index;
			//this.flipOthers(this.selectedID,b,false,this.data.onDisplay[this.selectedID].elements[b]);
		}
		else if (this.c3)
		{
			let formdata = new FormData();
			this.c3data.submitting = true;
			
			for (const [key, value] of Object.entries(formvalue)) 
			{
				if(key == "imgname" && this.fileupload2 != undefined)
				{
					formdata.append("imgfile",this.fileupload2,this.fileupload2.name);
					formdata.append("imagename","assets/images/"+this.fileupload2.name);
				}
				else 
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
	
	getRequestCallBack(ahttpservice:HttpService,formvalue:FormData,officefc:OfficeFormComponent,submissionNotifier:any)
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
							officefc.getRequestCallBack(officefc.httpservice,formvalue,officefc,submissionNotifier);
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
					if(!submissionNotifier)
						officefc.responseString = "ajout passé.";
					else
					{
						submissionNotifier.responseString = "ajout passé";
						if(submissionNotifier.count == undefined)
							submissionNotifier.submitting = false;
						else if( submissionNotifier.count > 0 )
						{
							submissionNotifier.count -= 1;
							if(submissionNotifier == 0)
								submissionNotifier.submitting = false;
						}
					}
				}
				else
				{
					if(!submissionNotifier)
						officefc.responseString = response.text as string;
					else
					{
						if( response.customtext == "Error" )
						{
							submissionNotifier.responseString = response.text;
						}
						if(submissionNotifier.count == undefined)
							submissionNotifier.submitting = false;
						else if( submissionNotifier.count > 0 )
						{
							submissionNotifier.count -= 1;
							if(submissionNotifier == 0)
								submissionNotifier.submitting = false;
						}
					}
				}
			}catch(ex){}
		},(responseValue:HttpErrorResponse)=>
		{
			console.log(responseValue);
			if (responseValue.status == 500)
			{
				if(!submissionNotifier)
					officefc.responseString = "ajout échoué.";
				else
				{
					submissionNotifier.responseString = "ajout échoué.";
					if(submissionNotifier.count == undefined)
							submissionNotifier.submitting = false;
					else if( submissionNotifier.count > 0 )
					{
						submissionNotifier.count -= 1;
						if(submissionNotifier == 0)
							submissionNotifier.submitting = false;
					}
				}
			}
			else if (responseValue.status == 504)
			{
				if(!submissionNotifier)
					officefc.responseString = "ajout échoué.Le serveur est entrain de charger..";
				else
				{	
					submissionNotifier.responseString = "ajout échoué.Le serveur est entrain de charger..";
					if(submissionNotifier.count == undefined)
						submissionNotifier.submitting = false;
					else if( submissionNotifier.count > 0 )
					{
						submissionNotifier.count -= 1;
						if(submissionNotifier == 0)
							submissionNotifier.submitting = false;
					}
				}
			}
			else
			{
				if(!submissionNotifier)
					officefc.responseString = "ajout échoué. Il y a un problème de connection.";
				else
				{
					submissionNotifier.responseString = "ajout échoué. Il y a un problème de connection.";					
					if(submissionNotifier.count == undefined)
						submissionNotifier.submitting = false;
					else if( submissionNotifier.count > 0 )
					{
						submissionNotifier.count -= 1;
						if(submissionNotifier == 0)
						submissionNotifier.submitting = false;
					}
				}
			}
		});
	}
	
	fileUpload(eventArgs:any):void
	{
		this.fileupload = eventArgs.target.files[0];
	}
	
	fileUpload2(eventArgs:any):void
	{
		this.fileupload2 = eventArgs.target.files[0];
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
	
	updateChange(selectedID:any,row:number,headers:any,typeofupdate:string)
	{
		console.log(row);
		let formdata = new FormData();
		let newwillbeswapped = undefined;
		let oldtobeswapped = undefined;
		
		if(typeofupdate == 'modifyinputrows')
		{
			newwillbeswapped = this.data.onDisplay[selectedID].elements[row].values;
			oldtobeswapped = this.data.onDisplaySaving[selectedID].values[row];
			
			console.log(this.data.onDisplaySaving[selectedID].values);
			console.log(newwillbeswapped);
			console.log(typeof newwillbeswapped);
			console.log(oldtobeswapped);
			console.log(typeof oldtobeswapped);
			
			
			for (const headerItem of headers) 
			{
				console.log(headerItem.validate);
				if( headerItem.validate )
				{
					console.log(headerItem.name+" "+oldtobeswapped[headerItem.name]);
					console.log(headerItem.name+" "+newwillbeswapped[headerItem.name]);
					formdata.append(headerItem.name as string,JSON.parse(JSON.stringify(oldtobeswapped[headerItem.name])));
					formdata.append(headerItem.name as string,JSON.parse(JSON.stringify(newwillbeswapped[headerItem.name])));
				}
			}
			
			formdata.append("index",oldtobeswapped["index"]);
			formdata.append("index",newwillbeswapped["index"]);
		}
		else if(typeofupdate == 'modifyrows')
		{
			newwillbeswapped = this.data.rowChanges[selectedID].values[row].row;
			oldtobeswapped = this.data.base.tables[selectedID].rows[row];
			
			console.log(this.data.onDisplaySaving[selectedID].values);
			console.log(newwillbeswapped);
			console.log(typeof newwillbeswapped);
			console.log(oldtobeswapped);
			console.log(typeof oldtobeswapped);
			
			let count = 0;
			for (const headerItem of headers) 
			{
				console.log(headerItem.validate);
				if( headerItem.validate )
				{
					console.log(headerItem.name+" "+oldtobeswapped[count].value);
					console.log(headerItem.name+" "+newwillbeswapped[count].value);
					formdata.append(headerItem.name as string,oldtobeswapped[count].value);
					formdata.append(headerItem.name as string,newwillbeswapped[count].value);
				}
				++count;
			}
		}
		//not needed this.swappingStack.push({old:oldtobeswapped,anew:newwillbeswapped,headers:headers});
		
		formdata.append("table",typeofupdate == 'modifyinputrows'?this.data.base.tables[this.selectedID].name+" saisies":this.data.base.tables[this.selectedID].name);
		formdata.append("command","update");
		formdata.append("cmdArg",typeofupdate);
		formdata.append("authID",this.data.userAuthentification.ID);
		formdata.append("authPrenom",this.data.userAuthentification.Prenom);
		formdata.append("authNom",this.data.userAuthentification.Nom);
		formdata.append("authGenre",this.data.userAuthentification.genre);
		formdata.append("authpass",this.data.userAuthentification.pass);
		this.getRequestCallBack(this.httpservice,formdata,this,this.updatingInputs);
		
		if(typeofupdate == 'modifyinputrows')
		{
			for (const headerItem of headers) 
			{
				if(headerItem.validate)
				{
					oldtobeswapped[headerItem.name] = JSON.parse(JSON.stringify(newwillbeswapped[headerItem.name]));
				}
			}
		}
		
	}
	
	async addUp(length:number,selectedID:string,ID:string,headers:any[])
	{
		let formdata = new FormData();
		let values:any = {};
		let values2:any ={};
		console.log(headers);
		
		if(this.data.onDisplay[selectedID] == undefined)
		{
			this.data.onDisplay[selectedID] ={indexofSelection: 0, elements:[]};
		}
		
		for (const headerItem of headers) 
		{
			if( headerItem.name != "id" && headerItem.name != "idindividu" && headerItem.name !="prenom" && headerItem.name!="nom" && headerItem.name!="genre" && headerItem.name !="image")
			{	
				
				values[headerItem.name] = "";
				values2[headerItem.name] = "";
				if(headerItem.type == 'Date')
				{
					let curr = new Date();
					values[headerItem.name] = curr.getFullYear()+'-'+(curr.getMonth()+1)+'-'+curr.getDate();
					values2[headerItem.name] = curr.getFullYear()+'-'+(curr.getMonth()+1)+'-'+curr.getDate();
					formdata.append(headerItem.name as string,curr.getFullYear()+'-'+(curr.getMonth()+1)+'-'+curr.getDate());
				}
				else
					formdata.append(headerItem.name as string,'');
				
			}
			console.log(headerItem.name);
			console.log("empty");
		}
		
		if(formdata.get("id") == undefined)
		{
			formdata.append("id",selectedID);
			values["id"] = selectedID;
			values2["id"] = selectedID;
		}
			
		if(formdata.get("idindividu") == undefined)
		{
			formdata.append("idindividu",ID);
			values["idindividu"] = ID;
			values2["idindividu"] = ID;
		}
		
		let max = 0;
		let usable_index:number[] = [];
		this.data.onDisplay[selectedID].elements.forEach((el:any,index:number)=>
		{
			usable_index.push(index);
			let currNum = Number(el.values.index);
			if( currNum>= max )
			{
				max = currNum+1;
			}
			if(currNum == index)
				usable_index.pop();
		});
		
		values["index"] = usable_index.length > 0? usable_index[0]:max;
		
		let max2 = 0;
		usable_index = [];
		this.data.onDisplaySaving[selectedID].values.forEach((el:any,index:number)=>
		{
			usable_index.push(index);
			let currNum = Number(el.index);
			if( currNum >= max2 )
			{
				max2 = currNum+1;
			}
			if(currNum == index)
				usable_index.pop();
		});;
		
		values2["index"] = usable_index.length > 0? usable_index[0].toString():max2;
		
		formdata.append("index",values["index"]);
		
		let object_value:any = {values:values,responseString:"",class:"notdisplayed",done:false,index:this.data.onDisplay[selectedID].elements.length,flipped:false,submitting:false};
		
		this.data.onDisplay[selectedID].elements.push(object_value);
		this.data.onDisplay[selectedID].indexofSelection = this.data.onDisplay[selectedID].elements.length-1; 	
		this.data.dicSubmittedOnDisplay[selectedID+"b"+(this.data.onDisplay[selectedID].elements.length-1)] = object_value;
		
		this.data.onDisplaySaving[selectedID].values.push(values2);	
		
		formdata.append("table",this.data.base.tables[this.selectedID].name+" saisies");
		formdata.append("command","update");
		formdata.append("cmdArg","addinputrows");
		formdata.append("authID",this.data.userAuthentification.ID);
		formdata.append("authPrenom",this.data.userAuthentification.Prenom);
		formdata.append("authNom",this.data.userAuthentification.Nom);
		formdata.append("authGenre",this.data.userAuthentification.genre);
		formdata.append("authpass",this.data.userAuthentification.pass);
			
		this.addingRowsDone.count++;
		this.addingRowsDone.submitting = true;
		this.getRequestCallBack(this.httpservice,formdata,this,this.addingRowsDone);

	}
	
	deleteElement(givenindex:number)
	{
		let found_elements_index = -1;
		this.data.onDisplay.elements.forEach((element:rowInterface,index:number)=>
		{
			if(element.index == givenindex)
			{
				found_elements_index = index;;
			}
		});
		
		if(found_elements_index != -1)
		{
			this.data.onDisplay.elements.splice(1,found_elements_index);
			this.resetSelectedIndex();
		}
		
	}
	
	resetSelectedIndex()
	{
		this.data.onDisplay.elements.forEach((element:rowInterface,index:number)=>
		{
			if(!element.done)
			{
				this.data.onDisplay.indexofSelection = index;
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
	
	flipOthers(selectedID:any,indexPassed:number,flip:boolean,rowHovered:any)
	{
		console.log(indexPassed+"-----------------");
		if(flip)
		{
			this.rowHovered = rowHovered;
		}
		
		
		this.data.onDisplay[selectedID].elements.forEach((element:rowInterface,index:number)=>
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
	
	log(values:any[])
	{
		values.forEach((val)=>console.log(val));
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


