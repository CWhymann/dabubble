import { Component } from '@angular/core';
import { AVATARS } from '../../core/avatars';

interface MenuUser {
  name: string;
  avatar: string;
  online: boolean;
  you: boolean;
}

const avatarOf = (name: string) => AVATARS.find((avatar) => avatar.name === name)?.src ?? '';

@Component({
  selector: 'app-workspace-menu',
  templateUrl: './workspace-menu.html',
})
export class WorkspaceMenu {
  protected readonly channels = ['Entwicklerteam'];
  protected readonly activeChannel = 'Entwicklerteam';
  protected readonly users: MenuUser[] = [
    { name: 'Frederik Beck', avatar: avatarOf('Frederik Beck'), online: true, you: true },
    { name: 'Sofia Müller', avatar: avatarOf('Sofia Müller'), online: true, you: false },
    { name: 'Noah Braun', avatar: avatarOf('Noah Braun'), online: true, you: false },
    { name: 'Elise Roth', avatar: avatarOf('Elise Roth'), online: false, you: false },
    { name: 'Elias Neumann', avatar: avatarOf('Elias Neumann'), online: true, you: false },
    { name: 'Steffen Hoffmann', avatar: avatarOf('Steffen Hoffmann'), online: true, you: false },
  ];
}
