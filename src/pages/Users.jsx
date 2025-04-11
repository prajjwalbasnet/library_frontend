import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Users = () => {
  const { getAllUsers, userList } = useAuth();

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* ------Sidebar------- */}
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />

        {/* -----Main content------ */}
        <div className="flex flex-col m-3">
          <h1 className="m-3 text-blue-800 font-medium text-2xl">
            Registered Users
          </h1>

          <Table className="m-3">
            <TableHeader className="bg-gray-200">
              <TableRow>
                <TableHead className="">Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="">Role</TableHead>
                <TableHead className="">No. of Books Borrowed</TableHead>
                <TableHead className="">Registered On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userList.length !== 0 &&
                userList.map((user) => (
                  <TableRow className="" key={user._id}>
                    <TableCell className="font-medium">
                      {user.studentId}
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="">{user.role}</TableCell>
                    <TableCell className="text-center">
                      {user.borrowedBooks.length === 0
                        ? "0"
                        : user.borrowedBooks.length}
                    </TableCell>
                    <TableCell className="text-center">
                      {new Date(user.createdAt).toLocaleDateString("en-GB")}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Users;
