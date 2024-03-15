import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpResponse,HttpErrorResponse} from '@angular/common/http';
import {BasicCommands} from '../year-employee-model/year-employee-model';
@Injectable()

export class HttpService {

  constructor(public http: HttpClient) { }
  //urlport:string = "http://localhost:3035";
  //urlport:string = "https://msa-pointage-server.vercel.app";
  //urlport:string = "https://msa-pointage-web.cyclic.cloud";
  //urlport:string = "https://vercel-order-transmitter.vercel.app";
  //urlport:string =   "http://192.168.1.2:3034";
  //urlport:string = "http://192.168.0.106:3034";
  //urlport:string = "http://localhost:3034";
  //urlport:string = "http://localhost:3008";
  urlport:string ="https://broadappsdeleted.onrender.com"

  request(url:string)
  {
		let head = new HttpHeaders();
		head.append("Content-Type", "application/json; charset=utf-8");
		head.append("Accept-Charset","utf-8");
		head.append("Accept-Language","fr-FR");
		head.append("Connection","Keep-Alive");
		head.append("Keep-Alive","timeout=8000,max=10");
		return this.http.get(url,{headers:head});
  }
  
  requestBaseInit(url:string,userName:string,userPass:string)
  {
		let head = new HttpHeaders();
		
		let content = 
		{
			command: "pull",
			commandArg: "all",
			adminID: userName,
			pwd: userPass,
		}
		
		head.append("Content-Type", "application/json; charset=utf-8");
		head.append("Accept-Charset","utf-8");
		head.append("Accept-Language","fr-FR");
		head.append("Access-Control-Allow-Origin","*");
		head.append("Connection","Keep-Alive");
		head.append("Keep-Alive","timeout=8000,max=10");
		return this.http.post(url,JSON.stringify(content),{headers:head});
  }
  
  requestBaseInitBeta(userName:string,userPass:string)
  {
		let head = new HttpHeaders();
		
		let content = 
		{
			command: "pull",
			commandArg: "all",
			adminID: userName,
			pwd: userPass,
		}
		
		head.append("Content-Type", "application/json; charset=utf-8");
		head.append("Accept-Charset","utf-8");
		head.append("Accept-Language","fr-FR");
		head.append("Access-Control-Allow-Origin","*");
		head.append("Connection","Keep-Alive");
		head.append("Keep-Alive","timeout=8000,max=10");
		return this.http.post(this.urlport,JSON.stringify(content),{headers:head});
  }
  
  requestBaseStandard(url:string,commands: BasicCommands)
  {
	let head = new HttpHeaders();
		
	head.append("Content-Type", "application/json; charset=utf-8");
	head.append("Accept-Charset","utf-8");
	head.append("Accept-Language","fr-FR");
	head.append("Access-Control-Allow-Origin","*");
	head.append("Connection","Keep-Alive");
	head.append("Keep-Alive","timeout=8000,max=10");
	return this.http.post(url,JSON.stringify(commands),{headers:head});
  }
  
  requestBaseStandardBeta(commands: BasicCommands)
  {
	let head = new HttpHeaders();
		
	head.append("Content-Type", "application/json; charset=utf-8");
	head.append("Accept-Charset","utf-8");
	head.append("Accept-Language","fr-FR");
	head.append("Access-Control-Allow-Origin","*");
	head.append("Access-Control-Allow-Methods","POST, GET, PUT, DELETE, OPTIONS");
	head.append("Access-Control-Allow-Credentials","false");
	head.append("Access-Control-Max-Age",'86400');
	head.append("Access-Control-Allow-Headers","X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
	head.append("Connection","Keep-Alive");
	head.append("Keep-Alive","timeout=8000,max=10");
	return this.http.post(this.urlport,JSON.stringify(commands),{headers:head});
  }
  
  requestBaseInitForm(url:string,formData:FormData)
  {
	let head = new HttpHeaders();
	head.append("Content-Type","multipart/form-data");
	head.append("Access-Control-Allow-Origin","*");
	head.append("Connection","Keep-Alive");
	head.append("Keep-Alive","timeout=8000,max=10");
	return this.http.post(url,formData,{headers:head});
  }
  
  requestBaseInitFormBeta(formData:FormData)
  {
	let head = new HttpHeaders();
	head.append("Content-Type","multipart/form-data");
	head.append("Access-Control-Allow-Origin","*");
	head.append("Connection","Keep-Alive");
	head.append("Keep-Alive","timeout=8000,max=10");
	return this.http.post(this.urlport+"/form",formData,{headers:head});
  }
  
}