// friends.jsx
import React, { useState ,useRef,useEffect} from 'react';
import '../Scss/Chat.scss';
import room from "../image/icons8-video-call-50 (1).png";
import { useAuth } from '../store/Auth';
import {io} from "socket.io-client"
import Welcome from '../Components/ChatArea/Welcome.jsx'
import ChatContainer from '../Components/ChatArea/ChatContainer.jsx'
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import RoomPop from "../Components/mainArea/RoomPopUp.jsx"

  const Friends = () => {
  const [currFriend, setCurrFriend] = useState([])
  const [currChat, setCurrChat] = useState(undefined)
  const [msg, setMsg] = useState("");
  //const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currFriendChat,setCurrFriendChat]=useState([])
  const [arrivalmsg,setArrivalmsg]=useState([])
  const [RoomPopUp, setRoomPopUp]=useState(false)
  const scrollRef = useRef();

  const sendChat = (event) => {
    
  if (msg.length > 0) {
    handleSendMsg(msg);
    setMsg("");
  }
  };
  
  
  const { token,setUser,user,socket } = useAuth()
  console.log(user)
  console.log(token)
  const id = user._id

  useEffect(()=>{
   
    console.log(socket)
    //socket.emit("add-user",id)
    if(socket){
      socket.emit("add-user", user._id)
      socket.on("msg-receive",(msg)=>{
        console.log(msg)
        setArrivalmsg({fromUser:false,message:msg.message})
      })
      socket.on("video-call-receive",(msg)=>{
        console.log(msg)
        window.location=`videocall?room=${msg.message}`
      })
    }
    console.log("here i am boii")
  },[])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);

  const sendMessage=async(e)=>{
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:3000/sendmessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ide:currChat,
          content:msg
        })
      })
      if (response) {
        const data = await response.json()
        console.log("all done bhai")
        socket.emit("send-msg",{
          to:currChat,
          from:id,
          message:msg
        })
        setCurrFriendChat([...currFriendChat,{fromUser:true,message:msg}])


      }
    } catch (error) {
      console.log(`${error}`)
    }
  }
  useEffect(()=>{
    
  },[])

  useEffect(()=>{
       arrivalmsg && setCurrFriendChat((prevChat) => [...prevChat, arrivalmsg])
  },[arrivalmsg])

  const chatFriend=async(ide)=>{
    setCurrChat(ide)

    try {
      const response = await fetch(`http://localhost:3000/getmessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ide
        })
      })
      if (response) {
        const data = await response.json()
        let obj = data.msg
        console.log(obj)
        setCurrFriendChat(obj)
      }
    } catch (error) {
      console.log(`${error}`)
    }
  }
  const firstRender = async () => {
    try {
      const response = await fetch(`http://localhost:3000/myfriends`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response) {
        const data = await response.json()
        //socket=io(http://localhost:5173)
        socket.emit("add-user", user._id)
        let obj = data.msg
        console.log(obj)
        setCurrFriend(obj)
      }
    } catch (error) {
      console.log(`${error}`)
    }
  }
  function handleRoom(){
    setRoomPopUp(true);
  }

  React.useEffect(() => {
    firstRender()
  }, [])

  return (
    <div className="upper-container">
      {RoomPopUp && <RoomPop setRoomPopUp={setRoomPopUp} socket={socket} currChat={currChat}/>}
      <div className="upper-container-friend">
        <div className="left-friend">
          <div className="form-group">
            <div className="timer-area-text2">FRIENDS</div>
          </div>
          
            <div className="friends-area-container">
              <div className="friends-area">
                {currFriend.map((friend, index) => (
                  <div key={index} className="search-box search-friend-out" onClick={()=>chatFriend(friend._id)}>
                    <div className="search-out">
                      <div className="search-item">{friend.name}</div>
                      <div className="search-item">{friend.email}</div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-dark search-button"
                      onClick={handleRoom}
                    >
                      <img src={room} alt="Search" className="medal" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
        </div>
        <div className="right-friend">
          <div className="heading">CHAT</div>
          <div className="friends-area-container right-friend-request" ref={scrollRef}>
              {currChat ? <ChatContainer currFriendChat={currFriendChat} socket={socket}/> : <Welcome />}
          </div>
          {currChat && <div className="button-container">
            <form className="input-container" onSubmit={(event) => sendChat(event)}>
                <div className="form-group">
                <input
                  type="text"
                  className="form-control input-message input-msgg"
                  placeholder="Type Message here"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-dark search-button submit-button"
                  onClick={sendMessage}
                >
                  SEND
                </button>
              </div>
            </form>
          </div>}
        </div>
      </div>
    </div>
  );
};

export default Friends;