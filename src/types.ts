export type Kind = 'text' | 'superchat' | 'member';
export type Badge = 'owner' | 'mod' | 'member';
export interface ChatMessage {
  id: string; author: string; text: string; kind: Kind;
  ts: number; avatar?: string; badge?: Badge; amount?: string;
}
export interface SourceSettings { mode: 'mock' | 'youtube'; url: string; apiKey: string; interval: number }
export type SourceConfig = SourceSettings & { running: boolean };
