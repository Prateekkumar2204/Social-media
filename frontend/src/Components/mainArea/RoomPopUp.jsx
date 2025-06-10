import React, { useState } from 'react';
import './RoomPopUp.css';
import './LeftPane.css'
import axios from "axios"
import { useAuth } from '../../store/auth';
import cancel from '../../image/cancel.png'

const Modal = (props) => {
  const [upload, setUpload] = useState(false)
  
  //const { token, socket } = useAuth()

  const { setUpdatepost, currid, firstrender, setRoomPopUp,socket ,currChat} = props
  const [formData, setFormData] = useState({
    title: '',
    roomId: ''
  });
  const [image, setImage] = useState("")
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value});

  };
  function getimagepreview(e) {
    setUpload(true)
    setImage(e.target.files[0])
    var imgg = URL.createObjectURL(e.target.files[0])
    var newimg = document.getElementById("image-profile")
    newimg.src = imgg
  }
  const submit = async (e) => {
    e.preventDefault();
    const inviteCode=formData.roomId
    window.location=`videocall?room=${inviteCode}`
    socket.emit("send-video-call",{
      to:currChat,
      message:inviteCode
    })
    try {
      
      console.log(result.data);
    } catch (err) {
      console.error(err);
    }
    setUpdatepost(false)
    firstrender()
  };

  console.log(formData.title)
  return (
    <div className="modal">
      <div className="modal-content">
        <div className='cancel'><button className="btn btn-danger cancel-btn2" onClick={() => setRoomPopUp(false)}><img src={cancel}></img></button></div>
        
        <div className='middleUpper'>
          <div className='middle-content'>
            <input type="text" class="form-control" id="customFile" placeholder='Enter Room Id' name='roomId' onChange={handleChange} value={formData.roomId}/>
            <input type="email" class="form-control postcomment" id="exampleFormControlInput1" placeholder="Enter the Caption" onChange={handleChange} name='title' value={formData.title}></input>
          </div>
        </div>
        <button className="btn btn-dark cancel-btn" onClick={submit}>CREATE ROOM</button>
      </div>
    </div>
  );
};

export default Modal;
