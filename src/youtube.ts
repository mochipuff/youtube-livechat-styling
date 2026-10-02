import type { ChatMessage } from './types';
const API = 'https://www.googleapis.com/youtube/v3';

export function parseVideoId(input: string): string | null {
  const s = input.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s);
    return u.searchParams.get('v') || (u.hostname === 'youtu.be' ? u.pathname.slice(1) : null) || u.pathname.match(/\/(?:live|embed)\/([\w-]{11})/)?.[1] || null;
  } catch { return null; }
}
export const popoutUrl = (id: string) => `https://www.youtube.com/live_chat?is_popout=1&v=${id}`;
export const embedUrl = (id: string) => `https://www.youtube.com/live_chat?v=${id}&embed_domain=${location.hostname}`;

async function call(path: string) {
  const r = await fetch(`${API}/${path}`);
  const j = await r.json();
  if (!r.ok) throw new Error(j.error?.message ?? `HTTP ${r.status}`);
  return j;
}
export async function getChatId(videoId: string, key: string) {
  const j = await call(`videos?part=liveStreamingDetails&id=${videoId}&key=${encodeURIComponent(key)}`);
  const id = j.items?.[0]?.liveStreamingDetails?.activeLiveChatId;
  if (!id) throw new Error('No active live chat found for this video.');
  return id as string;
}
export async function fetchMessages(chatId: string, key: string, pageToken = '') {
  const j = await call(`liveChat/messages?liveChatId=${chatId}&part=snippet,authorDetails&key=${encodeURIComponent(key)}&pageToken=${pageToken}`);
  const messages: ChatMessage[] = (j.items ?? []).flatMap((it: any): ChatMessage[] => {
    const s = it.snippet, a = it.authorDetails;
    const base: Omit<ChatMessage, 'kind' | 'text'> = {
      id: it.id, author: a.displayName, avatar: a.profileImageUrl, ts: Date.parse(s.publishedAt),
      badge: a.isChatOwner ? 'owner' : a.isChatModerator ? 'mod' : a.isChatSponsor ? 'member' : undefined,
    };
    switch (s.type) {
      case 'textMessageEvent': return [{ ...base, kind: 'text', text: s.displayMessage }];
      case 'superChatEvent': return [{ ...base, kind: 'superchat', text: s.superChatDetails?.userComment ?? '', amount: s.superChatDetails?.amountDisplayString }];
      case 'newSponsorEvent': case 'memberMilestoneChatEvent': return [{ ...base, kind: 'member', text: s.displayMessage ?? 'New member!' }];
      default: return [];
    }
  });
  return { messages, next: (j.nextPageToken as string) ?? '', wait: Math.max(j.pollingIntervalMillis ?? 5000, 2000) };
}
