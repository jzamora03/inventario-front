import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {
  productForm: FormGroup;
  productId!: number;
  isLoading = true;
  isEditMode = false;


  constructor(private fb: FormBuilder, private productService: ProductService, private router: Router,  private route: ActivatedRoute) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      stockQuantity: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.productId = id;
        this.isEditMode = true;
        this.productService.getById(id).subscribe(product => {
          this.productForm.patchValue(product);
          setTimeout(() => {
            this.isLoading = false;
          }, 1000);
        });
      } else {
        this.isLoading = false;
      }
    });
  }

  submitForm() {
    const formattedProduct = { 
      id: this.productId,
      name: this.productForm.value.name,
      description: this.productForm.value.description,
      price: Number(this.productForm.value.price),
      category: this.productForm.value.category,
      stockQuantity: Number(this.productForm.value.stockQuantity)
    };

    console.log('Producto enviado:', formattedProduct);

    if (this.productId) {
      this.productService.update(this.productId, formattedProduct).subscribe(() => {
        this.router.navigate(['/products']);
      });
    } else {
      this.productService.create(formattedProduct).subscribe(() => {
        this.router.navigate(['/products']);
      });
    }
  }

  goToProductList() {
    this.router.navigate(['/products']);
  }
  
}