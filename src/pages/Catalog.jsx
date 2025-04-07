import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

  


const Catalog = () => {
  return (
    <div className='flex h-screen w-screen overflow-hidden'>
        {/* ------Sidebar------- */}
      <Sidebar/>

        <div className='flex flex-col flex-1 overflow-hidden'>

            <Navbar/>

            {/* -----Main content------ */}
            <div className='flex mx-3 my-6'>
                <Tabs defaultValue="borrowed" className="w-full">
                    <TabsList>
                        <TabsTrigger className='w-[200px]' value="borrowed">Borrowed Books</TabsTrigger>
                        <TabsTrigger className='w-[200px]' value="overdue">Overdue Books</TabsTrigger>
                    </TabsList>
                    <TabsContent value="borrowed" className='m-2'>
                        <Table>
                            <TableHeader className='bg-gray-200'>
                                <TableRow>
                                <TableHead className="">Student ID</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead className="">Date & Time</TableHead>
                                <TableHead className="">Return</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody >
                                <TableRow >
                                <TableCell className="font-medium">CIHE22336</TableCell>
                                <TableCell>prajjwal302@gmail.com</TableCell>
                                <TableCell>20/06/2025</TableCell>
                                <TableCell className="">90-2399-329</TableCell>
                                <TableCell className=""><Checkbox/></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TabsContent>
                    <TabsContent value="overdue" className='m-2'>
                        <Table>
                            <TableHeader className='bg-gray-200'>
                                <TableRow>
                                <TableHead className="">Student ID</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead className="">Date & Time</TableHead>
                                <TableHead className="">Return</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody >
                                <TableRow >
                                <TableCell className="font-medium">CIHE22336</TableCell>
                                <TableCell>prajjwal302@gmail.com</TableCell>
                                <TableCell>20/06/2025</TableCell>
                                <TableCell className="">90-2399-329</TableCell>
                                <TableCell className=""><Checkbox/></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs> 
            </div>

        </div>

    </div>
  )
}

export default Catalog
