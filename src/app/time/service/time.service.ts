import { Injectable, EventEmitter } from '@angular/core';
import { TimeSession } from '../time-session';
import { Observable, timer, Subscription, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Category } from '../../category/category';
import { DateTotal } from '../date-total';
import { Intent } from 'src/app/intent.enum';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  private url = '//localhost:8080/api/time';
  private timerSub: Subscription;
  private current: TimeSession;
  private ONE_DAY_IN_MILLIS = 24 * 60 * 60 * 1000;
  entrySavedEvent = new EventEmitter<Intent>();

  constructor(
    private http: HttpClient
  ) { }

  getCurrent(): Observable<TimeSession[]> {
    if (this.current) {
      const res = new Array<TimeSession>();
      res.push(this.current);
      return of(res);
    }
    return this.http.get<TimeSession[]>(`${this.url}/current`).pipe(
      tap(next => {
        if (next.length > 0) {
          this.current = next[0];
          this.current.endTime = this.dateToSecondsOfDay(new Date());
          this.startTimer();
        }
      })
    );
  }

  getEntriesByDate(date: Date): Observable<TimeSession[]> {
    const options = { params: new HttpParams().set('date', this.toDateString(date)) };
    return this.http.get<TimeSession[]>(this.url, options);
  }

  addFinished(entry: TimeSession): Observable<TimeSession> {
    return this.http.post<TimeSession>(`${this.url}/finished`, entry).pipe(
      tap(_ => this.entrySavedEvent.emit(Intent.add))
    );
  }

  editFinished(entry: TimeSession): Observable<TimeSession> {
    return this.http.put<TimeSession>(`${this.url}/finished`, entry).pipe(
      tap(_ => this.entrySavedEvent.emit(Intent.edit))
    );
  }

  editCurrent(entry: TimeSession): Observable<TimeSession> {
    return this.http.put<TimeSession>(`${this.url}/current`, entry).pipe(
      tap(_ => this.entrySavedEvent.emit(Intent.edit))
    );
  }

  changeCategoryOfCurrent(category: Category) {
    if (this.current) {
      this.current.category = category;
      this.editCurrent(this.current).subscribe();
    }
  }

  deleteFinishedById(id: number): Observable<any> {
    return this.http.delete(`${this.url}/finished/${id}`);
  }

  endCurrent() {
    if (!this.current) {
      return;
    }
    this.current.endTime = this.dateToSecondsOfDay(new Date());
    this.http.delete(`${this.url}/current/${this.current.id}`).subscribe(
      next => {
        this.current.id = 0;
        this.addFinished(this.current).subscribe(
          next => {
            this.current = null;
          }
        );
      }
    );
  }

  startTimeTracking(category: Category) {
    const entry = this.getNewCurrentEntry(category);
    this.http.post<TimeSession>(`${this.url}/current`, entry).subscribe(
      next => {
        this.current = next;
        this.startTimer();
      }
    )
  }

  private startTimer() {
    this.timerSub = timer(60000, 60000).subscribe(
      it => {
        this.current.endTime = this.dateToSecondsOfDay(new Date());
        this.editCurrent(this.current).subscribe();
      }
    );
  }

  stopTimeTracking() {
    this.timerSub.unsubscribe();
    this.endCurrent();
  }

  getTotalDuration(date: Date): Observable<number> {
    const options = { params: new HttpParams().set('date', this.toDateString(date)) };
    return this.http.get<number>(`${this.url}/total`, options);
  }

  getTotalFinishedDuration(date: Date): Observable<number> {
    const options = { params: new HttpParams().set('date', this.toDateString(date)) };
    return this.http.get<number>(`${this.url}/finished/total`, options);
  }

  private getNewCurrentEntry(category: Category): TimeSession {
    const d = new Date();
    const placeholderTime = this.dateToSecondsOfDay(d);
    return { id: 0, date: this.toDateString(d), category, startTime: placeholderTime, endTime: placeholderTime } as TimeSession;
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

  dateToSecondsOfDay(date: Date) {
    return (date.getHours() * 3600) + (date.getMinutes() * 60) + date.getSeconds();
  }

  getNextDay(date: Date) {
    const dateInMillis = date.getTime();
    return new Date(dateInMillis + this.ONE_DAY_IN_MILLIS);
  }

  getPreviousDay(date: Date) {
    const dateInMillis = date.getTime();
    return new Date(dateInMillis - this.ONE_DAY_IN_MILLIS);
  }

  addDays(date: Date, days: number) {
    const dateInMillis = date.getTime();
    return new Date(dateInMillis + (this.ONE_DAY_IN_MILLIS * days));
  }

  subtractDays(date: Date, days: number) {
    const dateInMillis = date.getTime();
    return new Date(dateInMillis - (this.ONE_DAY_IN_MILLIS * days));
  }

}
