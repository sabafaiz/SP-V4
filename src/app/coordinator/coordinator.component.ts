import {Component} from '@angular/core';
import { StorageService } from '../shared/storage.service';
@Component({
  selector:'co-ordinator',
  templateUrl:'./coordinator.component.html',
  styleUrls:['./coordinator.component.css']
})
export class CoordinatorComponent{
  userDetails: any = {};

  constructor(public stogareService: StorageService){
    this.userDetails = this.stogareService.getData('userDetails');
  }

  logout(){
    localStorage.clear();
  }
  
}