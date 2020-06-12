import { Injectable } from '@angular/core';
import {Task} from './task';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {TimeService} from './services/time.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private url = 'http://localhost:8080/api/tasks';

  constructor(
    private http: HttpClient,
    private timeService: TimeService) {
  }

  getTasks(date: Date): Observable<Task[]> {
    const options = { params: new HttpParams().set('date', this.timeService.toDateString(date)) };
    return this.http.get<Task[]>(this.url, options);
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.url, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  editTask(task: Task): Observable<Task> {
    return this.http.put<Task>(this.url, task);
  }

}
