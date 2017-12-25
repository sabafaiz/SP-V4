import {Component} from '@angular/core';

declare let $:any;

@Component({
  selector:'admin',
  templateUrl:'./admin.component.html',
  styleUrls:['./admin.component.css']
})
export class AdminComponent{
  constructor(){
    
      }
    
      ngAfterViewInit(){
        $("#wrapper").toggleClass("toggled");
        $("#menu-toggle").click(function(e:any) {
            e.preventDefault();
            $("#wrapper").toggleClass("toggled");
        });
      }
    
      logout(){
          localStorage.clear();
      }
}