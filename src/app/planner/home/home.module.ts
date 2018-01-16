import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from "../../shared/shared.module";
import { InitialSetup } from "./initial-setup/setup.component";

@NgModule({
	imports: [SharedModule, RouterModule.forChild([
		{
			path:'',
			redirectTo:'initial-setup',
			pathMatch:'full'
		},
		{
			path: '',
			component: HomeComponent
		},
		{
			path:'initial-setup',
			component: InitialSetup
		}
	])],
	providers: [],
	declarations: [HomeComponent, InitialSetup],
	// exports: [RouterModule]
})
export class HomeModule {
}