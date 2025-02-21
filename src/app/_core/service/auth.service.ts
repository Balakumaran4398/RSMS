import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import URLs from 'src/app/URL';
import { StorageService } from './storage.service';
const AUTH_API = URLs.AUTH_URL();
const BASE_API = URLs.BASE_URL();
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  warningMessage: any;
  warningMessageDate: any;
  notificationMessage: boolean = false;
  constructor(private http: HttpClient, private router: Router, private storageService: StorageService) { }
  login(credentials: { username: any; password: any; }): Observable<any> {
    console.log('Username' + credentials.username);
    console.log('Password' + credentials.password);
    return this.http.post(AUTH_API + '/signin', { username: credentials.username, password: credentials.password }, httpOptions);
  }

  notification(): Observable<any> {
    return this.http.get(AUTH_API + '/checkNotification');
  }
  msoDeatils(): Observable<any> {
    return this.http.get(AUTH_API + '/getMso');
  }

  signOut(): void {
    // window.location.reload();
    let user = this.storageService.getUser();
    let sessionId = sessionStorage.getItem('sessionId');
    let c = {
      "username": user.username,
      "role": user?.roles[0],
      "id": sessionId
    }
    console.log(c);

    window.sessionStorage.clear();
    this.router.navigate(['/signin']).then(() => {
    });
  }
}
