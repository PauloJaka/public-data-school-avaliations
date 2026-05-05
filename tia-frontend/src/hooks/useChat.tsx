'use client';

import { useCallback, useState } from 'react';
import { useLocale } from 'next-intl';
import { ask } from '@/lib/api/tia';
import { useChatContext } from '@/components/chat/ChatContext';

export interface ChatMsg {
  id: string;
  role: 'user' | 'ai';
  content: React.ReactNode;
  sources?: { id: number; label: string }[];
}

export function useChat() {
  const { uf } = useChatContext();
  const locale = useLocale() as 'pt-BR' | 'en';
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const send = useCallback(async (question: string) => {
    const userMsg: ChatMsg = { id: crypto.randomUUID(), role: 'user', content: question };
    setMessages(m => [...m, userMsg]);
    setIsStreaming(true);
    try {
      const res = await ask({ question, uf, locale });
      setMessages(m => [...m, {
        id:      res.id,
        role:    'ai',
        content: res.answer,
        sources: res.sources,
      }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      let content = 'Falha ao consultar a IA. Tente novamente.';
      if (msg.includes('backend_unreachable')) {
        content = 'Servidor de IA indisponível. Verifique se o backend está rodando em localhost:8000.';
      } else if (msg.includes('503') || msg.includes('upstream_not_configured')) {
        content = 'TIA_RAG_URL não configurado. Reinicie o servidor Next.js após criar .env.local.';
      } else if (msg.includes('502')) {
        content = 'Erro no servidor de IA. Verifique os logs do backend.';
      }
      setMessages(m => [...m, {
        id:      crypto.randomUUID(),
        role:    'ai',
        content,
      }]);
    } finally {
      setIsStreaming(false);
    }
  }, [uf, locale]);

  return { messages, isStreaming, send };
}
