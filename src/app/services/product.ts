import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'https://localhost:7227';

  constructor(
    private http: HttpClient,
    private authService: AuthService) {}

  // ========== GET AUTH HEADERS ==========
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  // ========== GET PRODUCTS BY CUSTOMER ==========
  getProducts(customerId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/Product?customerId=${customerId}`,
      { headers: this.getHeaders() }
    );
  }

  // ========== CREATE PRODUCT ==========
  createProduct(product: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/Product/create`,
      product,
      { headers: this.getHeaders() }
    );
  }

  // ========== DELETE PRODUCT ==========
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/Product?id=${id}`,
      { headers: this.getHeaders() }
    );
  }
}