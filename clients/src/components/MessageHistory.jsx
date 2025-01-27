import React from 'react';
import { useSelector } from 'react-redux';
import ScrollableFeed from "react-scrollable-feed";
import { isSameSender, isSameSenderMargin, isSameUser, isLastMessage } from '../utils/logics';
import "../pages/home.css";

// Helper function to check if the message is from today
const isToday = (date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

// Helper function to format the date
const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

function MessageHistory({ messages }) {
  const activeUser = useSelector((state) => state.activeUser);

  // Track the last date to show the date separator when it changes
  let lastDate = null;

  return (
    <ScrollableFeed className='scrollbar-hide'>
      {messages &&
        messages.map((m, i) => {
          const messageDate = new Date(m.createdAt);
          const isSameDay = lastDate && messageDate.toDateString() === lastDate.toDateString();
          lastDate = messageDate;

          return (
            <React.Fragment key={m._id}>
              {/* Date Separator */}
              {!isSameDay && (
                <div className="text-center text-sm text-gray-500 my-3">
                  {isToday(messageDate) ? "Today" : formatDate(messageDate)}
                </div>
              )}

              <div className="flex items-center gap-x-2">
                {/* Avatar & Tooltip */}
                {(isSameSender(messages, m, i, activeUser.id) ||
                  isLastMessage(messages, i, activeUser.id)) && (
                    <div className="relative group">
                      {/* Avatar Image */}
                      <img
                        className="w-8 h-8 rounded-full object-cover"
                        src={m.sender?.profilePic || "/default-avatar.png"}
                        alt={m.sender?.name}
                      />
                      {/* Tooltip */}
                      <div className="absolute left-10 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                        {m.sender?.name}
                      </div>
                    </div>
                  )}

                {/* Message Bubble */}
                <span
                  className="tracking-wider text-[15px] font-medium relative px-4 py-2 max-w-[460px] rounded-lg"
                  style={{
                    backgroundColor: m.sender._id === activeUser.id ? "#268d61" : "#f0f0f0",
                    marginLeft: isSameSenderMargin(messages, m, i, activeUser.id),
                    marginTop: isSameUser(messages, m, i, activeUser.id) ? 3 : 10,
                    borderRadius: m.sender._id === activeUser.id ? "10px 10px 0px 10px" : "10px 10px 10px 0",
                    color: m.sender._id === activeUser.id ? "#fff" : "#848587",
                  }}
                >
                  {m.message}
                  <span
                    className="block text-xs text-right mt-1"
                    style={{
                      color: m.sender._id === activeUser.id ? "#e6e6e6" : "#848587",
                    }}
                  >
                    {messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </span>
              </div>
            </React.Fragment>
          );
        })
      }
    </ScrollableFeed>
  );
}

export default MessageHistory;
