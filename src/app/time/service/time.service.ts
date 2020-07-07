import { Injectable, EventEmitter } from '@angular/core';
import { TimeEntry } from '../time-entry';
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
  private current: TimeEntry;
  private SECONDS_IN_DAY = 86400;
  entrySavedEvent = new EventEmitter<Intent>();
  resetCurrentEvent = new EventEmitter<TimeEntry>();

  constructor(
    private http: HttpClient
  ) { }

  getCurrent(): Observable<TimeEntry[]> {
    if (this.current) {
      return of([this.current]);
    }
    return this.http.get<TimeEntry[]>(`${this.url}/current`).pipe(
      tap(next => {
        if (next.length) {
          this.resumeCurrentEntry(next[0]);
        }
      })
    );
  }

  private resumeCurrentEntry(entry: TimeEntry) {
    const today = new Date();
    if (entry.date === TimeUtil.toDateString(today)) {
      this.resumeEntryFromToday(entry);
    } else {
      const yesterday = TimeUtil.getPreviousDay(today);
      if (entry.date === TimeUtil.toDateString(yesterday)) {
        this.resumeFromYesterday(entry);
      }
    }
  }

  private resumeEntryFromToday(entry: TimeEntry) {
    this.current = entry;
    this.current.endTime = TimeUtil.dateToSecondsOfDay(new Date());
    this.startTimer();
  }

  getEntriesByDate(date: Date): Observable<TimeEntry[]> {
    const options = { params: new HttpParams().set('date', TimeUtil.toDateString(date)) };
    return this.http.get<TimeEntry[]>(`${this.url}/finished`, options);
  }

  private addCurrent(entry: TimeEntry): Observable<TimeEntry> {
    return this.http.post<TimeEntry>(`${this.url}/current`, entry).pipe(
      tap(next => this.current = next)
    );
  }

  addFinished(entry: TimeEntry): Observable<TimeEntry> {
    return this.http.post<TimeEntry>(`${this.url}/finished`, entry).pipe(
      tap(_ => this.entrySavedEvent.emit(Intent.add))
    );
  }

  editFinished(entry: TimeEntry): Observable<void> {
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

  private stopCurrentEntry() {
    const entry = this.current;
    this.current = null;
    this.deleteCurrentById(entry.id).subscribe(
      next => {
        entry.id = 0;
        this.addFinished(entry).subscribe();
      }
    );
  }

  private stopCurrentEntryAfterMidnight(todayEntry: TimeEntry) {
    const yesterdayEntry = this.current;
    this.current = null;
    this.deleteCurrentById(yesterdayEntry.id).subscribe(
      next => {
        yesterdayEntry.id = 0;
        this.addFinished(yesterdayEntry).subscribe();
        this.addFinished(todayEntry).subscribe();
      }
    );
  }

  private resumeFromYesterday(yesterdayEntry: TimeEntry) {
    yesterdayEntry.endTime = this.SECONDS_IN_DAY - 1;
    const todayEntry = this.getNewCurrentEntry(this.current.category);
    todayEntry.startTime = 0;
    this.current = null;
    this.startNewEntry(yesterdayEntry, todayEntry);
  }

  private startNewEntry(entry: TimeEntry, newEntry: TimeEntry) {
    this.deleteCurrentById(entry.id).subscribe(
      next => {
        entry.id = 0;
        this.addFinished(entry).subscribe(
          next => {
            this.addCurrent(newEntry).subscribe(
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
        const isNewDay = now < this.current.endTime;
        if (isNewDay) {
          this.timerSub.unsubscribe();
          this.resumeFromYesterday(this.current);
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
      this.stopCurrentEntryAfterMidnight(newTimeEntry);
    } else {
      this.current.endTime = now;
      this.stopCurrentEntry();
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

  private getNewCurrentEntry(category: Category): TimeEntry {
    return this.getNewTimeEntry(category, true);
  }

  getNewTimeEntry(category: Category, includeSeconds?: boolean): TimeEntry {
    const d = new Date();
    let time: number;
    time = includeSeconds ? TimeUtil.dateToSecondsOfDay(d) : (d.getHours() * 3600 + d.getMinutes() * 60);
    return { id: 0, date: TimeUtil.toDateString(d), category, startTime: time, endTime: time } as TimeEntry;
  }

}
