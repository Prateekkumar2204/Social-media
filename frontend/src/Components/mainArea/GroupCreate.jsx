import React, { useState } from 'react';
import './GroupCreate.css';
import './LeftPane.css'
import { useAuth } from '../../store/auth';
import cancel from '../../image/cancel.png'

const Modal = (props) => {

  const { token } = useAuth()
  const { toBeAdded, setToBeAdded, setGroupAdded } = props
  const [formData, setFormData] = useState({
    title: '',
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

  };
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
        //socket=io(http://localhost:5173)
        let obj = data.msg
        console.log(obj)
        setCurrFriend(obj)
      }
    } catch (error) {
      console.log(`${error}`)
    }
  }
  const submit = async (e) => {
    if (formData.title.length > 0) {
      e.preventDefault();
      const newArray = [];
      for (let i = 0; i < toBeAdded.length; i++) {
        if (!toBeAdded[i].state) {
          newArray.push(toBeAdded[i]._id); // Corrected here
        }
      }
      try {
        const res = await fetch(`http://localhost:3000/creategroup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: formData.title,
            arr: newArray
          })
        });
        if (res.ok) {
          const data = await res.json();
          setGroupAdded(false);
          console.log(data);
          firstRender()
        }
      } catch (error) {
        console.log(`${error}`);
      }
    } else {
      console.log("error occurred");
    }
  };
  
  
  function handleClick(index) {
    setToBeAdded((prev) => {
      return prev.map((friend) => {
        return friend.index === index ? { ...friend, state: !friend.state } : friend
      })
    })
  }

  function handleClick2() {
    setGroupAdded(false);
  }


  console.log(formData.title)
  return (
    <div className="modal">
      <div className="modal-content">
        <div className='cancel'><button className="btn btn-danger cancel-btn2" onClick={handleClick2}><img src={cancel}></img></button></div>
        <div className="modal-data2">
          <div className="data2">
            {toBeAdded.map((friend, index) => {
              return (
                <div key={index} className="search-member search-friend-out">
                  <div className="search-out">
                    <div className="search-item">{friend.name}</div>
                    <div className="search-item">{friend.email}</div>
                  </div>
                  {friend.state ? <button className="btn btn-success invite-btn" onClick={() => handleClick(index)}>ADD</button> : <button className="btn btn-danger invite-btn" onClick={() => handleClick(index)}>REMOVE</button>}
                </div>
              )
            })}
          </div>
        </div>
        <div className='middleUpper'>
          <div className='middle-content'>
            <input type="email" class="form-control postcomment" id="exampleFormControlInput1" placeholder="Enter Group Name" onChange={handleChange} name='title' value={formData.title}></input>
          </div>
        </div>
        <button className="btn btn-dark cancel-btn" onClick={submit}>CREATE GROUP</button>
      </div>
    </div>
  );
};

export default Modal;
