import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useAuth } from '../context/AuthContext'
import { Button } from "@/components/ui/button" 
import { toast } from 'react-toastify'


const VerifyEmail = () => {

  const {verifyEmail, resendVerificationCode, loading, error} = useAuth()

  const navigate = useNavigate()
  const location = useLocation()

  const [value, setValue] = useState('')
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState('')

  useEffect(()=> {

    const queryParams = new URLSearchParams(location.search)
    const userIdParams = queryParams.get('userId')

    if(userIdParams){
      setUserId(userIdParams)
    } else{
      toast.error("User Id missing. Please registering try again")
    }

    const storedEmail = localStorage.getItem('registration_email')
    if(storedEmail){
      setEmail(storedEmail)
    }

  },[location])

  const handleVerify = async() => {

    if (value.length !== 6) {
      toast.error("Please enter the complete 6-digit code")
      return
    }

    try {
      const response = await verifyEmail({
        userId,
        verificationCode: Number(value)
      })

      toast.success(response.message || "Email verified Successfully")

      setTimeout(()=> {
        navigate('/')
      }, 1000)
    } catch (error) {
      console.error("Verification error:", err)
      toast.error(error || "Verification failed")
    }
  }

  const handleResend = async () => {

    if(!email){
      toast.error("Email missing")
      return
    }

    try {
      const response = await resendVerificationCode(email)
      toast.success(response.message || 'Verification code has been resent to your email') 
    } catch (error) {
      console.error("Resend error:", err)
      toast.error(error || "Failed to resend verification code")
    }

  }

  return (
    <div className='h-screen w-screen flex items-center justify-center'>

      <div className='flex flex-col px-5 py-5 items-center  border border-gray-300 rounded-lg'>
        <h1 className='text-blue-800 font-medium text-4xl mb-6'>Verify Your Email</h1>
        <p className='text-gray-500 mb-6 text-base'>Enter the 6 digits code sent to email</p>

        <div className='mb-3'>
          <InputOTP
            value = {value}
            onChange={setValue}
            maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0}/>
              <InputOTPSlot index={1}/>
            </InputOTPGroup>
            <InputOTPSeparator className='text-gray-400'/>
            <InputOTPGroup>
              <InputOTPSlot index={2}/>
              <InputOTPSlot index={3}/>
            </InputOTPGroup>
            <InputOTPSeparator className='text-gray-400' />
            <InputOTPGroup>
              <InputOTPSlot index={4}/>
              <InputOTPSlot index={5}/>
            </InputOTPGroup>
          </InputOTP>
        </div>

        <p className='text-gray-500 my-3 text-base'>Dont't receive the Code? 
          <span 
            className='text-blue-800 text-base font-medium cursor-pointer'
            onClick={handleResend}
            > 
            Resend code
            </span></p>

        <Button 
          className='w-full m-auto bg-blue-800 text-white hover:bg-blue-700 cursor-pointer mt-4 text-base'
          onClick = {handleVerify}
          disabled = {loading || value.length !== 6}
          >Verify</Button>

        {error && <p className='text-red-500 mt-3'>{error}</p>}

      </div>
      
    </div>
  )
}

export default VerifyEmail




