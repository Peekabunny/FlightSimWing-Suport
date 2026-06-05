import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Customers } from './components/customers/customers';
import { SupportIssues } from './components/support-issues/support-issues';
import { Instructions } from './components/instructions/instructions';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth';

// function base guard
const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  console.log('Guard called');
  
  if (authService.isLoggedIn()) {
    return true;
  }
  return router.navigate(['/login']);
};

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // default route
  { path: 'login', component: Login }, // login page does not require auth guard
  { path: 'customers', component: Customers, canActivate: [authGuard] },
  { path: 'support-issues', component: SupportIssues, canActivate: [authGuard] },
  { path: 'instructions', component: Instructions, canActivate: [authGuard] },
];