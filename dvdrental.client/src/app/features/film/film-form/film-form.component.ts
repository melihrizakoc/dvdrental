import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Film } from '../../../models/film.model';
import { FilmService } from '../../../services/film.service';

@Component({
  selector: 'app-film-form',
  standalone: false,
  templateUrl: './film-form.component.html',
  styleUrl: './film-form.component.scss'
})
export class FilmFormComponent implements OnInit {
  filmForm: FormGroup;
  isEditMode = false;
  filmId?: number;
  loading = false;
  submitted = false;
  error: string | null = null;

  ratingOptions = ['G', 'PG', 'PG-13', 'R', 'NC-17'];

  constructor(
    private fb: FormBuilder,
    private filmService: FilmService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.filmForm = this.fb.group({
      film_id: ['', [Validators.required, Validators.min(1)]],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', Validators.maxLength(1000)],
      release_year: ['', [Validators.min(1900), Validators.max(new Date().getFullYear())]],
      language_id: [1, Validators.required],
      rental_duration: [3, [Validators.required, Validators.min(1)]],
      rental_rate: [4.99, [Validators.required, Validators.min(0)]],
      length: ['90', [Validators.min(1)]],
      replacement_cost: [19.99, [Validators.required, Validators.min(0)]],
      rating: ['PG-13', Validators.required],
      special_features: [[]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.filmId = +params['id'];
        this.loadFilm(this.filmId);
      }
    });
  }

  loadFilm(id: number): void {
    this.loading = true;
    this.filmService.getFilm(id).subscribe({
      next: (film) => {
        this.filmForm.patchValue({
          film_id: film.film_id,
          title: film.title,
          description: film.description,
          release_year: film.release_year,
          language_id: film.language_id,
          rental_duration: film.rental_duration,
          rental_rate: film.rental_rate,
          length: film.length,
          replacement_cost: film.replacement_cost,
          rating: film.rating,
          special_features: film.special_features || []
        });
        this.filmForm.get('film_id')?.disable();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Film bilgileri yüklenirken bir hata oluştu';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.filmForm.invalid) {
      return;
    }
    
    this.loading = true;
    const filmData: Partial<Film> = {
      title: this.filmForm.value.title,
      description: this.filmForm.value.description,
      release_year: this.filmForm.value.release_year,
      language_id: this.filmForm.value.language_id,
      rental_duration: this.filmForm.value.rental_duration,
      rental_rate: this.filmForm.value.rental_rate,
      length: this.filmForm.value.length,
      replacement_cost: this.filmForm.value.replacement_cost,
      rating: this.filmForm.value.rating,
      special_features: this.filmForm.value.special_features?.length ? this.filmForm.value.special_features : null,
      last_update: new Date()
    };
    
    if (this.isEditMode && this.filmId) {
      filmData.film_id = this.filmId;
      this.filmService.updateFilm(filmData as Film).subscribe({
        next: () => {
          this.router.navigate(['/films']);
        },
        error: (err) => {
          this.error = 'Film güncellenirken bir hata oluştu';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      filmData.film_id = this.filmForm.value.film_id;
      this.filmService.createFilm(filmData as Film).subscribe({
        next: () => {
          this.router.navigate(['/films']);
        },
        error: (err) => {
          this.error = 'Film eklenirken bir hata oluştu';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  get f() {
    return this.filmForm.controls;
  }
}
