import { NgClass } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pagination',
  standalone: true,
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
  imports: [
    NgClass,
    MatIconModule,
  ]
})
export class PaginationComponent {
  @Input() pageIndex: number = 0;
  @Input() totalPage: number = 0;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  Math: any = Math;

  onPageChange(newPageIndex: number): void {
    this.pageChange.emit(newPageIndex);
  }
}
