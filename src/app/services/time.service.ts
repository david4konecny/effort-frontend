import { Injectable } from '@angular/core';
import { TimeSession } from '../model/time-session';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  private sessions: TimeSession[] = [];
  private current: TimeSession;

  constructor() { }

  startTimeSession(session: TimeSession) {
    this.current = session;
    this.sessions.push(this.current);
    console.log(this.sessions);
  }

  stopTimeSession() {
    this.current = null;
    console.log(this.sessions);
    console.log(this.getTodayTotal());
  }

  addTimeSession(timeSession: TimeSession) {
    this.sessions.push(timeSession);
  }

  getTodayTotal() {
    return this.sessions.map(s => this.getDuration(s)).reduce((a, b) => a + b, 0);
  }

  getDuration(timeSession: TimeSession) {
    return timeSession.endTime - timeSession.startTime;
  }

  getNewTimeSession(): TimeSession {
    const now = new Date();
    return { id: 0, date: this.toDateString(now), startTime: now.getTime(), endTime: now.getTime() } as TimeSession;
  }

  toDateString(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  toTimeString(timeInMillis: number) {
    const time = new Date(timeInMillis);
    const h = `${time.getHours()}`.padStart(2, '0');
    const m = `${time.getMinutes()}`.padStart(2, '0');
    return `${h}:${m}`;
  }

  toMilliseconds(time: string) {
    const h = +time.slice(0, 2);
    const m = +time.slice(3);
    return (h * 3600 + m * 60) * 1000;
  }

}
