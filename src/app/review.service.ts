import { Injectable } from '@angular/core';
import { Review } from './model/review';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TimeService } from './services/time.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private url = 'http://localhost:8080/reviews';

  constructor(
    private http: HttpClient,
    private timeService: TimeService
  ) {
  }

  getReview(date: Date): Observable<Review[]> {
    const options = { params: new HttpParams().set('date', this.timeService.toDateString(date)) };
    return this.http.get<Review[]>(this.url, options);
  }

  saveReview(review: Review): Observable<Review> {
    return this.http.post<Review>(this.url, review);
  }

}
