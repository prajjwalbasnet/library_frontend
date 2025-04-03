import { createContext, useContext, useState } from "react";
import axios from "axios";


const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)


    const API_URL = import.meta.env.VITE_BACKEND_URL

    const registerUser = async (userData) => {

        setLoading(true)
        setError(null)

        try {         
            const response = await axios.post(`${API_URL}/api/user/register`, userData)

            // -----store token if retuned immediately----
            if(response.data.token){
                localStorage.setItem('auth_token', response.data.token)
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
            }

            setLoading(false)
            return response.data
            
        } catch (error) {
            console.error('Registration error', error)
            setError(error.response?.data?.message || 'Registration Failed')
            setLoading(false)
            throw error
        }
    }

    const verifyEmail = async (verificationData) => {

        setLoading(true)
        setError(null)

        try {
            
            const response = await axios.post(`${API_URL}/api/user/verify`, verificationData)

            if(response.data.user){
                setUser(response.data.user)
            }

            if(response.data.token){
                localStorage.setItem('auth_token', response.data.token)
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
            }
            setLoading(false)
            return response.data

        } catch (error) {
            setError(error.response?.data?.message || 'Verification failed');
            setLoading(false);
            throw error;
        }
    }

    const resendVerificationCode = async (email) => {

        setLoading(true)
        setError(null)

        try {
            
            const response = await axios.post(`${API_URL}/api/user/resend-verification`, {email})
            setLoading(false)
            return response.data
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to resend verification code');
            setLoading(false);
            throw error;
        }
    }

    const loginUser = async(userData) => {

        setLoading(true)
        setError(null)
         
        try {
            
            const response = await axios.post(`${API_URL}/api/user/login`, userData)

            if(response.data.user){
                setUser(response.data.user)
            }

            if(response.data.token){
                localStorage.setItem('auth_token', response.data.token)
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
            }

            setLoading(false)
            console.log(response.data.user)
            return response.data
        } catch (error) {
            console.error('Login error:', error)
            setError(error.response?.data?.message || 'Login failed')
            setLoading(false)
            throw error
        }
    }

    const logout = async () => {
        try {
          // Call the backend logout endpoint with proper error handling
          await axios.post(`${API_URL}/api/user/logout`);
          console.log('Logout API call successful');
        } catch (error) {
          console.error('Error during logout:', error);
          // Don't let API errors prevent logout
        } finally {
          // Always clear local data regardless of server response
          setUser(null);
          localStorage.removeItem('auth_token');
          delete axios.defaults.headers.common['Authorization'];
          console.log('Local logout completed');
        }
        
        return true;
      };

      
       


    return (
        <AuthContext.Provider value={
            {
                user,
                loading,
                error,
                registerUser,
                verifyEmail,
                resendVerificationCode,
                loginUser,
                logout,
            }
        }>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}