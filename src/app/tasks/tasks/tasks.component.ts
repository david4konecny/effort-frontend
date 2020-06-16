import {Component, OnDestroy, OnInit} from '@angular/core';
import {TaskService} from '../service/task.service';
import {Task} from '../task';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {TaskDialogComponent} from '../task-dialog/task-dialog.component';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {TimeService} from '../../time/service/time.service';
import {Intent} from '../../intent.enum';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  sub: Subscription;
  tasksFinished = 0;
  date: Date = new Date();

  constructor(
    private taskService: TaskService,
    private timeService: TimeService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  onEditTask(task: Task) {
    this.openDialog(Intent.edit, task);
  }

  onAddTask() {
    this.openDialog(Intent.add);
  }

  onDeleteTask(task: Task) {
    this.deleteTask(task);
  }

  openDialog(action: Intent, task?: Task) {
    if (!task) {
      task = { id: 0, date: this.timeService.toDateString(new Date()), description: '', finished: false} as Task;
    }
    const dialogRef = this.dialog.open(
      TaskDialogComponent,
      { height: '300px', width: '350px', data: { action, task }});
    dialogRef.afterClosed().subscribe(result => this.onDialogClosed(result, action, task));
  }

  private onDialogClosed(result: any, action: Intent, task: Task) {
    if (result) {
      if (action === Intent.edit) {
        this.editTask(result);
      } else if (action === Intent.add) {
        this.addTask(result);
      }
    }
  }

  private loadTasks() {
    this.sub = this.taskService.getTasks(this.date).subscribe(
      next => {
        this.tasks = next;
        this.updateNumOfTasksFinished();
      }
    );
  }

  private updateNumOfTasksFinished() {
    this.tasksFinished = this.tasks.filter(it => it.finished).length;
  }

  onItemCheck(change: MatCheckboxChange, task: Task) {
    task.finished = change.checked;
    this.taskService.editTask(task).subscribe();
    this.updateNumOfTasksFinished();
  }

  private deleteTask(task: Task) {
    this.taskService.deleteTask(task.id).subscribe();
    this.removeTaskFromList(task);
    this.updateNumOfTasksFinished();
  }

  private addTask(task: Task) {
    this.taskService.addTask(task).subscribe(
      next => {
        if (task.date === this.timeService.toDateString(this.date)) {
          this.tasks.push(next);
        }
      }
    );
  }

  private editTask(task: Task) {
    this.taskService.editTask(task).subscribe(
      next => {
        if (task.date !== this.timeService.toDateString(new Date())) {
          this.removeTaskFromList(task);
        }
      }
    );
  }

  private removeTaskFromList(task: Task) {
    const idx = this.tasks.findIndex(it => task === it);
    this.tasks.splice(idx, 1);
  }

  onDateChanged(change: MatDatepickerInputEvent<Date>) {
    this.date = change.value;
    this.reloadTasks();
  }

  getTasksForNextDay() {
    this.date = this.timeService.getNextDay(this.date);
    this.reloadTasks();
  }

  getTasksForPreviousDay() {
    this.date = this.timeService.getPreviousDay(this.date);
    this.reloadTasks();
  }

  private reloadTasks() {
    this.sub.unsubscribe();
    this.loadTasks();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
