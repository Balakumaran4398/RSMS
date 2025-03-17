import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import URLs from 'src/app/URL';
import { StorageService } from './storage.service';
var AUTH_API = URLs.AUTH_URL();


// var AUTH_API = 'http://192.168.70.201:8585/rsms/api/auth';

// var AUTH_API = 'http://192.168.1.117:8081/api/auth';         //JAYA AKKA    
// var AUTH_API= 'http://192.168.1.115:8081/api/auth';         //BALA
// var AUTH_API ='http://192.168.1.111:8081/api/auth';         //SUBHA
// var AUTH_API = 'http://192.168.70.201:8585/rsms/api/auth';   //QC
// var AUTH_API ='http://103.183.47.212:8585/rsms/api/auth';       // 103
  

// var AUTH_API ='http://4kdigital.ridsys.in:8585/rsms/api/auth';   //4k
// var AUTH_API ='http://cas.ridsys.in:8585/rsms/api/auth';   //AJK
// var AUTH_API ='http://rdigital.ridsys.in:8585/rsms/api/auth';   //rdigital




// var AUTH_API = 'http://rdigital.ridsys.in:8585/rsms/api/auth';
// const AUTH_API = URLs.AUTH_URL();
const BASE_API = URLs.BASE_URL();
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  ip: any
  domain:any;
  warningMessage: any;
  warningMessageDate: any;
  notificationMessage: boolean = false;
  constructor(private http: HttpClient, private router: Router, private storageService: StorageService) {

    // const currentUrl = window.location.href;

    // const { ip, domain } = this.extractIpOrDomain(currentUrl);

    // this.ip = ip;
    // this.domain = domain;
    // if (this.ip) {
    //   localStorage.setItem('globalIp', this.ip);
    // } else {
    //   localStorage.setItem('globalDomain', this.domain);
    // }

    // console.log("Stored IP:", localStorage.getItem('globalIp'));
    // console.log("Stored Domain:", localStorage.getItem('globalDomain'));

    // AUTH_API = ip
    //   ? `http://${this.ip}:8585/rsms/api/auth`
    //   : `http://${this.domain}:8585/rsms/api/auth`;

    // console.log("Final AUTH_API:", AUTH_API);

  }


  extractIpOrDomain(url: string): { ip: string | null; domain: string | null } {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      console.log("Extracted Hostname:", hostname);

      const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;

      if (ipPattern.test(hostname)) {
        console.log("Detected IP:", hostname);
        return { ip: hostname, domain: null }; 
      } else {
        console.log("Detected Domain:", hostname);
        return { ip: null, domain: hostname }; 
      }
    } catch (error) {
      console.error("Invalid URL:", error);
      return { ip: null, domain: null }; 
    }
  }
  login(credentials: { username: any; password: any; }): Observable<any> {
    console.log('Username   :' + credentials.username);
    console.log('Password   :' + credentials.password);
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

  extractIpFromUrl(url: string): string | null {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    console.log(ipPattern);

    return ipPattern.test(hostname) ? hostname : null;
  }
}
