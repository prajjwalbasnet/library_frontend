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

  // Helper function to render appropriate table content
  const renderBooksTable = (isReturned) => {
    if (!user || !user.borrowedBooks || user.borrowedBooks.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="text-center py-4">
            No books data available
          </TableCell>
        </TableRow>
      );
    }

    const filteredBooks = user.borrowedBooks.filter(
      (book) => book.returned === isReturned
    );

    if (filteredBooks.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="text-center py-4">
            {isReturned ? "No returned books" : "No borrowed books"}
          </TableCell>
        </TableRow>
      );
    }

    return filteredBooks.map((item) => (
      <TableRow key={item.bookId}>
        <TableCell className="font-medium">{item.bookTitle}</TableCell>
        <TableCell>
          {new Date(item.borrowedDate).toLocaleDateString("en-GB")}
        </TableCell>
        <TableCell>
          {new Date(item.dueDate).toLocaleDateString("en-GB")}
        </TableCell>
        <TableCell>{isReturned ? "Yes" : "No"}</TableCell>
        <TableCell></TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
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
                    <TableHead>Book Title</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Returned</TableHead>
                    <TableHead>View</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{renderBooksTable(true)}</TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="non-returned" className="m-2">
              <Table>
                <TableHeader className="bg-gray-200">
                  <TableRow>
                    <TableHead>Book Title</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Returned</TableHead>
                    <TableHead>View</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{renderBooksTable(false)}</TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MyBorrowedBooks;
