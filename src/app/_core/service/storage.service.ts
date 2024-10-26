import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user'
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
  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    // console.log(user);
    if (user) {
      const parsedUser = JSON.parse(user);
      // console.log(parsedUser);
      let Username = parsedUser.username;
      // console.log(Username);
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
  public getUsername(): string {
    const user = this.getUser();
    return user.username || '';
  }
  public getUserRole(): string {
    const user = this.getUser();
    // console.log(user);
    // return user.roles.includes('ROLE_RECEPTION') ? 'ROLE_RECEPTION' : 'DEFAULT_ROLE';
    return user.roles.includes('ROLE_USER') ? 'ROLE_USER' : (user.roles.includes('ROLE_RECEPTION') ? 'ROLE_RECEPTION' : (user.roles.includes('ROLE_SPECIAL') ? 'ROLE_SPECIAL' : 'DEFAULT_ROLE'));
  }

  public getUserid(): number | null {
    const user = this.getUser();
    return user ? user.id : null; // Assuming 'id' is a number in your user data
  }
}
