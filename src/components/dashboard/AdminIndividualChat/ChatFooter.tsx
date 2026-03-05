import React, { useState } from 'react'
import { useSendMessageMutation } from '../../../redux/features/chat/chatApi';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

const ChatFooter = ({ conversationId }: { conversationId: string }) => {
    const [message, setMessage] = useState('');
    const [sendMessage] = useSendMessageMutation();


    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await sendMessage({ id: conversationId, content: message }).unwrap();
            if (response?.success) {
                toast.success(response?.message);
                setMessage('');
            }
        } catch (error: any) {
            toast.error(error?.data?.message)
        }
    };

    return (
        <div className="bg-[#111111] border-t border-[#D4AF37]/20">
            <div className="max-w-4xl mx-auto px-6 py-4">
                <form onSubmit={handleSend} className="relative">
                    <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend(e);
                            }
                        }}
                        placeholder="Type message here..."
                        className="w-full bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-xl pl-4 pr-14 py-3 text-white placeholder:text-gray-600 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none resize-none text-sm transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!message.trim()}
                        className="absolute right-2 top-2 bg-[#D4AF37] text-black p-2.5 rounded-lg hover:bg-[#F4CF57] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ChatFooter