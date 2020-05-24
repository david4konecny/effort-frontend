import {Component, OnDestroy, OnInit} from '@angular/core';
import {TaskService} from '../task.service';
import {Task} from '../task';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {TaskDialogComponent} from './task-dialog/task-dialog.component';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit, OnDestroy {
  tasks: Task[];
  sub: Subscription;

  constructor(
    private taskService: TaskService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  openDialog(perform: string, selectedTask?: Task) {
    const dialogRef = this.dialog.open(
      TaskDialogComponent,
      { height: '300px', width: '350px', data: { action: perform, task: selectedTask }});
  }

  private loadTasks() {
    this.sub = this.taskService.getTasks().subscribe(
      next => this.tasks = next
    );
  }

  onItemCheck(change: MatCheckboxChange, task: Task) {
    task.finished = change.checked;
    this.taskService.editTask(task).subscribe();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
