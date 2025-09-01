import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user'
const USERNAME = 'username'
const ACCESSIP = 'access_ip'
const TEMP_LOGGER_PASSWORD = 'password';
const TEMP_LOGGER_USERNAME = 'tem-logger-username';
const TEMP_LOGGER_ROLE = 'tem-logger-role';
const LCO = 'islco'
const ID = 'id'
const NAVLIST = 'navigationmap'
const NAVLIST1 = 'navigationmap'

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private router: Router) { }
  signOut(): void {
    window.sessionStorage.clear();
    this.router.navigate(['/signin']);
    // this.router.navigate(['/payment_customer']);

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
  public saveLco(islco: any): void {
    window.sessionStorage.removeItem(LCO);
    window.sessionStorage.setItem(LCO, islco);
  }
  public saveNavList(navigationmap: any): void {
    window.sessionStorage.removeItem(NAVLIST);
    window.sessionStorage.setItem(NAVLIST, JSON.stringify(navigationmap));
  }
  public saveNavList1(navigationmap: any): void {
    window.sessionStorage.removeItem(NAVLIST1);
    window.sessionStorage.setItem(NAVLIST1, JSON.stringify(navigationmap));
  }
  public saveID(id: any): void {
    window.sessionStorage.removeItem(ID);
    window.sessionStorage.setItem(ID, id);
    console.log('ID', ID);

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

  // public saveLoggerPass(password: any): void {
  //   window.sessionStorage.removeItem(TEMP_LOGGER_PASSWORD);
  //   window.sessionStorage.setItem(TEMP_LOGGER_PASSWORD, password);
  //   console.log('11111111111', TEMP_LOGGER_PASSWORD, password);
  // }

  // public getLoggerPass(): any {
  //   const password = window.sessionStorage.getItem(TEMP_LOGGER_PASSWORD);
  //   if (password) {
  //     console.log(password);

  //     const parsedPassword = JSON.parse(password);
  //     let Password = parsedPassword;
  //     return parsedPassword;
  //   }
  //   return {};
  // }

  public saveLoggerRole(username: any): void {
    window.sessionStorage.removeItem(TEMP_LOGGER_ROLE);
    window.sessionStorage.setItem(TEMP_LOGGER_ROLE, username);
  }

  public getLoggerRole(): String | null {
    return window.sessionStorage.getItem(TEMP_LOGGER_ROLE);
  }


  public saveLoggerName(username: any): void {
    window.sessionStorage.removeItem(TEMP_LOGGER_USERNAME);
    window.sessionStorage.setItem(TEMP_LOGGER_USERNAME, username);
  }

  public getLoggerName(): String | null {
    return window.sessionStorage.getItem(TEMP_LOGGER_USERNAME);
  }
  public saveLoggerPass(username: any): void {
    window.sessionStorage.removeItem(TEMP_LOGGER_PASSWORD);
    window.sessionStorage.setItem(TEMP_LOGGER_PASSWORD, username);
  }

  public getLoggerPass(): String | null {
    return window.sessionStorage.getItem(TEMP_LOGGER_PASSWORD);
  }
  public getLCO(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      const parsedUser = JSON.parse(user);
      let LCO = parsedUser.islco;
      return parsedUser;
    }
    return {};
  }
  public getLCORecharge(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      const parsedUser = JSON.parse(user);
      let LCO = parsedUser.islcorecharge;
      return parsedUser;
    }
    return {};
  }
  public getInventoryUpload(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      const parsedUser = JSON.parse(user);
      let LCO = parsedUser.isinventoryupload;
      return parsedUser;
    }
    return {};
  }
  public getTopSubscription(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      const parsedUser = JSON.parse(user);
      let LCO = parsedUser.istopsubscription;
      return parsedUser;
    }
    return {};
  }
  public getVersion(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      const parsedUser = JSON.parse(user);
      let LCO = parsedUser.isversion;
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
  public getNavList(): any {
    const user = sessionStorage.getItem(NAVLIST);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }
  public getNavList1(): any {
    const user = sessionStorage.getItem(NAVLIST1);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

  reload() {
    window.location.reload();
  }

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
  public getIsLCO(): any {
    const user = this.getLCO();
    return user.islco || '';
  }
  public getIsTopSubscription(): any {
    const user = this.getTopSubscription();
    return user.istopsubscription || '';
  }
  public getIsLCO_Recharge(): any {
    const user = this.getLCORecharge();
    return user.islcorecharge || '';
  }
    public getIsVersion(): any {
    const user = this.getVersion();
    return user.isversion || '';
  }
    public getIsInventoryUpload(): any {
    const user = this.getInventoryUpload();
    return user.isinventoryupload || '';
  }
  public getNavigationList(): any {
    return this.getNavList(); // do NOT access user.navigationmap
  }
  public getNavigationList1(): any {
    return this.getNavList(); // do NOT access user.navigationmap
  }
}
