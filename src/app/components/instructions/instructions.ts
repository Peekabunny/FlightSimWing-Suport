import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InstructionService } from '../../services/instruction';
import { ProductCatalogService } from '../../services/product-catalog';

@Component({
  selector: 'app-instructions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './instructions.html',
  styleUrl: './instructions.scss'
})
export class Instructions implements OnInit {

  // ========== PROPERTIES ==========
  instructions: any[] = [];
  filteredInstructions: any[] = [];  // filtered list for display
  catalog: any[] = [];
  selectedInstruction: any = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showAddForm = false;
  selectedProductId = 0;
  searchQuery = '';  // search input

  // ========== NEW INSTRUCTION FORM ==========
  newInstruction = {
    issueType: '',
    steps: '',
    notes: '',
    productId: 0
  };

  constructor(
    private instructionService: InstructionService,
    private productCatalogService: ProductCatalogService) {}

  // ========== ON INIT ==========
  ngOnInit() {
    this.loadInstructions();
    this.loadCatalog();
  }

  // ========== LOAD INSTRUCTIONS ==========
  loadInstructions() {
    this.isLoading = true;
    this.instructionService.getInstructions(
      this.selectedProductId || undefined
    ).subscribe({
      next: (response) => {
        this.instructions = response.data;
        this.filteredInstructions = response.data;  // initialize filtered list
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load instructions';
        this.isLoading = false;
      }
    });
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

  // ========== SEARCH ==========
  search() {
    this.filteredInstructions = this.instructions.filter(i =>
      i.issueType.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      i.steps.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      i.notes?.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // ========== SELECT INSTRUCTION ==========
  selectInstruction(instruction: any) {
    this.selectedInstruction = instruction;
  }

  // ========== FILTER BY PRODUCT ==========
  filterByProduct() {
    this.searchQuery = '';  // clear search when filtering by product
    this.loadInstructions();
  }

  // ========== CREATE INSTRUCTION ==========
  createInstruction() {
    this.instructionService.createInstruction(this.newInstruction).subscribe({
      next: (response) => {
        this.instructions.push(response.data);
        this.filteredInstructions = [...this.instructions];  // update filtered list
        this.newInstruction = { issueType: '', steps: '', notes: '', productId: 0 };
        this.showAddForm = false;
        this.successMessage = 'Instruction added successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = 'Failed to create instruction';
      }
    });
  }

  // ========== DELETE INSTRUCTION ==========
  deleteInstruction(id: number) {
    if (confirm('Are you sure you want to delete this instruction?')) {
      this.instructionService.deleteInstruction(id).subscribe({
        next: () => {
          this.instructions = this.instructions.filter(i => i.id !== id);
          this.filteredInstructions = this.filteredInstructions.filter(i => i.id !== id);
          this.selectedInstruction = null;
          this.successMessage = 'Instruction deleted successfully!';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete instruction';
        }
      });
    }
  }
}