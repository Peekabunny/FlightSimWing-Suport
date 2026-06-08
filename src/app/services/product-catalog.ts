import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ProductCatalogService {

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

  // ========== GET ALL CATALOG ITEMS ==========
  getCatalog(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/ProductCatalog`,
      { headers: this.getHeaders() }
    );
  }
}