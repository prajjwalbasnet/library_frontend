import React from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

const Books = () => {
  return (
    <div className='flex h-screen w-screen overflow-hidden'>
        {/* ------Sidebar------- */}
      <Sidebar/>

        <div className='flex flex-col flex-1 overflow-hidden'>

            <Navbar/>

            {/* -----Main content------ */}
            <div>
                
            </div>

        </div>

    </div>
  )
}

export default Books
