import { Component, input } from '@angular/core';
import { Message } from '../../core/chat';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.html',
})
export class ChatMessage {
  readonly message = input.required<Message>();
}
