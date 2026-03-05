import { useNavigate, useParams } from 'react-router';

import {
  ArrowLeft,
  Ban,
  CheckCheck,
  Flag,
  Shield,
  Lock,
  Unlock
} from 'lucide-react';
import { imageUrl } from '../../../redux/base/baseAPI';
import { useBlockConversationMutation,  useGetMessagesQuery } from '../../../redux/features/chat/chatApi';
import { useGetProfileQuery } from '../../../redux/features/user/userApi';
import ChatFooter from './ChatFooter';
import { toast } from 'sonner';

export default function AdminIndividualChat() {
  const { requestId, chatId } = useParams();
  const navigate = useNavigate();

  const { data: messagesData, isLoading } = useGetMessagesQuery(chatId!, { skip: !chatId });
  const { data: profileData } = useGetProfileQuery({});
  const [blockConversation] = useBlockConversationMutation();
  // const [unblockConversation] = useUnblockConversationMutation();

  const isBlocked = messagesData?.conversation?.status === 'blocked';

  const handleBlockConversation = async () => {
    try {
      const response = await blockConversation(chatId!).unwrap();
      if (response?.success) {
        toast.success(response?.message);
        navigate(`/requests/${requestId}`);
      }
    } catch (error: any) {
      toast.error(error?.data?.message);
    }
  };

  const handleUnblockConversation = async () => {
    // try {
    //   const response = await unblockConversation(chatId!).unwrap();
    //   if (response?.success) {
    //     toast.success(response?.message);
    //   }
    // } catch (error: any) {
    //   toast.error(error?.data?.message);
    // }
  };

  return (
    <div className="h-screen flex flex-col bg-[#0A0A0A]">
      {/* Header */}
      <div className="bg-[#111111] border-b border-[#D4AF37]/20 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate(`/requests/${requestId}`)}
            className="flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors mb-3 group text-sm"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Request
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium `}>
              </div>
              <img src={imageUrl + messagesData?.conversation?.ownerId?.image} alt={messagesData?.conversation?.ownerId?.name} className='h-14 w-14 rounded-full' />
              <div>
                <h1 className="text-md! text-white font-medium">
                  {messagesData?.conversation?.ownerId?.name}
                </h1>
                <p className="text-xs text-gray-500">
                  Chatting with: <span className="text-gray-400">{messagesData?.conversation?.initiatorId?.name}</span>
                </p>
                <p className="text-xs text-gray-500">
                  Regarding: <span className="text-gray-400">{messagesData?.conversation?.postId?.title}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-end gap-3">
              <div className="flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-lg px-3 py-1.5">
                <Shield className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs text-[#D4AF37] font-medium">Admin Monitoring</span>
              </div>
              {isBlocked ? (
                <button
                  onClick={handleUnblockConversation}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-400/20 rounded-lg text-xs font-medium hover:bg-green-500/20 transition-colors"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  Unblock Chat
                </button>
              ) : (
                <button
                  onClick={handleBlockConversation}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-400/20 rounded-lg text-xs font-medium hover:bg-red-500/20 transition-colors"
                >
                  <Flag className="w-3.5 h-3.5" />
                  Flag Chat
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
          {messagesData?.messages?.map((msg: any, idx: number) => {
            const isAdmin = msg.senderId?._id.toString() === profileData?._id;
            const isUser = messagesData?.conversation?.initiatorId?._id?.toString() === msg.senderId?._id.toString();
            return (
              <div
                key={msg._id || idx}
                className={`flex ${isAdmin ? 'justify-center' : isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${isAdmin ? 'w-full max-w-2xl' : ''}`}>
                  {/* Sender Info */}
                  <div
                    className={`flex items-center gap-2 mb-1.5 px-1 ${isAdmin ? 'justify-center' : isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <span
                      className={`text-xs font-medium ${isAdmin ? 'text-[#D4AF37]' : isUser ? 'text-blue-400' : 'text-gray-400'}`}
                    >
                      {msg.senderId?.name}
                      {!isAdmin && (
                        <span className="text-gray-600 font-normal ml-1 text-[11px]">
                          (shows as {msg.senderAlias})
                        </span>
                      )}
                      {isAdmin && (
                        <span className="ml-2 text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded">
                          ADMIN
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-gray-600">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl px-4 py-3 ${isAdmin
                      ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/30'
                      : isUser
                        ? 'bg-blue-600/20 border border-blue-500/30'
                        : 'bg-[#1A1A1A] border border-white/10'
                      }`}
                  >
                    {msg.content && (
                      <p className="text-sm text-white leading-relaxed">{msg.content}</p>
                    )}

                    {msg.images?.length > 0 && (
                      <div className={`flex flex-wrap gap-2 ${msg.content ? 'mt-2' : ''}`}>
                        {msg.images.map((imgSrc: any, imgIdx: number) => (
                          <img
                            key={imgIdx}
                            src={imgSrc}
                            alt="attachment"
                            className="max-w-50 max-h-50 rounded-lg object-cover border border-white/10"
                          />
                        ))}
                      </div>
                    )}

                    {isUser && (
                      <div className="flex items-center justify-end gap-1 mt-2">
                        <CheckCheck
                          className={`w-3.5 h-3.5 ${msg.isRead ? 'text-blue-400' : 'text-gray-600'}`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Blocked Banner or Footer */}
      {isBlocked ? (
        <div className="bg-[#111111] border-t border-red-500/20 px-6 py-5">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                <Lock className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-400">Conversation Blocked by Admin</p>
                <p className="text-xs text-gray-500 mt-0.5">Users can no longer send or receive messages in this chat.</p>
              </div>
            </div>
            <button
              onClick={handleUnblockConversation}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 border border-green-400/20 rounded-lg text-sm font-medium hover:bg-green-500/20 transition-colors flex-shrink-0"
            >
              <Unlock className="w-4 h-4" />
              Unblock Conversation
            </button>
          </div>
        </div>
      ) : (
        <ChatFooter conversationId={chatId ?? ""} />
      )}
    </div>
  );
}