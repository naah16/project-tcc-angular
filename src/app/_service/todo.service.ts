import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Todo {
  key: string;
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface TodoPost {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = 'https://server-7m4zhbfadq-uc.a.run.app/todos';
  private apiUrlCount = 'https://server-7m4zhbfadq-uc.a.run.app/todos/count';

  constructor(private http: HttpClient) {}

  getTodos(offset: number, limit: number): Observable<Todo[]> {
    const url = `${this.apiUrl}?offset=${offset}&limit=${limit}`;
    return this.http.get<Todo[]>(url).pipe(
      catchError(this.handleError<Todo[]>('getTodos', []))
    );
  }

  getTodosCount(): Observable<{count: number}> {
    return this.http.get<{count: number}>(this.apiUrlCount).pipe(
      catchError(this.handleError<{count: number}>('getTodosCount', {count: 0}))
    );

  }

  addTodo(todo: TodoPost): Observable<TodoPost> {
    return this.http.post<TodoPost>(this.apiUrl, todo).pipe(
      catchError(this.handleError<TodoPost>('addTodo'))
    );
  }

  updateTodo(todo: Todo): Observable<any> {
    const url = `${this.apiUrl}/${todo.key}`;
    return this.http.put(url, todo).pipe(
      catchError(this.handleError<any>('updateTodo'))
    );
  }

  deleteTodo(key: string): Observable<Todo> {
    const url = `${this.apiUrl}/${key}`;
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
