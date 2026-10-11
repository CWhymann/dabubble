import { ChatUser, DM_USERS } from './users';

export type SearchHit = { kind: 'channel'; name: string } | { kind: 'user'; user: ChatUser };

// "@" sucht nur Personen, "#" nur Channels, ohne Präfix beides.
export function searchTargets(query: string, channels: string[]): SearchHit[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }
  const prefix = trimmed.charAt(0);
  const term = (prefix === '@' || prefix === '#' ? trimmed.slice(1) : trimmed).trim().toLowerCase();

  const channelHits: SearchHit[] =
    prefix === '@'
      ? []
      : channels
          .filter((name) => name.toLowerCase().includes(term))
          .map((name) => ({ kind: 'channel', name }));

  const userHits: SearchHit[] =
    prefix === '#'
      ? []
      : DM_USERS.filter((user) => user.name.toLowerCase().includes(term)).map((user) => ({
          kind: 'user',
          user,
        }));

  return [...channelHits, ...userHits];
}
