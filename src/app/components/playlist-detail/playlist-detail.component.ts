import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Playlist } from '../../models/playlist';
import { Song } from '../../models/song';
import { PlayerState } from '../../models/player-state';
import { PlaylistService } from '../../services/playlist.service';
import { SongService } from '../../services/song.service';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.css']
})
export class PlaylistDetailComponent implements OnInit {

  playlist?: Playlist;
  allSongs: Song[] = [];
  recommendations: Song[] = [];
  playerState?: PlayerState;

  playlistId!: number;
  loading = false;
  errorMessage = '';
  infoMessage = '';

  shuffleType = 'RANDOM';
  shuffleTypes = ['RANDOM', 'SMART', 'GENRE_BALANCED'];

  exportFormat = 'JSON';
  exportFormats = ['JSON', 'M3U'];

  selectedSongId?: number;

  constructor(
    private playlistService: PlaylistService,
    private songService: SongService,
    private playerService: PlayerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.playlistId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPlaylist();
    this.loadAllSongs();
    this.refreshPlayerState();
  }

  loadPlaylist(): void {
    this.loading = true;
    this.playlistService.getPlaylistById(this.playlistId).subscribe({
      next: (data) => {
        this.playlist = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load playlist.';
        this.loading = false;
      }
    });
  }

  loadAllSongs(): void {
    this.songService.getAllSongs().subscribe({
      next: (data) => { this.allSongs = data; },
      error: () => {}
    });
  }

  // Songs not already in the playlist
  get addableSongs(): Song[] {
    const ids = new Set((this.playlist?.songs || []).map(s => s.id));
    return this.allSongs.filter(s => !ids.has(s.id));
  }

  addSong(songId: number | undefined): void {
    if (songId === undefined) {
      return;
    }
    this.playlistService.addSongToPlaylist(this.playlistId, songId).subscribe({
      next: () => {
        this.infoMessage = 'Song added to the playlist.';
        this.selectedSongId = undefined;
        this.loadPlaylist();
      },
      error: () => { this.errorMessage = 'Unable to add the song.'; }
    });
  }

  removeSong(songId: number | undefined): void {
    if (songId === undefined) {
      return;
    }
    this.playlistService.removeSongFromPlaylist(this.playlistId, songId).subscribe({
      next: () => {
        this.infoMessage = 'Song removed from the playlist.';
        this.loadPlaylist();
      },
      error: () => { this.errorMessage = 'Unable to remove the song.'; }
    });
  }

  shuffle(): void {
    this.playlistService.shufflePlaylist(this.playlistId, this.shuffleType).subscribe({
      next: (data) => {
        this.playlist = data;
        this.infoMessage = `Playlist shuffled (${this.shuffleType}).`;
      },
      error: () => { this.errorMessage = 'Unable to shuffle the playlist.'; }
    });
  }

  loadRecommendations(): void {
    this.playlistService.getRecommendations(this.playlistId).subscribe({
      next: (data) => {
        this.recommendations = data;
        if (data.length === 0) {
          this.infoMessage = 'No recommendation available for now.';
        }
      },
      error: () => { this.errorMessage = 'Unable to load recommendations.'; }
    });
  }

  export(): void {
    this.playlistService.exportPlaylist(this.playlistId, this.exportFormat).subscribe({
      next: (content) => this.downloadFile(content, this.exportFormat),
      error: () => { this.errorMessage = 'Unable to export the playlist.'; }
    });
  }

  private downloadFile(content: string, format: string): void {
    const ext = format.toLowerCase() === 'm3u' ? 'm3u' : 'json';
    const mime = ext === 'm3u' ? 'audio/x-mpegurl' : 'application/json';
    const blob = new Blob([content], { type: mime });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `playlist-${this.playlistId}.${ext}`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  // ----- Player -----
  playPlaylist(): void {
    this.playerService.play(this.playlistId).subscribe({
      next: (state) => { this.playerState = state; },
      error: () => { this.errorMessage = 'Unable to start playback.'; }
    });
  }

  pause(): void {
    this.playerService.pause().subscribe({
      next: (state) => { this.playerState = state; },
      error: () => {}
    });
  }

  resume(): void {
    this.playerService.resume().subscribe({
      next: (state) => { this.playerState = state; },
      error: () => {}
    });
  }

  refreshPlayerState(): void {
    this.playerService.getState().subscribe({
      next: (state) => { this.playerState = state; },
      error: () => {}
    });
  }

  songLabel(songId?: number): string {
    const song = this.allSongs.find(s => s.id === songId);
    return song ? `${song.title} - ${song.artist}` : '—';
  }
}
