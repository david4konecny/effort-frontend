import { Injectable } from '@angular/core';
import { Task } from '../task';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TimeService } from '../../time/service/time.service';
import { TimeUtil } from 'src/app/time/time-util';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private url = `${environment.apiUrl}/tasks`;

  constructor(
    private http: HttpClient,
    private timeService: TimeService) {
  }

  getTasks(date: Date): Observable<Task[]> {
    const options = { params: new HttpParams().set('date', TimeUtil.toDateString(date)) };
    return this.http.get<Task[]>(this.url, options);
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.url, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  editTask(task: Task): Observable<void> {
    return this.http.put<void>(this.url, task);
  }

}
