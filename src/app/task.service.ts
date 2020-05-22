import { Injectable } from '@angular/core';
import {Task} from './task';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private url = 'http://localhost:8080/tasks';
  private tasks: Task[];

  constructor(private http: HttpClient) {
  }

  getTasks(): Observable<Task[]> {
    const date = new Date();
    const years = date.getFullYear();
    const months = `${date.getMonth() + 1}`.padStart(2, '0');
    const days = `${date.getDate()}`.padStart(2, '0');
    const options = { params: new HttpParams().set('date', `${years}-${months}-${days}`) };
    return this.http.get<Task[]>(this.url, options);
  }

  addTask(todo: string, date: string) {
    const task = { id: this.genId(), description: todo, date, finished: false } as Task;
    this.tasks.push(task);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  editTask(id: number, todo: string) {
    const task = this.tasks.find(it => it.id === id);
    task.description = todo;
  }

  private genId(): number {
    return this.tasks.length > 0 ? Math.max(...this.tasks.map(task => task.id)) + 1 : 1;
  }

  private populateSampleData() {
    this.tasks = [
      { id: 1, description: 'run', date: new Date().toDateString(), finished: false },
      { id: 2, description: 'walk', date: new Date().toDateString(), finished: false },
      { id: 3, description: 'gym', date: new Date().toDateString(), finished: true },
    ];
  }
}
