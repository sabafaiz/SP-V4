import { Component } from '@angular/core';
import {
  Router,
  // import as RouterEvent to avoid confusion with the DOM Event
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';

@Component({
  selector: 'my-app',
  template: `
  <div class="loading-outer-overlay" *ngIf="loading">
    <div class="loading-overlay" >
      <!-- show something fancy here, here with Angular 2 Material's loading bar or circle -->
      <div class="loader"></div>
    </div>
  </div>
    
  <router-outlet></router-outlet>
  `,
  styleUrls:['./app.component.css']
})
export class AppComponent {
  // Sets initial value to true to show loading spinner on first load
  loading = true

  constructor(private router: Router) {
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event)
    })
  }

  // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.loading = true
    }
    if (event instanceof NavigationEnd) {
      this.loading = false
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.loading = false
    }
    if (event instanceof NavigationError) {
      this.loading = false
    }
  }
}
