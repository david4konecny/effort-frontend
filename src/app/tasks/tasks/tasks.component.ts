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
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TimeUtil } from 'src/app/time/time-util';

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
      task = { id: 0, date: TimeUtil.toDateString(this.date), description: '', finished: false} as Task;
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
    if (this.tasks.length === 0) {
      task.position = 10000.0;
    } else {
      const lastPosition = this.tasks[this.tasks.length - 1].position;
      task.position = lastPosition + 10000.0;
    }
    this.taskService.addTask(task).subscribe(
      next => {
        if (task.date === TimeUtil.toDateString(this.date)) {
          this.tasks.push(next);
        }
      }
    );
  }

  private editTask(task: Task) {
    this.taskService.editTask(task).subscribe(
      next => {
        if (task.date !== TimeUtil.toDateString(new Date())) {
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
    this.date = TimeUtil.getNextDay(this.date);
    this.reloadTasks();
  }

  getTasksForPreviousDay() {
    this.date = TimeUtil.getPreviousDay(this.date);
    this.reloadTasks();
  }

  private reloadTasks() {
    this.sub.unsubscribe();
    this.loadTasks();
  }

  onTaskMoved(event: CdkDragDrop<Task[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
    if (this.tasks.length === 1 || event.previousIndex === event.currentIndex) {
      return;
    }
    this.updateTaskPosition(event.currentIndex);
  }

  private updateTaskPosition(newIdx: number) {
    const movedTask = this.tasks[newIdx];
    switch (newIdx) {
      case 0:
        movedTask.position = 0.9 * this.tasks[1].position;
        break;
      case this.tasks.length - 1:
        movedTask.position = this.tasks[this.tasks.length - 2].position + 10000.0;
        break;
      default:
        movedTask.position = (this.tasks[newIdx - 1].position + this.tasks[newIdx + 1].position) / 2;
    }
    this.taskService.editTask(movedTask).subscribe();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
