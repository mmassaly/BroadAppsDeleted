import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select'
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule,HttpClient} from '@angular/common/http';
import { LoginPageComponent } from './login-page/login-page.component';
import {HttpService} from './http-forced/http.service';
import { AppComponent } from './app.component';
import { OfficeFormComponent } from './office-form/office-form.component';
import { RouterModule,Routes} from '@angular/router';
import {DataStorageService} from './data-storage-service/data-storage.service';
import { MngtypeDirective } from './mngtype.directive';
import { MngvalueDirective } from './mngvalue.directive';

let routes:Routes = 
[
	{path:'',redirectTo:'acceuil',pathMatch:'full'},
	{path:'acceuil',component:OfficeFormComponent}
];

@NgModule({
  declarations: [
    AppComponent,
	LoginPageComponent,
	OfficeFormComponent,
 MngtypeDirective,
 MngvalueDirective
  ],
  imports: [
    BrowserModule,
	AppRoutingModule,
	HttpClientModule,
	FormsModule,
	ReactiveFormsModule,
	NgSelectModule,
	CommonModule,
	RouterModule.forRoot(routes)	
  ],
  providers: [HttpService,DataStorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
