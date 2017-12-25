import {Component} from '@angular/core';
@Component({
  selector:'co-ordinator',
  templateUrl:'./coordinator.component.html',
  styleUrls:['./coordinator.component.css']
})
export class CoordinatorComponent{

  logout(){
    localStorage.clear();
  }
  
}