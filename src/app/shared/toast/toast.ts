import { Component, inject } from '@angular/core';
import { Toast as ToastState } from '../../core/toast';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
})
export class Toast {
  protected readonly toast = inject(ToastState);
}
