import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
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
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // default route
  { path: 'login', component: Login }, // login page does not require auth guard
  { path: 'dashboard', component: Dashboard},
  { path: 'customers', component: Customers, canActivate: [authGuard] },
  { path: 'support-issues', component: SupportIssues, canActivate: [authGuard] },
  { path: 'instructions', component: Instructions, canActivate: [authGuard] },
];