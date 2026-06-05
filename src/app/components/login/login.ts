import { Component, OnInit } from '@angular/core';
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
export class Login implements OnInit {
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router) {}

  // ========== ON INIT ==========
  // if already logged in skip login page
  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/customers']);
    }
  }

  // ========== LOGIN ==========
  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.username, this.password).subscribe({
      next: (token) => {
        this.authService.saveToken(token);
        this.router.navigate(['/customers']);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Invalid username or password';
        this.isLoading = false;
      }
    });
  }
}