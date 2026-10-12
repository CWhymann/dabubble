import { Component, computed, inject, signal } from '@angular/core';
import type { User } from '@supabase/supabase-js';
import { Auth } from '../../core/auth';
import {
  DEV_CHANNEL,
  DEV_CHANNEL_CREATOR,
  DEV_CHANNEL_DESCRIPTION,
  DEV_CHANNEL_MEMBERS,
} from '../../core/channels';
import { ChatStore } from '../../core/chat-store';
import { SearchHit } from '../../core/search';
import { ChatUser, DM_USERS, USERS } from '../../core/users';
import { AddChannel, NewChannel } from '../../features/add-channel/add-channel';
import { AddChannelMembers } from '../../features/add-channel-members/add-channel-members';
import { AddMembers } from '../../features/add-members/add-members';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';
import { ChatHeader } from '../../features/chat-header/chat-header';
import { ChannelEdit, ChannelEdition } from '../../features/channel-edition/channel-edition';
import { ChatMessages } from '../../features/chat-messages/chat-messages';
import { DmHeader } from '../../features/dm-header/dm-header';
import { DmIntro } from '../../features/dm-intro/dm-intro';
import { MessageBox } from '../../features/message-box/message-box';
import { MobileMenu } from '../../features/mobile-menu/mobile-menu';
import { NavToggle } from '../../features/nav-toggle/nav-toggle';
import { NewMessage } from '../../features/new-message/new-message';
import { OtherProfile } from '../../features/other-profile/other-profile';
import { ProfileEdit } from '../../features/profile-edit/profile-edit';
import { ProfileMenu } from '../../features/profile-menu/profile-menu';
import { ProfileView } from '../../features/profile-view/profile-view';
import { SearchBar } from '../../features/search-bar/search-bar';
import { Thread } from '../../features/thread/thread';
import { WorkspaceMenu } from '../../features/workspace-menu/workspace-menu';
import { Logo } from '../../shared/logo/logo';

type MobileView = 'menu' | 'chat' | 'thread';

interface ChannelMeta {
  description: string;
  creator: string;
}

function renameKey<T>(map: Record<string, T>, from: string, to: string): Record<string, T> {
  const { [from]: value, ...rest } = map;
  return value === undefined ? rest : { ...rest, [to]: value };
}

@Component({
  selector: 'app-home',
  imports: [
    AddChannel,
    AddChannelMembers,
    AddMembers,
    ChatHeader,
    ChannelEdition,
    ChatMessages,
    ConfirmDialog,
    DmHeader,
    DmIntro,
    Logo,
    MessageBox,
    MobileMenu,
    NavToggle,
    NewMessage,
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
  private readonly store = inject(ChatStore);
  private readonly auth = inject(Auth);

  private readonly authorName = signal<string | null>(null);

  constructor() {
    void this.loadAuthor();
  }

  protected readonly ownName = signal('Frederik Beck');
  protected readonly channels = signal<string[]>([DEV_CHANNEL]);
  protected readonly activeChannel = signal<string | null>(DEV_CHANNEL);
  protected readonly activeDm = signal<ChatUser | null>(null);
  protected readonly threadRootId = signal<string | null>('noah-root');
  protected readonly channelMembers = signal<Record<string, string[]>>({
    [DEV_CHANNEL]: DEV_CHANNEL_MEMBERS,
  });
  protected readonly channelMeta = signal<Record<string, ChannelMeta>>({
    [DEV_CHANNEL]: { description: DEV_CHANNEL_DESCRIPTION, creator: DEV_CHANNEL_CREATOR },
  });
  protected readonly channelEditOpen = signal(false);
  protected readonly channelMembersOpen = signal(false);
  protected readonly leaveConfirmOpen = signal(false);
  protected readonly newMessageOpen = signal(false);
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

  protected readonly activeChannelMeta = computed<ChannelMeta>(() => {
    const channel = this.activeChannel();
    return (channel && this.channelMeta()[channel]) || { description: '', creator: '' };
  });

  protected readonly activeChatKey = computed(() => {
    const dm = this.activeDm();
    return dm ? `dm:${dm.name}` : this.activeChannel();
  });

  protected readonly messagePlaceholder = computed(() => {
    const dm = this.activeDm();
    return dm ? `Nachricht an ${dm.name}` : `Nachricht an #${this.activeChannel() ?? ''}`;
  });

  protected readonly mainClass = computed(
    () =>
      ({
        chat: 'flex lg:flex',
        menu: 'hidden lg:flex',
        thread: 'hidden thread:flex',
      })[this.mobileView()],
  );

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

  protected sendMessage(text: string): void {
    const key = this.activeChatKey();
    if (key) {
      this.store.send(key, text, this.authorName() ?? this.ownName());
    }
  }

  protected sendReply(text: string): void {
    const rootId = this.threadRootId();
    if (rootId) {
      this.store.reply(rootId, text, this.authorName() ?? this.ownName());
    }
  }

  private async loadAuthor(): Promise<void> {
    const { user } = await this.auth.getUser();
    if (user) {
      this.authorName.set(this.nameOf(user));
    }
  }

  private nameOf(user: User): string {
    if (user.is_anonymous) {
      return 'Gast';
    }
    const name = user.user_metadata?.['name'];
    if (typeof name === 'string' && name.trim()) {
      return name.trim();
    }
    return user.email?.split('@')[0] ?? 'Gast';
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected openNewMessage(): void {
    this.newMessageOpen.set(true);
  }

  protected closeNewMessage(): void {
    this.newMessageOpen.set(false);
  }

  protected openRecipient(hit: SearchHit): void {
    this.closeNewMessage();
    if (hit.kind === 'channel') {
      this.selectChannel(hit.name);
    } else {
      this.selectUser(hit.user.name);
    }
  }

  protected openChannelEdit(): void {
    this.channelEditOpen.set(true);
  }

  protected closeChannelEdit(): void {
    this.channelEditOpen.set(false);
  }

  protected openChannelMembers(): void {
    this.channelMembersOpen.set(true);
  }

  protected closeChannelMembers(): void {
    this.channelMembersOpen.set(false);
  }

  protected addChannelMembers(names: string[]): void {
    const channel = this.activeChannel();
    if (channel) {
      this.channelMembers.update((map) => {
        const current = map[channel] ?? [];
        return {
          ...map,
          [channel]: [...current, ...names.filter((name) => !current.includes(name))],
        };
      });
    }
    this.closeChannelMembers();
  }

  protected requestLeaveChannel(): void {
    this.leaveConfirmOpen.set(true);
  }

  protected closeLeaveConfirm(): void {
    this.leaveConfirmOpen.set(false);
  }

  protected leaveChannel(): void {
    this.leaveConfirmOpen.set(false);
    const channel = this.activeChannel();
    if (!channel) {
      return;
    }
    this.channelMembers.update((map) => ({
      ...map,
      [channel]: (map[channel] ?? []).filter((member) => member !== this.ownAuthor),
    }));
    this.closeChannelEdit();
  }

  protected saveChannel(edit: ChannelEdit): void {
    const old = this.activeChannel();
    if (!old) {
      return;
    }
    const name = edit.name.trim();
    const newName = name && (name === old || !this.channels().includes(name)) ? name : old;
    const meta = this.channelMeta()[old] ?? { description: '', creator: this.ownAuthor };
    this.channels.update((list) => list.map((channel) => (channel === old ? newName : channel)));
    this.channelMembers.update((map) => renameKey(map, old, newName));
    this.channelMeta.update((map) => ({
      ...renameKey(map, old, newName),
      [newName]: { ...meta, description: edit.description },
    }));
    this.activeChannel.set(newName);
  }

  protected openThread(rootId: string): void {
    this.threadRootId.set(rootId);
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
    this.channelMeta.update((map) => ({
      ...map,
      [name]: { description: '', creator: this.ownAuthor },
    }));
  }
}
