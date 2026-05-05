'use client';

import './style.css';
import { ChatProvider } from '../ChatContext';
import { ChatSidebar } from '../ChatSidebar/ChatSidebar';
import { ChatWindow } from '../ChatWindow/ChatWindow';

export function ChatLayout() {
  return (
    <ChatProvider>
      <div className="chat-layout flex h-[100dvh] overflow-hidden bg-bg">
        <ChatSidebar />
        <div className="flex-1 overflow-hidden">
          <ChatWindow />
        </div>
      </div>
    </ChatProvider>
  );
}
