import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewService } from '../review.service';
import { Review } from '../model/review';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  reviewForm: FormGroup;
  review = { date: new Date(), rating: 3, description: ''} as Review;
  isEditingForm = false;
  date = new Date();

  constructor(
    private reviewService: ReviewService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.fetchReview();
  }

  fetchReview() {
    this.reviewService.getReview(this.date).subscribe(
      next => {
        if (next.length) {
          this.review = next[0];
        }
      }
    );
  }

  onDisplayForm() {
    this.setUpForm(this.review.rating, this.review.description);
    this.isEditingForm = true;
  }

  onHideForm() {
    this.isEditingForm = false;
  }

  setUpForm(rating: number, description: string) {
    this.reviewForm = this.formBuilder.group(
      {
        rating: [rating],
        description: [description, Validators.required]
      }
    );
  }

  onSave() {
    this.review.rating = this.reviewForm.value.rating;
    this.review.description = this.reviewForm.value.description;
    this.reviewService.saveReview(this.review);
  }

}
