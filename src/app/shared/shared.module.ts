import {NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { CommonModule } from "@angular/common";
import {ScrollToModule} from 'ng2-scroll-to';
@NgModule({
  imports:[ReactiveFormsModule,CommonModule,FormsModule,HttpModule,ScrollToModule.forRoot()],
  declarations:[],
  providers:[],
  exports:[ReactiveFormsModule,CommonModule,FormsModule,HttpModule,ScrollToModule]
})
export class SharedModule{
  
}