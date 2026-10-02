import 'react';
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'yt-live-chat-text-message-renderer': any;
      'yt-live-chat-paid-message-renderer': any;
      'yt-live-chat-membership-item-renderer': any;
      'yt-live-chat-author-chip': any;
    }
  }
}
