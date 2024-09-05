import { Component, HostListener } from '@angular/core';
import { AuthService } from './_core/service/auth.service';
import { StorageService } from './_core/service/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'RSMS';

  constructor(private authService: AuthService, private storageService: StorageService) {
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
}
