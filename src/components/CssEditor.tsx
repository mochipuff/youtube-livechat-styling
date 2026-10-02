import { useRef, useState, type KeyboardEvent } from 'react';
import { templates } from '../templates';

interface Props { value: string; onChange: (v: string) => void; templateId: string; onTemplate: (id: string) => void }

export function CssEditor({ value, onChange, templateId, onTemplate }: Props) {
  const gutter = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const count = value.split('\n').length;

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const t = e.currentTarget, s = t.selectionStart;
    onChange(value.slice(0, s) + '  ' + value.slice(t.selectionEnd));
    requestAnimationFrame(() => t.setSelectionRange(s + 2, s + 2));
  };
  const copy = async () => { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1200); };
  const download = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([value], { type: 'text/css' }));
    a.download = 'livechat.css'; a.click(); URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <div className="row">
        <label className="row">Template
          <select value={templateId} onChange={(e) => onTemplate(e.target.value)}>
            {(['Vtuber cute', 'Classic'] as const).map((g) => (
              <optgroup key={g} label={g}>{templates.filter((t) => t.group === g).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</optgroup>
            ))}
          </select>
        </label>
        <span className="grow" />
        <button onClick={() => onTemplate(templateId)}>Reset</button>
        <button onClick={copy}>{copied ? 'Copied' : 'Copy CSS'}</button>
        <button onClick={download}>Download .css</button>
      </div>
      <div className="editor">
        <pre className="gutter" ref={gutter}>{Array.from({ length: count }, (_, i) => i + 1).join('\n')}</pre>
        <textarea spellCheck={false} value={value} onKeyDown={onKey} aria-label="Chat CSS"
          onChange={(e) => onChange(e.target.value)}
          onScroll={(e) => { if (gutter.current) gutter.current.scrollTop = e.currentTarget.scrollTop; }} />
      </div>
      <small className="mute">Changes apply to the preview instantly. Switching templates replaces the editor content.</small>
    </>
  );
}
