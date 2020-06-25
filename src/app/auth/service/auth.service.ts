import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { User } from 'src/app/user/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = '//localhost:8080/api/users';
  isAuthenticated = false;
  username = '';
  targetUrl = 'dashboard';

  constructor(
    private http: HttpClient
  ) { }

  login(username: string, password: string): Observable<any> {
    const encodedData = btoa(`${username}:${password}`);
    const headers = new HttpHeaders({Authorization: `Basic ${encodedData}`});
    return this.http.get(`${this.url}/login`, { headers }).pipe(
      tap(next => {
        this.isAuthenticated = true;
        this.username = next.username;
      }
      )
    );
  }

  verifyAuthentication(): Observable<void> {
    const headers = new HttpHeaders().append("X-Requested-With", "XMLHttpRequest");
    return this.http.get<void>(`${this.url}/login/test`, { headers }).pipe(
      tap(next => this.isAuthenticated = true)
    );
  }

  setTargetUrl(url: string) {
    this.targetUrl = url;
  }

  getUsername(): Observable<string> {
    return this.http.get<any>(this.url).pipe(
      tap(next => this.username = next.username),
      map(next => next.username)
    );
  }

  signup(user: User): Observable<User> {
    return this.http.post<User>(this.url, user);
  }

  editUsername(newUsername: string): Observable<void> {
    return this.http.put<void>(`${this.url}/username`, newUsername).pipe(
      tap(next => this.username = newUsername)
    );
  }

  deleteUser(): Observable<void> {
    return this.http.delete<void>(this.url).pipe(
      tap(next => {
        this.username = '';
        this.isAuthenticated = false;
      })
    );
  }

  logout() {
    this.username = '';
    this.isAuthenticated = false;
  }
}
