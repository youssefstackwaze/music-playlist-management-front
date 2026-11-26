import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PlayerState } from '../models/player-state';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private apiUrl = `${environment.apiBaseUrl}/api/player`;

  constructor(private http: HttpClient) { }

  play(playlistId: number): Observable<PlayerState> {
    return this.http.post<PlayerState>(`${this.apiUrl}/play/${playlistId}`, {});
  }

  pause(): Observable<PlayerState> {
    return this.http.post<PlayerState>(`${this.apiUrl}/pause`, {});
  }

  resume(): Observable<PlayerState> {
    return this.http.post<PlayerState>(`${this.apiUrl}/resume`, {});
  }

  getState(): Observable<PlayerState> {
    return this.http.get<PlayerState>(`${this.apiUrl}/state`);
  }
}
