import { NgModule } from '@angular/core';
import { InitiativeComponent } from './initiative';
import { RouterModule } from '@angular/router';
import { SharedModule } from "../../shared/shared.module";
import { MyFilterPipe } from "./my-filter.pipe";

@NgModule({
	imports: [SharedModule,RouterModule.forChild([{
	 path: '', component: InitiativeComponent 
	 }])],
	providers:[],
	declarations : [InitiativeComponent,MyFilterPipe],
	// exports: [RouterModule]
})
export class InitiativeModule{
}