import {Component, OnDestroy, OnInit} from '@angular/core';
import {TaskService} from '../task.service';
import {Task} from '../task';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit, OnDestroy {
  tasks: Task[];
  sub: Subscription;

  constructor(
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.loadTasks();
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
