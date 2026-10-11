import { Component, input, output, signal } from '@angular/core';
import { SearchHit } from '../../core/search';
import { SearchResults } from '../search-results/search-results';

@Component({
  selector: 'app-search-bar',
  imports: [SearchResults],
  templateUrl: './search-bar.html',
})
export class SearchBar {
  readonly channels = input<string[]>([]);
  readonly pick = output<SearchHit>();

  protected readonly query = signal('');

  protected onInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected select(hit: SearchHit): void {
    this.query.set('');
    this.pick.emit(hit);
  }
}
