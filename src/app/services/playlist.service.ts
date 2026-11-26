import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Playlist } from '../models/playlist';
import { Song } from '../models/song';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  private apiUrl = `${environment.apiBaseUrl}/api/playlists`;

  constructor(private http: HttpClient) { }

  getAllPlaylists(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(this.apiUrl);
  }

  getPlaylistById(id: number): Observable<Playlist> {
    return this.http.get<Playlist>(`${this.apiUrl}/${id}`);
  }

  createPlaylist(playlist: Playlist): Observable<Playlist> {
    return this.http.post<Playlist>(this.apiUrl, playlist);
  }

  updatePlaylist(id: number, playlist: Playlist): Observable<Playlist> {
    return this.http.put<Playlist>(`${this.apiUrl}/${id}`, playlist);
  }

  deletePlaylist(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addSongToPlaylist(playlistId: number, songId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${playlistId}/songs/${songId}`, {});
  }

  removeSongFromPlaylist(playlistId: number, songId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${playlistId}/songs/${songId}`);
  }

  shufflePlaylist(playlistId: number, type: string): Observable<Playlist> {
    return this.http.post<Playlist>(
      `${this.apiUrl}/${playlistId}/shuffle?type=${type}`,
      {}
    );
  }

  getRecommendations(playlistId: number): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.apiUrl}/${playlistId}/recommendations`);
  }

  exportPlaylist(playlistId: number, format: string): Observable<string> {
    return this.http.get(
      `${this.apiUrl}/${playlistId}/export?format=${format}`,
      { responseType: 'text' }
    );
  }
}