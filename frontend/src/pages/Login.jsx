import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { AuthProvider } from '../store/Auth';
import { useAuth } from '../store/Auth';
import '../Scss/Login.scss';

export default function Login() {
  const navigate = useNavigate();
  const {storeTokenInLS,user,setUser,token,setToken}=useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {email,password}=formData;
    try {
      const res = await fetch("http://localhost:3000/Login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        email,password
      })
    });
    if(res.ok){
      const data=await res.json();
      console.log(data)
      setToken(data.token)
      storeTokenInLS(data.token)
      try{
        const response=await fetch("http://localhost:3000/check",{
         method:"GET",
         headers:{
             Authorization:`Bearer ${data.token}`
         }
        })
        if(response) {
         const data=await response.json()
         console.log(data.msg)
         let obj=data.msg
         console.log(obj)
         setUser(obj)
        }               
     }catch(error){
         console.log(`${error}`)
     }
      
      //localStorage.setItem("token",data.token)
      window.alert("loggedin successfully")
      navigate("/")
     } 
    
    else{
      window.alert("Invalid Credentials")
    }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <section className="login-section ">
      <div className="container login-cont ">
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="text-uppercase text-center loginheading">Sign in</h2>
          <div className="form-outline mb-4 outeremaildiv">
            <input
              name="email"
              placeholder="email"
              type="email"
              id="form2Example17"
              className="form-control form-control-lg forminputemail"
              onChange={handleChange}
            />
           
          </div>

          <div className="form-outline mb-4 outerpassworddiv">
            <input
              name="password"
              type="password"
              placeholder="password"
              id="form2Example27"
              className="form-control form-control-lg forminputpassword"
              onChange={handleChange}
            />
            
          </div>

          <div className="pt-1 loginbtndiv">
            <button className="btn btn-dark btn-lg btn-block loginbtn" type="submit" style={{ backgroundColor: '#000',color:'#EDE7F6' }}>
              Login
            </button>
          </div>
          <p className="mb-4 mt-4 pb-lg-2 loginpara" >
            Don't have an account? <a href="/register" style={{ color: '#8E4585' }}>Register here</a>
          </p>
          
        </form>
      </div>
    </section>
  );
}