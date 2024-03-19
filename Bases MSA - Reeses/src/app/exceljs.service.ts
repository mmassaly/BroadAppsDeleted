import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExceljsService {

  constructor() { }
  
  public createWorkBook(name:string):any
  {
		const workbook:any = new ExcelJS.Workbook();
		workbook.creator = name;
		workbook.created = new Date();
		return workbook;
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
		sheet.addRow(headers.map((headerObj)=> headerObj.name)); 
		const headerRow = sheet.getRow(1);
		headerRow.font = { bold: true, color: { argb: 'FFFFFF' } }; // Texte en gras et blanc
		headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0070C0' } }; 
  }
  
  private addRowToWorkSheet(row:any[],sheet:any)
  {
		console.log(row);
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
			let rowOfValues = rowValue.map((el:any)=> el.value);
			this.addRowToWorkSheet(rowOfValues,sheet);
		});
  }
  
}
