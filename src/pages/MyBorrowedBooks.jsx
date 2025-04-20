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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const MyBorrowedBooks = () => {
  const { user, loadUserFromToken } = useAuth();

  useEffect(() => {
    const loadUser = async () => {
      if (!user) {
        await loadUserFromToken();
      }
    };

    loadUser();
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* ------Sidebar------- */}
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />

        <div className="flex mx-3 my-6">
          <Tabs defaultValue="returned" className="w-full">
            <TabsList>
              <TabsTrigger
                className="w-[200px] data-[state=active]:bg-blue-900 data-[state=active]:text-white"
                value="returned"
              >
                Returned Books
              </TabsTrigger>
              <TabsTrigger
                className="w-[200px] data-[state=active]:bg-blue-900 data-[state=active]:text-white"
                value="non-returned"
              >
                Non-Returned Books
              </TabsTrigger>
            </TabsList>
            <TabsContent value="returned" className="m-2">
              <Table>
                <TableHeader className="bg-gray-200">
                  <TableRow>
                    <TableHead className="">Book Title</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Returned</TableHead>
                    <TableHead className="">View</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user &&
                    user.borrowedBooks.map(
                      (item) =>
                        item.returned === true && (
                          <TableRow key={item.bookId}>
                            <TableCell className="font-medium">
                              {item.bookTitle}
                            </TableCell>
                            <TableCell>
                              {new Date(item.borrowedDate).toLocaleDateString(
                                "en-GB"
                              )}
                            </TableCell>
                            <TableCell className="">
                              {new Date(item.dueDate).toLocaleDateString(
                                "en-GB"
                              )}
                            </TableCell>
                            <TableCell className="">Yes</TableCell>
                          </TableRow>
                        )
                    )}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="non-returned" className="m-2">
              <Table>
                <TableHeader className="bg-gray-200">
                  <TableRow>
                    <TableHead className="">Book Title</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Returned</TableHead>
                    <TableHead className="">View</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user &&
                    user.borrowedBooks.map(
                      (item) =>
                        item.returned === false && (
                          <TableRow key={item.bookId}>
                            <TableCell className="font-medium">
                              {item.bookTitle}
                            </TableCell>
                            <TableCell>
                              {new Date(item.borrowedDate).toLocaleDateString(
                                "en-GB"
                              )}
                            </TableCell>
                            <TableCell className="">
                              {new Date(item.dueDate).toLocaleDateString(
                                "en-GB"
                              )}
                            </TableCell>
                            <TableCell className="">No</TableCell>
                          </TableRow>
                        )
                    )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MyBorrowedBooks;
