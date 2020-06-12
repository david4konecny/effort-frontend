import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://localhost:8080/api/users';
  isAuthenticated = false;
  targetUrl = 'dashboard';

  constructor(
    private http: HttpClient
  ) { }

  login(username: string, password: string): Observable<any> {
    const encodedData = btoa(`${username}:${password}`);
    const headers = new HttpHeaders({Authorization: `Basic ${encodedData}`});
    return this.http.get(`${this.url}/login`, { headers }).pipe(
      tap(next => this.isAuthenticated = true)
    );
  }

  verifyAuthentication(): Observable<void> {
    const headers = new HttpHeaders().append("X-Requested-With", "XMLHttpRequest");
    return this.http.get<void>(`${this.url}/login/verification`, { headers }).pipe(
      tap(next => this.isAuthenticated = true)
    );
  }

  setTargetUrl(url: string) {
    this.targetUrl = url;
  }

  logout() {
    this.isAuthenticated = false;
  }
}
