import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { DEV_CHANNEL } from '../../core/channels';
import { Auth } from '../../core/auth';
import { Presence } from '../../core/presence';
import { Data } from '../../core/data';
import { ChatStore } from '../../core/chat-store';
import { SearchHit } from '../../core/search';
import { ChatUser, DM_USERS, setOwnUser, setUsers, USERS } from '../../core/users';
import { AddChannel, NewChannel } from '../../features/add-channel/add-channel';
import { AddChannelMembers } from '../../features/add-channel-members/add-channel-members';
import { AddMembers } from '../../features/add-members/add-members';
import { ChannelMembers } from '../../features/channel-members/channel-members';
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

@Component({
  selector: 'app-home',
  imports: [
    AddChannel,
    AddChannelMembers,
    AddMembers,
    ChatHeader,
    ChannelEdition,
    ChannelMembers,
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
  private readonly store = inject(ChatStore);
  private readonly auth = inject(Auth);
  private readonly data = inject(Data);
  private readonly presence = inject(Presence);
  protected readonly ownName = signal('');
  protected readonly ownEmail = signal('');
  protected readonly ownAvatar = signal('/icons/avatar-frederik-beck.svg');
  protected readonly memberAvatars = signal<Record<string, string>>({});
  private readonly isAdminAccount = signal(false);

  constructor() {
    void this.loadCurrentProfile();
    const stopWatching = this.data.watchChanges(() => {
      void this.loadMessages();
      void this.loadReplies();
    });
    inject(DestroyRef).onDestroy(() => {
      stopWatching();
      this.presence.stop();
    });
  }

  private get ownAuthor(): string {
    return this.ownName();
  }
  protected readonly channels = signal<string[]>([]);
  protected readonly activeChannel = signal<string | null>(null);
  protected readonly activeDm = signal<ChatUser | null>(null);
  protected readonly threadRootId = signal<string | null>(null);
  protected readonly channelMembers = signal<Record<string, string[]>>({});
  protected readonly channelMeta = signal<Record<string, ChannelMeta>>({});
  protected readonly channelEditOpen = signal(false);
  protected readonly channelMembersOpen = signal(false);
  protected readonly leaveConfirmOpen = signal(false);
  protected readonly membersOpen = signal(false);
  private profileFromMembers = false;
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

  protected readonly isAdmin = computed(() => this.isAdminAccount());

  protected readonly memberNeighbors = computed(() => {
    const current = this.otherProfile()?.name;
    const others = this.activeMembers().filter((name) => name !== this.ownAuthor);
    const index = current ? others.indexOf(current) : -1;
    return {
      previous: index > 0 ? others[index - 1] : null,
      next: index >= 0 && index < others.length - 1 ? others[index + 1] : null,
    };
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

  protected async sendMessage(text: string): Promise<void> {
    const key = this.activeChatKey();
    if (key) {
      await this.data.sendMessage(key, text);
      await this.loadMessages();
    }
  }

  private async loadMessages(): Promise<void> {
    const key = this.activeChatKey();
    if (key) {
      this.store.setMessages(key, await this.data.loadMessages(key));
    }
  }

  protected async sendReply(text: string): Promise<void> {
    const rootId = this.threadRootId();
    if (rootId) {
      await this.data.sendReply(rootId, text);
      await this.loadReplies();
      await this.loadMessages();
    }
  }

  private async loadReplies(): Promise<void> {
    const rootId = this.threadRootId();
    if (rootId) {
      this.store.setReplies(rootId, await this.data.loadReplies(rootId));
    }
  }

  private async loadCurrentProfile(): Promise<void> {
    const profile = await this.auth.getCurrentProfile();
    if (profile) {
      setOwnUser(profile.name, profile.email, profile.avatar);
      this.presence.start(profile.name);
      this.ownName.set(profile.name);
      this.ownEmail.set(profile.email);
      this.ownAvatar.set(profile.avatar);
      this.isAdminAccount.set(profile.isAdmin);
    }
    await this.loadChannels();
  }

  private async loadChannels(): Promise<void> {
    const records = await this.data.loadChannels();
    this.channels.set(records.map((record) => record.name));
    this.channelMembers.set(
      Object.fromEntries(records.map((record) => [record.name, record.members])),
    );
    this.channelMeta.set(
      Object.fromEntries(
        records.map((record) => [
          record.name,
          { description: record.description, creator: record.createdBy },
        ]),
      ),
    );
    const avatars = await this.data.loadAvatars();
    setUsers(avatars);
    this.memberAvatars.set(avatars);
    const first = records.find((record) => record.name === DEV_CHANNEL) ?? records[0];
    this.activeChannel.set(first?.name ?? null);
    await this.loadMessages();
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

  protected openMembers(): void {
    this.membersOpen.set(true);
  }

  protected closeMembers(): void {
    this.membersOpen.set(false);
  }

  protected openChannelMembers(): void {
    this.channelMembersOpen.set(true);
  }

  protected closeChannelMembers(): void {
    this.channelMembersOpen.set(false);
  }

  protected async addChannelMembers(names: string[]): Promise<void> {
    const channel = this.activeChannel();
    if (channel) {
      await this.data.addMembers(channel, names);
      await this.loadChannels();
    }
    this.closeChannelMembers();
  }

  protected requestLeaveChannel(): void {
    this.leaveConfirmOpen.set(true);
  }

  protected closeLeaveConfirm(): void {
    this.leaveConfirmOpen.set(false);
  }

  protected async leaveChannel(): Promise<void> {
    this.leaveConfirmOpen.set(false);
    const channel = this.activeChannel();
    if (!channel) {
      return;
    }
    await this.data.leaveChannel(channel);
    this.store.notify(channel, `${this.ownName()} hat den Channel verlassen.`);
    this.closeChannelEdit();
    await this.loadChannels();
  }

  protected async removeMembers(names: string[]): Promise<void> {
    const channel = this.activeChannel();
    if (!channel || !this.isAdmin()) {
      return;
    }
    await this.data.removeMembers(channel, names);
    for (const name of names) {
      this.store.notify(channel, `${this.ownName()} hat ${name} aus dem Channel entfernt.`);
    }
    await this.loadChannels();
  }

  protected async saveChannel(edit: ChannelEdit): Promise<void> {
    const old = this.activeChannel();
    if (!old) {
      return;
    }
    const name = edit.name.trim();
    const newName = name && (name === old || !this.channels().includes(name)) ? name : old;
    await this.data.updateChannel(old, newName, edit.description);
    await this.loadChannels();
    this.activeChannel.set(newName);
  }

  protected openThread(rootId: string): void {
    this.threadRootId.set(rootId);
    this.threadOpen.set(true);
    this.mobileView.set('thread');
    void this.loadReplies();
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
    void this.loadMessages();
  }

  protected selectUser(name: string): void {
    const user = DM_USERS.find((candidate) => candidate.name === name);
    if (user) {
      this.activeChannel.set(null);
      this.activeDm.set(user);
      this.threadOpen.set(false);
      this.mobileView.set('chat');
      void this.loadMessages();
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

  protected openProfileFromMembers(name: string): void {
    if (window.matchMedia('(max-width: 1023px) and (orientation: portrait)').matches) {
      this.membersOpen.set(false);
      this.profileFromMembers = true;
    }
    this.openProfileOf(name);
  }

  protected closeProfile(): void {
    this.profileOpen.set(false);
    this.returnToMembers();
  }

  private returnToMembers(): void {
    if (this.profileFromMembers) {
      this.profileFromMembers = false;
      this.membersOpen.set(true);
    }
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

  protected showNeighbor(name: string | null): void {
    if (name) {
      this.openProfileOf(name);
    }
  }

  protected closeOtherProfile(): void {
    this.otherProfile.set(null);
    this.returnToMembers();
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

  protected async confirmMembers(names: string[]): Promise<void> {
    const channel = this.pendingChannel();
    if (channel) {
      await this.data.createChannel(channel.name, '');
      await this.data.addMembers(
        channel.name,
        names.filter((name) => name !== this.ownAuthor),
      );
      await this.loadChannels();
      this.selectChannel(channel.name);
    }
    this.closeAddMembers();
  }
}
