// src/components/Profile.jsx
import React,{useState} from 'react';
import axios from "axios"
import { useAuth } from '../store/auth';
import '../Scss/Profile.scss'
const Profile = () => {
  const [image,setImage]=useState()
  const {user} =useAuth()
  console.log(user.image)
  console.log(user._id)
  const id=user._id
  const submitImage=async (e)=>{
    e.preventDefault();
    const formdata=new FormData()
    formdata.append('image',image)

    const result = await axios.post(`http://localhost:3000/upload-image/${id}`,
    formdata,
    {
      headers: {"Content-Type": "multipart/form-data"}
    })
    .then(res=>console.log(res))
    .catch(err=>console.log(err))
  }

  console.log(user._id)
  return (
    
    <div className="container container-profile">
      <div className="inner-profile">
        <div className="leftprofile">
          <h2 className="font-weight-bold profiletext mb-3 bg-black text-white profiletext2">Profile</h2>
          <p className="profiletext mt-1 mb-5">{user.name}</p>
          <div>
            <img src={`http://localhost:3000/images/${user.image}`}/>
          </div>
        </div>
        <div className="centerprofile">
          <h2 className="text-center2 bg-black text-white">Information</h2>
              <div className="profile-content">
                <div className="profile-email">
                  <p className="font-weight-bold mb-2 content-text1">Email:</p>
                  <h6 className="text-muted mt-3 content-text2">{user.email}</h6>
                </div>
                <div className="profile-friend">
                  <p className="font-weight-bold mb-2 content-text1">Phone:</p>
                  <h6 className="text-muted mt-2 content-text2">number</h6>
                </div>
              </div>
              <div className="mt-3 profile-lower">
                <div className="profile-lower-inner1">
                  <label className="font-weight-bold upload-text mb-2">Upload Profile Image:</label>
                  <input type="file" className="form-control-file upload-text" onChange={e => setImage(e.target.files[0])} />
                </div>
                  <div className="d-flex profile-lower-inner2">
                    <button className="btn btn-dark ml-2 upload-btn" type="button" onClick={submitImage}>Upload</button>
                  </div>
                </div>
              </div>
              <div className="bottomprofile">
                <h2 className="bg-black text-white text-center2">ScoreCard</h2>
                <div className="profile-lower profile-lower2">
                  <div className="profile-lower-inner1 upload-text">
                    <p className="font-weight-bold">Recent</p>
                    <h6 className="text-muted">{user.highScore}</h6>
                  </div>
                </div>
              </div>
        </div>
      </div>
  );
};

export default Profile;
