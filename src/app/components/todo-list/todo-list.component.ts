import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TodoService, Todo, TodoPost } from '../../_service/todo.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { ToastComponent } from '../toast/toast.component';
import { ToastService } from '../../_service/toast.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    ReactiveFormsModule,
    ModalComponent,
    PaginationComponent,
    ToastComponent
  ],
  standalone: true,
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  todosPost: TodoPost[] = [];
  todoForm: FormGroup;
  isModalEditOpen = false;
  isModalDeleteOpen = false;
  currentTodoId: number | null = null;
  currentTodoKey: string | null = null;
  currentPage: number = 0;
  totalPages: number = 0;
  itemsPerPage: number = 10;

  constructor(
    private todoService: TodoService, 
    private fb: FormBuilder, 
    private toastService: ToastService
  ) {
    this.todoForm = this.fb.group({
      title: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getTodosCount();
    this.getTodos(this.currentPage);
  }

  getTodos(page: number): void {
    this.todoService.getTodos(page * this.itemsPerPage, this.itemsPerPage).subscribe(todos => this.todos = todos);
  }

  getTodosCount(): void {
    this.todoService.getTodosCount().subscribe(resp => 
      this.totalPages = resp.count
    );
  }

  addTodo(): void {
    if (this.todoForm.invalid) {
      return;
    }
    const maxId = this.todos.reduce((maxId: number, item: Todo) => Math.max(item.id, maxId), 0) + 1;
    
    const newTodo: Todo = {
      key: '',
      id: maxId,
      userId: 1,
      title: this.todoForm.value.title,
      completed: false,
    };

    const newTodoPost: TodoPost = {
      id: newTodo.id,
      userId: newTodo.userId,
      title: newTodo.title,
      completed: newTodo.completed,
    };

    this.todoService.addTodo(newTodoPost).subscribe(todo => {
      this.todosPost.push(todo);
      this.todoForm.reset();
      this.getTodos(this.currentPage);
      this.getTodosCount();
      this.toastService.showToast('Tarefa adicionada com sucesso!', 'success');
    }, () => {
      this.toastService.showToast('Falha ao adicionar tarefa.', 'error');
    });
  }

  updateTodoCompleted(todo: Todo): void {
    this.todoService.updateTodo(todo).subscribe(() => {
      this.toastService.showToast('Tarefa atualizada com sucesso!', 'success');
    }, () => {
      this.toastService.showToast('Falha ao atualizar tarefa.', 'error');
    });
  }

  deleteTodo(): void {
    if (this.currentTodoKey !== null) {
      this.todoService.deleteTodo(this.currentTodoKey).subscribe(() => {
        this.todos = this.todos.filter(todo => todo.key !== this.currentTodoKey);
        this.handleModalDeleteClose();
        this.getTodosCount();
        this.toastService.showToast('Tarefa excluída com sucesso!', 'success');
      }, () => {
        this.toastService.showToast('Falha ao excluir tarefa.', 'error');
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
      this.toastService.showToast('Tarefa editada com sucesso!', 'success');
    }, () => {
      this.toastService.showToast('Falha ao atualizar tarefa.', 'error');
    });
  }

  openModalDelete(key: string): void {
    this.currentTodoKey = key;
    this.isModalDeleteOpen = true;
  }

  handleModalDeleteClose(): void {
    this.isModalDeleteOpen = false;
    this.currentTodoId = null;
  }

  handleModalDeleteConfirm(): void {
    this.deleteTodo();
  }

  handlePageChange(newPageIndex: number): void {
    this.currentPage = newPageIndex;
    this.getTodos(newPageIndex);
  }
}
