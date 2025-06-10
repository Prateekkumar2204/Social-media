import React from 'react'
import '../Scss/Contactus.scss';
import ayush3060 from "../image/ayush3060.jpeg"
import ayush3061 from "../image/ayush3061.jpeg"
import aruni from "../image/aruni.jpeg"

const ContactUs = () => {
  return (
    <div className='outer'>
    <div className="contactus-main">
      <div class="card card-content-1 names"  >
      <img src={ayush3060} alt="Gold Medal" className="image-contactus" />
         <div class="card-body">
           <h5 class="card-title">Ayush Kumar</h5>
           <p class="card-text">Pursuing B.tech from NIT Allahabad in CSE</p>
           <a href="https://www.linkedin.com/in/ayush-kumar-713b06269?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" class="btn btn-primary">LinkedIn Profile</a>
         </div>
      </div>
      <div class="card card-content-1 names" >
      <img src={ayush3061} alt="Gold Medal" className="image-contactus" />
         <div class="card-body ">
           <h5 class="card-title">Ayush Kumar</h5>
           <p class="card-text">Pursuing B.tech from NIT Allahabad in CSE</p>
           <a href="https://www.linkedin.com/in/ayush-kumar-243005271?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" class="btn btn-primary">LinkedIn Profile</a>
         </div>
      </div>
      <div class="card card-content-1 names" >
      <img src={aruni} alt="Gold Medal" className="image-contactus" />
         <div class="card-body">
           <h5 class="card-title">Aaruni Awasthi</h5>
           <p class="card-text">Pursuing B.tech from NIT Allahabad in CSE</p>
           <a href="https://www.linkedin.com/in/aaruni-awasthi-219828269/" class="btn btn-primary">LinkedIn Profile</a>
         </div>
      </div>
      </div>
      </div>
  )
}

export default ContactUs