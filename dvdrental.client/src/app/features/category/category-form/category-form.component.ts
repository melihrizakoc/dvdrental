import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-category-form',
  standalone: false,
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent {
  categoryForm: FormGroup;
  isEditMode = false;
  categoryId?: number;
  loading = false;
  submitted = false;
  error: string | null = null;
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.categoryForm = this.fb.group({
      category_id: ['', [Validators.required, Validators.min(1)]],
      name: ['', [Validators.required, Validators.maxLength(25)]]
    });
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.categoryId = +params['id'];
        this.loadCategory(this.categoryId);
      }
    });
  }
  loadCategory(id: number): void {
    this.loading = true;
    this.categoryService.getCategory(id).subscribe({
      next: (category) => {
        this.categoryForm.patchValue({
          category_id: category.category_id,
          name: category.name
        });
        this.categoryForm.get('category_id')?.disable();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Kategori bilgileri yüklenirken bir hata oluştu';
        this.loading = false;
        console.error(err);
      }
    });
  }
  onSubmit(): void {
    this.submitted = true;

    if (this.categoryForm.invalid) return;

    this.loading = true;

    const categoryData: Partial<Category> = {
      category_id: this.isEditMode ? this.categoryId! : this.categoryForm.value.category_id,
      name: this.categoryForm.value.name,
      last_update: new Date()
    };

    if (this.isEditMode && this.categoryId) {
      categoryData.category_id = this.categoryId; 
      this.categoryService.updateCategory(categoryData as Category).subscribe({
        next: () => {
          this.router.navigate(['/categories']);
        },
        error: (err) => {
          this.error = 'Kategori güncellenirken bir hata oluştu';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      categoryData.category_id = this.categoryForm.value.category_id;
      this.categoryService.createCategory(categoryData as Category).subscribe({
        next: () => {
          this.router.navigate(['/categories']);
        },
        error: (err) => {
          this.error = 'Kategori oluşturulurken bir hata oluştu';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  get f() {
    return this.categoryForm.controls;
  }

}
