import { Injectable } from '@angular/core';
import { TimeSession } from '../time-session';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Category } from '../../category/category';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  private url = '//localhost:8080/api/time';
  private todayTimeEntries: TimeSession[] = [];
  private current: TimeSession;
  private ONE_DAY_IN_MILLIS = 24 * 60 * 60 * 1000;

  constructor(
    private http: HttpClient
  ) { }

  getCurrent(): Observable<TimeSession[]> {
    return this.http.get<TimeSession[]>(`${this.url}/current`).pipe(
      tap(next => {
        if (next.length > 0) {
          this.current = next[0];
        }
      })
    );
  }

  getEntriesByDate(date: Date): Observable<TimeSession[]> {
    const options = { params: new HttpParams().set('date', this.toDateString(date)) };
    return this.http.get<TimeSession[]>(this.url, options)
      .pipe(
        tap(next => {
          if (this.toDateString(date) === this.toDateString(new Date())) {
            this.todayTimeEntries = next;
          }
        })
      );
  }

  addFinished(entry: TimeSession): Observable<TimeSession> {
    return this.http.post<TimeSession>(`${this.url}/finished`, entry);
  }

  editFinished(entry: TimeSession): Observable<TimeSession> {
    return this.http.put<TimeSession>(`${this.url}/finished`, entry);
  }

  deleteFinishedById(id: number): Observable<any> {
    return this.http.delete(`${this.url}/finished/${id}`);
  }

  endCurrent() {
    this.http.delete(`${this.url}/current/${this.current.id}`).subscribe(
      next => {
        this.addFinished(this.current).subscribe(
          next => {
            this.current = null;
          }
        );
      }
    );
  }

  startTimeTracking(entry: TimeSession): Observable<TimeSession> {
    return this.http.post<TimeSession>(`${this.url}/current`, entry).pipe(
      tap(next => this.current = next)
    );
  }

  getTotalDuration(date: Date): Observable<number> {
    const options = { params: new HttpParams().set('date', this.toDateString(date)) };
    return this.http.get<number>(`${this.url}/total`, options);
  }

  getNewTimeSession(category: Category): TimeSession {
    const d = new Date();
    const placeholderTime = this.toSecondsOfDay(`${d.getHours()}-${d.getMinutes()}`);
    return { id: 0, date: this.toDateString(d), category, startTime: placeholderTime, endTime: placeholderTime } as TimeSession;
  }

  toDateString(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  secondsOfDayToString(seconds: number) {
    const h = `${Math.floor(seconds / 3600)}`.padStart(2, '0');
    const m = `${Math.floor(seconds / 60) % 60}`.padStart(2, '0');
    return `${h}:${m}`;
  }

  toSecondsOfDay(time: string) {
    const h = +time.slice(0, 2);
    const m = +time.slice(3);
    return h * 3600 + m * 60;
  }

  getNextDay(date: Date) {
    const dateInMillis = date.getTime();
    return new Date(dateInMillis + this.ONE_DAY_IN_MILLIS);
  }

  getPreviousDay(date: Date) {
    const dateInMillis = date.getTime();
    return new Date(dateInMillis - this.ONE_DAY_IN_MILLIS);
  }

}
