import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class InstructionService {

private apiUrl = 'https://fsw-support-api-eybrdfemfvdqfnek.westus3-01.azurewebsites.net';

  constructor(
    private http: HttpClient,
    private authService: AuthService) {}

  // ========== GET AUTH HEADERS ==========
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  // ========== GET ALL INSTRUCTIONS ==========
  getInstructions(productId?: number): Observable<any> {
    let url = `${this.apiUrl}/TroubleshootingInstruction`;
    if (productId) url += `?productId=${productId}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  // ========== CREATE INSTRUCTION ==========
  createInstruction(instruction: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/TroubleshootingInstruction/create`,
      instruction,
      { headers: this.getHeaders() }
    );
  }

  // ========== DELETE INSTRUCTION ==========
  deleteInstruction(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/TroubleshootingInstruction?id=${id}`,
      { headers: this.getHeaders() }
    );
  }
}