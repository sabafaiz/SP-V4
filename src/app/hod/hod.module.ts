import {NgModule} from '@angular/core';
import { HodComponent } from './hod.component';
import { RouterModule } from '@angular/router';
import { HodService } from './hod.service';
import { CustomHttpService } from '../shared/default.header.service';
import { SharedModule } from '../shared/shared.module';
@NgModule({
 imports:[SharedModule,RouterModule.forChild([
  {
   path:'',
   component:HodComponent
  }
 ])],
 exports:[],
 declarations:[HodComponent],
 providers:[CustomHttpService,HodService]
})
export class HodModule{

}