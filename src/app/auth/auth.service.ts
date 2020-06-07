import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated = false;
  targetUrl = 'dashboard';

  constructor() { }

  login(username: string, password: string): Observable<boolean> {
    if (username === 'joe' && password === 'test') {
      this.isAuthenticated = true;
    }
    return of(this.isAuthenticated);
  }

  setTargetUrl(url: string) {
    this.targetUrl = url;
  }

  logout() {
    this.isAuthenticated = false;
  }
}
