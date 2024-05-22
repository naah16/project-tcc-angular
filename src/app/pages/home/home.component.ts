import { Component } from '@angular/core';
import { TodoListComponent } from '../../components/todo-list/todo-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TodoListComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  // template: `<app-todo-list></app-todo-list>`,
})
export class HomeComponent {

}
