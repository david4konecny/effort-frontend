import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DateTotal } from '../../time/date-total';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private url = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getDurationsForDaysInMonth(year: number, month: number): Observable<DateTotal[]> {
    const monthFormatted = `${month}`.padStart(2, '0');
    const options = { params: new HttpParams().set('date', `${year}-${monthFormatted}`) };
    return this.http.get<DateTotal[]>(`${this.url}/time/total/month`, options);
  }

  getDurationsForDaysInPeriod(startDate: string, endDate: string): Observable<DateTotal[]> {
    const options = { params: new HttpParams().append('startDate', startDate).append('endDate', endDate) };
    return this.http.get<DateTotal[]>(`${this.url}/time/total/period`, options);
  }

  getStatsForPeriod(startDate: string, endDate: string): Observable<any> {
    const options = { params: new HttpParams().append('startDate', startDate).append('endDate', endDate) };
    return this.http.get<any>(`${this.url}/stats`, options);
  }

}
