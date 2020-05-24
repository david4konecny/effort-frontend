import {Component, OnDestroy, OnInit} from '@angular/core';
import {TaskService} from '../task.service';
import {Task} from '../task';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {TaskDialogComponent} from './task-dialog/task-dialog.component';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {TimeService} from '../services/time.service';

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
    private timeService: TimeService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  openDialog(action: string, task?: Task) {
    if (!task) {
      task = { id: 0, date: this.timeService.toDateString(new Date()), description: '', finished: false} as Task;
    }
    const dialogRef = this.dialog.open(
      TaskDialogComponent,
      { height: '300px', width: '350px', data: { action, task }});
    dialogRef.afterClosed().subscribe(result => this.onDialogClosed(result, action, task));
  }

  private onDialogClosed(result: any, action: string, task: Task) {
    if (result === 'delete') {
      this.deleteTask(task);
    } else if (result) {
      if (action === 'edit') {
        this.editTask(result);
      } else if (action === 'add') {
        this.addTask(result);
      }
    }
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

  private deleteTask(task: Task) {
    this.taskService.deleteTask(task.id).subscribe();
    const idx = this.tasks.findIndex(it => task === it);
    this.tasks.splice(idx, 1);
  }

  private addTask(task: Task) {
    this.taskService.addTask(task).subscribe(
      next => this.tasks.push(next)
    );
  }

  private editTask(task: Task) {
    this.taskService.editTask(task).subscribe();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
