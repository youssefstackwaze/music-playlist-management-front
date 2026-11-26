import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SongListComponent } from './components/song-list/song-list.component';
import { SongFormComponent } from './components/song-form/song-form.component';
import { PlaylistListComponent } from './components/playlist-list/playlist-list.component';
import { PlaylistFormComponent } from './components/playlist-form/playlist-form.component';
import { PlaylistDetailComponent } from './components/playlist-detail/playlist-detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'songs', pathMatch: 'full' },
  { path: 'songs', component: SongListComponent },
  { path: 'songs/new', component: SongFormComponent },
  { path: 'songs/edit/:id', component: SongFormComponent },
  { path: 'playlists', component: PlaylistListComponent },
  { path: 'playlists/new', component: PlaylistFormComponent },
  { path: 'playlists/edit/:id', component: PlaylistFormComponent },
  { path: 'playlists/:id', component: PlaylistDetailComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
