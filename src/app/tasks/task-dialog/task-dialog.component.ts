import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TimeService } from '../../time/service/time.service';
import {Intent} from '../../intent.enum';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css']
})
export class TaskDialogComponent implements OnInit {
  taskForm: FormGroup;
  add = Intent.add;
  edit = Intent.edit;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<TaskDialogComponent>,
    private timeService: TimeService
  ) { }

  ngOnInit(): void {
    this.setUpForm();
  }

  private setUpForm() {
    this.taskForm = this.formBuilder.group({
      date: [this.data.task.date, Validators.required],
      description: [this.data.task.description, Validators.required]
    });
  }

  onSubmit() {
    if (typeof this.taskForm.value.date === 'object') {
      this.data.task.date = this.timeService.toDateString(this.taskForm.value.date);
    }
    this.data.task.description = this.taskForm.value.description;
    this.dialogRef.close(this.data.task);
  }

}
