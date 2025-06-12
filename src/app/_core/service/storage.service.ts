import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user'
const USERNAME = 'username'
const ACCESSIP = 'access_ip'
const ID = 'id'

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private router: Router) { }
  signOut(): void {
    window.sessionStorage.clear();
    this.router.navigate(['/signin']);

    let myInterval = setInterval(() => {
      window.location.reload();
    }, 500);
    clearInterval(myInterval);
  }
  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }
  public saveToken(accessToken: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, accessToken);
  }

  public getUsernamenew(): any {
    return window.sessionStorage.getItem(USERNAME);
  }
  public saveUsernamenew(username: string): void {
    window.sessionStorage.removeItem(USERNAME);
    window.sessionStorage.setItem(USERNAME, username);
  }
  public saveAccessIP(access_ip: any): void {
    window.sessionStorage.removeItem(ACCESSIP);
    window.sessionStorage.setItem(ACCESSIP, access_ip);
  }
  public saveID(id: any): void {
    window.sessionStorage.removeItem(ID);
    window.sessionStorage.setItem(ID, id);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      const parsedUser = JSON.parse(user);
      let Username = parsedUser.username;
      return parsedUser;
    }
    return {};
  }
  public getAccessIP(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      const parsedUser = JSON.parse(user);
      let AccessIP = parsedUser.access_ip;
      return parsedUser;
    }
    return {};
  }
  public getUserID(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      const parsedUser = JSON.parse(user);
      let UserID = parsedUser.id;
      return parsedUser;
    }
    return {};
  }

  // signOut(): void {
  //   window.sessionStorage.clear();
  //   setInterval(this.reload, 500)
  // }
  reload() {
    window.location.reload();
  }


  // public getUserRole(): string {
  //   const user = this.getUser();

  //   // return user.roles.includes('ROLE_RECEPTION') ? 'ROLE_RECEPTION' : 'DEFAULT_ROLE';
  //   return user.roles.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : (user.roles.includes('ROLE_RECEPTION') ? 'ROLE_RECEPTION' : (user.roles.includes('ROLE_SPECIAL') ? 'ROLE_SPECIAL' :  'DEFAULT_ROLE'));
  // }
  public getUserRole(): string {
    const user = this.getUser();
    if (!user || !user.roles) return 'DEFAULT_ROLE';

    if (user.roles.includes('ROLE_ADMIN')) return 'ROLE_ADMIN';
    if (user.roles.includes('ROLE_RECEPTION')) return 'ROLE_RECEPTION';
    if (user.roles.includes('ROLE_SPECIAL')) return 'ROLE_SPECIAL';
    if (user.roles.includes('ROLE_INVENTORY')) return 'ROLE_INVENTORY';
    if (user.roles.includes('ROLE_CUSSERVICE')) return 'ROLE_CUSSERVICE';
    if (user.roles.includes('ROLE_SERVICECENTER')) return 'ROLE_SERVICECENTER';
    if (user.roles.includes('ROLE_OPERATOR')) return 'ROLE_OPERATOR';
    if (user.roles.includes('ROLE_SUBLCO')) return 'ROLE_SUBLCO';
    if (user.roles.includes('ROLE_SUBSCRIBER')) return 'ROLE_SUBSCRIBER';
    return 'DEFAULT_ROLE';
  }

  public getUserid(): number | null {
    const user = this.getUser();
    return user ? user.id : null;
  }
  public getUsername(): string {
    const user = this.getUser();
    return user.username || '';
  }
  public getAccessip(): any {
    const user = this.getAccessIP();
    return user.access_ip || '';
  }
}
