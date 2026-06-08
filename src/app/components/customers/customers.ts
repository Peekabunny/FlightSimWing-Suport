import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer';
import { ProductService } from '../../services/product';
import { ProductCatalogService } from '../../services/product-catalog';

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
  catalog: any[] = [];
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
    productCatalogId: 0,
    purchaseDate: ''
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
    private productService: ProductService,
    private productCatalogService: ProductCatalogService) {}

  // ========== ON INIT ==========
  ngOnInit() {
    this.loadCustomers();
    this.loadCatalog();
  }

  // ========== LOAD CATALOG ==========
  loadCatalog() {
    this.productCatalogService.getCatalog().subscribe({
      next: (response) => {
        this.catalog = response.data;
      },
      error: (err) => {
        console.log('Failed to load catalog', err);
      }
    });
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
    this.loadProducts(customer.id);
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

  // ========== ADD CUSTOMER WITH PRODUCT ==========
  addCustomer() {
    this.customerService.createCustomer({
      name: this.newCustomer.name,
      email: this.newCustomer.email,
      phone: this.newCustomer.phone
    }).subscribe({
      next: (response) => {
        const newCustomerId = response.data.id;
        const selectedProduct = this.catalog.find(
          p => p.id == this.newCustomer.productCatalogId);

        if (selectedProduct) {
          this.productService.createProduct({
            name: selectedProduct.name,
            description: selectedProduct.description,
            purchaseDate: this.newCustomer.purchaseDate,
            customerId: newCustomerId
          }).subscribe({
            next: () => {
              this.loadCustomers();
              this.newCustomer = { name: '', email: '', phone: '', productCatalogId: 0, purchaseDate: '' };
              this.showAddForm = false;
              this.successMessage = 'Customer and product added successfully!';
              setTimeout(() => this.successMessage = '', 3000);
            },
            error: (err) => {
              this.errorMessage = 'Customer created but failed to add product';
            }
          });
        } else {
          this.loadCustomers();
          this.showAddForm = false;
        }
      },
      error: (err) => {
        this.errorMessage = 'Failed to create customer';
      },
    });
  }

  // ========== ADD PRODUCT ==========
  addProduct() {
    const selectedProduct = this.catalog.find(
      p => p.id == this.newProduct.name);

    this.productService.createProduct({
      name: selectedProduct ? selectedProduct.name : this.newProduct.name,
      description: selectedProduct ? selectedProduct.description : '',
      purchaseDate: this.newProduct.purchaseDate,
      customerId: this.selectedCustomer.id
    }).subscribe({
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
          this.customers = this.customers.filter(c => c.id !== id);
          this.selectedCustomer = null;
          this.products = [];
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete customer';
        },
      });
    }
  }

  // ========== DELETE PRODUCT ==========
  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
          this.successMessage = 'Product deleted successfully!';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete product';
        }
      });
    }
  }

  // ========== SEARCH ==========
  search() {
    this.loadCustomers();
  }
}