import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewService } from '../service/review.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { TimeUtil } from 'src/app/time/time-util';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  reviewForm: FormGroup;
  review = this.reviewService.getNewReview(new Date());
  isEditingForm = false;
  date = new Date();

  constructor(
    private reviewService: ReviewService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loadReview();
  }

  loadReview() {
    this.reviewService.getReview(this.date).subscribe(
      next => {
        if (next.length) {
          this.review = next[0];
        } else {
          this.review = this.reviewService.getNewReview(this.date);
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
        rating: [rating, [Validators.required, Validators.min(1), Validators.max(10)]],
        description: [description]
      }
    );
  }

  onSubmit() {
    this.review.rating = this.reviewForm.value.rating;
    this.review.description = this.reviewForm.value.description;
    if (this.review.id === 0) {
      this.addReview();
    } else {
      this.editReview();
    }
  }

  private addReview() {
    this.reviewService.addReview(this.review).subscribe(
      next => {
        this.review = next;
        this.isEditingForm = false;
      }
    );
  }

  private editReview() {
    this.reviewService.editReview(this.review).subscribe(
      next => {
        this.isEditingForm = false;
      }
    );
  }

  onGetReviewForPreviousDay() {
    this.date = TimeUtil.getPreviousDay(this.date);
    this.loadReview();
  }

  onGetReviewForNextDay() {
    this.date = TimeUtil.getNextDay(this.date);
    this.loadReview();
  }

  onDatePicked(change: MatDatepickerInputEvent<Date>) {
    this.date = change.value;
    this.loadReview();
  }

}
