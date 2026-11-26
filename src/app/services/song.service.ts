import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Song } from '../models/song';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  private apiUrl = `${environment.apiBaseUrl}/api/songs`;

  constructor(private http: HttpClient) { }

  getAllSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(this.apiUrl);
  }

  getSongById(id: number): Observable<Song> {
    return this.http.get<Song>(`${this.apiUrl}/${id}`);
  }

  createSong(song: Song): Observable<Song> {
  return this.http.post<Song>(this.apiUrl, song);
}

  updateSong(id: number, song: Song): Observable<Song> {
    return this.http.put<Song>(`${this.apiUrl}/${id}`, song);
  }

  deleteSong(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getSongsByArtist(artist: string): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.apiUrl}/artist/${encodeURIComponent(artist)}`);
  }

  getSongsByGenre(genre: string): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.apiUrl}/genre/${encodeURIComponent(genre)}`);
  }

  importSongsFromCsv(): Observable<string> {
    return this.http.post(
      `${environment.apiBaseUrl}/api/batch/import-songs`,
      {},
      { responseType: 'text' }
    );
  }
}