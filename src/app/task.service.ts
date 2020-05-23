import { Injectable } from '@angular/core';
import {Task} from './task';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {TimeService} from './services/time.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private url = 'http://localhost:8080/tasks';
  private tasks: Task[];

  constructor(
    private http: HttpClient,
    private timeService: TimeService) {
  }

  getTasks(): Observable<Task[]> {
    const options = { params: new HttpParams().set('date', this.timeService.toDateString(new Date())) };
    return this.http.get<Task[]>(this.url, options);
  }

  addTask(description: string, date: string): Observable<Task> {
    const task = { id: 0, description, date, finished: false } as Task;
    return this.http.post<Task>(this.url, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  editTask(task: Task): Observable<Task> {
    return this.http.put<Task>(this.url, task);
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
