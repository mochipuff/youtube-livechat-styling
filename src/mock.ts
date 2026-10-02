import type { ChatMessage } from './types';
const names = ['Aoi', 'Mizu', 'KaiGamer', 'PixelFox', 'NightOwl', 'Sora', 'LunaTic', 'Ryu', 'Hana', 'ModBot'];
const lines = ['hello chat!', "LET'S GOOO", 'this stream is so cozy', 'first time here, hi!', 'can you replay that?', 'lol 😂', 'GG', 'the overlay looks great', 'what song is this?', 'clip it!'];
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
let counter = 0;

export const avatarFor = (name: string) => {
  const hue = [...name].reduce((a, c) => a + c.charCodeAt(0) * 7, 0) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" fill="hsl(${hue},60%,45%)"/><text x="24" y="32" font-size="24" text-anchor="middle" fill="#fff" font-family="sans-serif">${(name[0] ?? '?').toUpperCase()}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export function makeMessage(o: Partial<Pick<ChatMessage, 'author' | 'text' | 'kind' | 'badge'>> = {}): ChatMessage {
  const author = o.author || pick(names), r = Math.random();
  const kind = o.kind ?? (r < 0.06 ? 'superchat' : r < 0.1 ? 'member' : 'text');
  return {
    id: `m${Date.now()}-${counter++}`, author, text: o.text || pick(lines), kind, ts: Date.now(),
    avatar: avatarFor(author),
    badge: o.badge ?? (kind === 'member' ? 'member' : Math.random() < 0.1 ? 'mod' : undefined),
    amount: kind === 'superchat' ? pick(['$2.00', '$5.00', '$20.00', '$50.00']) : undefined,
  };
}
