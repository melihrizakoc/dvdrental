import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Film } from '../../../models/film.model';
import { FilmService } from '../../../services/film.service';

@Component({
  selector: 'app-film-list',
  standalone: false,
  templateUrl: './film-list.component.html',
  styleUrl: './film-list.component.scss'
})
export class FilmListComponent implements OnInit {
  allFilms: Film[] = [];
  filteredFilms: Film[] = [];
  films: Film[] = [];
  loading = false;
  error: string | null = null;

  // Search properties
  searchTerm: string = '';
  searchFields = [
    { value: 'all', label: 'Tümü' },
    { value: 'title', label: 'Film Adı' },
    { value: 'release_year', label: 'Yayın Yılı' },
    { value: 'rating', label: 'Kategori' },
    { value: 'description', label: 'Açıklama' }
  ];
  selectedSearchField = 'all';

  // Pagination properties
  currentPage = 1;
  pageSize = 20;
  totalItems = 0;
  totalPages = 0;

  constructor(private filmService: FilmService, private router: Router) { }

  ngOnInit(): void {
    this.loadFilms();
  }

  loadFilms(): void {
    this.loading = true;
    this.error = null;

    this.filmService.getFilms().subscribe({
      next: (data) => {
        this.allFilms = data;
        this.applySearch();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Filmler yüklenirken bir hata oluştu';
        this.loading = false;
        console.error(err);
      }
    });
  }

  applySearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredFilms = [...this.allFilms];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase().trim();

      this.filteredFilms = this.allFilms.filter(film => {
        switch (this.selectedSearchField) {
          case 'title':
            return film.title?.toLowerCase().includes(searchTermLower);
          case 'release_year':
            return film.release_year?.toString().includes(searchTermLower);
          case 'rating':
            return film.rating?.toLowerCase().includes(searchTermLower);
          case 'description':
            return film.description?.toLowerCase().includes(searchTermLower);
          case 'all':
          default:
            return (
              film.title?.toLowerCase().includes(searchTermLower) ||
              film.release_year?.toString().includes(searchTermLower) ||
              film.rating?.toLowerCase().includes(searchTermLower) ||
              film.description?.toLowerCase().includes(searchTermLower) ||
              film.film_id?.toString().includes(searchTermLower)
            );
        }
      });
    }

    this.totalItems = this.filteredFilms.length;
    this.currentPage = 1;
    this.calculatePagination();
    this.updateDisplayedFilms();
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

  updateDisplayedFilms(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.films = this.filteredFilms.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.updateDisplayedFilms();
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
    this.updateDisplayedFilms();
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

  editFilm(id: number): void {
    this.router.navigate(['/films/edit', id]);
  }

  deleteFilm(id: number): void {
    if (confirm('Bu filmi silmek istediğinizden emin misiniz?')) {
      this.filmService.deleteFilm(id).subscribe({
        next: () => {
          this.loadFilms(); // Tüm veriyi tekrar yükle
        },
        error: (err) => {
          this.error = 'Film silinirken bir hata oluştu';
          console.error(err);
        }
      });
    }
  }

  createFilm(): void {
    this.router.navigate(['/films/new']);
  }

  // Film list component'ine bu metodu ekleyin
  highlightSearchTerm(text: string, searchTerm: string): string {
    if (!text || !searchTerm.trim()) {
      return text;
    }
    
    const regex = new RegExp(`(${searchTerm.trim()})`, 'gi');
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
  }
}
