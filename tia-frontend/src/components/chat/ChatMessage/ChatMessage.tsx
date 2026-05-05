import './style.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SourceRow } from '../SourceRow/SourceRow';
import { cn } from '@/lib/utils/cn';

export type ChatRole = 'user' | 'ai';
export interface ChatMessageProps {
  id: string;
  role: ChatRole;
  content: React.ReactNode;
  sources?: { id: number; label: string }[];
}

export function ChatMessage({ role, content, sources }: ChatMessageProps) {
  const isUser = role === 'user';
  return (
    <div className={cn('msg flex gap-3', isUser && 'flex-row-reverse')}>
      <span className={cn(
        'grid h-9 w-9 flex-none place-items-center rounded-xl font-mono',
        isUser ? 'bg-soft text-text text-xs' : 'bg-gradient-to-br from-primary to-secondary text-white text-[9px] font-bold tracking-tight'
      )}>
        {isUser ? 'User' : 'T.I.A'}
      </span>
      <div className={cn(
        'bubble max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
        isUser ? 'bg-primary text-white' : 'bg-surface border border-border text-text'
      )}>
        {role === 'ai' && typeof content === 'string' ? (
          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        ) : content}
        {sources && sources.length > 0 && <SourceRow sources={sources} />}
      </div>
    </div>
  );
}
