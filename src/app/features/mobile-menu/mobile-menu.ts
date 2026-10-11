import { Component, input, output } from '@angular/core';
import { WorkspaceMenu } from '../workspace-menu/workspace-menu';

@Component({
  selector: 'app-mobile-menu',
  imports: [WorkspaceMenu],
  templateUrl: './mobile-menu.html',
})
export class MobileMenu {
  readonly channels = input.required<string[]>();
  readonly activeChannel = input.required<string | null>();
  readonly activeUser = input.required<string | null>();
  readonly addChannel = output<void>();
  readonly selectChannel = output<string>();
  readonly selectUser = output<string>();
}
