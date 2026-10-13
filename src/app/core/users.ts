import { signal } from '@angular/core';

export interface ChatUser {
  name: string;
  avatar: string;
  email: string;
  online: boolean;
}

const onlineNames = signal<string[]>([]);

export const setOnlineNames = (names: string[]): void => {
  onlineNames.set(names);
};

export const OWN_USER: ChatUser = {
  name: '',
  avatar: '/icons/avatar-frederik-beck.svg',
  email: '',
  online: true,
};

const makeUser = (name: string, avatar: string): ChatUser => ({
  name,
  avatar,
  email: '',
  get online(): boolean {
    return onlineNames().includes(name);
  },
});

export const USERS: ChatUser[] = [];

export const DM_USERS: ChatUser[] = [OWN_USER];

export const setOwnUser = (name: string, email: string, avatar: string): void => {
  OWN_USER.name = name;
  OWN_USER.email = email;
  OWN_USER.avatar = avatar;
};

export const setUsers = (avatars: Record<string, string>): void => {
  const others: ChatUser[] = Object.entries(avatars)
    .filter(([name]) => name !== '' && name !== OWN_USER.name)
    .map(([name, avatar]) => makeUser(name, avatar));
  USERS.splice(0, USERS.length, ...others);
  DM_USERS.splice(0, DM_USERS.length, OWN_USER, ...others);
};

export const isOwnUser = (user: ChatUser): boolean =>
  user.name !== '' && user.name === OWN_USER.name;
