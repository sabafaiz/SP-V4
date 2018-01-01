import {Component} from '@angular/core';
import { Filters } from '../shared/filters';
import { StorageService } from '../shared/storage.service';
import { HodService } from './hod.service';

declare let $:any;

@Component({
 selector:'hod',
 templateUrl:'hod.component.html',
 styleUrls:['hod.component.css']
})
export class HodComponent extends Filters{

 constructor(private utServ: HodService,
  private storage: StorageService){
  super();
  this.getOpi();
 }

 getOpi(): any {
  this.utServ.getOpiByDeptId(this.storage.getData('user_roleInfo')[0].departmentId).subscribe((response: any) => {
   if (response.status == 204) {
     this.goals = [];
     this.goalsCopy = []
   } else {
     this.goals = response;
     this.goalsCopy = response;
     
     this.initFilters(this.goalsCopy);
   }
 })
 }

 get(e){
   var promise = new Promise((resolve:any,reject:any)=>{     $(e)["0"].height = $(e)["0"].clientHeight;     resolve();    });    
   return promise;
 }
}