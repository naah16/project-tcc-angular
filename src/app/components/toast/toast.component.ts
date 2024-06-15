import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastMessage, ToastService } from '../../_service/toast.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [
    NgClass,
    NgIf
  ],
  template: `
    <div *ngIf="toastMessage" class="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white border"
      [ngClass]="{
        'bg-green-700': toastMessage.type === 'success',
        'bg-red-500': toastMessage.type === 'error'
      }"
    >
      {{ toastMessage.message }}
    </div>
  `,
})
export class ToastComponent implements OnInit {
  toastMessage: ToastMessage | null = null;
  private subscription: Subscription;

  constructor(private toastService: ToastService) {
    this.subscription = this.toastService.toastState.subscribe((toastMessage: ToastMessage) => {
      this.toastMessage = toastMessage;
      setTimeout(() => this.toastMessage = null, toastMessage.duration || 3000);
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
