const SELECTORS: [string, string][] = [
  ['yt-live-chat-text-message-renderer', 'A normal chat message. Has author-type="moderator | member | owner".'],
  ['#author-photo, #img', 'Avatar wrapper and image.'],
  ['#author-name', 'Display name. #chip-badges holds the badge icon.'],
  ['#message', 'The message text.'],
  ['yt-live-chat-paid-message-renderer', 'Super Chat. Use #card, #header, #purchase-amount, #content.'],
  ['yt-live-chat-membership-item-renderer', 'New member card. Uses #card, #header-subtext.'],
];

export function Guide() {
  return (
    <div className="guide">
      <h2>Quick start</h2>
      <ol>
        <li>Pick a template (try the cute animated VTuber presets) in <b>Code editor</b> and edit the CSS. The preview updates as you type.</li>
        <li>Use the <b>Send test message</b> bar under the preview to try long names, Super Chats and member cards.</li>
        <li>Open <b>Live source</b>, choose <i>Real YouTube chat</i>, paste a livechat popup or watch URL and a YouTube Data API key, then press Start to see real messages in your style.</li>
        <li>Press <b>Open livechat popup</b> to compare with YouTube's own window.</li>
        <li>Copy or download the CSS when you are happy.</li>
      </ol>
      <h2>Using your CSS in OBS</h2>
      <p>Add a Browser source with the popup URL <code>https://www.youtube.com/live_chat?is_popout=1&amp;v=VIDEO_ID</code> and paste your CSS into its Custom CSS box. The preview uses YouTube's element names, so most rules carry over. Add <code>body {'{'} background: transparent !important; {'}'}</code> for a see-through overlay.</p>
      <h2>Selectors</h2>
      <table><tbody>{SELECTORS.map(([s, d]) => <tr key={s}><td><code>{s}</code></td><td>{d}</td></tr>)}</tbody></table>
      <h2>Good to know</h2>
      <ul>
        <li>Browsers block styling YouTube's own embedded chat, so real messages are fetched through the YouTube Data API and drawn in the preview.</li>
        <li>The API only works while the stream is live and counts against your daily quota.</li>
        <li>Preview backgrounds (dark, light, checker, green) help you check contrast for overlays.</li>
      </ul>
    </div>
  );
}
