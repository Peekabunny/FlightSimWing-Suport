import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../services/dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

  // ========== PROPERTIES ==========
  stats: any = null;
  isLoading = false;
  errorMessage = '';

  constructor(private dashboardService: DashboardService) {}

  // ========== ON INIT ==========
  ngOnInit() {
    this.loadStats();
  }

  // ========== LOAD STATS ==========
  loadStats() {
    this.isLoading = true;
    this.dashboardService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load dashboard data';
        this.isLoading = false;
      }
    });
  }

  // ========== GET STATUS LABEL ==========
  getStatusLabel(status: number): string {
    switch(status) {
      case 0: return 'Open';
      case 1: return 'In Progress';
      case 2: return 'Resolved';
      default: return 'Unknown';
    }
  }

  // ========== GET STATUS CLASS ==========
  getStatusClass(status: number): string {
    switch(status) {
      case 0: return 'status-open';
      case 1: return 'status-inprogress';
      case 2: return 'status-resolved';
      default: return '';
    }
  }
}