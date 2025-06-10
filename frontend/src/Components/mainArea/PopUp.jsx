import React, { useState } from 'react';
import './PopUp.css';
import './LeftPane.css'
import axios from "axios"
import { useAuth } from '../../store/auth';
import cancel from '../../image/cancel.png'

const Modal = (props) => {
  const [upload, setUpload] = useState(false)

  const { token } = useAuth()
  const { setpopupshow, firstrender } = props
  const [formData, setFormData] = useState({
    title: '',
  });
  const [image, setImage] = useState("")
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

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
    const formdata = new FormData();
    formdata.append('image', image);
    formdata.append('title', formData.title);

    try {
      const result = await axios.post(
        'http://localhost:3000/sendpost',
        formdata,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      firstrender();
      console.log(result.data);
    } catch (err) {
      console.error(err);
    }
    setpopupshow(false)
  };

  console.log(formData.title)
  return (
    <div className="modal">
      <div className="modal-content">
        <div className='cancel'><button className="btn btn-danger cancel-btn2" onClick={() => setpopupshow(false)}><img src={cancel}></img></button></div>
        <div className="modal-data">
          <div className="data">
            {upload ? (
              <div id="image-profile" style={{ backgroundImage: `url(${image && URL.createObjectURL(image)})` }}></div>
            ) : (
              'Upload Your Image'
            )}
          </div>
        </div>
        <div className='middleUpper'>
          <div className='middle-content'>
            <input type="file" class="form-control postimage" id="customFile" onChange={getimagepreview} />
            <input type="email" class="form-control postcomment" id="exampleFormControlInput1" placeholder="Enter the Caption" onChange={handleChange} name='title' value={formData.title}></input>
          </div>
        </div>
        <button className="btn btn-dark cancel-btn" onClick={submit}>POST</button>
      </div>
    </div>
  );
};

export default Modal;
