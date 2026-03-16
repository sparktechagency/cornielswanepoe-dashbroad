import { Send } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { getIsAuthenticated } from '../../../lib/socket';
import { useSendMessageMutation } from '../../../redux/features/chat/chatApi';

const SOCKET_EVENTS = {
  SEND_MESSAGE: 'send_message',
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',
};

interface ChatFooterProps {
  conversationId: string;
  socket: Socket | null;
  myAlias?: string;
}

const ChatFooter = ({ conversationId, socket, myAlias = 'Admin' }: ChatFooterProps) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [sendMessage] = useSendMessageMutation();

  // ─── Emit typing events ──────────────────────────────────────────────────
  const emitTyping = () => {
    if (!socket) return;
    socket.emit(SOCKET_EVENTS.TYPING_START, { conversationId, alias: myAlias });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit(SOCKET_EVENTS.TYPING_STOP, { conversationId, alias: myAlias });
    }, 1500);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const trimmed = message.trim();

    // ─── Prefer socket for text messages ──────────────────────────────────
    if (socket && getIsAuthenticated()) {
      setMessage('');
      socket.emit(SOCKET_EVENTS.SEND_MESSAGE, {
        conversationId,
        content: trimmed,
      });
      return;
    }

    // ─── Fallback to REST if socket not ready ─────────────────────────────
    setLoading(true);
    try {
      const response = await sendMessage({
        id: conversationId,
        content: trimmed,
      }).unwrap();

      console.log("responseresponse", response);
      
      if (response?.success) {
        setMessage('');
      }
    } catch (error: any) {
    //   toast.error(error?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111111] border-t border-primary/20">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <form onSubmit={handleSend} className="relative">
          <textarea
            rows={3}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              emitTyping();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder="Type message here..."
            className="w-full bg-[#0A0A0A] border border-primary/20 rounded-xl pl-4 pr-14 py-3 text-white placeholder:text-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none text-sm transition-all"
          />
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="absolute right-2 top-2 bg-primary text-black p-2.5 rounded-lg hover:bg-[#F4CF57] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatFooter;