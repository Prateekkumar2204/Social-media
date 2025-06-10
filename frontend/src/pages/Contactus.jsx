import React from 'react'
import '../Scss/Contactus.scss';
import sahaj from "../image/sahaj.png"
 
const ContactUs = () => {
  return (
    <div className='outer'>
    <div className="contactus-main">
      <div class="card card-content-1 names"  >
      <img src={sahaj} alt="Gold Medal" className="image-contactus" />
         <div class="card-body">
           <h5 class="card-title">sahaj jot singh</h5>
           <p class="card-text">Pursuing B.tech from NIT Allahabad in EE</p>
           <a href="https://www.linkedin.com/in/sahaj9897?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" class="btn btn-primary">LinkedIn Profile</a>
         </div>
      </div>
 
      <div class="card card-content-1 names" >
      <img src={sahaj} alt="Gold Medal" className="image-contactus" />
         <div class="card-body">
           <h5 class="card-title">Prateek kumar</h5>
           <p class="card-text">Pursuing B.tech from NIT Allahabad in EE</p>
           <a href="https://www.linkedin.com/in/sahaj9897" class="btn btn-primary">LinkedIn Profile</a>
         </div>
      </div>
      </div>
      </div>
  )
}

export default ContactUs