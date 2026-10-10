import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-nav-toggle',
  templateUrl: './nav-toggle.html',
})
export class NavToggle {
  readonly open = input.required<boolean>();
  readonly toggleMenu = output<void>();

  protected readonly label = computed(() =>
    this.open() ? 'Workspace-Menü schließen' : 'Workspace-Menü öffnen',
  );
  protected readonly icon = computed(() =>
    this.open() ? '/icons/hide-navigation.svg' : '/icons/show-navigation.svg',
  );
  protected readonly iconHover = computed(() =>
    this.open() ? '/icons/hide-navigation-hover.svg' : '/icons/show-navigation-hover.svg',
  );
}
