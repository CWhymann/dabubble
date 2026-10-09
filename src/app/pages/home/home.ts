import { Component } from '@angular/core';
import { ProfileMenu } from '../../features/profile-menu/profile-menu';
import { SearchBar } from '../../features/search-bar/search-bar';
import { Logo } from '../../shared/logo/logo';

@Component({
  selector: 'app-home',
  imports: [Logo, ProfileMenu, SearchBar],
  templateUrl: './home.html',
})
export class Home {}
