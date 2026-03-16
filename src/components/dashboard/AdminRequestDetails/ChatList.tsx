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
        className="bg-[#111111] border border-primary/20 rounded-xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-primary/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-white font-medium">Individual Chats</h3>
              <p className="text-xs text-gray-500">{chatsData?.conversations?.length} active conversations</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-3 py-1.5">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-primary font-medium">Admin View - All Chats</span>
          </div>
        </div>

        {/* Chat Cards */}
        <div className="p-6 space-y-3 bg-[#0A0A0A]">
          {/* Chat 1: Seller_001 with Buyer_789 */}
          {chatsData?.conversations?.length > 0 ? chatsData?.conversations?.map((chat: any) => 
          <div key={chat._id}
            className="bg-[#111111] border border-white/5 hover:border-primary/30 rounded-lg p-4 transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-3 ">
              {chat?.initiatorId?.image ? <img src={imageUrl + chat?.initiatorId?.image} className='w-10 h-10 rounded-full object-cover' /> :
                <StringToAvatar name={chat?.initiatorId?.name || 'Unknown User'} size={40} />}


              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-300">
                      {chat?.initiatorId?.name}
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
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-black text-xs font-medium rounded-lg hover:bg-[#F4CF57] transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Chat
                  </button></Link>
                </div>
              </div>
            </div>

          </div>): <p className='capitalize text-center text-slate-600 font-semibold text-lg'>No conversation start yet</p>}

        </div>
      </div>
    </div>
  )
}

export default ChatList