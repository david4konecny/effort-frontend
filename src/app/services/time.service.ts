import { Injectable } from '@angular/core';
import { TimeSession } from '../model/time-session';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {Category} from '../model/category';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  private url = 'http://localhost:8080/api/time';
  private todayTimeEntries: TimeSession[] = [];
  private current: TimeSession;
  private ONE_DAY_IN_MILLIS = 24 * 60 * 60 * 1000;

  constructor(
    private http: HttpClient
  ) { }

  getEntriesByDate(date: Date): Observable<TimeSession[]> {
    const options = { params: new HttpParams().set('date', this.toDateString(date)) };
    return this.http.get<TimeSession[]>(this.url, options)
      .pipe(
        tap(next => {
          if (this.toDateString(date) === this.toDateString(new Date())) {
            this.todayTimeEntries = next;
            console.log(this.todayTimeEntries);
          }
        })
      );
  }

  addNewTimeEntry(entry: TimeSession): Observable<TimeSession> {
    return this.http.post<TimeSession>(this.url, entry);
  }

  editTimeEntry(entry: TimeSession): Observable<TimeSession> {
    return this.http.put<TimeSession>(this.url, entry);
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  startTimeTracking(session: TimeSession) {
    this.current = session;
    this.todayTimeEntries.push(session);
  }

  saveTrackedTime(): Observable<TimeSession> {
    const entry = this.current;
    this.current = null;
    return this.addNewTimeEntry(entry);
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
