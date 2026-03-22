import React, { useState, useRef, useEffect } from 'react';
import '../Scss/Group.scss';
import search1 from "../image/search1.png";
import { useAuth } from '../store/auth';
import Welcome from '../Components/ChatArea/Welcome.jsx';
import GroupChatContainer from '../Components/ChatArea/GroupChatContainer.jsx';
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import Modal from "../Components/mainArea/GroupCreate.jsx";
import Modal2 from "../Components/mainArea/GroupUpdate.jsx";

const Groups = () => {
  const [currFriend, setCurrFriend] = useState([]);
  const [currChat, setCurrChat] = useState(undefined);
  const [msg, setMsg] = useState("");
  const [currFriendChat, setCurrFriendChat] = useState([]);
  const [arrivalmsg, setArrivalmsg] = useState(null);
  const [groupadded, setGroupAdded] = useState(false);
  const [toBeAdded, setToBeAdded] = useState([]);
  const [addMem, setAddMem] = useState(false);
  const [removeMem, setRemoveMem] = useState(false);
  const [membersToBeAdded, setMembersToBeAdded] = useState([]);
  const [membersToBeDeleted, setMembersToBeDeleted] = useState([]);
  const [currGroup, setCurrGroup] = useState();

  const scrollRef = useRef();

  const { token, setUser, user, socket } = useAuth();
  const id = user?._id;

  useEffect(() => {
    if (!socket || !user?._id) return;

    socket.emit("add-grp-user", user._id);

    const handleGroupMsg = (incomingMsg) => {
      setArrivalmsg({
        fromUser: false,
        message: incomingMsg.message,
        name: incomingMsg.name
      });
    };

    socket.on("msg-grp-receive", handleGroupMsg);

    return () => {
      socket.off("msg-grp-receive", handleGroupMsg);
    };
  }, [socket, user]);

  useEffect(() => {
    if (arrivalmsg) {
      setCurrFriendChat((prevChat) => [...prevChat, arrivalmsg]);
    }
  }, [arrivalmsg]);


  const firstRender = async () => {
    try {
      const response = await fetch(`http://localhost:3000/getgroups`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response) {
        const data = await response.json()
        let obj = data.msg
        console.log(obj)
        setCurrFriend(obj)
        socket.emit("add-grp-user", user._id)
      }
    } catch (error) {
      console.log(`${error}`)
    }
  }

  const addition=async(ide)=>{
    let groupId=ide
    try {
      const res = await fetch(`http://localhost:3000/getMembersToAdded`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          groupId
        })
      })
      if (res) {
        const data = await res.json();
        console.log(data);
        if (data.msg && data.msg.length > 0) {
            let newArray=[];
            for(let i=0; i<data.msg.length; i++){
                const newObj={...data.msg[i], state:true ,index:i}
                newArray.push(newObj)
            }
            setMembersToBeAdded(newArray);
            console.log("hello");
        } else {
          console.log("No friends found");
        }
      }
    } catch (error) {
      console.log(`${error}`)
    }
  }

  const subtraction=async(ide)=>{
    let groupId=ide
    try {
      const res = await fetch(`http://localhost:3000/getMembersToRemoved`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          groupId
        })
      })
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        if (data.msg && data.msg.length > 0) {
            let newArray=[];
            for(let i=0; i<data.msg.length; i++){
                const newObj={...data.msg[i], state:false ,index:i}
                newArray.push(newObj)
            }
            setMembersToBeDeleted(newArray);
            console.log("hello");
        } else {
          console.log("No friends found");
        }
      }
    } catch (error) {
      console.log(`${error}`)
    }
  }

  const chatFriend=async(ide)=>{
    setCurrChat(ide)
    let groupId=ide
    try {
      const response = await fetch(`http://localhost:3000/getgroupchat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          groupId
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

  const addgroup = async () => {
    try {
      const res = await fetch(`http://localhost:3000/getMembersToAdded1`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        if (data.msg && data.msg.length > 0) {
            let newArray=[];
            for(let i=0; i<data.msg.length; i++){
                const newObj={...data.msg[i], state:true ,index:i}
                newArray.push(newObj)
            }
            setToBeAdded(newArray);
            setGroupAdded(prev => !prev);
            console.log("hello");
        } else {
          console.log("No friends found");
        }
      } else {
        console.log("Error:", res.status);
      }
      
    } catch (err) {
      console.log("Error:", err.message);
    }
  };
  
  const sendGroupChat = (event) => {
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  const sendMessage=async(e)=>{
    e.preventDefault()

    try {
      const response = await fetch(`http://localhost:3000/sendgroupchat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          groupId:currChat,
          message:msg
        })
      })
      if (response) {
        const data = await response.json()
        console.log("all done bhai")
        socket.emit("send-grp-msg",{
          to:currChat,
          from:id,
          message:msg,
          name:user.name
        })
        setCurrFriendChat([...currFriendChat,{fromUser:true,message:msg,name:user.name}])
      }
    } catch (error) {
      console.log(`${error}`)
    }
  }

  function addmem(ide){
    addition(ide)
    setCurrGroup(ide)
    setAddMem(true)
  }

  function removemem(ide){
    subtraction(ide)
    setCurrGroup(ide)
    setRemoveMem(true)
  }

  React.useEffect(() => {
    firstRender()
  }, [])

  if (!user || !socket) {
    return <div>Loading...</div>;
  }

  return (
    <div className="upper-container44">
      <div className="upper-container-friend44">
        <div className="left-friend44">
          <div className="form-group44 group-form44">
            <div className="timer-area-textgroup44">
                <div className='friendTab44'>GROUP</div>
                <button 
                    className="btn btn-dark search-button44 submit-button44 addGroup44"
                    onClick={addgroup}
                >
                +
                </button>
            </div>
          </div>
          
          <div className="friends-area-container44" >
            {groupadded && <Modal setGroupAdded={setGroupAdded} toBeAdded={toBeAdded} setToBeAdded={setToBeAdded} />}
            {addMem && <Modal2  currGroup={currGroup} addMem={addMem} removeMem={removeMem} setAddMem={setAddMem} setRemoveMem={setRemoveMem} toBeAdded={membersToBeAdded} setToBeAdded={setMembersToBeAdded}/>}
            {removeMem && <Modal2 currGroup={currGroup} addMem={addMem} removeMem={removeMem} setRemoveMem={setRemoveMem} setAddMem={setAddMem} toBeAdded={membersToBeDeleted} setToBeAdded={setMembersToBeDeleted}/>}
            
            <div className="friends-area44" >
              {currFriend.map((friend, index) => (
                <div key={index} style={{ backgroundColor: "#E6DFF0", color:"black", marginTop: "10px" }} className="search-box44 search-friend-out44" onClick={()=>chatFriend(friend._id)}>
                  <div className="search-out44">
                    <div className="search-item44">{friend.name}</div>
                    {user._id===friend.creator_id && 
                      <div className='add-removebtn44'>
                        <button
                          type="button"
                          className="btn btn-success submit-button244"
                          onClick={()=>addmem(friend._id)}
                        >
                          ADD
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger submit-button44"
                          onClick={()=>removemem(friend._id)}
                        >
                          REMOVE
                        </button>
                      </div>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="right-friend44">
          <div className="heading44">GROUP CHAT</div>
          <div className="friends-area-container44 right-friend-request44" style={{ backgroundColor: "#E6DFF0", color:"black" }} ref={scrollRef}>
              {currChat ? <GroupChatContainer currFriendChat={currFriendChat}/> : <Welcome />}
          </div>

          {currChat && <div className="button-container44">
            <form className="input-container44" onSubmit={(event) => sendGroupChat(event)}>
              <div className="form-group44">
                <input
                  type="text"
                  className="form-control input-message input-msgg"
                  placeholder="Type Message here"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                />
                <button
                  type="button"
                  style={{ backgroundColor: "#36013f"}}
                  className="btn btn-dark search-button44 submit-button44"
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

export default Groups;