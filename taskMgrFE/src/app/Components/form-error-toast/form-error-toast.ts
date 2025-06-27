import { Component, computed, input, OnInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { ErrorToast } from "../error-toast/error-toast";

@Component({
  selector: 'app-form-error-toast',
  imports: [ErrorToast],
  templateUrl: './form-error-toast.html',
  styleUrl: './form-error-toast.css'
})
export class FormErrorToast implements OnInit{
  public fields = input.required<FormGroup>();
  controls = computed(() => {
    return Object.entries(this.fields().controls);
  });
  
  ngOnInit(): void {
    console.log(this.fields())
    console.log(this.controls(),typeof(this.controls()));
  }
  
  stringifyErrors(errors: any): string {
    return JSON.stringify(errors);
  }

  getErrorMessages(control: AbstractControl): string[] {
    const messages: string[] = [];
    
    if (control.errors) {
      if (control.errors['required']) {
        messages.push(`${this.getControlName(control)} is required.`);
      }
      if (control.errors['email']) {
        messages.push(`${this.getControlName(control)} must be a valid email address.`);
      }
      if (control.errors['minlength']) {
        messages.push(`${this.getControlName(control)} must be at least ${control.errors['minlength'].requiredLength} characters long.`);
      }
      if (control.errors['message']) {
        messages.push(`${control.errors['message']}.`);
      }
    }
    
    return messages;
  }

  private getControlName(control: AbstractControl): string {
    const formGroup = this.fields();
    return Object.keys(formGroup.controls).find(key => formGroup.get(key) === control) || 'Field';
  }
}
