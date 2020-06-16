import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TimeService } from '../service/time.service';
import { Intent } from '../../intent.enum';
import { Category } from '../../category/category';
import { CategoryService } from '../../category/service/category.service';

@Component({
  selector: 'app-time-dialog',
  templateUrl: './time-dialog.component.html',
  styleUrls: ['./time-dialog.component.css']
})
export class TimeDialogComponent implements OnInit {
  form: FormGroup;
  categories = new Array<Category>();
  add = Intent.add;
  edit = Intent.edit;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<TimeDialogComponent>,
    private timeService: TimeService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.setUpForm();
  }

  private loadCategories() {
    this.categoryService.getCategories().subscribe(
      next => this.categories = next
    );
  }

  private setUpForm() {
    this.form = this.formBuilder.group({
      date: [this.data.timeSession.date, Validators.required],
      category: [this.data.timeSession.category, Validators.required],
      startTime: [this.timeService.secondsOfDayToString(this.data.timeSession.startTime), Validators.required],
      endTime: [this.timeService.secondsOfDayToString(this.data.timeSession.endTime), Validators.required]
    });
  }

  onSubmit() {
    const result = this.data.timeSession;
    result.date = this.timeService.toDateString(this.form.value.date);
    result.category = this.form.value.category;
    result.startTime = this.timeService.toSecondsOfDay(this.form.value.startTime);
    result.endTime = this.timeService.toSecondsOfDay(this.form.value.endTime);
    this.dialogRef.close(result);
  }

}
