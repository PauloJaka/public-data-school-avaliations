'use client';

import './style.css';
import { useState } from 'react';
import { ChatProvider } from '../ChatContext';
import { ChatSidebar } from '../ChatSidebar/ChatSidebar';
import { ChatWindow } from '../ChatWindow/ChatWindow';

export function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ChatProvider>
      <div className="chat-layout flex h-[100dvh] overflow-hidden bg-bg">

        {/* Backdrop — mobile only, shown when sidebar is open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <ChatSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 overflow-hidden min-w-0">
          <ChatWindow onOpenSidebar={() => setSidebarOpen(true)} />
        </div>
      </div>
    </ChatProvider>
  );
}
