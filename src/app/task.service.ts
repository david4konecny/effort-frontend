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
    const task = { id: this.genId(), todo, date, finished: false } as Task;
    this.tasks.push(task);
  }

  deleteTask(id: number) {
    const idx = this.tasks.findIndex(task => task.id === id);
    this.tasks.splice(idx, 1);
  }

  editTask(id: number, todo: string) {
    const task = this.tasks.find(it => it.id === id);
    task.todo = todo;
  }

  private genId(): number {
    return this.tasks.length > 0 ? Math.max(...this.tasks.map(task => task.id)) + 1 : 1;
  }

  private populateSampleData() {
    this.tasks = [
      { id: 1, todo: 'run', date: new Date(), finished: false },
      { id: 2, todo: 'walk', date: new Date(), finished: false },
      { id: 3, todo: 'gym', date: new Date(), finished: true },
    ];
  }
}
