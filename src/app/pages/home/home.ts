import { Component, computed, signal } from '@angular/core';
import { ChatUser, USERS } from '../../core/users';
import { ChatHeader } from '../../features/chat-header/chat-header';
import { ChatMessages } from '../../features/chat-messages/chat-messages';
import { MessageBox } from '../../features/message-box/message-box';
import { NavToggle } from '../../features/nav-toggle/nav-toggle';
import { OtherProfile } from '../../features/other-profile/other-profile';
import { ProfileMenu } from '../../features/profile-menu/profile-menu';
import { ProfileView } from '../../features/profile-view/profile-view';
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
    NavToggle,
    OtherProfile,
    ProfileMenu,
    ProfileView,
    SearchBar,
    Thread,
    WorkspaceMenu,
  ],
  templateUrl: './home.html',
})
export class Home {
  private readonly ownName = 'Frederik Beck';

  protected readonly menuOpen = signal(true);
  protected readonly threadOpen = signal(true);
  protected readonly profileOpen = signal(false);
  protected readonly otherProfile = signal<ChatUser | null>(null);

  protected readonly gridCols = computed(() => {
    if (this.menuOpen()) {
      return this.threadOpen()
        ? 'lg:grid-cols-[22.875rem_minmax(0,1fr)] 2xl:grid-cols-[22.875rem_minmax(0,1fr)_30.3125rem]'
        : 'lg:grid-cols-[22.875rem_minmax(0,1fr)]';
    }
    return this.threadOpen()
      ? 'lg:grid-cols-[minmax(0,1fr)] 2xl:grid-cols-[minmax(0,1fr)_30.3125rem]'
      : 'lg:grid-cols-[minmax(0,1fr)]';
  });

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected openThread(): void {
    this.threadOpen.set(true);
  }

  protected closeThread(): void {
    this.threadOpen.set(false);
  }

  protected openProfile(): void {
    this.otherProfile.set(null);
    this.profileOpen.set(true);
  }

  protected closeProfile(): void {
    this.profileOpen.set(false);
  }

  protected openProfileOf(name: string): void {
    if (name === this.ownName) {
      this.openProfile();
      return;
    }
    const user = USERS.find((candidate) => candidate.name === name);
    if (user) {
      this.profileOpen.set(false);
      this.otherProfile.set(user);
    }
  }

  protected closeOtherProfile(): void {
    this.otherProfile.set(null);
  }
}
