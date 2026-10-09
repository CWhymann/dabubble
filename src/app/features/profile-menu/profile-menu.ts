import { Component, input } from '@angular/core';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.html',
})
export class ProfileMenu {
  readonly name = input.required<string>();
  readonly avatar = input.required<string>();
}
