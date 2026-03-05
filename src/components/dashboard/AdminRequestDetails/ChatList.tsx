import { Eye, MessageSquare, Shield } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { imageUrl } from '../../../redux/base/baseAPI';
import { formatChatTime } from '../../Shared/FormatChatTime';
import StringToAvatar from '../../Shared/StringToAvater';

const ChatList = ({ chatsData }: any) => {
   const { id } = useParams<{ id: string }>();
  return (
    <div>
      <div
        className="bg-[#111111] border border-[#D4AF37]/20 rounded-xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#D4AF37]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <h3 className="text-white font-medium">Individual Chats</h3>
              <p className="text-xs text-gray-500">{chatsData?.conversations?.length} active conversations</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-lg px-3 py-1.5">
            <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-xs text-[#D4AF37] font-medium">Admin View - All Chats</span>
          </div>
        </div>

        {/* Chat Cards */}
        <div className="p-6 space-y-3 bg-[#0A0A0A]">
          {/* Chat 1: Seller_001 with Buyer_789 */}
          {chatsData?.conversations?.length && chatsData?.conversations?.map((chat: any) => 
          <div key={chat._id}
            className="bg-[#111111] border border-white/5 hover:border-[#D4AF37]/30 rounded-lg p-4 transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-3 ">
              {chat?.ownerId?.image ? <img src={imageUrl + chat?.ownerId?.image} className='w-10 h-10 rounded-full object-cover' /> :
                <StringToAvatar name={chat?.ownerId?.name || 'Unknown User'} size={40} />}


              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-300">
                      {chat?.ownerId?.name}
                    </span>
                    <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] rounded-full">
                      Active Chat
                    </span>
                  </div>
                  <span className="text-xs text-gray-600">{formatChatTime(chat?.updatedAt ? chat?.updatedAt : chat?.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                    {chat?.lastMessage}
                  </p>

                 <Link to={`/requests/${id}/chat/${chat?._id}`}> <button
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37] text-black text-xs font-medium rounded-lg hover:bg-[#F4CF57] transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Chat
                  </button></Link>
                </div>
              </div>
            </div>

          </div>)}

          {/* Chat 2: Developer_042 with Buyer_789 */}
          <div
            className="bg-[#111111] border border-white/5 hover:border-[#D4AF37]/30 rounded-lg p-4 transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-sm font-medium flex-shrink-0">
                DE
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-300">
                      Sarah Williams <span className="text-gray-600 font-normal text-xs">(shows as Developer_042)</span>
                    </span>
                    <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] rounded-full">
                      Active Chat
                    </span>
                  </div>
                  <span className="text-xs text-gray-600">5 hours ago</span>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                  I'm currently developing a similar property in the same area. Expected completion in 8 months...
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    <MessageSquare className="w-3 h-3 inline mr-1" />
                    4 messages
                  </span>
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37] text-black text-xs font-medium rounded-lg hover:bg-[#F4CF57] transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Chat
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Chat 3: Agent_105 with Buyer_789 */}
          <div
            className="bg-[#111111] border border-white/5 hover:border-[#D4AF37]/30 rounded-lg p-4 transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-300 flex items-center justify-center text-sm font-medium flex-shrink-0">
                AG
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-300">
                      John Mbatha <span className="text-gray-600 font-normal text-xs">(shows as Agent_105)</span>
                    </span>
                    <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] rounded-full">
                      Active Chat
                    </span>
                  </div>
                  <span className="text-xs text-gray-600">1 day ago</span>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                  I represent multiple property owners in Sandton. I can arrange viewings for 5 properties matching...
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    <MessageSquare className="w-3 h-3 inline mr-1" />
                    9 messages
                  </span>
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37] text-black text-xs font-medium rounded-lg hover:bg-[#F4CF57] transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatList