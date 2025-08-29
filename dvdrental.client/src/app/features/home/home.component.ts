import { Component, OnInit } from '@angular/core';
import { FilmService } from '../../services/film.service';
import { ActorService } from '../../services/actor.service';
import { CategoryService } from '../../services/category.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  title = 'DVD Kiralama Sistemi';
  subtitle = 'Hoş Geldiniz';

  // Gerçek istatistikler
  filmCount = 0;
  actorCount = 0;
  categoryCount = 0;
  loading = true;

  statisticsCards = [
    {
      title: 'Filmler',
      icon: 'bi-film',
      color: 'primary',
      route: '/films'
    },
    {
      title: 'Aktörler',
      icon: 'bi-person',
      color: 'success',
      route: '/actors'
    },
    {
      title: 'Kategoriler',
      icon: 'bi-tags',
      color: 'warning',
      route: '/categories'
    }
  ];

  constructor(
    private filmService: FilmService,
    private actorService: ActorService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.loading = true;

    // Tüm servisleri paralel olarak çağır
    forkJoin({
      films: this.filmService.getFilms(),
      actors: this.actorService.getActors(),
      categories: this.categoryService.getCategories()
    }).subscribe({
      next: (data) => {
        this.filmCount = data.films.length;
        this.actorCount = data.actors.length;
        this.categoryCount = data.categories.length;
        this.loading = false;
      },
      error: (err) => {
        console.error('İstatistikler yüklenirken hata oluştu:', err);
        this.loading = false;
      }
    });
  }
}
