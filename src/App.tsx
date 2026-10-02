import { useEffect, useState } from 'react';
import { ChatPreview, type Bg } from './components/ChatPreview';
import { CssEditor } from './components/CssEditor';
import { Guide } from './components/Guide';
import { SourcePanel } from './components/SourcePanel';
import { usePersistentState } from './hooks';
import { makeMessage } from './mock';
import { templates } from './templates';
import type { Kind, SourceSettings } from './types';
import { useChatStream } from './useChatStream';

type Tab = 'editor' | 'source' | 'guide';
const TABS: [Tab, string][] = [['editor', 'Code editor'], ['source', 'Live source'], ['guide', 'Guide']];
const BGS: Bg[] = ['dark', 'light', 'checker', 'green'];
const SPARKLES = [['🌸', '6%', '12%', '0s'], ['✨', '88%', '16%', '1s'], ['💖', '10%', '78%', '2s'], ['⭐', '92%', '72%', '1.5s'], ['🫧', '50%', '90%', '3s']];
const PANEL = 'flex min-h-0 flex-col gap-3 overflow-auto rounded-3xl border border-white bg-white/70 p-4 shadow-xl shadow-pink-200/60 backdrop-blur max-md:overflow-visible';

export default function App() {
  const [tab, setTab] = useState<Tab>('editor');
  const [css, setCss] = usePersistentState('lc-css', templates[0].css);
  const [tplId, setTplId] = usePersistentState('lc-tpl', templates[0].id);
  const [source, setSource] = usePersistentState<SourceSettings>('lc-source', { mode: 'mock', url: '', apiKey: '', interval: 1500 });
  const [bg, setBg] = usePersistentState<Bg>('lc-bg', 'dark');
  const [running, setRunning] = useState(true);
  const [test, setTest] = useState<{ author: string; text: string; kind: Kind }>({ author: '', text: 'Testing my style!', kind: 'text' });
  const stream = useChatStream({ ...source, running });

  useEffect(() => {
    document.title = `${TABS.find(([id]) => id === tab)![1]} · fikk@ytsalon – YouTube livechat style editor`;
  }, [tab]);

  const pickTemplate = (id: string) => { setTplId(id); setCss(templates.find((t) => t.id === id)!.css); };
  const send = () => stream.push([makeMessage(test)]);

  return (
    <div className="relative flex h-dvh flex-col max-md:h-auto max-md:min-h-dvh">
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        {SPARKLES.map(([e, x, y, d]) => (
          <span key={e} className="absolute animate-float text-2xl opacity-40 motion-reduce:animate-none" style={{ left: x, top: y, animationDelay: d }}>{e}</span>
        ))}
      </div>
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-4 pt-4">
        <div>
          <h1 className="bg-linear-to-r from-pink-500 via-violet-500 to-sky-500 bg-clip-text text-2xl font-extrabold text-transparent">
            <span className="inline-block animate-wiggle motion-reduce:animate-none">🎀</span> fikk@ytsalon
          </h1>
          <p className="text-xs font-semibold text-slate-500">YouTube livechat style sandbox for VTubers</p>
        </div>
        <nav className="flex gap-2" aria-label="Sections">
          {TABS.map(([id, label]) => <button key={id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>{label}</button>)}
        </nav>
      </header>
      <main className="relative z-10 grid min-h-0 flex-1 grid-cols-[1.1fr_1fr] gap-4 p-4 max-md:grid-cols-1">
        <section className={PANEL}>
          {tab === 'editor' && <CssEditor value={css} onChange={setCss} templateId={tplId} onTemplate={pickTemplate} />}
          {tab === 'source' && <SourcePanel source={source} onChange={setSource} running={running} onRunning={setRunning} status={stream.status} error={stream.error} onClear={stream.clear} />}
          {tab === 'guide' && <Guide />}
        </section>
        <section className={PANEL}>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="mr-auto font-extrabold text-pink-500">Live preview</h2>
            {BGS.map((b) => <button key={b} className={bg === b ? 'on' : ''} onClick={() => setBg(b)}>{b}</button>)}
          </div>
          <ChatPreview messages={stream.messages} css={css} bg={bg} />
          <div className="flex flex-wrap items-center gap-2">
            <input className="grow" placeholder="Author (random if empty)" value={test.author} onChange={(e) => setTest({ ...test, author: e.target.value })} />
            <input className="grow" placeholder="Message" value={test.text} onChange={(e) => setTest({ ...test, text: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && send()} />
            <select value={test.kind} onChange={(e) => setTest({ ...test, kind: e.target.value as Kind })}>
              <option value="text">Message</option><option value="superchat">Super Chat</option><option value="member">Member</option>
            </select>
            <button className="on" onClick={send}>Send test message</button>
          </div>
        </section>
      </main>
    </div>
  );
}
