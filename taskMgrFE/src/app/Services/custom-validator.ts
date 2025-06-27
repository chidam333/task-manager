import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomValidator {
  constructor() { }
  checkForSymbolAndNumber():ValidatorFn {
    return (control:AbstractControl):ValidationErrors | null => {
      const value = control.value;
      const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const hasNumber = /\d/.test(value);
      if (value && !hasSymbol) {
        return { message: 'Password must contain at least one symbol.' };
      }
      if (value && !hasNumber) {
        return { message: 'Password must contain at least one number.' };
      }
      return null;
    }
  }
  passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password');
      const confirmPassword = formGroup.get('confirmPassword');
      if (password && confirmPassword && password.value !== confirmPassword.value) {
        return { passwordMismatch: 'Passwords do not match.' };
      }
      console.log('Passwords do not match');
      return null;
    }
  }
}
