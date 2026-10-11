import { Component, input, output, signal } from '@angular/core';
import { SearchHit } from '../../core/search';
import { SearchResults } from '../search-results/search-results';

@Component({
  selector: 'app-new-message',
  imports: [SearchResults],
  templateUrl: './new-message.html',
  host: {
    '(document:keydown.escape)': 'closed.emit()',
  },
})
export class NewMessage {
  readonly channels = input.required<string[]>();
  readonly picked = output<SearchHit>();
  readonly closed = output<void>();

  protected readonly query = signal('');

  protected onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
