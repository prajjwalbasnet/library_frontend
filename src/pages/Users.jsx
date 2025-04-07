import React from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"

  


const Users = () => {
  return (
    <div className='flex h-screen w-screen overflow-hidden'>
        {/* ------Sidebar------- */}
      <Sidebar/>

        <div className='flex flex-col flex-1 overflow-hidden'>

            <Navbar/>

            {/* -----Main content------ */}
            <div className='flex flex-col m-3'>

                <h1 className='m-3 text-blue-800 font-medium text-2xl'>Registered Users</h1>

                <Table className='m-3'>
                    <TableHeader className='bg-gray-200'>
                        <TableRow>
                        <TableHead className="">Student ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="">Role</TableHead>
                        <TableHead className="">No. of Books Borrowed</TableHead>
                        <TableHead className="">Registered On</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody >
                        <TableRow className=''>
                        <TableCell className="font-medium">CIHE22336</TableCell>
                        <TableCell>Prajjwal Basnet</TableCell>
                        <TableCell>prajjwal302@gmail.com</TableCell>
                        <TableCell className="">User</TableCell>
                        <TableCell className="text-center">20/07/2023</TableCell>
                        <TableCell className="text-center">20/07/2023</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

        </div>

    </div>
  )
}

export default Users
