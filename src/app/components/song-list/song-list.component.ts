import { Component, OnInit } from '@angular/core';
import { Song } from '../../models/song';
import { SongService } from '../../services/song.service';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})
export class SongListComponent implements OnInit {

  songs: Song[] = [];
  loading = false;
  errorMessage = '';
  infoMessage = '';

  searchTerm = '';
  searchType: 'artist' | 'genre' = 'artist';
  importing = false;

  constructor(private songService: SongService) { }

  ngOnInit(): void {
    this.loadSongs();
  }

  loadSongs(): void {
    this.loading = true;

    this.songService.getAllSongs().subscribe({
      next: (data) => {
        this.songs = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load songs.';
        this.loading = false;
      }
    });
  }

  search(): void {
    const term = this.searchTerm.trim();
    if (!term) {
      this.loadSongs();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const request$ = this.searchType === 'artist'
      ? this.songService.getSongsByArtist(term)
      : this.songService.getSongsByGenre(term);

    request$.subscribe({
      next: (data) => {
        this.songs = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Search failed.';
        this.loading = false;
      }
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.loadSongs();
  }

  importCsv(): void {
    this.importing = true;
    this.errorMessage = '';
    this.infoMessage = '';

    this.songService.importSongsFromCsv().subscribe({
      next: (message) => {
        this.infoMessage = message;
        this.importing = false;
        // The batch job runs asynchronously; reload after a short delay.
        setTimeout(() => this.loadSongs(), 1500);
      },
      error: () => {
        this.errorMessage = 'CSV import failed.';
        this.importing = false;
      }
    });
  }

  deleteSong(id: number | undefined): void {
    if (id === undefined) {
      return;
    }

    if (confirm('Are you sure you want to delete this song?')) {
      this.songService.deleteSong(id).subscribe({
        next: () => {
          this.loadSongs();
        },
        error: () => {
          this.errorMessage = 'Unable to delete song.';
        }
      });
    }
  }
}