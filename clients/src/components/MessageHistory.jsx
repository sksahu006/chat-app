import React from 'react'
import { useSelector } from 'react-redux'
import ScrollableFeed from "react-scrollable-feed"
import { isSameSender, isSameSenderMargin, isSameUser, isLastMessage } from '../utils/logics'
import { Tooltip } from "@chakra-ui/tooltip";
import { Avatar } from "@chakra-ui/avatar";
import "../pages/home.css"

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
    <>
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

                <div className='flex items-center gap-x-[6px]'>
                  {(isSameSender(messages, m, i, activeUser.id) ||
                    isLastMessage(messages, i, activeUser.id)) && (
                      <Tooltip label={m.sender?.name} placement="bottom-start" hasArrow>
                        <Avatar
                          style={{ width: "32px", height: "32px" }}
                          mt="43px"
                          mr={1}
                          cursor="pointer"
                          name={m.sender?.name}
                          src={m.sender?.profilePic}
                          borderRadius="25px"
                        />
                      </Tooltip>
                    )}
                  <span
                    className="tracking-wider text-[15px] font-medium"
                    style={{
                      backgroundColor: `${m.sender._id === activeUser.id ? "#268d61" : "#f0f0f0"}`,
                      marginLeft: isSameSenderMargin(messages, m, i, activeUser.id),
                      marginTop: isSameUser(messages, m, i, activeUser.id) ? 3 : 10,
                      borderRadius: `${m.sender._id === activeUser.id ? "10px 10px 0px 10px" : "10px 10px 10px 0"}`,
                      padding: "10px 18px",
                      maxWidth: "460px",
                      color: `${m.sender._id === activeUser.id ? "#fff" : "#848587"}`,
                      position: "relative",
                    }}
                  >
                    {m.message}
                    <span
                      style={{
                        display: "block",
                        fontSize: "10px",
                        color: `${m.sender._id === activeUser.id ? "#e6e6e6" : "#848587"}`,
                        textAlign: "right",
                        marginTop: "5px",
                      }}
                    >
                      {/* {isToday(messageDate)
                        ? messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : formatDate(messageDate)} */}
                        {messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </span>
                </div>
              </React.Fragment>
            );
          })
        }
      </ScrollableFeed >
    </>
  );
}

export default MessageHistory;