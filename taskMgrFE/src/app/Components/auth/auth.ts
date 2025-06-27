import { Component, signal } from '@angular/core';
import { LoginForm } from "../login-form/login-form";
import { SignUpForm } from "../sign-up-form/sign-up-form";

@Component({
  selector: 'app-auth',
  imports: [LoginForm, SignUpForm],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  isLoginForm = signal(true);
}

