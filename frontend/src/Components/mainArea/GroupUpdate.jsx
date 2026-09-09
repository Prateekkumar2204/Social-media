import React, { useState } from 'react';
import './GroupUpdate.css';
import './LeftPane.css'
import axios from "axios"
import { useAuth } from '../../store/auth';
import cancel from '../../image/cancel.png'

const Modal2 = (props) => {

  const { currGroup,addMem,removeMem,setAddMem, setRemoveMem,toBeAdded,setToBeAdded} = props
  const [formData, setFormData] = useState({
    title: '',
  });
  const [image, setImage] = useState("")
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

  };
  const firstRender = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/getgroups`, {
        method: "GET",
        credentials: "include",
      })
      if (response) {
        const data = await response.json()
        //socket=io(http://localhost:5173)
        let obj = data.msg
        console.log(obj)
        setCurrFriend(obj)
        firstRender()
      }
    } catch (error) {
      console.log(`${error}`)
    }
  }
const submit = async () => {
    
      const ide=currGroup
      const newArray = [];
      const newArray2=[]
      for (let i = 0; i < toBeAdded.length; i++) {
        if (!toBeAdded[i].state) {
          newArray.push(toBeAdded[i]._id);
        } else {
          newArray2.push(toBeAdded[i]._id); 
        }
      }
      if(addMem===true){
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/addmembers`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials:"include",
              body: JSON.stringify({
                groupId: ide,
                members: newArray,
              })
            });
            if (res.ok) {
              const data = await res.json();
              setRemoveMem(false);
              setAddMem(false);
              console.log(data);
              firstRender()
            }
          } catch (error) {
            console.log(`${error}`);
          }
      }
      else{
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/removemembers`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
         
              },
              credentials: "include",
              body: JSON.stringify({
                groupId: ide,
                members: newArray2,
              })
            });
            if (res.ok) {
              const data = await res.json();
              setRemoveMem(false);
              setAddMem(false);
              console.log(data);
              firstRender()
            }
          } catch (error) {
            console.log(`${error}`);
          }
      }
      
    
  };
  
  
  
   function handleClick(index){
        setToBeAdded((prev) => {
            return prev.map((friend)=>{
                return friend.index===index ? {...friend, state:!friend.state}:friend
            })
        })
   } 

   function handleClick2(){
    setRemoveMem(false);
    setAddMem(false)
   }


  console.log(formData.title)
  return (
    <div className="modal">
      <div className="modal-content">
        <div className='cancel'><button className="btn btn-danger cancel-btn2" onClick={handleClick2}><img src={cancel}></img></button></div>
        <div className="modal-data2">
          <div className="data2">
            {toBeAdded.map((friend, index)=>{
                return (
                    <div key={index} className="search-member search-friend-out">
                        <div className="search-out">
                            <div className="search-item">{friend.name}</div>
                            <div className="search-item">{friend.email}</div>
                        </div>
                        {friend.state ? <button className="btn btn-success invite-btn" onClick={()=>handleClick(index)}>ADD</button> : <button className="btn btn-danger invite-btn" onClick={()=>handleClick(index)}>REMOVE</button>}
                  </div>
                )
            })}
          </div>
        </div>
        <div className='middleUpper'>
          
        </div>
        <button className="btn btn-dark cancel-btn" onClick={() => submit()}>UPDATE GROUP</button>
      </div>
    </div>
  );
};

export default Modal2;
