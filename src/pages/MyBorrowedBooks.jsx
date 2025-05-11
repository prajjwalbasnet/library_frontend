import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { MdPreview } from "react-icons/md";
import { FaBookOpen, FaCalendarAlt, FaCheck, FaTimes } from "react-icons/fa";

const MyBorrowedBooks = () => {
  const { user, loadUserFromToken } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      if (!user) {
        await loadUserFromToken();
      }
    };

    loadUser();
  }, []);

  // Filter books based on search term
  const getFilteredBooks = (books, isReturned) => {
    if (!books) return [];

    return books
      .filter((book) => book.returned === isReturned)
      .filter((book) =>
        book.bookTitle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  };

  // Card view for mobile
  const renderBookCard = (book) => {
    const isPastDue = new Date(book.dueDate) < new Date() && !book.returned;

    return (
      <div key={book.bookId} className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg text-gray-800">{book.bookTitle}</h3>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              book.returned
                ? "bg-green-100 text-green-800"
                : isPastDue
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {book.returned ? "Returned" : isPastDue ? "Overdue" : "Borrowed"}
          </span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <FaBookOpen className="mr-2 text-blue-800" />
            <span className="font-medium mr-2">Borrowed On:</span>
            <span>
              {new Date(book.borrowedDate).toLocaleDateString("en-GB")}
            </span>
          </div>

          <div className="flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-800" />
            <span className="font-medium mr-2">Due Date:</span>
            <span className={isPastDue ? "text-red-500 font-medium" : ""}>
              {new Date(book.dueDate).toLocaleDateString("en-GB")}
            </span>
          </div>

          <div className="flex items-center">
            {book.returned ? (
              <FaCheck className="mr-2 text-green-600" />
            ) : (
              <FaTimes className="mr-2 text-red-600" />
            )}
            <span className="font-medium mr-2">Status:</span>
            <span>{book.returned ? "Returned" : "Not Returned"}</span>
          </div>
        </div>

        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-blue-700 border-blue-200 hover:text-white hover:bg-blue-700"
          >
            View Details
          </Button>
        </div>
      </div>
    );
  };

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

    const filteredBooks = getFilteredBooks(user.borrowedBooks, isReturned);

    if (filteredBooks.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="text-center py-4">
            {searchTerm
              ? "No books matching your search"
              : isReturned
              ? "No returned books"
              : "No borrowed books"}
          </TableCell>
        </TableRow>
      );
    }

    return filteredBooks.map((item) => {
      const isPastDue = new Date(item.dueDate) < new Date() && !item.returned;

      return (
        <TableRow key={item.bookId}>
          <TableCell className="font-medium">{item.bookTitle}</TableCell>
          <TableCell>
            {new Date(item.borrowedDate).toLocaleDateString("en-GB")}
          </TableCell>
          <TableCell className={isPastDue ? "text-red-500 font-medium" : ""}>
            {new Date(item.dueDate).toLocaleDateString("en-GB")}
          </TableCell>
          <TableCell>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                item.returned
                  ? "bg-green-100 text-green-800"
                  : isPastDue
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {item.returned ? "Yes" : "No"}
            </span>
          </TableCell>
          <TableCell>
            <Button variant="ghost" size="icon" className="text-blue-800">
              <MdPreview className="h-5 w-5" />
            </Button>
          </TableCell>
        </TableRow>
      );
    });
  };

  // Render mobile card lists
  const renderBooksCards = (isReturned) => {
    if (!user || !user.borrowedBooks || user.borrowedBooks.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
          No books data available
        </div>
      );
    }

    const filteredBooks = getFilteredBooks(user.borrowedBooks, isReturned);

    if (filteredBooks.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
          {searchTerm
            ? "No books matching your search"
            : isReturned
            ? "No returned books"
            : "No borrowed books"}
        </div>
      );
    }

    return filteredBooks.map((book) => renderBookCard(book));
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl text-blue-800 font-medium mb-4">
        My Borrowed Books
      </h1>

      {/* Search input */}
      <div className="mb-4">
        <Input
          placeholder="Search books by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="mt-4">
        <Tabs defaultValue="non-returned" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:inline-flex mb-4">
            <TabsTrigger
              className="data-[state=active]:bg-blue-900 data-[state=active]:text-white"
              value="non-returned"
            >
              Currently Borrowed
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-blue-900 data-[state=active]:text-white"
              value="returned"
            >
              Return History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="returned">
            {/* Mobile card view */}
            <div className="md:hidden space-y-4">{renderBooksCards(true)}</div>

            {/* Desktop table view */}
            <div className="hidden md:block">
              <div className="rounded-lg overflow-hidden shadow-md">
                <Table>
                  <TableHeader className="bg-gray-200">
                    <TableRow>
                      <TableHead>Book Title</TableHead>
                      <TableHead>Borrowed On</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Returned</TableHead>
                      <TableHead>View</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>{renderBooksTable(true)}</TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="non-returned">
            {/* Mobile card view */}
            <div className="md:hidden space-y-4">{renderBooksCards(false)}</div>

            {/* Desktop table view */}
            <div className="hidden md:block">
              <div className="rounded-lg overflow-hidden shadow-md">
                <Table>
                  <TableHeader className="bg-gray-200">
                    <TableRow>
                      <TableHead>Book Title</TableHead>
                      <TableHead>Borrowed On</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Returned</TableHead>
                      <TableHead>View</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>{renderBooksTable(false)}</TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyBorrowedBooks;
