import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private storageService: StorageService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.storageService.getUser();
    console.log(user);
    let token = sessionStorage.getItem('auth-token');
    console.log(token);
    const isAuthenticated = true;
    if (user?.username && token) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}