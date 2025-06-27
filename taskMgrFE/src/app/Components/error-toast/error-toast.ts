import { Component, input } from '@angular/core';

@Component({
  selector: 'app-error-toast',
  imports: [],
  templateUrl: './error-toast.html',
  styleUrl: './error-toast.css'
})
export class ErrorToast {
  message = input.required<string[]>();
  title = input.required<string | null>();
}
