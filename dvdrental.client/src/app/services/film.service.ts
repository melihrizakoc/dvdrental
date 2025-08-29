import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Film } from '../models/film.model';

@Injectable({
  providedIn: 'root'
})
export class FilmService {
  private apiUrl = '/api/Film';

  constructor(private http: HttpClient) { }

  getFilms(): Observable<Film[]> {
    return this.http.get<Film[]>(this.apiUrl);
  }

  getFilm(id: number): Observable<Film> {
    return this.http.get<Film>(`${this.apiUrl}/${id}`);
  }

  createFilm(film: Film): Observable<Film> {
    return this.http.post<Film>(this.apiUrl, film);
  }

  updateFilm(film: Film): Observable<Film> {
    return this.http.put<Film>(`${this.apiUrl}/${film.film_id}`, film);
  }

  deleteFilm(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
