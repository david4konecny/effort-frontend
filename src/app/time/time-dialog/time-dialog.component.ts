import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TimeService } from '../service/time.service';
import { Intent } from '../../intent.enum';
import { Category } from '../../category/category';
import { CategoryService } from '../../category/service/category.service';
import { timeValidator } from '../time-validator';

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
    this.loadOptionsAndInitForm();
  }

  private loadOptionsAndInitForm() {
    this.categoryService.getCategories().subscribe(
      next => {
        this.categories = next;
        this.setUpForm();
      }
    );
  }

  private setUpForm() {
    this.form = this.formBuilder.group({
      date: [this.data.timeSession.date, Validators.required],
      category: [this.findInitialCategoryFromOptions(), Validators.required],
      startTime: [this.timeService.secondsOfDayToString(this.data.timeSession.startTime), Validators.required],
      endTime: [this.timeService.secondsOfDayToString(this.data.timeSession.endTime), Validators.required]
    }, { validators: timeValidator });
  }

  onSubmit() {
    const result = this.data.timeSession;
    if (typeof this.form.value.date === 'string') {
      result.date = this.form.value.date;
    } else {
      result.date = this.timeService.toDateString(this.form.value.date);
    }
    result.category = this.form.value.category;
    result.startTime = TimeService.toSecondsOfDay(this.form.value.startTime);
    result.endTime = TimeService.toSecondsOfDay(this.form.value.endTime);
    this.dialogRef.close(result);
  }

  private findInitialCategoryFromOptions(): Category {
    return this.categories.find(it => it.id === this.data.timeSession.category.id);
  }

}
