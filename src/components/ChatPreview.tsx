import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ChatMessage } from '../types';

export type Bg = 'dark' | 'light' | 'checker' | 'green';
const ICON = { owner: '👑', mod: '🔧', member: '⭐' } as const;
const time = (ts: number) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// Neutral defaults that YouTube's own stylesheet normally provides; user CSS builds on top.
const BASE = `:host{display:block;height:100%}
.lc-scroll{height:100%;overflow-y:auto;box-sizing:border-box;padding:6px 0;font-family:Roboto,Arial,sans-serif}
yt-live-chat-text-message-renderer,yt-live-chat-paid-message-renderer,yt-live-chat-membership-item-renderer{display:block}
yt-live-chat-author-chip{display:inline}
#author-photo{display:inline-block;vertical-align:middle;width:24px;height:24px}
#img{width:100%;height:100%;border-radius:50%;display:block}
#timestamp{display:none}
#header{display:flex;align-items:center;gap:12px;padding:8px 16px}
#header-content{display:flex;flex-direction:column}`;

function Badge({ type }: { type?: ChatMessage['badge'] }) {
  return type ? <span id="chip-badges"><span id="badge" data-type={type}>{ICON[type]}</span></span> : null;
}
function Photo({ src }: { src?: string }) {
  return <div id="author-photo"><img id="img" src={src} alt="" /></div>;
}

function Message({ m }: { m: ChatMessage }) {
  if (m.kind === 'superchat') return (
    <yt-live-chat-paid-message-renderer><div id="card">
      <div id="header"><Photo src={m.avatar} /><div id="header-content"><div id="author-name">{m.author}</div><div id="purchase-amount">{m.amount}</div></div></div>
      {m.text && <div id="content"><div id="message">{m.text}</div></div>}
    </div></yt-live-chat-paid-message-renderer>
  );
  if (m.kind === 'member') return (
    <yt-live-chat-membership-item-renderer><div id="card">
      <div id="header"><Photo src={m.avatar} /><div id="header-content"><div id="author-name">{m.author}</div><div id="header-subtext">New member</div></div></div>
      <div id="content"><div id="message">{m.text}</div></div>
    </div></yt-live-chat-membership-item-renderer>
  );
  return (
    <yt-live-chat-text-message-renderer author-type={m.badge === 'mod' ? 'moderator' : m.badge}>
      <Photo src={m.avatar} />
      <div id="content" style={{ display: 'inline' }}>
        <span id="timestamp">{time(m.ts)}</span>
        <yt-live-chat-author-chip><span id="author-name">{m.author}<Badge type={m.badge} /></span></yt-live-chat-author-chip>
        <span id="message">{m.text}</span>
      </div>
    </yt-live-chat-text-message-renderer>
  );
}

/** Renders messages inside a Shadow DOM so user CSS never leaks into the app UI. */
export function ChatPreview({ messages, css, bg }: { messages: ChatMessage[]; css: string; bg: Bg }) {
  const host = useRef<HTMLDivElement>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const [root, setRoot] = useState<ShadowRoot | null>(null);

  useEffect(() => {
    if (host.current) setRoot(host.current.shadowRoot ?? host.current.attachShadow({ mode: 'open' }));
  }, []);
  useEffect(() => { if (scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight; }, [messages, root]);

  return (
    <div ref={host} className={`preview bg-${bg}`}>
      {root && createPortal(
        <>
          <style>{BASE}</style><style>{css}</style>
          <div className="lc-scroll" ref={scroll}>{messages.map((m) => <Message key={m.id} m={m} />)}</div>
        </>, root)}
    </div>
  );
}
