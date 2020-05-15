import { Injectable } from '@angular/core';
import {Task} from './task';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[];

  constructor() {
    this.populateSampleData();
  }

  getTasks(): Observable<Task[]> {
    return of(this.tasks);
  }

  addTask(todo: string, date: Date) {
    const task = { todo, date, finished: false } as Task;
    this.tasks.push(task);
  }

  private populateSampleData() {
    this.tasks = [
      { todo: 'run', date: new Date(), finished: false },
      { todo: 'walk', date: new Date(), finished: false },
      { todo: 'gym', date: new Date(), finished: true },
    ];
  }
}
