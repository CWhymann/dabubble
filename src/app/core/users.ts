import { AVATARS } from './avatars';

export interface ChatUser {
  name: string;
  avatar: string;
  email: string;
  online: boolean;
}

const avatarOf = (name: string) => AVATARS.find((avatar) => avatar.name === name)?.src ?? '';

export const USERS: ChatUser[] = [
  {
    name: 'Sofia Müller',
    avatar: avatarOf('Sofia Müller'),
    email: 'sofia.muel@beispiel.com',
    online: true,
  },
  {
    name: 'Noah Braun',
    avatar: avatarOf('Noah Braun'),
    email: 'noahbra@beispiel.com',
    online: true,
  },
  {
    name: 'Elise Roth',
    avatar: avatarOf('Elise Roth'),
    email: 'rothelise@beispiel.com',
    online: false,
  },
  {
    name: 'Elias Neumann',
    avatar: avatarOf('Elias Neumann'),
    email: 'ichbinelias@beispiel.com',
    online: true,
  },
  {
    name: 'Steffen Hoffmann',
    avatar: avatarOf('Steffen Hoffmann'),
    email: 'thehoffman@beispiel.com',
    online: true,
  },
];

export const OWN_USER: ChatUser = {
  name: 'Frederik Beck',
  avatar: avatarOf('Frederik Beck'),
  email: 'fred.beck@email.com',
  online: true,
};

export const DM_USERS: ChatUser[] = [OWN_USER, ...USERS];

export const isOwnUser = (user: ChatUser): boolean => user.name === OWN_USER.name;
