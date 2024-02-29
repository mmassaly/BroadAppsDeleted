import { Directive,ElementRef, Input,OnInit } from '@angular/core';

@Directive({
  selector: '[appMngtype]'
})
export class MngtypeDirective implements OnInit {

  @Input() appMngtype:string = "";
  
  constructor(private el:ElementRef) 
  {
	
  }

  ngOnInit()
  {
	this.el.nativeElement.type = this.appMngtype;
  } 
  
}
