import { Component, HostListener } from '@angular/core';
import { AuthService } from './_core/service/auth.service';
import { StorageService } from './_core/service/storage.service';
import { RouteHistoryService } from './_core/service/route-history';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'RSMS';

  constructor(private authService: AuthService, private storageService: StorageService, private historyService: RouteHistoryService, private router: Router,

  ) {
  }
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    console.log($event);

    let user = this.storageService.getUser();
    let c = {
      "username": user.username,
      "role": user?.roles[0],
    }

  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    const previousUrl = this.historyService.getPreviousUrl();
    const roles = this.storageService.getUser()?.roles || [];

    if (roles.includes('ROLE_OPERATOR')) {
      this.router.navigateByUrl('/admin/operator_dashboard');
    } else if (roles.includes('ROLE_SUBSCRIBER')) {
      this.router.navigateByUrl('/admin/subscriber-full-info/...');
    } else if (roles.includes('ROLE_SUBLCO')) {
      this.router.navigateByUrl('/admin/operator_dashboard');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

}
