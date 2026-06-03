import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;  // shows loading state while waiting for API

  // inject AuthService and Router
  constructor(
    private authService: AuthService,
    private router: Router) {}

  onLogin() {
    this.isLoading = true;      // start loading
    this.errorMessage = '';     // clear previous errors

    this.authService.login(this.username, this.password).subscribe({
      next: (token) => {
        this.authService.saveToken(token);  // save JWT to localStorage
        this.router.navigate(['/customers']); // redirect to customers page
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Invalid username or password'; // show error
        this.isLoading = false;
      }
    });
  }
}