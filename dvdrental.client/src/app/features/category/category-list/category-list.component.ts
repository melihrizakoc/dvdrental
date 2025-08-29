import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-category-list',
  standalone: false,
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit {
  allCategories: Category[] = [];
  filteredCategories: Category[] = [];
  categories: Category[] = [];
  loading = false;
  error: string | null = null;

  // Search properties
  searchTerm: string = '';
  searchFields = [
    { value: 'all', label: 'Tümü' },
    { value: 'name', label: 'Kategori Adı' },
    { value: 'category_id', label: 'ID' }
  ];
  selectedSearchField = 'all';

  // Pagination properties
  currentPage = 1;
  pageSize = 20;
  totalItems = 0;
  totalPages = 0;

  constructor(private categoryService: CategoryService, private router: Router) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = null;

    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.allCategories = data;
        this.applySearch();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Kategoriler yüklenirken bir hata oluştu';
        this.loading = false;
        console.error(err);
      }
    });
  }

  applySearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCategories = [...this.allCategories];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase().trim();

      this.filteredCategories = this.allCategories.filter(category => {
        switch (this.selectedSearchField) {
          case 'name':
            return category.name?.toLowerCase().includes(searchTermLower);
          case 'category_id':
            return category.category_id?.toString().includes(searchTermLower);
          case 'all':
          default:
            return (
              category.name?.toLowerCase().includes(searchTermLower) ||
              category.category_id?.toString().includes(searchTermLower)
            );
        }
      });
    }

    this.totalItems = this.filteredCategories.length;
    this.currentPage = 1;
    this.calculatePagination();
    this.updateDisplayedCategories();
  }

  onSearchChange(): void {
    this.applySearch();
  }

  onSearchFieldChange(): void {
    this.applySearch();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.selectedSearchField = 'all';
    this.applySearch();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = 1;
    }
  }

  updateDisplayedCategories(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.categories = this.filteredCategories.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.updateDisplayedCategories();
    }
  }

  goToFirstPage(): void {
    this.goToPage(1);
  }

  goToLastPage(): void {
    this.goToPage(this.totalPages);
  }

  goToPreviousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  goToNextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  changePageSize(newPageSize: number): void {
    this.pageSize = newPageSize;
    this.currentPage = 1;
    this.calculatePagination();
    this.updateDisplayedCategories();
  }

  get pages(): number[] {
    const pages = [];
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  get startItem(): number {
    return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  get isSearchActive(): boolean {
    return this.searchTerm.trim().length > 0;
  }

  highlightSearchTerm(text: string, searchTerm: string): string {
    if (!text || !searchTerm.trim()) {
      return text;
    }

    const regex = new RegExp(`(${searchTerm.trim()})`, 'gi');
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  editCategory(id: number): void {
    this.router.navigate(['/categories/edit', id]);
  }

  deleteCategory(id: number): void {
    if (confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories(); // Tüm veriyi tekrar yükle
        },
        error: (err) => {
          this.error = 'Kategori silinirken bir hata oluştu';
          console.error(err);
        }
      });
    }
  }

  createCategory(): void {
    this.router.navigate(['/categories/new']);
  }
}
