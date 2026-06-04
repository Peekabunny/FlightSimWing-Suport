import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.html',
  styleUrl: './customers.scss'
})
export class Customers implements OnInit {

  // ========== PROPERTIES ==========
  customers: any[] = [];          // list of customers
  selectedCustomer: any = null;   // currently selected customer
  isLoading = false;              // loading state
  errorMessage = '';              // error message
  filterQuery = '';               // search filter

  // ========== NEW CUSTOMER FORM ==========
  newCustomer = {
    name: '',
    email: '',
    phone: ''
  };

  showAddForm = false;            // show/hide add form

  constructor(private customerService: CustomerService) {}

  // ========== ON INIT ==========
  // called when component loads
  ngOnInit() {
    this.loadCustomers();
  }

  // ========== LOAD CUSTOMERS ==========
  loadCustomers() {
    this.isLoading = true;
    this.customerService.getCustomers(0, 10, this.filterQuery).subscribe({
      next: (response) => {
        this.customers = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load customers';
        this.isLoading = false;
      }
    });
  }

  // ========== SELECT CUSTOMER ==========
  selectCustomer(customer: any) {
    this.selectedCustomer = customer;
  }

  // ========== ADD CUSTOMER ==========
  addCustomer() {
    this.customerService.createCustomer(this.newCustomer).subscribe({
      next: () => {
        this.loadCustomers();   // reload list
        this.newCustomer = { name: '', email: '', phone: '' }; // reset form
        this.showAddForm = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to create customer';
      }
    });
  }

  // ========== DELETE CUSTOMER ==========
  deleteCustomer(id: number) {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          this.loadCustomers();  // reload list
          this.selectedCustomer = null;
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete customer';
        }
      });
    }
  }

  // ========== SEARCH ==========
  search() {
    this.loadCustomers();
  }
}