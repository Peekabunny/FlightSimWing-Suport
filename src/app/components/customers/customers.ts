import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.html',
  styleUrl: './customers.scss',
})
export class Customers implements OnInit {

  // ========== PROPERTIES ==========
  successMessage = '';
  customers: any[] = [];
  selectedCustomer: any = null;
  isLoading = false;
  errorMessage = '';
  filterQuery = '';
  showAddForm = false;
  isEditing = false;

  // ========== PRODUCT PROPERTIES ==========
  products: any[] = [];
  showAddProductForm = false;
  newProduct = {
    name: '',
    description: '',
    purchaseDate: '',
    customerId: 0
  };

  // ========== NEW CUSTOMER FORM ==========
  newCustomer = {
    name: '',
    email: '',
    phone: '',
  };

  // ========== EDIT CUSTOMER FORM ==========
  editCustomer = {
    id: 0,
    name: '',
    email: '',
    phone: '',
  };

  constructor(
    private customerService: CustomerService,
    private productService: ProductService) {}

  // ========== ON INIT ==========
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
      },
    });
  }

  // ========== SELECT CUSTOMER ==========
  selectCustomer(customer: any) {
    this.selectedCustomer = customer;
    this.isEditing = false;
    this.showAddProductForm = false;
    this.loadProducts(customer.id);  // load products for this customer
  }

  // ========== LOAD PRODUCTS ==========
  loadProducts(customerId: number) {
    this.productService.getProducts(customerId).subscribe({
      next: (response) => {
        this.products = response.data;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load products';
      }
    });
  }

  // ========== ADD PRODUCT ==========
  addProduct() {
    this.newProduct.customerId = this.selectedCustomer.id;
    this.productService.createProduct(this.newProduct).subscribe({
      next: () => {
        this.loadProducts(this.selectedCustomer.id);
        this.newProduct = { name: '', description: '', purchaseDate: '', customerId: 0 };
        this.showAddProductForm = false;
        this.successMessage = 'Product added successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = 'Failed to add product';
      }
    });
  }

  // ========== DELETE PRODUCT ==========
  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts(this.selectedCustomer.id);
          this.successMessage = 'Product deleted successfully!';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete product';
        }
      });
    }
  }

  // ========== ADD CUSTOMER ==========
  addCustomer() {
    this.customerService.createCustomer(this.newCustomer).subscribe({
      next: () => {
        this.loadCustomers();
        this.newCustomer = { name: '', email: '', phone: '' };
        this.showAddForm = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to create customer';
      },
    });
  }

  // ========== START EDIT ==========
  startEdit(customer: any) {
    this.isEditing = true;
    this.editCustomer = {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone
    };
  }

  // ========== SAVE EDIT ==========
  saveEdit() {
    this.customerService.updateCustomer(this.editCustomer).subscribe({
      next: (response) => {
        this.successMessage = 'Customer updated successfully!';
        this.isEditing = false;
        this.selectedCustomer = {
          ...this.selectedCustomer,
          name: this.editCustomer.name,
          email: this.editCustomer.email,
          phone: this.editCustomer.phone
        };
        this.loadCustomers();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = `Failed to update customer: ${err.status}`;
      }
    });
  }

  // ========== CANCEL EDIT ==========
  cancelEdit() {
    this.isEditing = false;
  }

  // ========== DELETE CUSTOMER ==========
  deleteCustomer(id: number) {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          this.loadCustomers();
          this.selectedCustomer = null;
          this.products = [];
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete customer';
        },
      });
    }
  }

  // ========== SEARCH ==========
  search() {
    this.loadCustomers();
  }
}