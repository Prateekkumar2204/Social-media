import React, { useEffect } from 'react';
import './mainArea.css';
import LeftPane from './LeftPane.jsx';
import like from '../../image/blackheart.png';
import redheart from '../../image/redheart.png'
import comment from '../../image/blackcomment.png';
 
import sahaj from '../../image/sahaj.png'
import PopUp from './PopUp.jsx'
import PopUpUpdate from './PopupUpdate.jsx'
import { useAuth } from '../../store/auth';

export default function MainArea() {
  const [messages, setMessages] = React.useState([])
  const { token } = useAuth()
  const [commentmsg, setCommentmsg] = React.useState("")
  const [currid, setCurrid] = React.useState("")
  const [commentsByPost, setCommentsByPost] = React.useState({});

  const firstrender = async () => {
    try {
      const response = await fetch("http://localhost:3000/getpost", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response) {
        const data = await response.json()
        let obj = data.msg
        console.log(obj)
        setMessages(obj)
      }
    } catch (error) {
      console.log("${error}")
    }
  }

  useEffect(() => {
    firstrender()
  }, [])
  const fetchCommentsByPost = async (postId) => {
  try {
    const response = await fetch(`http://localhost:3000/getcomments/${postId}`);

    const data = await response.json();

    if (response.ok) {
      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: data.comments
      }));
    }
  } catch (error) {
    console.log(error);
  }
};
  const handlelike = async (ide) => {
    try {
      const response = await fetch("http://localhost:3000/addlike", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          postId: ide
        })
      })
      if (response) {
        const data = await response.json()
        console.log(data)
        firstrender()
      }
    } catch (error) {
      console.log("${error}")
    }
  }
const sendcomment = async (ide) => {
  try {
    const response = await fetch("http://localhost:3000/addcommentv2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        postId: ide,
        content: commentmsg
      })
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      setcommentmsg("");
      await firstrender();
      await fetchCommentsByPost(ide);
    } else {
      alert(data.msg);
    }
  } catch (error) {
    console.log(error);
  }
};
  const handledelete = async (ide) => {
    try {
      const response = await fetch("http://localhost:3000/deletepost", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          postId: ide
        })
      })
      if (response) {
        const data = await response.json()
        console.log(data)
        firstrender()
      }
    } catch (error) {
      console.log("${error}")
    }
  }
  const [commentSection, setCommentSection] = React.useState(null);
  const [popupshow, setpopupshow] = React.useState(false);
  const [updatePost, setUpdatepost] = React.useState(false);
async function handleComment(index, postId) {
  if (commentSection === index) {
    setCommentSection(null);
  } else {
    setCommentSection(index);
    await fetchCommentsByPost(postId);
  }
}
  function handleUpdate(ide) {
    setUpdatepost(true);
    setCurrid(ide)
  }

  return (
    <div className="uppercontainer">
      {popupshow && <PopUp setpopupshow={setpopupshow} firstrender={firstrender} />}
      {updatePost && <PopUpUpdate setUpdatepost={setUpdatepost} currid={currid} firstrender={firstrender} />}
      <div className="containerArea">
        <div className="leftPane">
          <LeftPane setpopupshow={setpopupshow} />
        </div>
        <div className="stageArea">
          {messages.map((message, index) => (
            <div key={index} className='post'>
              <div className='user-name'>{message.post.originalName}</div>
              <div className='post-image'>
                <img src={message.post.image} style={{ width: '80%' }} alt="post"></img>
              </div>
              <div className='user-button'>
                <div className='like-comment'>
                  <img src={message.isLiked ? redheart : like} alt="like" onClick={() => { handlelike(message.post._id) }}></img>
                  <div className='likecount'>{message.post.likes.length}</div>
                  <img src={comment} onClick={() => handleComment(index, message.post._id)} alt="comment"></img>
                </div>
                {message.fromSelf && <div className='update-delete'>
                  <button type="button" className="btn btn-warning" onClick={() => { handleUpdate(message.post._id) }}>Update</button>
                  <button type="button" className="btn btn-danger" onClick={() => { handledelete(message.post._id) }}>Delete</button>
                </div>}
              </div>
              <div className='caption'>
                {message.post.originalName}: {message.post.title}
              </div>
              <div className='comments'>
                <form className="input-container send-comment">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control input-message"
                      placeholder="Enter your Comment"
                      value={commentmsg}
                      onChange={(e) => { setCommentmsg(e.target.value) }}
                    />
                    <button
                      type="button"
                      className="btn btn-dark search-button submit-button"
                      style={{ backgroundColor: "#36013f"}}
                      onClick={() => { sendcomment(message.post._id) }}
                    >
                      SEND
                    </button>
                  </div>
                </form>
                {commentsByPost[message.post._id]?.length > 0 ? (
                  commentsByPost[message.post._id].map((comment, commentIndex) => (
                    <div key={commentIndex} className='outer-comment'>
                      <div className='middle-comment'>
                        {comment.userName}
                      </div>
                      <div className='inner-comment'>
                        {comment.content}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='outer-comment'>
                    <div className='inner-comment'>No comments yet</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
