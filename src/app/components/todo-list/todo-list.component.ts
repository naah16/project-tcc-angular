import { Component, OnInit } from '@angular/core';
import { TodoService, Todo } from '../../_service/todo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule
  ],
  standalone: true,
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  newTodoTitle: string = '';

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.getTodos();
  }

  getTodos(): void {
    this.todoService.getTodos().subscribe(todos => this.todos = todos);
    console.log(this.todos);
  }

  addTodo(): void {
    const newTodo: Todo = {
      id: Date.now(),
      userId: 1,
      title: this.newTodoTitle,
      completed: false,
    };
    this.todoService.addTodo(newTodo).subscribe(todo => {
      this.todos.push(todo);
      this.newTodoTitle = '';
    });
  }

  updateTodo(todo: Todo): void {
    this.todoService.updateTodo(todo).subscribe();
  }

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.todos = this.todos.filter(todo => todo.id !== id);
    });
  }
}
