import React, { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  FaUserGraduate,
  FaUser,
  FaEnvelope,
  FaUserShield,
  FaBook,
  FaCalendarAlt,
} from "react-icons/fa";

const Users = () => {
  const { getAllUsers, userList } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllUsers();
  }, []);

  // Filter function for search
  const filteredUsers = userList.filter(
    (user) =>
      user.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Card view for mobile
  const renderUserCard = (user) => {
    return (
      <div key={user._id} className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg text-gray-800">{user.name}</h3>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              user.role === "Admin"
                ? "bg-purple-100 text-purple-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {user.role}
          </span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <FaUserGraduate className="mr-2 text-blue-800" />
            <span className="font-medium mr-2">Student ID:</span>
            <span>{user.studentId}</span>
          </div>

          <div className="flex items-center">
            <FaEnvelope className="mr-2 text-blue-800" />
            <span className="font-medium mr-2">Email:</span>
            <span className="break-all">{user.email}</span>
          </div>

          <div className="flex items-center">
            <FaBook className="mr-2 text-blue-800" />
            <span className="font-medium mr-2">Books Borrowed:</span>
            <span>
              {user.borrowedBooks.length === 0
                ? "0"
                : user.borrowedBooks.length}
            </span>
          </div>

          <div className="flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-800" />
            <span className="font-medium mr-2">Registered On:</span>
            <span>{new Date(user.createdAt).toLocaleDateString("en-GB")}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl text-blue-800 font-medium mb-4">
        Registered Users
      </h1>

      {/* Search input */}
      <div className="mb-4">
        <Input
          placeholder="Search users by name, email, student ID or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Mobile card view */}
      <div className="md:hidden">
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
            No users found
          </div>
        ) : (
          filteredUsers.map((user) => renderUserCard(user))
        )}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block">
        <div className="overflow-x-auto rounded-lg shadow-md">
          <Table>
            <TableHeader className="bg-gray-200">
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-center">Books Borrowed</TableHead>
                <TableHead className="text-center">Registered On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-gray-500"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">
                      {user.studentId}
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.role === "Admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {user.borrowedBooks.length === 0
                        ? "0"
                        : user.borrowedBooks.length}
                    </TableCell>
                    <TableCell className="text-center">
                      {new Date(user.createdAt).toLocaleDateString("en-GB")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Users;
