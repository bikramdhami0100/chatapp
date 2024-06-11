"use client"
import React, { useState ,useEffect} from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
function LogIn({show,setShow}) {
  const router=useRouter();
  const [token,setToken]=useState();
  const [formData, setFormData] = useState({
   
    email: '',
    password: '',
    
  });

  const handleChange = (e) => {
     
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Handle form submission logic here
    // console.log('Form Data:', formData);
    const sendUser=await fetch("http://localhost:4000/login",{
      method:"POST",
      headers:{
        "Content-type":"application/json"
      },
      body:JSON.stringify(formData)
    })
    const respone=await sendUser.json()
    if (respone.token) {
      Cookies.set('token',respone.token , {
        expires: 7, // 1 week
        // secure: process.env.NODE_ENV !== 'development',
        // sameSite: 'strict',
      });
      router.push("/home")
      // console.log(respone.token)
    }
    
  };

useEffect(()=>{
  
    const savetoken=Cookies.get('token');
    setToken(savetoken);
    // console.log(savetoken)
     if (token!==undefined) {
      router.push("/home")
     }

},[]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full text-black max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Log In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
         
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
         
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Log In
          </button>

        </form>
        <div>
           if you have not account ? <button onClick={()=>{
            setShow(false);
           }}>Sign Up</button>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
