import {createContext, useContext,useState,useEffect} from "react"
import {io} from "socket.io-client"
export const AuthContext=createContext();


export const AuthProvider= ({children})=>{
    const [token,setToken]=useState(localStorage.getItem("token"))
    const  socket=new io("http://localhost:3000")
    
    const [user,setUser]=useState({})
    let checking=!!token
    const storeTokenInLS=(serverToken)=>{
        return localStorage.setItem("token",serverToken)
    }

     const LogoutUser=()=>{
        setToken("")
        
        return localStorage.removeItem("token")
     }

     const userAuthentication=async()=>{
        try{
           const response=await fetch("http://localhost:3000/check",{
            method:"GET",
            headers:{
                Authorization:`Bearer ${token}`
            }
           })
           if(response) {
            const data=await response.json()
            console.log(data.msg)
            let obj=data.msg
            console.log(obj)
            
            socket.emit("add-grp-user",obj._id)
            setUser(obj)
            console.log(user)
           }               
        }catch(error){
            console.log(`${error}`)
        }
     }
    
    useEffect(()=>{
        userAuthentication()
    },[])
   return(

   <AuthContext.Provider value={{token,user,checking,storeTokenInLS,LogoutUser,setUser,setToken,socket}}>
       {children}
   </AuthContext.Provider>
   ) 
}

export const useAuth=()=>{
    const authContextValue=useContext(AuthContext)
    if(!authContextValue){
        throw new Error("useAuth used outside of the provider")
    }
    return authContextValue
}