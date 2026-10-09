import { Component } from '@angular/core';
import { ProfileMenu } from '../../features/profile-menu/profile-menu';
import { SearchBar } from '../../features/search-bar/search-bar';
import { WorkspaceMenu } from '../../features/workspace-menu/workspace-menu';
import { Logo } from '../../shared/logo/logo';

@Component({
  selector: 'app-home',
  imports: [Logo, ProfileMenu, SearchBar, WorkspaceMenu],
  templateUrl: './home.html',
})
export class Home {}
