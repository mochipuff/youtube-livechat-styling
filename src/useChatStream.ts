import { useCallback, useEffect, useState } from 'react';
import type { ChatMessage, SourceConfig } from './types';
import { makeMessage } from './mock';
import { fetchMessages, getChatId, parseVideoId } from './youtube';

const MAX = 150;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useChatStream(cfg: SourceConfig) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const push = useCallback((m: ChatMessage[]) => setMessages((p) => [...p, ...m].slice(-MAX)), []);
  const clear = useCallback(() => setMessages([]), []);

  useEffect(() => {
    setError('');
    if (!cfg.running) { setStatus('paused'); return; }
    if (cfg.mode === 'mock') {
      setStatus('simulated');
      const t = window.setInterval(() => push([makeMessage()]), cfg.interval);
      return () => clearInterval(t);
    }
    const videoId = parseVideoId(cfg.url);
    if (!videoId || !cfg.apiKey) { setStatus('error'); setError('Enter a valid livechat/video URL and a YouTube Data API key.'); return; }
    let stop = false;
    (async () => {
      try {
        setStatus('connecting');
        const chatId = await getChatId(videoId, cfg.apiKey);
        let token = '';
        setStatus('live');
        while (!stop) {
          const r = await fetchMessages(chatId, cfg.apiKey, token);
          if (stop) break;
          token = r.next; push(r.messages);
          await sleep(r.wait);
        }
      } catch (e) {
        if (!stop) { setStatus('error'); setError(e instanceof Error ? e.message : 'Request failed'); }
      }
    })();
    return () => { stop = true; };
  }, [cfg.running, cfg.mode, cfg.url, cfg.apiKey, cfg.interval, push]);

  return { messages, status, error, push, clear };
}
