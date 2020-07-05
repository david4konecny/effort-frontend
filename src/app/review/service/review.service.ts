import { Injectable } from '@angular/core';
import { Review } from '../review';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TimeService } from '../../time/service/time.service';
import { Observable } from 'rxjs';
import { TimeUtil } from 'src/app/time/time-util';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private url = '//localhost:8080/api/reviews';

  constructor(
    private http: HttpClient,
    private timeService: TimeService
  ) {
  }

  getReview(date: Date): Observable<Review[]> {
    const options = { params: new HttpParams().set('date', TimeUtil.toDateString(date)) };
    return this.http.get<Review[]>(this.url, options);
  }

  saveReview(review: Review): Observable<Review> {
    return this.http.post<Review>(this.url, review);
  }

  getNewReview(date: Date): Review {
    return { id: 0, date: TimeUtil.toDateString(date), description: '', rating: 0 } as Review;
  }

}
