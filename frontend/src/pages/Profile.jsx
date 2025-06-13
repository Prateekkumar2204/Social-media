// src/components/Profile.jsx
import React,{useState} from 'react';
import axios from "axios"
import { useAuth } from '../store/auth';
import '../Scss/Profile.scss'
const Profile = () => {
  const [friends, setFriends] = useState([]); 

  const [image,setImage]=useState()
  const {user} =useAuth()
  console.log(user);
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

  console.log(user._id);
  console.log(user);
  console.log(user.createdAt);
  return (
    
    <div className="container container-profile w-full" >
      <div className="inner-profile" >
        <div className="leftprofile" style={{ backgroundColor: '#E6DFF0'}}>
          <h2 className="font-weight-bold profiletext mb-3 profiletext2" style={{ backgroundColor: '#735DA5', color:'#EDE7F6'}}>Profile</h2>
          <div className="leftprofile-top">
            <div className="image">
              <img src={`http://localhost:3000/images/${user.image}`} />
            </div>
          </div>
          <div className="leftprofile-bottom">
    <p className="mt-1 mb-5" style={{fontSize: 32}}>{user.name}</p>
  </div>
        </div>
        <div className="centerprofile" style={{ backgroundColor: '#E6DFF0'}}>
          <h2 className="text-center2" style={{ backgroundColor: '#735DA5', color:'#EDE7F6'}}>Information</h2>
              <div className="profile-content">
                <div className="profile-email">
                  <p className="font-weight-bold mb-2 content-text1">Email:</p>
                  <h6 className="text-muted mt-3 content-text2">{user.email}</h6>
                </div>
                <div className="profile-friend">
                  <p className="font-weight-bold mb-2 content-text1">Member Since:</p>
                  <h6 className="text-muted mt-2 content-text2">{new Date(user.createdAt).toLocaleDateString()}</h6>
                </div>
              </div>
              <div className="mt-3 profile-lower">
                <div className="profile-lower-inner1">
                  <label className="font-weight-bold upload-text mb-2">Upload Profile Image:</label>
                  <input type="file" className="form-control-file upload-text" onChange={e => setImage(e.target.files[0])} />
                </div>
                  <div className="d-flex profile-lower-inner2">
                    <button className="btn btn-dark ml-2 upload-btn" style={{ backgroundColor: '#36013f'}}type="button" onClick={submitImage}>Upload</button>
                  </div>
                </div>
              </div>
              <div className="bottomprofile" style={{ backgroundColor: '#E6DFF0'}}>
                <h2 className="text-white text-center2" style={{ backgroundColor: '#735DA5', color:'#EDE7F6'}}>Friends</h2>
                <div className="profile-lower profile-lower2">
                  <div className="profile-lower-inner1 upload-text">
                    <p className="font-weight-bold">Total Friends: {user.friends?.length || 0}</p>
                  </div>
                </div>
              </div>
        </div>
      </div>
  );
};

export default Profile;
