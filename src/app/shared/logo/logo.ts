import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.html',
})
export class Logo {
  readonly compact = input(false);

  protected readonly size = computed(() =>
    this.compact() ? 'text-[45px] lg:text-[70px]' : 'text-[56px] lg:text-[70px]',
  );
}
