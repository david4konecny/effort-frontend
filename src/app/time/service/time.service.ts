import { Injectable, EventEmitter } from '@angular/core';
import { TimeSession } from '../time-session';
import { Observable, timer, Subscription, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Category } from '../../category/category';
import { Intent } from 'src/app/intent.enum';
import { TimeUtil } from '../time-util';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  private url = '//localhost:8080/api/time';
  private timerSub: Subscription;
  private current: TimeSession;
  private SECONDS_IN_DAY = 86400;
  entrySavedEvent = new EventEmitter<Intent>();
  resetCurrentEvent = new EventEmitter<TimeSession>();

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
        if (next.length) {
          const entry = next[0];
          const today = new Date();
          if (entry.date === TimeUtil.toDateString(today)) {
            this.resumeEntryFromToday(entry);
          } else {
            const yesterday = TimeUtil.getPreviousDay(today);
            if (entry.date === TimeUtil.toDateString(yesterday)) {
              this.current = entry;
              this.current.endTime = this.SECONDS_IN_DAY - 1;
              const newTimeEntry = this.getNewCurrentEntry(this.current.category);
              newTimeEntry.startTime = 0;
              this.resumeFromPreviousDay(newTimeEntry);
            }
          }
        }
      })
    );
  }

  private resumeEntryFromToday(entry: TimeSession) {
    this.current = entry;
    this.current.endTime = TimeUtil.dateToSecondsOfDay(new Date());
    this.startTimer();
  }

  getEntriesByDate(date: Date): Observable<TimeSession[]> {
    const options = { params: new HttpParams().set('date', TimeUtil.toDateString(date)) };
    return this.http.get<TimeSession[]>(`${this.url}/finished`, options);
  }

  private addCurrent(entry: TimeSession): Observable<TimeSession> {
    return this.http.post<TimeSession>(`${this.url}/current`, entry).pipe(
      tap(next => this.current = next)
    );
  }

  addFinished(entry: TimeSession): Observable<TimeSession> {
    return this.http.post<TimeSession>(`${this.url}/finished`, entry).pipe(
      tap(_ => this.entrySavedEvent.emit(Intent.add))
    );
  }

  editFinished(entry: TimeSession): Observable<void> {
    return this.http.put<void>(`${this.url}/finished`, entry).pipe(
      tap(_ => this.entrySavedEvent.emit(Intent.edit))
    );
  }

  private editCurrent(): Observable<void> {
    return this.http.put<void>(`${this.url}/current`, this.current).pipe(
      tap(_ => this.entrySavedEvent.emit(Intent.edit))
    );
  }

  changeCategoryOfCurrent(category: Category) {
    if (this.current) {
      this.current.category = category;
      this.editCurrent().subscribe();
    }
  }

  deleteFinishedById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/finished/${id}`);
  }

  deleteCurrentById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/current/${id}`);
  }

  private endCurrent() {
    const entry = this.current;
    this.current = null;
    this.deleteCurrentById(entry.id).subscribe(
      next => {
        entry.id = 0;
        this.addFinished(entry).subscribe();
      }
    );
  }

  private endCurrentAfterMidnight(newTimeEntry: TimeSession) {
    const entry = this.current;
    this.current = null;
    this.deleteCurrentById(entry.id).subscribe(
      next => {
        entry.id = 0;
        this.addFinished(entry).subscribe();
        this.addFinished(newTimeEntry).subscribe();
      }
    );
  }

  private resumeFromPreviousDay(newTimeEntry: TimeSession) {
    const entry = this.current;
    this.current = null;
    this.deleteCurrentById(entry.id).subscribe(
      next => {
        entry.id = 0;
        this.addFinished(entry).subscribe(
          next => {
            this.addCurrent(newTimeEntry).subscribe(
              next => {
                this.startTimer();
                this.resetCurrentEvent.emit(next);
              }
            );
          }
        );
      }
    );
  }

  startTimeTracking(category: Category) {
    const entry = this.getNewCurrentEntry(category);
    this.addCurrent(entry).subscribe(
      next => this.startTimer()
    );
  }

  private startTimer() {
    this.timerSub = timer(60000, 60000).subscribe(
      it => {
        const now = TimeUtil.dateToSecondsOfDay(new Date());
        if (now < this.current.endTime) {
          this.timerSub.unsubscribe();
          this.current.endTime = this.SECONDS_IN_DAY - 1;
          const newTimeEntry = this.getNewCurrentEntry(this.current.category);
          newTimeEntry.startTime = 0;
          this.resumeFromPreviousDay(newTimeEntry);
        } else {
          this.current.endTime = now;
          this.editCurrent().subscribe();
        }
      }
    );
  }

  stopTimeTracking() {
    this.timerSub.unsubscribe();
    const now = TimeUtil.dateToSecondsOfDay(new Date());
    if (now < this.current.endTime) {
      this.current.endTime = this.SECONDS_IN_DAY - 1;
      const newTimeEntry = this.getNewCurrentEntry(this.current.category);
      newTimeEntry.startTime = 0;
      newTimeEntry.endTime = now;
      this.endCurrentAfterMidnight(newTimeEntry);
    } else {
      this.current.endTime = now;
      this.endCurrent();
    }
  }

  getTotalDuration(date: Date): Observable<number> {
    const options = { params: new HttpParams().set('date', TimeUtil.toDateString(date)) };
    return this.http.get<number>(`${this.url}/total`, options);
  }

  getTotalFinishedDuration(date: Date): Observable<number> {
    const options = { params: new HttpParams().set('date', TimeUtil.toDateString(date)) };
    return this.http.get<number>(`${this.url}/finished/total`, options);
  }

  private getNewCurrentEntry(category: Category): TimeSession {
    const d = new Date();
    const placeholderTime = TimeUtil.dateToSecondsOfDay(d);
    return { id: 0, date: TimeUtil.toDateString(d), category, startTime: placeholderTime, endTime: placeholderTime } as TimeSession;
  }

  getNewTimeSession(category: Category): TimeSession {
    const d = new Date();
    const hours = `${d.getHours()}`.padStart(2, '0');
    const placeholderTime = TimeUtil.toSecondsOfDay(`${hours}-${d.getMinutes()}`);
    return { id: 0, date: TimeUtil.toDateString(d), category, startTime: placeholderTime, endTime: placeholderTime } as TimeSession;
  }

}
