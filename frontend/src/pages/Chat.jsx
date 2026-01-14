// friends.jsx
import React, { useState, useRef, useEffect } from "react";
import "../Scss/Chat.scss";
import room from "../image/icons8-video-call-50 (1).png";
import { useAuth } from "../store/auth.jsx";
import Welcome from "../Components/ChatArea/Welcome.jsx";
import ChatContainer from "../Components/ChatArea/ChatContainer.jsx";
import RoomPop from "../Components/mainArea/RoomPopUp.jsx";

const Friends = () => {
  const [currFriend, setCurrFriend] = useState([]);
  const [currChat, setCurrChat] = useState(undefined);
  const [msg, setMsg] = useState("");
  const [currFriendChat, setCurrFriendChat] = useState([]);
  const [arrivalmsg, setArrivalmsg] = useState(null);
  const [RoomPopUp, setRoomPopUp] = useState(false);
  const scrollRef = useRef();

  const { token, user, socket } = useAuth();
  const id = user?._id;

  /* ---------------- SOCKET SETUP ---------------- */
  useEffect(() => {
    if (socket && user?._id) {
      socket.emit("add-user", user._id);

      socket.on("msg-receive", (msg) => {
        setArrivalmsg({ fromUser: false, message: msg.message });
      });

      socket.on("video-call-receive", (msg) => {
        window.location = `videocall?room=${msg.message}`;
      });
    }
  }, [socket, user]);

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currFriendChat]);

  /* ---------------- RECEIVE MESSAGE ---------------- */
  useEffect(() => {
    arrivalmsg &&
      setCurrFriendChat((prev) => [...prev, arrivalmsg]);
  }, [arrivalmsg]);

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = async (e) => {
    e.preventDefault();

    if (!msg.trim()) return;

    await fetch("http://localhost:3000/sendmessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ide: currChat,
        content: msg,
      }),
    });

    socket.emit("send-msg", {
      to: currChat,
      from: id,
      message: msg,
    });

    setCurrFriendChat((prev) => [
      ...prev,
      { fromUser: true, message: msg },
    ]);
    setMsg("");
  };

  /* ---------------- LOAD CHAT ---------------- */
  const chatFriend = async (ide) => {
    setCurrChat(ide);
    setCurrFriendChat([]); // reset

    const response = await fetch("http://localhost:3000/getmessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ide }),
    });

    const data = await response.json();
    setCurrFriendChat(data.msg || []);
  };

  /* ---------------- LOAD FRIENDS ---------------- */
  const firstRender = async () => {
    const response = await fetch("http://localhost:3000/myfriends", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    setCurrFriend(data.msg || []);
  };

  useEffect(() => {
    firstRender();
  }, []);

  /* ---------------- UI ---------------- */
  return (
    <div className="upper-container">
      {RoomPopUp && (
        <RoomPop
          setRoomPopUp={setRoomPopUp}
          socket={socket}
          currChat={currChat}
        />
      )}

      <div className="upper-container-friend">
        {/* ---------------- LEFT FRIEND LIST ---------------- */}
        <div className="left-friend">
          <div className="form-group">
            <div className="timer-area-text2">FRIENDS</div>
          </div>

          <div className="friends-area-container">
            <div className="friends-area">
              {currFriend.map((friend, index) => (
                <div
                  key={index}
                  className="search-box search-friend-out"
                  style={{
                    backgroundColor: "#E6DFF0",
                    color: "black",
                    marginTop: "10px",
                  }}
                  onClick={() => chatFriend(friend._id)}
                >
                  <div className="search-out">
                    <div className="search-item">{friend.name}</div>
                    <div className="search-item">{friend.email}</div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-dark search-button"
                    onClick={() => setRoomPopUp(true)}
                  >
                    <img src={room} alt="Video Call" className="medal" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---------------- RIGHT CHAT AREA ---------------- */}
        <div className="right-friend">
          <div className="heading">CHAT</div>

          <div
            className="friends-area-container right-friend-request"
            style={{ backgroundColor: "#E6DFF0" }}
            ref={scrollRef}
          >
            {!currChat ? (
              <Welcome />
            ) : currFriendChat.length === 0 ? (
              // 🟢 EMPTY STATE ONLY AFTER OPENING CHAT
              <div className="empty-state">
                <img
                  src="https://png.pngtree.com/png-clipart/20210826/ourmid/pngtree-purple-linear-filled-communication-right-click-message-sending-icon-design-png-image_3455147.jpg"
                  alt="Start conversation"
                  className="empty-image"
                />
                <h4>Start your conversation</h4>
              </div>
            ) : (
              <ChatContainer
                currFriendChat={currFriendChat}
                socket={socket}
              />
            )}
          </div>

          {/* ---------------- MESSAGE INPUT ---------------- */}
          {currChat && (
            <div className="button-container">
              <form className="input-container" onSubmit={sendMessage}>
                <input
                  type="text"
                  className="form-control input-message input-msgg"
                  placeholder="Type message"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-dark submit-button"
                >
                  SEND
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Friends;
