import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route) => {

  const router = inject(Router);
  const token = sessionStorage.getItem('token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  const payload = JSON.parse(atob(token.split('.')[1]));
  const userRole = payload.role;

  const allowedRoles = route.data?.['roles'];

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    alert("Access Denied");
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};