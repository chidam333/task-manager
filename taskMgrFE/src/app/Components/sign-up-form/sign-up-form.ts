import { Component, inject, model, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidator } from '../../Services/custom-validator';
import { FormErrorToast } from "../form-error-toast/form-error-toast";
import { AuthFetch } from '../auth/auth-service/auth-fetch';
import { UserDto } from '../../Models/user.model';
import { ErrorToast } from "../error-toast/error-toast";


@Component({
  selector: 'app-sign-up-form',
  imports: [ReactiveFormsModule, FormErrorToast, ErrorToast],
  templateUrl: './sign-up-form.html',
  styleUrl: './sign-up-form.css',
})
export class SignUpForm {
  isLoginForm = model.required();
  authFetch = inject(AuthFetch);
  fb = new FormBuilder();
  loading = signal(false);
  error = signal<string | null>(null);
  customValidator = inject(CustomValidator);
  signupForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), this.customValidator.checkForSymbolAndNumber()]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6), this.customValidator.checkForSymbolAndNumber()]],
  }, { validators: this.customValidator.passwordMatchValidator() });
  async onSubmit() {
    this.loading.set(true);
    this.error.set(null);
    if (this.signupForm.valid) {
      const formData = this.signupForm.value  as UserDto;
      const response = await this.authFetch.register(formData);
      if('error' in response) {
        this.error.set(response.error);
        this.loading.set(false);
      }
      else{
        this.isLoginForm.set(true);
        this.loading.set(false);
      }
    } else {
      console.log('Form is invalid. Please correct the errors and try again.');
    }
  }
}
