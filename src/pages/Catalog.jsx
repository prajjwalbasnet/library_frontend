import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import {
  FaBook,
  FaCalendarAlt,
  FaUserGraduate,
  FaEnvelope,
} from "react-icons/fa";

const Catalog = () => {
  const [borrowedData, setBorrowedData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isReturning, setIsReturning] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { API_URL } = useAuth();

  const fetchborrowedData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/borrow/borrowed-books-by-users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      setBorrowedData(response.data.borrowedBooks);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch borrowed books data");
    }
  };

  const returnBook = async () => {
    if (!selectedItem) return;

    setIsReturning(true);
    try {
      const bookId = selectedItem.book.id;
      const response = await axios.put(
        `${API_URL}/api/borrow/return-borrowed-book/${bookId}`,
        {
          email: selectedItem.user.email,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        fetchborrowedData();
        setIsDialogOpen(false);
        toast.success("Book returned successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error returning book");
    } finally {
      setIsReturning(false);
    }
  };

  const handleOpenDialog = (item) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    fetchborrowedData();
  }, []);

  // Filter function for search
  const filteredData = borrowedData.filter(
    (item) =>
      item.user.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.book.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOverdueData = filteredData.filter(
    (item) => item.notified === true
  );

  // Card view for mobile
  const renderBorrowedCard = (item) => {
    return (
      <div key={item._id} className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="mb-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-lg">{item.book.title}</h3>
            {item.returned ? (
              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Returned
              </span>
            ) : (
              <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Borrowed
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <FaUserGraduate className="mr-2 text-blue-800" />
            <span className="font-medium mr-2">Student ID:</span>
            <span>{item.user.studentId}</span>
          </div>

          <div className="flex items-center">
            <FaEnvelope className="mr-2 text-blue-800" />
            <span className="font-medium mr-2">Email:</span>
            <span className="break-all">{item.user.email}</span>
          </div>

          <div className="flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-800" />
            <span className="font-medium mr-2">Due Date:</span>
            <span className={item.notified ? "text-red-500" : ""}>
              {new Date(item.dueDate).toLocaleDateString("en-GB")}
            </span>
          </div>

          <div className="flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-800" />
            <span className="font-medium mr-2">Borrowed On:</span>
            <span>{new Date(item.createdAt).toLocaleDateString("en-GB")}</span>
          </div>
        </div>

        {!item.returned && (
          <div className="mt-4">
            <Button
              className="w-full text-white bg-blue-900 hover:bg-blue-700"
              size="sm"
              onClick={() => handleOpenDialog(item)}
            >
              Return Book
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl text-blue-800 font-medium mb-4">
        Book Catalog
      </h1>

      {/* Search input */}
      <div className="mb-4">
        <Input
          placeholder="Search by student ID, email or book title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* -----Main content------ */}
      <div className="mt-4">
        <Tabs defaultValue="borrowed" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:inline-flex mb-4">
            <TabsTrigger
              className="data-[state=active]:bg-blue-900 data-[state=active]:text-white"
              value="borrowed"
            >
              Borrowed Books
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-blue-900 data-[state=active]:text-white"
              value="overdue"
            >
              Overdue Books
            </TabsTrigger>
          </TabsList>

          {/* Borrowed Books Tab */}
          <TabsContent value="borrowed" className="space-y-4">
            {/* Mobile card view */}
            <div className="md:hidden">
              {filteredData.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                  No borrowed books available
                </div>
              ) : (
                filteredData.map((item) => renderBorrowedCard(item))
              )}
            </div>

            {/* Desktop table view */}
            <div className="hidden md:block">
              <div className="rounded-lg overflow-hidden shadow-md">
                <Table>
                  <TableHeader className="bg-gray-200">
                    <TableRow>
                      <TableHead className="">Student ID</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Book Title</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="">Date & Time</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-6 text-gray-500"
                        >
                          No borrowed books available
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell className="font-medium">
                            {item.user.studentId}
                          </TableCell>
                          <TableCell>{item.user.email}</TableCell>
                          <TableCell>{item.book.title}</TableCell>
                          <TableCell
                            className={item.notified ? "text-red-500" : ""}
                          >
                            {new Date(item.dueDate).toLocaleDateString("en-GB")}
                          </TableCell>
                          <TableCell className="">
                            {new Date(item.createdAt).toLocaleDateString(
                              "en-GB"
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.returned ? (
                              <div className="flex items-center justify-center">
                                <Checkbox checked disabled />
                                <span className="ml-2">Returned</span>
                              </div>
                            ) : (
                              <Button
                                className="text-white bg-blue-900 hover:bg-blue-700"
                                size="sm"
                                onClick={() => handleOpenDialog(item)}
                              >
                                Return
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          {/* Overdue Books Tab */}
          <TabsContent value="overdue" className="space-y-4">
            {/* Mobile card view */}
            <div className="md:hidden">
              {filteredOverdueData.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                  No overdue books available
                </div>
              ) : (
                filteredOverdueData.map((item) => renderBorrowedCard(item))
              )}
            </div>

            {/* Desktop table view */}
            <div className="hidden md:block">
              <div className="rounded-lg overflow-hidden shadow-md">
                <Table>
                  <TableHeader className="bg-gray-200">
                    <TableRow>
                      <TableHead className="">Student ID</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Book Title</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="">Date & Time</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOverdueData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-6 text-gray-500"
                        >
                          No overdue books available
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOverdueData.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell className="font-medium">
                            {item.user.studentId}
                          </TableCell>
                          <TableCell>{item.user.email}</TableCell>
                          <TableCell>{item.book.title}</TableCell>
                          <TableCell className="text-red-500">
                            {new Date(item.dueDate).toLocaleDateString("en-GB")}
                          </TableCell>
                          <TableCell>
                            {new Date(item.createdAt).toLocaleDateString(
                              "en-GB"
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.returned ? (
                              <div className="flex items-center justify-center">
                                <Checkbox checked disabled />
                                <span className="ml-2">Returned</span>
                              </div>
                            ) : (
                              <Button
                                className="text-white bg-blue-900 hover:bg-blue-700"
                                size="sm"
                                onClick={() => handleOpenDialog(item)}
                              >
                                Return
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Return Book Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
          <DialogHeader>
            <DialogTitle className="text-blue-900">
              Confirm Book Return
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this book as returned?
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-2">
                <p className="text-right font-medium text-blue-900">Book:</p>
                <div className="col-span-3 break-words">
                  {selectedItem.book.title}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <p className="text-right text-blue-900 font-medium">User:</p>
                <div className="col-span-3 break-words">
                  {selectedItem.user.email}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <p className="text-right font-medium text-blue-900">
                  Due Date:
                </p>
                <div className="col-span-3">
                  {new Date(selectedItem.dueDate).toLocaleDateString("en-GB")}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isReturning}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              className="text-white bg-blue-900 hover:bg-blue-700 w-full sm:w-auto"
              onClick={returnBook}
              disabled={isReturning}
            >
              {isReturning ? "Processing..." : "Confirm Return"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Catalog;
