import { Component, input, output, signal } from '@angular/core';
import { SearchHit } from '../../core/search';
import { SearchResults } from '../search-results/search-results';
import { WorkspaceMenu } from '../workspace-menu/workspace-menu';

@Component({
  selector: 'app-mobile-menu',
  imports: [SearchResults, WorkspaceMenu],
  templateUrl: './mobile-menu.html',
})
export class MobileMenu {
  readonly channels = input.required<string[]>();
  readonly activeChannel = input.required<string | null>();
  readonly activeUser = input.required<string | null>();
  readonly addChannel = output<void>();
  readonly selectChannel = output<string>();
  readonly selectUser = output<string>();
  readonly newMessage = output<void>();

  protected readonly query = signal('');

  protected onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected pick(hit: SearchHit): void {
    this.query.set('');
    if (hit.kind === 'channel') {
      this.selectChannel.emit(hit.name);
    } else {
      this.selectUser.emit(hit.user.name);
    }
  }
}
