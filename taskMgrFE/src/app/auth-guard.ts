import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AuthFetch } from './Components/auth/auth-service/auth-fetch';

export const authGuard: CanActivateFn = (route, state) => {
   const authFetch = inject(AuthFetch);
  const router = inject(Router);
  const token = authFetch.getStoredToken();
  if (!token) {
    return new RedirectCommand(router.parseUrl('/auth?error=you are not authorized'));
  }
  if(!authFetch.isAuthenticated()){
    return new RedirectCommand(router.parseUrl('/auth?error=you are not authorized'));
  }
  return true
};
