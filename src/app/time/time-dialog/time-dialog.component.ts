import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TimeService } from '../../services/time.service';
import { Intent } from '../../intent.enum';

@Component({
  selector: 'app-time-dialog',
  templateUrl: './time-dialog.component.html',
  styleUrls: ['./time-dialog.component.css']
})
export class TimeDialogComponent implements OnInit {
  form: FormGroup;
  add = Intent.add;
  edit = Intent.edit;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<TimeDialogComponent>,
    private timeService: TimeService
  ) { }

  ngOnInit(): void {
    this.setUpForm();
  }

  private setUpForm() {
    this.form = this.formBuilder.group({
      date: [this.data.timeSession.date, Validators.required],
      startTime: [this.timeService.secondsOfDayToString(this.data.timeSession.startTime), Validators.required],
      endTime: [this.timeService.secondsOfDayToString(this.data.timeSession.endTime), Validators.required]
    });
  }

  onSubmit() {
    const result = this.data.timeSession;
    result.date = this.form.value.date;
    result.startTime = this.timeService.toSecondsOfDay(this.form.value.startTime);
    result.endTime = this.timeService.toSecondsOfDay(this.form.value.endTime);
    this.dialogRef.close(result);
  }

  onDelete() {
    this.dialogRef.close('delete');
  }

}
