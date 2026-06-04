import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = 'https://localhost:7227';

  constructor(
    private http: HttpClient,
    private authService: AuthService) {}

  // ========== GET AUTH HEADERS ==========
  // adds JWT token to every request
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  // ========== GET ALL CUSTOMERS ==========
  getCustomers(pageIndex = 0, pageSize = 10, filterQuery = ''): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/Customer?pageIndex=${pageIndex}&pageSize=${pageSize}&filterQuery=${filterQuery}`,
      { headers: this.getHeaders() }
    );
  }

  // ========== CREATE CUSTOMER ==========
  createCustomer(customer: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/Customer/create`,
      customer,
      { headers: this.getHeaders() }
    );
  }

  // ========== UPDATE CUSTOMER ==========
  updateCustomer(customer: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/Customer`,
      customer,
      { headers: this.getHeaders() }
    );
  }

  // ========== DELETE CUSTOMER ==========
  deleteCustomer(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/Customer?id=${id}`,
      { headers: this.getHeaders() }
    );
  }
}