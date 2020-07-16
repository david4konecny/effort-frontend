import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../category';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private url = `${environment.apiUrl}/categories`;
  categoryChanged = new EventEmitter();

  constructor(
    private http: HttpClient
  ) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url);
  }

  add(category: Category): Observable<Category> {
    return this.http.post<Category>(this.url, category);
  }

  edit(category: Category): Observable<void> {
    return this.http.put<void>(this.url, category).pipe(
      tap(
        next => this.categoryChanged.emit()
      )
    );
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

}
