import { Component, input } from '@angular/core';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.html',
})
export class MessageBox {
  readonly placeholder = input('Nachricht an #Entwicklerteam');
}
