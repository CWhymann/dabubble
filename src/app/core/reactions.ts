export interface ReactionOption {
  icon: string;
  label: string;
}

// Die vier Reaktions-Emojis aus der Figma-Vorlage (Emojitwo Emoji Set).
export const REACTION_OPTIONS: ReactionOption[] = [
  { icon: '/icons/emoji-rocket.svg', label: 'Rakete' },
  { icon: '/icons/emoji-check.svg', label: 'Haken' },
  { icon: '/icons/emoji-nerd.svg', label: 'Nerd' },
  { icon: '/icons/emoji-hands-up.svg', label: 'Hände hoch' },
];
