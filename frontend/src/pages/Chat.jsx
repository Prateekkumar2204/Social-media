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
    arrivalmsg && setCurrFriendChat((prev) => [...prev, arrivalmsg]);
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

    setCurrFriendChat((prev) => [...prev, { fromUser: true, message: msg }]);
    setMsg("");
  };

  /* ---------------- LOAD CHAT ---------------- */
  const chatFriend = async (ide) => {
    setCurrChat(ide);
    setCurrFriendChat([]);

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
    <div className="upper-container1">
      {RoomPopUp && (
        <RoomPop
          setRoomPopUp={setRoomPopUp}
          socket={socket}
          currChat={currChat}
        />
      )}

      <div className="upper-container-friend1">
        {/* ---------------- LEFT FRIEND LIST ---------------- */}
        <div className="left-friend1">
          <div className="form-group1">
            <div className="timer-area-text21">FRIENDS</div>
          </div>

          <div className="friends-area-container1">
            <div className="friends-area1">
              {currFriend.map((friend, index) => (
                <div
                  key={index}
                  className="search-box1 search-friend-out1"
                  style={{
                    backgroundColor: "#E6DFF0",
                    color: "black",
                    marginTop: "10px",
                  }}
                  onClick={() => chatFriend(friend._id)}
                >
                  <div className="search-out1">
                    <div className="search-item1">{friend.name}</div>
                    <div className="search-item1">{friend.email}</div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-dark search-button1"
                    onClick={() => setRoomPopUp(true)}
                  >
                    <img src={room} alt="Video Call" className="medal1" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---------------- RIGHT CHAT AREA ---------------- */}
        <div className="right-friend3">
          <div className="heading1">CHAT</div>

          <div
            className="friends-area-container1 right-friend-request1"
            style={{ backgroundColor: "#E6DFF0" }}
            ref={scrollRef}
          >
            {!currChat ? (
              <Welcome />
            ) : currFriendChat.length === 0 ? (
              <div className="empty-state1">
                <img
                  src="https://png.pngtree.com/png-clipart/20210826/ourmid/pngtree-purple-linear-filled-communication-right-click-message-sending-icon-design-png-image_3455147.jpg"
                  alt="Start conversation"
                  className="empty-image1"
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
            <div className="button-container1">
              <form className="input-container1" onSubmit={sendMessage}>
                <input
                  type="text"
                  className="form-control input-message1 input-msgg1"
                  placeholder="Type message"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-dark submit-button1"
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