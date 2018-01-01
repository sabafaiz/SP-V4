import { NgModule } from '@angular/core';
import { CoordinatorComponent } from './coordinator.component';
import { RouterModule } from '@angular/router';
import { CoordinatorService } from "./coordinator.service";
import { UniversityService } from "../shared/UTI.service";
import { StorageService } from "../shared/storage.service";
import { CustomHttpService } from "../shared/default.header.service";
import { SharedModule } from "../shared/shared.module";
@NgModule({
	imports: [SharedModule,RouterModule.forChild([
    {
      path: '',
      redirectTo:'home',
      pathMatch:'full'
    },
    {
			path: '',
			component: CoordinatorComponent,
			children: [
				{
					path: '',
					loadChildren: 'app/coordinator/home/home.module#HomeModule'
				}
			]
		},
	])],
	providers: [StorageService, CustomHttpService],
	declarations: [CoordinatorComponent],
	// exports: [RouterModule]
})
export class CoordinatorModule {
}