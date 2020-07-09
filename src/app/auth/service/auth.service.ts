import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, map, retry } from 'rxjs/operators';
import { User } from 'src/app/user/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = '//localhost:8080/api';
  isAuthenticated = false;
  username = '';
  targetUrl = 'dashboard';

  constructor(
    private http: HttpClient
  ) { }

  login(username: string, password: string): Observable<any> {
    const encodedData = btoa(`${username}:${password}`);
    const headers = new HttpHeaders({Authorization: `Basic ${encodedData}`});
    return this.http.get(`${this.url}/auth/login`, { headers }).pipe(
      tap(next => {
        this.isAuthenticated = true;
        this.username = next.username;
      }
      )
    );
  }

  verifyAuthentication(): Observable<void> {
    const headers = new HttpHeaders().append("X-Requested-With", "XMLHttpRequest");
    return this.http.get<void>(`${this.url}/users`, { headers }).pipe(
      tap(next => this.isAuthenticated = true)
    );
  }

  setTargetUrl(url: string) {
    this.targetUrl = url;
  }

  getUsername(): Observable<string> {
    return this.http.get<any>(`${this.url}/users`).pipe(
      tap(next => this.username = next.username),
      map(next => next.username)
    );
  }

  signup(user: User): Observable<User> {
    const headers = new HttpHeaders().append("X-Requested-With", "XMLHttpRequest");
    return this.http.post<User>(`${this.url}/users`, user, { headers }).pipe(
      retry(1)
    )
  }

  editUsername(newUsername: string): Observable<void> {
    return this.http.put<void>(`${this.url}/users/username`, newUsername).pipe(
      tap(next => this.username = newUsername)
    );
  }

  editPassword(oldPassword: string, newPassword: string) {
    return this.http.put<void>(`${this.url}/users/password`, { oldPassword, newPassword });
  }

  deleteUser(): Observable<void> {
    return this.http.delete<void>(`${this.url}/users`).pipe(
      tap(next => {
        this.username = '';
        this.isAuthenticated = false;
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.url}/auth/logout`, null).pipe(
      tap(next => {
        this.isAuthenticated = false;
        this.username = '';
        })
    );
  }
}
