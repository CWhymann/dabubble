import { Component, computed, signal } from '@angular/core';
import { DEV_CHANNEL, DEV_CHANNEL_MEMBERS } from '../../core/channels';
import { ChatUser, DM_USERS, USERS } from '../../core/users';
import { AddChannel, NewChannel } from '../../features/add-channel/add-channel';
import { AddMembers } from '../../features/add-members/add-members';
import { ChatHeader } from '../../features/chat-header/chat-header';
import { ChatMessages } from '../../features/chat-messages/chat-messages';
import { DmHeader } from '../../features/dm-header/dm-header';
import { DmIntro } from '../../features/dm-intro/dm-intro';
import { MessageBox } from '../../features/message-box/message-box';
import { MobileMenu } from '../../features/mobile-menu/mobile-menu';
import { NavToggle } from '../../features/nav-toggle/nav-toggle';
import { OtherProfile } from '../../features/other-profile/other-profile';
import { ProfileEdit } from '../../features/profile-edit/profile-edit';
import { ProfileMenu } from '../../features/profile-menu/profile-menu';
import { ProfileView } from '../../features/profile-view/profile-view';
import { SearchBar } from '../../features/search-bar/search-bar';
import { Thread } from '../../features/thread/thread';
import { WorkspaceMenu } from '../../features/workspace-menu/workspace-menu';
import { Logo } from '../../shared/logo/logo';

type MobileView = 'menu' | 'chat' | 'thread';

@Component({
  selector: 'app-home',
  imports: [
    AddChannel,
    AddMembers,
    ChatHeader,
    ChatMessages,
    DmHeader,
    DmIntro,
    Logo,
    MessageBox,
    MobileMenu,
    NavToggle,
    OtherProfile,
    ProfileEdit,
    ProfileMenu,
    ProfileView,
    SearchBar,
    Thread,
    WorkspaceMenu,
  ],
  templateUrl: './home.html',
})
export class Home {
  private readonly ownAuthor = 'Frederik Beck';

  protected readonly ownName = signal('Frederik Beck');
  protected readonly channels = signal<string[]>([DEV_CHANNEL]);
  protected readonly activeChannel = signal<string | null>(DEV_CHANNEL);
  protected readonly activeDm = signal<ChatUser | null>(null);
  protected readonly channelMembers = signal<Record<string, string[]>>({
    [DEV_CHANNEL]: DEV_CHANNEL_MEMBERS,
  });
  protected readonly mobileView = signal<MobileView>('menu');
  protected readonly menuOpen = signal(true);
  protected readonly threadOpen = signal(true);
  protected readonly profileOpen = signal(false);
  protected readonly profileEditOpen = signal(false);
  protected readonly addChannelOpen = signal(false);
  protected readonly pendingChannel = signal<NewChannel | null>(null);
  protected readonly otherProfile = signal<ChatUser | null>(null);

  protected readonly activeMembers = computed(() => {
    const channel = this.activeChannel();
    return channel ? (this.channelMembers()[channel] ?? []) : [];
  });

  protected readonly messagePlaceholder = computed(() => {
    const user = this.activeDm();
    return user ? `Nachricht an ${user.name}` : `Nachricht an #${this.activeChannel() ?? ''}`;
  });

  protected readonly gridCols = computed(() => {
    if (this.menuOpen()) {
      return this.threadOpen()
        ? 'lg:grid-cols-[22.875rem_minmax(0,1fr)] thread:grid-cols-[22.875rem_minmax(0,1fr)_30.3125rem]'
        : 'lg:grid-cols-[22.875rem_minmax(0,1fr)]';
    }
    return this.threadOpen()
      ? 'lg:grid-cols-[minmax(0,1fr)] thread:grid-cols-[minmax(0,1fr)_30.3125rem]'
      : 'lg:grid-cols-[minmax(0,1fr)]';
  });

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected openThread(): void {
    this.threadOpen.set(true);
    this.mobileView.set('thread');
  }

  protected closeThread(): void {
    this.threadOpen.set(false);
    if (this.mobileView() === 'thread') {
      this.mobileView.set('menu');
    }
  }

  protected showMobileMenu(): void {
    this.mobileView.set('menu');
  }

  protected selectChannel(channel: string): void {
    this.activeDm.set(null);
    this.activeChannel.set(channel);
    this.mobileView.set('chat');
    if (channel !== DEV_CHANNEL) {
      this.threadOpen.set(false);
    }
  }

  protected selectUser(name: string): void {
    const user = DM_USERS.find((candidate) => candidate.name === name);
    if (user) {
      this.activeChannel.set(null);
      this.activeDm.set(user);
      this.threadOpen.set(false);
      this.mobileView.set('chat');
    }
  }

  protected openDmWith(user: ChatUser): void {
    this.selectUser(user.name);
    this.closeOtherProfile();
  }

  protected openProfile(): void {
    this.otherProfile.set(null);
    this.profileEditOpen.set(false);
    this.profileOpen.set(true);
  }

  protected closeProfile(): void {
    this.profileOpen.set(false);
  }

  protected editProfile(): void {
    this.profileOpen.set(false);
    this.profileEditOpen.set(true);
  }

  protected cancelEdit(): void {
    this.profileEditOpen.set(false);
    this.profileOpen.set(true);
  }

  protected saveProfile(name: string): void {
    this.ownName.set(name);
    this.profileEditOpen.set(false);
    this.profileOpen.set(true);
  }

  protected openProfileOf(name: string): void {
    if (name === this.ownAuthor) {
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

  protected openAddChannel(): void {
    this.addChannelOpen.set(true);
  }

  protected closeAddChannel(): void {
    this.addChannelOpen.set(false);
  }

  protected createChannel(channel: NewChannel): void {
    this.addChannelOpen.set(false);
    this.pendingChannel.set(channel);
  }

  protected closeAddMembers(): void {
    this.pendingChannel.set(null);
  }

  protected confirmMembers(names: string[]): void {
    const channel = this.pendingChannel();
    if (channel) {
      this.addChannel(channel.name, names);
      this.selectChannel(channel.name);
    }
    this.closeAddMembers();
  }

  private addChannel(name: string, names: string[]): void {
    if (this.channels().includes(name)) {
      return;
    }
    const members = [this.ownAuthor, ...names.filter((member) => member !== this.ownAuthor)];
    this.channels.update((list) => [...list, name]);
    this.channelMembers.update((map) => ({ ...map, [name]: members }));
  }
}
