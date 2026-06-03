import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',  // available throughout the whole app
})
export class AuthService {
  
  // base URL of your .NET API
  private apiUrl = 'https://localhost:7227';

  // HttpClient is injected to make HTTP requests to the API
  constructor(private http: HttpClient) {}

  // ========== LOGIN ==========
  // sends username and password to API
  // returns JWT token as plain text string
  login(userName: string, password: string): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/Account/Login`,  // POST https://localhost:7227/Account/Login
      { userName, password },           // request body
      { responseType: 'text' as const }          // JWT comes back as plain text not JSON
    );
  }

  // ========== SAVE TOKEN ==========
  // stores JWT token in browser localStorage
  // localStorage persists even after browser tab is closed
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // ========== GET TOKEN ==========
  // retrieves JWT token from localStorage
  // returns null if not logged in
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ========== IS LOGGED IN ==========
  // checks if user is logged in by checking if token exists
  // returns true if token exists, false if not
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  // ========== LOGOUT ==========
  // removes JWT token from localStorage
  // user will need to login again
  logout(): void {
    localStorage.removeItem('token');
  }
}