import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Category} from '../model/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private url = 'http://localhost:8080/api/categories';

  constructor(
    private http: HttpClient
  ) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url);
  }

  add(category: Category): Observable<Category> {
    return this.http.post<Category>(this.url, category);
  }

  edit(category: Category): Observable<Category> {
    return this.http.put<Category>(this.url, category);
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

}
