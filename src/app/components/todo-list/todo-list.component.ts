import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TodoService, Todo } from '../../_service/todo.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    ReactiveFormsModule,
    ModalComponent
  ],
  standalone: true,
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  keysTodos: string[] = [];
  todoForm: FormGroup;
  isModalEditOpen = false;
  isModalDeleteOpen = false;
  currentTodoId: number | null = null;
  currentTodoKey: string | null = null;

  constructor(private todoService: TodoService, private fb: FormBuilder) {
    this.todoForm = this.fb.group({
      title: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getTodos();
  }

  getTodos(): void {
    this.todoService.getTodos().subscribe(todos => { 
      this.keysTodos = Object.keys(todos);
      this.todos = Object.values(todos);
    });
  }

  addTodo(): void {
    if (this.todoForm.invalid) {
      return;
    }
    const maxId = this.todos.reduce((maxId: number, item: Todo) => Math.max(item.id, maxId), 0) + 1;
    
    const newTodo: Todo = {
      id: maxId,
      userId: 1,
      title: this.todoForm.value.title,
      completed: false,
    };

    this.todoService.addTodo(newTodo).subscribe(todo => {
      this.todos.push(todo);
      this.todoForm.reset();
    });
  }

  updateTodoCompleted(todo: Todo): void {
    this.todoService.updateTodo(todo).subscribe();
  }

  deleteTodo(): void {
    if (this.currentTodoKey !== null) {
      this.todoService.deleteTodo(this.currentTodoKey).subscribe(() => {
        delete this.todos[Number(this.currentTodoKey)];
        this.handleModalDeleteClose();
      });
    }
  }

  startEdit(todo: Todo): void {
    this.currentTodoId = todo.id;
    this.todoForm.setValue({ title: todo.title });
    this.openModalEdit();
  }

  openModalEdit(): void {
    this.isModalEditOpen = true;
  }

  handleModalEditClose(): void {
    this.isModalEditOpen = false;
    this.currentTodoId = null;
    this.todoForm.reset();
  }

  handleModalEditConfirm(): void {
    if (this.todoForm.invalid || this.currentTodoId === null) {
      return;
    }

    const updatedTodo: Todo = {
      ...(this.todos.find(todo => todo.id === this.currentTodoId) as Todo),
      title: this.todoForm.value.title,
    };

    this.todoService.updateTodo(updatedTodo).subscribe(() => {
      const index = this.todos.findIndex(todo => todo.id === updatedTodo.id);
      this.todos[index] = updatedTodo;
      this.handleModalEditClose();
    });
  }

  openModalDelete(id: number): void {
    this.currentTodoId = id;
    this.isModalDeleteOpen = true;
  }

  handleModalDeleteClose(): void {
    this.isModalDeleteOpen = false;
    this.currentTodoId = null;
  }

  handleModalDeleteConfirm(): void {
    this.deleteTodo();
  }
}
