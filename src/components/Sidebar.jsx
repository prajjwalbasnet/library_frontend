import React, { useState, useEffect } from 'react'
import logo from '../assets/image.png'
import { MdSpaceDashboard } from "react-icons/md";
import { IoBookSharp } from "react-icons/io5";
import { AiFillBook } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { Button } from "@/components/ui/button"
import { NavLink, useLocation } from 'react-router-dom';


const SidebarItem = ({ icon: Icon, label, to, active }) => (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex flex-row items-center gap-2 hover:bg-gray-100 p-2 rounded-md ${isActive ? 'bg-gray-100' : ''}`
      }
    >
      <div className={`relative rounded-sm flex items-center justify-center w-8 h-8 ${active ? 'bg-blue-900' : 'bg-gray-300'}`}>
        <Icon className={`text-xl absolute ${active ? 'text-white' : 'text-gray-600'}`} />
      </div>
      <p className={`text-gray-600 text-md ${active ? 'font-bold': 'font-normal'}`}>{label}</p>
    </NavLink>
  );

const Sidebar = () => {

    const location = useLocation()
    const [activeItem, setActiveItem] = useState('/')

    useEffect(()=>{
        setActiveItem(location.pathname)
    }, [location])


    const navItems = [
        { path: '/', label: 'Dashboard', icon: MdSpaceDashboard },
        { path: '/books', label: 'Books', icon: IoBookSharp },
        { path: '/catalog', label: 'Catalog', icon: AiFillBook },
        { path: '/users', label: 'Users', icon: FaUsers },
        { path: '/add-admin', label: 'Add new Admin', icon: RiAdminFill }
    ];


    return (
        <div className="flex flex-col h-screen w-[240px] border-r border-gray-200 shadow-xl bg-white">

            <div className="flex items-center justify-center py-6">
                <img className="max-w-[110px]" src={logo} alt="CIHE Library" />
            </div>

            <div className="flex flex-col px-3 gap-2 mt-4">
                {navItems.map((item)=> (
                    <SidebarItem 
                        key={item.path}
                        to={item.path}
                        icon={item.icon}
                        label={item.label}
                        active={activeItem === item.path}
                    />
                ))}
            </div>

            <div className='mt-auto p-4'>
                <Button className="bg-blue-900 hover:bg-blue-800 w-full text-white">Logout</Button>
            </div>

        </div>
    )

}

export default Sidebar
