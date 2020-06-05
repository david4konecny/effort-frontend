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
  reviews: Review[];

  constructor(
    private http: HttpClient,
    private timeService: TimeService
  ) {
    this.populateSampleData();
  }

  getReview(date: Date): Observable<Review[]> {
    const options = { params: new HttpParams().set('date', this.timeService.toDateString(date)) };
    return this.http.get<Review[]>(this.url, options);
  }

  saveReview(review: Review) {
    if (review.id) {
      this.editReview(review);
    } else {
      this.addReview(review);
    }
  }

  addReview(review: Review) {
    review.id = this.genId();
    this.reviews.push(review);
  }

  editReview(review: Review) {
    const origReview = this.reviews.find(it => it.id === review.id);
    origReview.rating = review.rating;
    origReview.description = review.description;
  }

  genId(): number {
    return this.reviews.length > 0 ? Math.max(...this.reviews.map(review => review.id)) + 1 : 1;
  }

  datesEqual(d1: Date, d2: Date): boolean {
    return (d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDay() === d2.getDay());
  }

  private populateSampleData() {
    this.reviews = [
      { id: 1, date: new Date(2020, 5, 10), rating: 2, description: 'good' },
    ];
  }
}
