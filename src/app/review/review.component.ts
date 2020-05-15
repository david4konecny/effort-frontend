import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ReviewService } from '../review.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  reviewForm: FormGroup;

  constructor(
    private reviewService: ReviewService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.reviewForm = this.formBuilder.group(
      {
        rating: [3],
        description: ['', Validators.required]
      }
    );
  }

  onSave() {

  }

}
