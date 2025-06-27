import {
  Component,
  inject,
  input,
  InputSignal,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidator } from '../../Services/custom-validator';
import { FormErrorToast } from '../form-error-toast/form-error-toast';
import { AuthFetch } from '../auth/auth-service/auth-fetch';
import { CredentialsDTO } from '../../Models/auth.model';
import { Router } from '@angular/router';
import { ErrorToast } from '../error-toast/error-toast';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, FormErrorToast, ErrorToast],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm implements OnInit {
  private router = inject(Router);
  isLoginForm: InputSignal<WritableSignal<boolean>> = input.required<WritableSignal<boolean>>();
  public fb = new FormBuilder();
  authFetch = inject(AuthFetch);
  error_message: WritableSignal<string | undefined> = signal(
    this.router.parseUrl(this.router.url).queryParams['error']
  );
  ngOnInit(): void {
    setTimeout(() => {
      this.error_message.set(undefined);
    }, 3000);
  }
  private customValidator = inject(CustomValidator);
  error = signal<string | null>(null);
  loading = signal(false);
  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        this.customValidator.checkForSymbolAndNumber(),
      ],
    ],
  });
  async onSubmit() {
    this.loading.set(true);
    this.error.set(null);
    if (this.loginForm.valid) {
      const formData = this.loginForm.value as CredentialsDTO;
      const response = await this.authFetch.login(formData);
      if ('error' in response) {
        console.error('Login failed:', response.error);
        this.error.set(response.error);
      } else {
        this.router.navigate(['/']);
      }
    }
    this.loading.set(false);
  }
}
