import {Component, OnDestroy, OnInit} from '@angular/core';
import {TaskService} from '../task.service';
import {Task} from '../task';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {TaskDialogComponent} from './task-dialog/task-dialog.component';

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

  openDialog(perform: string) {
    const dialogRef = this.dialog
      .open(TaskDialogComponent, { height: '400px', width: '600px', data: { action: perform }});
  }

  private loadTasks() {
    this.sub = this.taskService.getTasks().subscribe(
      next => this.tasks = next
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
