import { Component, computed, input, output } from '@angular/core';
import { SearchHit, searchTargets } from '../../core/search';
import { ChatUser, isOwnUser } from '../../core/users';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.html',
})
export class SearchResults {
  readonly query = input.required<string>();
  readonly channels = input.required<string[]>();
  readonly pick = output<SearchHit>();

  protected readonly hits = computed(() => searchTargets(this.query(), this.channels()));

  protected label(user: ChatUser): string {
    return isOwnUser(user) ? `${user.name} (Du)` : user.name;
  }
}
