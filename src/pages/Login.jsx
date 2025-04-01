import React, { useState } from 'react'
import bgImg from '../assets/login_bg.jpg'
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { Button } from "@/components/ui/button"
import { FaAddressCard } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const Login = () => {

  const { loading, registerUser, error} = useAuth()
  const navigate = useNavigate()

  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [formData, setFormData] = useState({
    fullName:'',
    email:'',
    studentId:'',
    password:''
  })

  const handleTogglePassword = () => {
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
    setFormErrors({})
  };

  const validateForm = () => {
    const errors = {};
    
    if (!isLogin) {
      if (!formData.fullName.trim()) errors.fullName = 'Name is required';
      
      if (!formData.studentId.trim()) errors.studentId = 'Student ID is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!isLogin && (formData.password.length < 8 || formData.password.length > 16)) {
      errors.password = 'Password must be between 8 to 16 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
 

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(!validateForm()){
      const firstError = Object.values(formErrors)[0]
      toast.error(firstError)
      return
    }

    if(isLogin){
      toast.info("Login not implemented yet")
    }
    else{
      try {
        const response = await registerUser({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          studentId: formData.studentId,
        })
        toast.success(response.message)
        localStorage.setItem('registration_email', formData.email)
        navigate(`/verify_email?userId=${response.userId}`)
      } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message || "Registration failed")
      }
    }
  }


  return (
    <div className='flex min-h-screen bg-linear-to-r from-blue-500 to-blue-800 items-center justify-center '>
      
      <div className='container max-w-[70%] min-h-[60vh] bg-white flex flex-row'>

        <form onSubmit={handleSubmit} className='flex flex-1/2 flex-col m-3 gap-3'>
          <div className=' flex flex-col items-center gap-1 text-center justify-center'>
            <p className=' text-2xl text-blue-800 font-lg'>{isLogin ? 'Login' : 'Sign Up'}</p>
            <div className='h-[1.5px] bg-blue-800 w-7'></div>
          </div>

          {/* Update all your input containers to have a consistent structure */}
        {!isLogin && (
          <div className='flex items-center mt-6 relative w-full'>
            <FaUser className='absolute left-0 mx-2 text-lg text-blue-800'/>
            <input 
              type="text" 
              name='fullName' 
              value={formData.fullName} 
              onChange={handleChange} 
              placeholder='Enter your fullname' 
              className={`w-full border-b ${formErrors.fullName ? 'border-red-500' : 'border-gray-300'} pl-8 py-2 outline-none`}
            />
            {formErrors.fullName && <p className='absolute -bottom-5 text-red-500 text-xs'>{formErrors.fullName}</p>}
          </div>
        )}

        <div className={`flex items-center relative w-full ${isLogin ? 'mt-15' : 'mt-6'}`}>
          <MdEmail className='absolute left-0 mx-2 text-lg text-blue-800'/>
          <input 
            type="email" 
            placeholder='Enter your email' 
            name='email' 
            value={formData.email} 
            onChange={handleChange} 
            className={`w-full border-b ${formErrors.email ? 'border-red-500' : 'border-gray-300'} pl-8 py-2 outline-none`}
          />
          {formErrors.email && <p className='absolute -bottom-5 text-red-500 text-xs'>{formErrors.email}</p>}
        </div>

        {!isLogin && (
          <div className='flex items-center mt-6 relative w-full'>
            <FaAddressCard className='absolute left-0 mx-2 text-lg text-blue-800'/>
            <input 
              type="text" 
              placeholder='Enter your student Id' 
              name='studentId' 
              value={formData.studentId} 
              onChange={handleChange} 
              className={`w-full border-b ${formErrors.studentId ? 'border-red-500' : 'border-gray-300'} pl-8 py-2 outline-none`}
            />
            {formErrors.studentId && <p className='absolute -bottom-5 text-red-500 text-xs'>{formErrors.studentId}</p>}
          </div>
        )}

        <div className='flex items-center mt-6 relative w-full'>
          <RiLockPasswordFill className='absolute left-0 mx-2 text-lg text-blue-800'/>
          <input 
            type={showPassword ? 'text' : "password"} 
            name='password' 
            value={formData.password} 
            onChange={handleChange} 
            placeholder='Enter your password' 
            className={`w-full border-b ${formErrors.password ? 'border-red-500' : 'border-gray-300'} pl-8 py-2 outline-none`}
          />
          {showPassword ? 
            <FaEyeSlash onClick={handleTogglePassword} className='absolute right-0 mx-2 text-blue-800 cursor-pointer'/> : 
            <FaEye onClick={handleTogglePassword} className='absolute right-0 mx-2 text-blue-800 cursor-pointer'/>
          }
          {formErrors.password && <p className='absolute -bottom-5 text-red-500 text-xs'>{formErrors.password}</p>}
        </div>
 
          <Button 
            type='submit' 
            disabled={loading}
            className={`bg-blue-800 text-white text-md cursor-pointer hover:bg-blue-900 ${isLogin ? 'mt-10' : 'mt-8'}`}>{isLogin ? 'Login': 'Sign Up'}</Button>

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
