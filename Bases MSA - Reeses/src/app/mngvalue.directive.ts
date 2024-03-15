import { Directive,ElementRef, Input,OnInit } from '@angular/core';

@Directive({
  selector: '[appMngvalue]'
})
export class MngvalueDirective {

 @Input() appMngvalue:any = undefined;
  
  constructor(private el:ElementRef) 
  {
	
  }

  ngOnInit()
  {
	
	if(this.appMngvalue != undefined)
	{
		this.el.nativeElement.value = this.appMngvalue;
	}
	console.log(this.appMngvalue);
  } 

}
