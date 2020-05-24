import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../task.service';
import { TimeService } from '../../services/time.service';
import { Task } from '../../task';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css']
})
export class TaskDialogComponent implements OnInit {
  taskForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<TaskDialogComponent>,
    private taskService: TaskService,
    private timeService: TimeService
  ) { }

  ngOnInit(): void {
    const value = this.data.task.description;
    this.taskForm = this.formBuilder.group(
      {description: [value, Validators.required]}
      );
  }

  onSubmit() {
    this.data.task.description = this.taskForm.value.description;
    this.dialogRef.close(this.data.task);
  }

  onDeleteTask() {
    this.dialogRef.close('delete');
  }
}
