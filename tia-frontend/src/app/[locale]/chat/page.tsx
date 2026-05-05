import { ChatLayout } from '@/components/chat/ChatLayout/ChatLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat IA — T.I.A',
  description: 'Converse com a T.I.A sobre indicadores educacionais brasileiros com fontes citadas.',
};

export default function ChatPage() {
  return <ChatLayout />;
}
