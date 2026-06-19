// HTTP requests

import { Injectable } from '@angular/core';
// marks as injectable service

import { HttpClient, HttpHeaders } from '@angular/common/http';
// makes HTTP requests, creates headers

import { Observable, forkJoin } from 'rxjs';
// Observable = async data stream
// forkJoin = combines multiple Observables into one

import { map } from 'rxjs/operators';
// transforms data after it arrives

import { AuthService } from './auth';
// gets JWT token


// class set up
@Injectable({
    providedIn:'root' // service throught the whole app
})
export class DashboardService {

      private apiUrl = 'https://fsw-support-api-eybrdfemfvdqfnek.westus3-01.azurewebsites.net';

      constructor( private http: HttpClient, private authService: AuthService )
      {

      }

      private getHeaders(): HttpHeaders {
        return new HttpHeaders({'Authorization': `Bearer ${this.authService.getToken()}`});

      }
      
      getDashboardStats(): Observable<any> {
          const customers$ = this.http.get(
              `${this.apiUrl}/Customer?pageSize=100`,
              { headers: this.getHeaders() }
            );
            
            const issues$ = this.http.get(
                `${this.apiUrl}/Troubleshooting`,
                { headers: this.getHeaders() }
            );
            
            const catalog$ = this.http.get(
                `${this.apiUrl}/ProductCatalog`,
                { headers: this.getHeaders() }
            );
            
            return forkJoin([customers$, issues$, catalog$]).pipe(
                map(([customersRes, issuesRes, catalogRes]: any) => {
                    const issues = issuesRes.data;
                    
                    return {
                        totalCustomers: customersRes.recordCount || customersRes.data.length,
                        totalProducts: catalogRes.data.length,
                        totalIssues: issues.length,
                        openIssues: issues.filter((i: any) => i.status === 0).length,
                        inProgressIssues: issues.filter((i: any) => i.status === 1).length,
                        resolvedIssues: issues.filter((i: any) => i.status === 2).length,
                        recentIssues: issues.slice(-5).reverse()
                    };
                })
            );
        }
    }