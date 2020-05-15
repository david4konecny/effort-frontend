import { Injectable } from '@angular/core';
import { Review } from './model/review';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  reviews: Review[];

  constructor() {
    this.populateSampleData();
  }

  getReviewByDate(date: Date) {
    return this.reviews.find(it => this.datesEqual(it.date, date));
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
