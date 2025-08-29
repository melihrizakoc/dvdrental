import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actor } from '../../../models/actor.model';
import { ActorService } from '../../../services/actor.service';

@Component({
  selector: 'app-actor-list',
  standalone: false,
  templateUrl: './actor-list.component.html',
  styleUrl: './actor-list.component.scss'
})
export class ActorListComponent implements OnInit {
  allActors: Actor[] = [];
  filteredActors: Actor[] = [];
  actors: Actor[] = [];
  loading = false;
  error: string | null = null;

  // Search properties
  searchTerm: string = '';
  searchFields = [
    { value: 'all', label: 'Tümü' },
    { value: 'first_name', label: 'Ad' },
    { value: 'last_name', label: 'Soyad' },
    { value: 'full_name', label: 'Ad Soyad' }
  ];
  selectedSearchField = 'all';

  // Pagination properties
  currentPage = 1;
  pageSize = 20;
  totalItems = 0;
  totalPages = 0;

  constructor(private actorService: ActorService, private router: Router) { }

  ngOnInit(): void {
    this.loadActors();
  }

  loadActors(): void {
    this.loading = true;
    this.error = null;

    this.actorService.getActors().subscribe({
      next: (data) => {
        this.allActors = data;
        this.applySearch();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Aktörler yüklenirken bir hata oluştu';
        this.loading = false;
        console.error(err);
      }
    });
  }

  applySearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredActors = [...this.allActors];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase().trim();

      this.filteredActors = this.allActors.filter(actor => {
        const fullName = `${actor.first_name} ${actor.last_name}`.toLowerCase();

        switch (this.selectedSearchField) {
          case 'first_name':
            return actor.first_name?.toLowerCase().includes(searchTermLower);
          case 'last_name':
            return actor.last_name?.toLowerCase().includes(searchTermLower);
          case 'full_name':
            return fullName.includes(searchTermLower);
          case 'all':
          default:
            return (
              actor.first_name?.toLowerCase().includes(searchTermLower) ||
              actor.last_name?.toLowerCase().includes(searchTermLower) ||
              fullName.includes(searchTermLower) ||
              actor.actor_id?.toString().includes(searchTermLower)
            );
        }
      });
    }

    this.totalItems = this.filteredActors.length;
    this.currentPage = 1;
    this.calculatePagination();
    this.updateDisplayedActors();
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

  updateDisplayedActors(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.actors = this.filteredActors.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.updateDisplayedActors();
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
    this.updateDisplayedActors();
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

  editActor(id: number): void {
    this.router.navigate(['/actors/edit', id]);
  }

  deleteActor(id: number): void {
    if (confirm('Bu aktörü silmek istediğinizden emin misiniz?')) {
      this.actorService.deleteActor(id).subscribe({
        next: () => {
          this.loadActors(); // Tüm veriyi tekrar yükle
        },
        error: (err) => {
          this.error = 'Aktör silinirken bir hata oluştu';
          console.error(err);
        }
      });
    }
  }

  createActor(): void {
    this.router.navigate(['/actors/new']);
  }
}
