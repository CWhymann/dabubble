export interface Reaction {
  emoji: string;
  label: string;
  count: number;
}

export interface Replies {
  count: number;
  last: string;
}

export interface Message {
  author: string;
  avatar: string;
  time: string;
  text: string;
  own: boolean;
  replies?: Replies;
  reactions: Reaction[];
}

export interface DayGroup {
  label: string;
  messages: Message[];
}
