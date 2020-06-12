import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DateTotal} from './model/date-total';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private url = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient
  ) { }

  getDurationsForDaysInMonth(year: number, month: number): Observable<DateTotal[]> {
    const monthFormatted = `${month}`.padStart(2, '0');
    const options = { params: new HttpParams().set('date', `${year}-${monthFormatted}`) };
    return this.http.get<DateTotal[]>(`${this.url}/time/total/month`, options);
  }

}
