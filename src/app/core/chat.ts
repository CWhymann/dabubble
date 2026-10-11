export interface Reaction {
  emoji: string;
  label: string;
  count: number;
  mine?: boolean;
}

export interface Replies {
  count: number;
  last: string;
}

export interface Message {
  id: string;
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
