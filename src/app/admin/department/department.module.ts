import {NgModule} from '@angular/core';
import { RouterModule } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { DeparmtmentComponent } from "./department.component";
@NgModule({
  imports: [SharedModule, RouterModule.forChild([
    {
      path: '',
      component: DeparmtmentComponent
    }
  ])],
  providers: [],
  declarations: [DeparmtmentComponent],
})
export class DepartmentModule{
  
}