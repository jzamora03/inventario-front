import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  selectedProductId!: number; 
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  isLoading = true; 
  transactionType: string = 'Compra';
  transactionQuantity: number = 1;

  constructor(private productService: ProductService, private router: Router, private transactionService: TransactionService) {}

  ngOnInit() {
    setTimeout(() => {
      this.productService.getAll().subscribe(data => {
        this.products = data;
        this.filteredProducts = data;
        this.isLoading = false; 
      });
    }, 1000); 
  }

  filterProducts() {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.price.toString().includes(term) ||
      product.stockQuantity.toString().includes(term)
    );
  }


  confirmDelete(id: number) {
    this.selectedProductId = id;
    const modal = document.getElementById('deleteModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  cancelDelete() {
    const modal = document.getElementById('deleteModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  deleteConfirmed() {
    this.productService.delete(this.selectedProductId).subscribe(() => {
      this.productService.getAll().subscribe(data => {
        this.products = data;
        this.filteredProducts = data;
        this.cancelDelete();
      });
    });
  }
  
  openTransactionModal(productId: number) {
    this.selectedProductId = productId;
    const modal = document.getElementById('transactionModal');
    if (modal) modal.style.display = 'block';
  }
  
  cancelTransaction() {
    const modal = document.getElementById('transactionModal');
    if (modal) modal.style.display = 'none';
  }
  
  processTransaction() {
    const transaction: Transaction = {
      productId: this.selectedProductId,
      quantity: this.transactionQuantity,
      type: this.transactionType as 'Compra' | 'Venta'
    };
  
    this.transactionService.processTransaction(transaction).subscribe({
      next: (response) => {  
        console.log('Respuesta del backend:', response);
  
        this.productService.getAll().subscribe(data => this.products = data);
        alert(`Transacción completada: ${transaction.type} ${transaction.quantity} unidades del producto ID ${transaction.productId}`);
      },
      error: (err) => {
        console.error('Error en la transacción', err);
        alert('Ocurrió un error al procesar la transacción.');
      }
    });
  }

  navigateToForm() {
    this.router.navigate(['/new']);
  }

  navigateToEdit(id: number) {
    this.router.navigate([`/edit/${id}`]);
  }
}
