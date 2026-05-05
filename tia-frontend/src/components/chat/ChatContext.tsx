'use client';

import { createContext, useContext, useState } from 'react';

interface ChatContextValue {
  uf: string;
  setUf: (uf: string) => void;
}

const ChatCtx = createContext<ChatContextValue>({ uf: 'SE', setUf: () => {} });

export const useChatContext = () => useContext(ChatCtx);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [uf, setUf] = useState('SE');
  return <ChatCtx.Provider value={{ uf, setUf }}>{children}</ChatCtx.Provider>;
}
