import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../task.service';

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
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    let value = '';
    if (this.data.task) {
      value = this.data.task.todo;
    }
    this.taskForm = this.formBuilder.group(
      {todo: [value, Validators.required]}
      );
  }

  onSubmit() {
    if (this.data.action === 'add') {
      this.taskService.addTask(this.taskForm.value.todo, new Date());
    } else {
      this.taskService.editTask(this.data.task.id, this.taskForm.value.todo);
    }
    this.dialogRef.close();
  }

  onDeleteTask() {
    this.taskService.deleteTask(this.data.task.id);
    this.dialogRef.close();
  }
}
