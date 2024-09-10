import { Injectable } from '@angular/core';
import {Workbook}  from 'exceljs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExceljsService {

  constructor() { }
  
  public createWorkBook(name:string):any
  {
		const workbook:any = new Workbook();
		workbook.creator = name;
		workbook.created = new Date();
		return workbook;
  }
  public dictionnaryFyWB(name:string):any
  {
		const workbook:any = new Workbook();
		var sheets:any = {};
			
		workbook.xlsx.readFile(name).then(()=>
		{
			workbook.eachSheet((sheet:any,sheetid:any)=>
			{
				sheets[sheetid] = {rows:[]};
				sheet.eachRow((row:any,rowId:any)=>
				{
					sheets[sheetid][sheets[sheetid].length-1].push({cells:[]});
					row.eachCell((cell:any,cellId:any)=>
					{
						sheets[sheetid].rows[sheets[sheetid].length-1].cells[sheets[sheetid].rows[sheets[sheetid].length-1].length-1].cells.push(cell.text);
					});
				});
			});
		});
		
		return sheets;
  }
  public addWorkSheet(name:string,workbook:any):any
  {
		const sheet:any = workbook.addWorksheet(name,{
		pageSetup:{paperSize: 9, orientation:'landscape'},properties:{tabColor:{argb:'FF005B0'}}});
		sheet.state = 'visible';
		return sheet;
  }
  
  public addHeadersToWorkSheet(sheet:any,headers:any[])
  {
		console.log(headers);
		let headersTemp:any[] =[];
		headers.forEach((headerObj:any)=> 
		{ 
			if(typeof headerObj == 'string')
			{
				headersTemp.push({ header:headerObj,key: headerObj.toLowerCase().replace(' ',''),width:15 }); 
			}
			else
			{
				headersTemp.push({ header:headerObj.name,key: headerObj.name.toLowerCase().replace(' ',''),width:15 }); 
			}
		});
		if(headersTemp != undefined)
			sheet.columns = headersTemp;
		const headerRow = sheet.getRow(1);
		headerRow.font = { bold: true, color: { argb: 'FFFFFF' } }; // Texte en gras et blanc
		headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0070C0' } }; 
	
  }
  
  private addRowToWorkSheet(row:any[],sheet:any)
  {
		sheet.addRow(row); 
  }
  
  public async saveWorkBookIntoFile(wb:any,name:string)
  {
	let buff = await wb.xlsx.writeBuffer();
	const blob = new Blob([buff], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
	saveAs(blob,name+" "+(new Date()).toLocaleTimeString('fr-FR',{day:'numeric',month:'long',year:'numeric'}));
  }
  
  public writeAllRowValuesFor1DArray(sheet:any,values:any[],limit:number)
  {
		let length = 0;
		console.log("limit"+limit);console.log("length"+length);console.log("values"+values.length);
		values.forEach((rowValue:any[])=>
		{
			let rowOfValues = rowValue.map((el:any,index:number)=> el.value);
			let values = [];
			for(let i = 0; i < rowOfValues.length && i < limit;++i)
			{
				values.push(rowOfValues[i]);
			}
			this.addRowToWorkSheet(values,sheet);
		});
		
		sheet.columns.forEach((column:any) => {
			column.width = (column.header == undefined || (column.header != undefined && column.header.length < 15))? 15 : column.header.length;
			column.eachCell({ includeEmpty: true }, (cell:any) => {
				const columnWidth = cell.value ? cell.value.toString().length : 15;
				column.width = Math.max(column.width, columnWidth);
			});
		});
  }
  
  public MergeCells(str:string,sheet:any)
  {
		sheet.mergeCells(str);
  }
  
}
