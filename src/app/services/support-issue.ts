import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class SupportIssueService {

  private apiUrl = 'https://fsw-support-api-eybrdfemfvdqfnek.westus3-01.azurewebsites.net';

  // ========== CACHE ==========
  // lives on the service, which survives component destruction
  private cachedIssues: any[] = [];
  private hasLoaded = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService) {}

  // ========== GET AUTH HEADERS ==========
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  // ========== CACHE ACCESSORS ==========
  getCachedIssues(): any[] {
    return this.cachedIssues;
  }

  setCachedIssues(issues: any[]) {
    this.cachedIssues = issues;
    this.hasLoaded = true;
  }

  hasLoadedOnce(): boolean {
    return this.hasLoaded;
  }

   clearCache() {
    this.cachedIssues = [];
    this.hasLoaded = false;
  }

  // ========== GET ALL ISSUES ==========
  getIssues(customerId?: number, status?: string): Observable<any> {
    let url = `${this.apiUrl}/Troubleshooting?`;
    if (customerId) url += `customerId=${customerId}&`;
    if (status) url += `status=${status}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  // ========== CREATE ISSUE ==========
  createIssue(issue: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/Troubleshooting/create`,
      issue,
      { headers: this.getHeaders() }
    );
  }

  // ========== UPDATE ISSUE ==========
  updateIssue(issue: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/Troubleshooting`,
      issue,
      { headers: this.getHeaders() }
    );
  }

  // ========== DELETE ISSUE ==========
  deleteIssue(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/Troubleshooting?id=${id}`,
      { headers: this.getHeaders() }
    );
  }
}