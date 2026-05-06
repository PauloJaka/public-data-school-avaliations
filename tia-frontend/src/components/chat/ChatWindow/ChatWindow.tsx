'use client';

import './style.css';
import { useChat } from '@/hooks/useChat';
import { ChatMessage } from '../ChatMessage/ChatMessage';
import { ChatTypingIndicator } from '../ChatTypingIndicator/ChatTypingIndicator';
import { SuggestedQuestions } from '../SuggestedQuestions/SuggestedQuestions';
import { ChatInput } from '../ChatInput/ChatInput';
import { useChatContext } from '../ChatContext';
import { STATE_DATA } from '@/lib/data/neo4j-snapshot';
import { useLocale, useTranslations } from 'next-intl';

interface ChatWindowProps {
  onOpenSidebar: () => void;
}

export function ChatWindow({ onOpenSidebar }: ChatWindowProps) {
  const { messages, isStreaming, send } = useChat();
  const { uf } = useChatContext();
  const t = useTranslations('chat');
  const locale = useLocale();
  const st = STATE_DATA[uf] ?? STATE_DATA['SE'];

  return (
    <main className="flex h-full flex-col">
      <header className="chat-head flex items-center justify-between border-b border-border bg-surface px-4 py-4 md:px-6">
        <div className="flex items-center gap-3 min-w-0">
          {/* Sidebar toggle — mobile only */}
          <button
            onClick={onOpenSidebar}
            aria-label="Abrir menu"
            className="md:hidden flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-muted hover:text-text transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-text truncate">{t('header.title')}</h2>
            <p className="font-mono text-[11px] text-muted truncate">
              {st.nome} · IDEB {st.ideb_af.toFixed(1)} · QEDU/PNAD
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted flex-shrink-0">
          <button title="Nova conversa" aria-label="Nova conversa">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </header>

      <div className="stream flex-1 overflow-y-auto px-3 py-4 md:px-6 md:py-6">
        <div className="thread mx-auto flex max-w-[760px] flex-col gap-5">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-2xl text-white">T.I.A</div>
              <p className="font-mono text-sm text-muted">{t('empty.welcome')}</p>
            </div>
          )}
          {messages.map(m => <ChatMessage key={m.id} {...m} />)}
          {isStreaming && <ChatTypingIndicator locale={locale} />}
        </div>
      </div>

      <div className="dock border-t border-border bg-surface px-3 py-3 md:px-6 md:py-4">
        <SuggestedQuestions onPick={send} />
        <ChatInput onSubmit={send} disabled={isStreaming} />
      </div>
    </main>
  );
}
