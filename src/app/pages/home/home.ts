import { Component } from '@angular/core';
import { ChatHeader } from '../../features/chat-header/chat-header';
import { ChatMessages } from '../../features/chat-messages/chat-messages';
import { MessageBox } from '../../features/message-box/message-box';
import { ProfileMenu } from '../../features/profile-menu/profile-menu';
import { SearchBar } from '../../features/search-bar/search-bar';
import { Thread } from '../../features/thread/thread';
import { WorkspaceMenu } from '../../features/workspace-menu/workspace-menu';
import { Logo } from '../../shared/logo/logo';

@Component({
  selector: 'app-home',
  imports: [
    ChatHeader,
    ChatMessages,
    Logo,
    MessageBox,
    ProfileMenu,
    SearchBar,
    Thread,
    WorkspaceMenu,
  ],
  templateUrl: './home.html',
})
export class Home {}
