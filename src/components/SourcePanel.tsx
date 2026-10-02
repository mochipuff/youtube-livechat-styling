import type { SourceSettings } from '../types';
import { embedUrl, parseVideoId, popoutUrl } from '../youtube';

interface Props {
  source: SourceSettings; onChange: (s: SourceSettings) => void;
  running: boolean; onRunning: (r: boolean) => void;
  status: string; error: string; onClear: () => void;
}

export function SourcePanel({ source, onChange, running, onRunning, status, error, onClear }: Props) {
  const set = (p: Partial<SourceSettings>) => onChange({ ...source, ...p });
  const id = parseVideoId(source.url);
  const openPopup = () => id && window.open(popoutUrl(id), 'yt-livechat', 'width=420,height=720');

  return (
    <>
      <div className="row">
        <button className={source.mode === 'mock' ? 'on' : ''} onClick={() => set({ mode: 'mock' })}>Simulated chat</button>
        <button className={source.mode === 'youtube' ? 'on' : ''} onClick={() => set({ mode: 'youtube' })}>Real YouTube chat</button>
        <span className="grow" />
        <span className={`pill ${status}`}>{status}</span>
      </div>
      {source.mode === 'mock' ? (
        <label className="row">Message every
          <select value={source.interval} onChange={(e) => set({ interval: Number(e.target.value) })}>
            {[500, 1000, 1500, 3000, 6000].map((ms) => <option key={ms} value={ms}>{ms / 1000}s</option>)}
          </select>
        </label>
      ) : (
        <>
          <input placeholder="Livechat popup URL, watch URL or video ID" value={source.url} onChange={(e) => set({ url: e.target.value })} />
          <input type="password" placeholder="YouTube Data API v3 key (kept in this browser only)" value={source.apiKey} onChange={(e) => set({ apiKey: e.target.value })} />
          {source.url && !id && <span className="err">Could not find a video ID in that URL.</span>}
        </>
      )}
      {error && <span className="err">{error}</span>}
      <div className="row">
        <button className="on" onClick={() => onRunning(!running)}>{running ? 'Pause' : 'Start'}</button>
        <button onClick={onClear}>Clear messages</button>
        <button onClick={openPopup} disabled={!id}>Open livechat popup</button>
      </div>
      {id && <><small className="mute">Official YouTube chat for comparison (its own styles cannot be edited from here):</small>
        <iframe title="YouTube live chat" src={embedUrl(id)} /></>}
    </>
  );
}
