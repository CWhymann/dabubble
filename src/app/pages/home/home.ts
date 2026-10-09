import { Component } from '@angular/core';
import { ChatHeader } from '../../features/chat-header/chat-header';
import { ChatMessages } from '../../features/chat-messages/chat-messages';
import { ProfileMenu } from '../../features/profile-menu/profile-menu';
import { SearchBar } from '../../features/search-bar/search-bar';
import { WorkspaceMenu } from '../../features/workspace-menu/workspace-menu';
import { Logo } from '../../shared/logo/logo';

@Component({
  selector: 'app-home',
  imports: [ChatHeader, ChatMessages, Logo, ProfileMenu, SearchBar, WorkspaceMenu],
  templateUrl: './home.html',
})
export class Home {}
