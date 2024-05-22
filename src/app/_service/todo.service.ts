import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = 'http://localhost:3333/todos';

  constructor(private http: HttpClient) {}

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl).pipe(
      catchError(this.handleError<Todo[]>('getTodos', []))
    );
  }

  addTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, todo).pipe(
      catchError(this.handleError<Todo>('addTodo'))
    );
  }

  updateTodo(todo: Todo): Observable<any> {
    const url = `${this.apiUrl}/${todo.id}`;
    return this.http.put(url, todo).pipe(
      catchError(this.handleError<any>('updateTodo'))
    );
  }

  deleteTodo(id: number): Observable<Todo> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<Todo>(url).pipe(
      catchError(this.handleError<Todo>('deleteTodo'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
