import { Component } from '@angular/core';
import * as alertify from 'alertifyjs';
import {
  Router,
  // import as RouterEvent to avoid confusion with the DOM Event
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import { LoaderService } from './shared/loader.service';

@Component({
  selector: 'my-app',
  template: `
  <router-outlet>
  <div class="loading-outer-overlay" *ngIf="showLoader">
    <div class="loading-overlay">
      <div class="loader"></div>
    </div>
  </div>
  </router-outlet>
  `,
  styleUrls:['./app.component.css']
})
export class AppComponent {
  // Sets initial value to true to show loading spinner on first load
  // loading;
  showLoader:boolean;

  constructor(private router: Router,private loaderService:LoaderService) {
    // router.events.subscribe((event: RouterEvent) => {
    //   this.navigationInterceptor(event)
    // })
    if(!localStorage.getItem('access_token'))
      this.router.navigateByUrl('/login');
  }

  ngOnInit() {
    this.loaderService.status.asObservable().subscribe((val: boolean) => {
    this.showLoader = val;
    });
    }

  // Shows and hides the loading spinner during RouterEvent changes
  // navigationInterceptor(event: RouterEvent): void {
  //   if (event instanceof NavigationStart) {
  //     this.loading = true
  //   }
  //   if (event instanceof NavigationEnd) {
  //     this.loading = false;
  //   }

  //   // Set loading state to false in both of the below events to hide the spinner in case a request fails
  //   if (event instanceof NavigationCancel) {
  //     this.loading = false;
      
  //   }
  //   if (event instanceof NavigationError) {
  //     this.loading = false;
      
  //   }
  // }
}
