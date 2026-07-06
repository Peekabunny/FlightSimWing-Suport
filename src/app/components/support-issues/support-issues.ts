import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { SupportIssueService } from '../../services/support-issue';
import { CustomerService } from '../../services/customer';
import { ProductService } from '../../services/product';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-support-issues',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './support-issues.html',
  styleUrl: './support-issues.scss'
})
export class SupportIssues implements OnInit {

refresh() {
  this.supportIssueService.clearCache();
  this.selectedIssue = null;
  this.loadIssues();
}
  
  // ========== AUTOCOMPLETE CONTROL ==========
  customerControl = new FormControl('');
  showCustomerList = false;

  // ========== PROPERTIES ==========
  allIssues: any[] = [];
  issues: any[] = [];
  customers: any[] = [];
  filteredCustomers: Observable<any[]> = new Observable<any[]>();
  products: any[] = [];
  selectedIssue: any = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showAddForm = false;
  filterStatus = '';

  // ========== NEW ISSUE FORM ==========
  newIssue = {
    title: '',
    description: '',
    status: 0,
    customerId: 0,
    productId: 0
  };

  constructor(
    private supportIssueService: SupportIssueService,
    private customerService: CustomerService,
    private productService: ProductService) {}

// ========== ON INIT ==========
ngOnInit() {
  this.filteredCustomers = this.customerControl.valueChanges.pipe(
    startWith(''),
    map(value => typeof value === 'string' ? value : (value as any)?.name || ''),
    map(name => this.filterCustomers(name))
  );

  if (this.supportIssueService.hasLoadedOnce()) {
    // restore from service cache - no API call, no stale-read risk
    this.allIssues = this.supportIssueService.getCachedIssues();
    this.issues = [...this.allIssues];
  } else {
    // first time ever - fetch fresh
    this.loadIssues();
  }

  this.loadCustomers();
}

// ========== LOAD ISSUES ==========
loadIssues() {
  this.isLoading = true;
  this.supportIssueService.getIssues().subscribe({
    next: (response) => {
      this.allIssues = response.data;
      this.issues = response.data;
      this.supportIssueService.setCachedIssues(response.data);  // save to service cache
      this.isLoading = false;
    },
    error: (err) => {
      this.errorMessage = 'Failed to load issues';
      this.isLoading = false;
    }
  });
}

  // ========== LOAD CUSTOMERS ==========
  loadCustomers() {
    this.customerService.getCustomers(0, 100).subscribe({
      next: (response) => {
        this.customers = response.data;
      },
      error: (err) => {
        console.log('Failed to load customers', err);
      }
    });
  }

  // ========== FILTER CUSTOMERS ==========
  filterCustomers(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.customers.filter(c =>
      c.name.toLowerCase().includes(filterValue) ||
      c.email.toLowerCase().includes(filterValue)
    );
  }

  // ========== HIDE CUSTOMER LIST ==========
  hideCustomerList() {
    setTimeout(() => this.showCustomerList = false, 200);
  }

  // ========== ON CUSTOMER SELECTED ==========
  onCustomerSelected(customer: any) {
    this.newIssue.customerId = customer.id;
    this.customerControl.setValue(customer.name);
    this.showCustomerList = false;
    this.loadProductsForCustomer(customer.id);
  }

  // ========== LOAD PRODUCTS FOR CUSTOMER ==========
  loadProductsForCustomer(customerId: number) {
    this.productService.getProducts(customerId).subscribe({
      next: (response) => {
        this.products = response.data;
      },
      error: (err) => {
        console.log('Failed to load products', err);
      }
    });
  }

  // ========== SELECT ISSUE ==========
  selectIssue(issue: any) {
    this.selectedIssue = issue;
  }

  // ========== CREATE ISSUE ==========
createIssue() {
  this.supportIssueService.createIssue(this.newIssue).subscribe({
    next: (response) => {
      this.allIssues.push(response.data);
      this.supportIssueService.setCachedIssues(this.allIssues);  // sync cache

      if (this.filterStatus === '') {
        this.issues = [...this.allIssues];
      } else {
        this.issues = this.allIssues.filter(
          i => i.status === parseInt(this.filterStatus));
      }

      this.newIssue = { title: '', description: '', status: 0, customerId: 0, productId: 0 };
      this.customerControl.setValue('');
      this.products = [];
      this.showAddForm = false;
      this.successMessage = 'Issue created successfully!';
      setTimeout(() => this.successMessage = '', 3000);
    },
    error: (err) => {
      this.errorMessage = 'Failed to create issue';
    }
  });
}

// ========== UPDATE STATUS ==========
updateStatus(issue: any, status: number) {
  this.supportIssueService.updateIssue({
    id: issue.id,
    status: status
  }).subscribe({
    next: () => {
      const issueInAll = this.allIssues.find(i => i.id === issue.id);
      if (issueInAll) issueInAll.status = status;

      issue.status = status;
      this.selectedIssue.status = status;

      this.supportIssueService.setCachedIssues(this.allIssues);  // sync cache

      if (this.filterStatus !== '') {
        this.issues = this.allIssues.filter(
          i => i.status === parseInt(this.filterStatus));
        this.selectedIssue = null;
      }

      this.successMessage = 'Status updated successfully!';
      setTimeout(() => this.successMessage = '', 3000);
    },
    error: (err) => {
      this.errorMessage = 'Failed to update status';
    }
  });
}

  // ========== DELETE ISSUE ==========
deleteIssue(id: number) {
  if (confirm('Are you sure you want to delete this issue?')) {
    this.supportIssueService.deleteIssue(id).subscribe({
      next: () => {
        this.allIssues = this.allIssues.filter(i => i.id !== id);
        this.issues = this.issues.filter(i => i.id !== id);
        this.supportIssueService.setCachedIssues(this.allIssues);  // sync cache
        this.selectedIssue = null;
        this.successMessage = 'Issue deleted successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = 'Failed to delete issue';
      }
    });
  }
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

  // ========== FILTER BY STATUS ==========
filterByStatus(status: string) {
  this.filterStatus = status;
  
  // filter locally instead of calling API
  if (status === '') {
    this.issues = [...this.allIssues];  // show all
  } else {
    this.issues = this.allIssues.filter(i => i.status === parseInt(status));
  }
}
}

