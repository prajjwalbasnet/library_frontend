import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const Catalog = () => {
  const [borrowedData, setBorrowedData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isReturning, setIsReturning] = useState(false);
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
      console.log(response.data.borrowedBooks);
      setBorrowedData(response.data.borrowedBooks);
    } catch (error) {
      console.log(error);
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
      toast.error(error);
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
    console.log("Auth token:", localStorage.getItem("auth_token"));
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* ------Sidebar------- */}
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />

        {/* -----Main content------ */}
        <div className="flex mx-3 my-6">
          <Tabs defaultValue="borrowed" className="w-full">
            <TabsList>
              <TabsTrigger
                className="w-[200px] data-[state=active]:bg-blue-900 data-[state=active]:text-white"
                value="borrowed"
              >
                Borrowed Books
              </TabsTrigger>
              <TabsTrigger
                className="w-[200px] data-[state=active]:bg-blue-900 data-[state=active]:text-white"
                value="overdue"
              >
                Overdue Books
              </TabsTrigger>
            </TabsList>
            <TabsContent value="borrowed" className="m-2">
              <Table>
                <TableHeader className="bg-gray-200">
                  <TableRow>
                    <TableHead className="">Student ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Book Title</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="">Date & Time</TableHead>
                    <TableHead className=""></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {borrowedData.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell className="font-medium">
                        {item.user.studentId}
                      </TableCell>
                      <TableCell>{item.user.email}</TableCell>
                      <TableCell>{item.book.title}</TableCell>
                      <TableCell>
                        {new Date(item.dueDate).toLocaleDateString("en-GB")}
                      </TableCell>
                      <TableCell className="">
                        {new Date(item.createdAt).toLocaleDateString("en-GB")}
                      </TableCell>
                      <TableCell className="">
                        {item.returned ? (
                          <Checkbox checked disabled />
                        ) : (
                          <Button
                            className="text-white bg-blue-900 hover:bg-blue-700 hover:text-white "
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(item)}
                          >
                            Return
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="overdue" className="m-2">
              <Table>
                <TableHeader className="bg-gray-200">
                  <TableRow>
                    <TableHead className="">Student ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Book Title</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="">Date & Time</TableHead>
                    <TableHead className="">Return</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {borrowedData.map(
                    (item) =>
                      item.returned === false && (
                        <TableRow key={item._id}>
                          <TableCell className="font-medium">
                            {item.user.studentId}
                          </TableCell>
                          <TableCell>{item.user.email}</TableCell>
                          <TableCell>{item.book.title}</TableCell>
                          <TableCell className="text-red-500">
                            {new Date(item.dueDate).toLocaleDateString("en-GB")}
                          </TableCell>
                          <TableCell className="">
                            {new Date(item.createdAt).toLocaleDateString(
                              "en-GB"
                            )}
                          </TableCell>
                          <TableCell className="">
                            {item.returned ? (
                              <Checkbox checked disabled />
                            ) : (
                              <Button
                                className="text-white bg-blue-900 hover:bg-blue-700 hover:text-white "
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenDialog(item)}
                              >
                                Return
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
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
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-right font-medium text-blue-900">Book:</p>
                <div className="col-span-3">{selectedItem.book.title}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-right text-blue-900 font-medium">User:</p>
                <div className="col-span-3">{selectedItem.user.email}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-right font-medium text-blue-900">
                  Due Date:
                </p>
                <div className="col-span-3">
                  {new Date(selectedItem.dueDate).toLocaleDateString("en-GB")}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isReturning}
            >
              Cancel
            </Button>
            <Button
              className="text-white bg-blue-900 hover:bg-blue-700 hover:text-white "
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
