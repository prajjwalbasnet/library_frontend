import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useAuth } from '../context/AuthContext'
import { Button } from "@/components/ui/button" 


const VerifyEmail = () => {

  const {verifyEmail, resendVerificationCode, loading, error} = useAuth()

    const navigate = useNavigate()
    const location = useLocation()

  return (
    <div className='h-screen w-screen flex items-center justify-center'>

      <div className='flex flex-col px-5 py-5 items-center  border border-gray-300 rounded-lg'>
        <h1 className='text-blue-800 font-medium text-4xl mb-6'>Verify Your Email</h1>
        <p className='text-gray-500 mb-6 text-base'>Enter the 6 digits code sent to email</p>

        <div className='mb-3'>
          <InputOTP maxLength={6}>
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

        <p className='text-gray-500 my-3 text-base'>Dont't receive the Code? <span className='text-blue-800 text-base font-medium'>Resend code</span></p>

        <Button className='w-full m-auto bg-blue-800 text-white hover:bg-blue-700 cursor-pointer mt-4 text-base'>Verify</Button>

      </div>
      
    </div>
  )
}

export default VerifyEmail




