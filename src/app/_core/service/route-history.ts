import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteHistoryService {
  private history: string[] = [];

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects);
      }
    });
  }

  getPreviousUrl(): string | undefined {
    return this.history.length > 1 ? this.history[this.history.length - 2] : undefined;
  }

  clearHistory(): void {
    this.history = [];
  }
}
