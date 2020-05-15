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

  private populateSampleData() {
    this.reviews = [
      { id: 1, date: new Date(2020, 5, 10), rating: 2, description: 'good' }
    ];
  }
}
