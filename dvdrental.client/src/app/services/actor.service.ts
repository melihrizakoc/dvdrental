import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Actor } from '../models/actor.model';

@Injectable({
  providedIn: 'root'
})
export class ActorService {
  private apiUrl = '/api/Actor';

  constructor(private http: HttpClient) { }

  getActors(): Observable<Actor[]> {
    return this.http.get<Actor[]>(this.apiUrl);
  }

  getActor(id: number): Observable<Actor> {
    return this.http.get<Actor>(`${this.apiUrl}/${id}`);
  }

  createActor(actor: Actor): Observable<Actor> {
    return this.http.post<Actor>(this.apiUrl, actor);
  }

  updateActor(actor: Actor): Observable<Actor> {
    return this.http.put<Actor>(`${this.apiUrl}/${actor.actor_id}`, actor);
  }

  deleteActor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
