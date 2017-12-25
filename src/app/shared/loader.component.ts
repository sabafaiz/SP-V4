import {Component,Input} from '@angular/core';

@Component({
  selector:'loader',
  template:`
  <div class="loading-outer-overlay" *ngIf="condition">
    <div class="loading-overlay" >
      <!-- show something fancy here, here with Angular 2 Material's loading bar or circle -->
      <div class="loader"></div>
    </div>
  </div>
  `
})
export class Loader{
  @Input() condition: boolean;
}