import React, { useState } from 'react'
import bgImg from '../assets/login_bg.jpg'
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { Button } from "@/components/ui/button"
import { FaAddressCard } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const Login = () => {

  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName:'',
    email:'',
    studentId:'',
    password:''
  })

  const handleTogglePaassword = () => {
    setShowPassword(!showPassword)
  }

  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData({
      ...formData,
      [name]:value
    })
  }

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Reset form data when switching modes
    setFormData({
      fullName: "",
      email: "",
      studentId: "",
      password: ""
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault()
  }


  return (
    <div className='flex min-h-screen bg-linear-to-r from-blue-500 to-blue-800 items-center justify-center '>
      
      <div className='container max-w-[70%] h-[60vh] bg-white flex flex-row'>

        <form onSubmit={handleSubmit} className='flex flex-1/2 flex-col m-3 gap-3'>
          <div className=' flex flex-col items-center gap-1 text-center justify-center'>
            <p className=' text-2xl text-blue-800 font-lg'>{isLogin ? 'Login' : 'Sign Up'}</p>
            <div className='h-[1.5px] bg-blue-800 w-7'></div>
          </div>

          {!isLogin &&  
          (<div className='flex items-center mt-6'>
            <input type="text" 
                name='fullName' value={formData.fullName} onChange={handleChange} placeholder='Enter your fullname' className='absolute border-b border-gray-300 px-8 py-2 outline-none w-xs'/>
            <FaUser className='relative mx-2 text-lg text-blue-800'/>
          </div>)
          }

          <div className={`flex items-center ${isLogin ? 'mt-15' :'mt-6'}`}>
            <input type="email" placeholder='Enter your email' 
                name='email' value={formData.email} onChange={handleChange} className='absolute border-b border-gray-300 px-8 py-2 outline-none w-xs'/>
            <MdEmail className='relative mx-2 text-lg text-blue-800'/>
          </div>

          {!isLogin &&
          (<div className='flex items-center mt-6'>
            <input type="text" placeholder='Enter your srudent Id' 
                name='studentId' value={formData.studentId} onChange={handleChange} className='absolute border-b border-gray-300 px-8 py-2 outline-none w-xs'/>
            <FaAddressCard className='relative mx-2 text-lg text-blue-800'/>
          </div>)
          }

          <div className='flex items-center mt-3 relative' >
            <input type={showPassword ? 'text' : "password"} 
                  name='password' value={formData.password} onChange={handleChange} placeholder='Enter your password' className='border-b border-gray-300 px-8 py-2 outline-none w-xs'/>
            <RiLockPasswordFill className='absolute mx-2 text-lg text-blue-800'/>
            {showPassword ?
             <FaEyeSlash onClick={handleTogglePaassword} className='absolute text-blue-800 right-4 cursor-pointer'/>:
             <FaEye onClick={handleTogglePaassword} className='absolute text-blue-800 right-4 cursor-pointer'/> 
             }
          </div>
 
          <Button type='submit' className={`bg-blue-800 text-white text-md cursor-pointer hover:bg-blue-900 ${isLogin ? 'mt-10' : 'mt-8'}`}>{isLogin ? 'Login': 'Sign Up'}</Button>

          <p className='mt-2 text-gray-500'>
            {isLogin ? (
              <>Don't have an account? <span className='text-blue-800 cursor-pointer' onClick={toggleAuthMode}>Sign Up</span></>
            ) : (
              <>Already have an account? <span className='text-blue-800 cursor-pointer' onClick={toggleAuthMode}>Login</span></>
            )}
          </p>

        </form>

        <div className='flex-2/3'>
          <img className='w-full h-full bg-cover' src={bgImg} alt="" />
        </div>
        
      </div>
      
    </div>
  )
}

export default Login
