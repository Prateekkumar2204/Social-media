import React,{useState} from 'react'
import './ChatContainer.css'

const ChatContainer = (props) => {
    const messages=props.currFriendChat
    const socket=props.socket
  return (
    <div className="friends-area-container right-friend-request2">
            <div className="friends-area">
              {messages.map((messages, index) => (
                <div className={`message-inside ${messages.fromUser ? "sended" : "received" }`} key={index}>
                <div key={index} className={`search-box messages-chat${messages.fromUser ? "2" : "1" } search-friend-out ${messages.fromUser ? "sended" : "received" }`}>
                  <div className="search-out">
                    <div className="search-item">{messages.message}</div>
                  </div>
                </div>
                </div>
              ))}
            </div>
    </div>
    
  )
}

export default ChatContainer