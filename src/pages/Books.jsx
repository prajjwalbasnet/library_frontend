import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MdPreview } from "react-icons/md";
import { BsFileRichtextFill } from "react-icons/bs";
import { FaBookmark } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCaption,
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
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { MdAssignment } from "react-icons/md";
import { FaImage } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Books = () => {
  const { user, isAdmin, isUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBookId, setCurrentBookId] = useState(null);
  const [deleteBookId, setDeleteBookId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");

  const [books, setBooks] = useState([]);

  const [coverImage, setCoverImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [openSearch, setOpenSearch] = useState(false);
  const searchContainerRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    totalCopies: "",
  });

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setOpenSearch(false);
      }
    };

    if (openSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openSearch]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/api/book/getAll`);
      setBooks(response.data.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch books. Please try again later.");
      setLoading(false);
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (error) setError(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setCoverImage(file);

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      if (error) setError(null);
    }
  };

  const handleDialogOpen = (open) => {
    setIsDialogOpen(open);

    // Reset form when dialog closes
    if (!open) {
      setFormData({
        title: "",
        author: "",
        description: "",
        genre: "",
        totalCopies: "",
      });
      setCoverImage(null);
      setImagePreview(null);
      setError(null);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return false;
    }

    if (!formData.author.trim()) {
      setError("Author is required");
      return false;
    }

    if (!formData.genre.trim()) {
      setError("Genre is required");
      return false;
    }

    if (
      !formData.totalCopies ||
      isNaN(formData.totalCopies) ||
      parseInt(formData.totalCopies) < 1
    ) {
      setError("Valid number of copies is required");
      return false;
    }

    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const bookFormData = new FormData();

      bookFormData.append("title", formData.title);
      bookFormData.append("author", formData.author);
      bookFormData.append("description", formData.description);
      bookFormData.append("genre", formData.genre);
      bookFormData.append("totalCopies", formData.totalCopies);

      if (coverImage) {
        bookFormData.append("coverImage", coverImage);
      }

      let response;

      if (isEditMode) {
        response = await axios.put(
          `${API_URL}/api/book/update/${currentBookId}`,
          bookFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
          }
        );

        if (response.data.success) {
          toast.success("Book updated successfully");
        }
      } else {
        response = await axios.post(
          `${API_URL}/api/book/addBook`,
          bookFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
          }
        );
        if (response.data.success) {
          toast.success("Book added successfully!");
        }
      }

      if (response.data.success) {
        // Reset form data
        setFormData({
          title: "",
          author: "",
          description: "",
          genre: "",
          totalCopies: "",
        });

        // Reset file state
        setCoverImage(null);
        setImagePreview(null);

        // Close dialog
        setIsDialogOpen(false);

        // Refresh book list
        fetchBooks();
      }
    } catch (error) {
      console.error("Error adding book:", error);
      setError(
        error.response?.data?.message ||
          "An error occurred while adding the book"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteBookId) {
      toast.error("Book Id missing");
    }

    try {
      setLoading(true);
      const response = await axios.delete(
        `${API_URL}/api/book/delete/${deleteBookId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Book deleted successfully");
        fetchBooks();
      } else {
        toast.error(response.data.message || "Failed to delete book");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while deleting the book"
      );
    } finally {
      setLoading(false);
    }
  };

  const openDeleteConfirmation = (bookId) => {
    setDeleteBookId(bookId);
    setIsDeleteDialogOpen(true);
  };

  const handleEdit = async (book) => {
    setIsEditMode(true);
    setCurrentBookId(book._id);

    setFormData({
      title: book.title || "",
      author: book.author || "",
      description: book.description || "",
      genre: book.genre || "",
      totalCopies: book.totalCopies || "",
    });

    if (book.coverImage && book.coverImage.url) {
      setImagePreview(book.coverImage.url);
    }

    setIsDialogOpen(true);
  };

  const recordBook = async (bookId) => {
    if (!studentEmail || !studentEmail.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/api/borrow/record/${bookId}`,
        { email: studentEmail },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Book borrowed successfully");
        setStudentEmail(""); // Reset the email input
        fetchBooks(); // Refresh book list to update availability
      } else {
        toast.error(response.data.message || "Failed to borrow book");
      }
    } catch (error) {
      console.error("Error recording book:", error);

      if (error.response) {
        switch (error.response.status) {
          case 404:
            if (error.response.data.message.includes("User not found")) {
              toast.error("User not found with this email");
            } else if (error.response.data.message.includes("Book not found")) {
              toast.error("Book not found");
            } else {
              toast.error(error.response.data.message);
            }
            break;
          case 400:
            toast.error(error.response.data.message);
            break;
          default:
            toast.error("An error occurred while borrowing the book");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter books based on search term
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Responsive card view for mobile
  const renderBookCard = (book) => {
    return (
      <div
        key={book._id}
        className="bg-white rounded-lg shadow-md overflow-hidden mb-4"
      >
        <div className="flex p-4">
          <div className="flex-shrink-0 w-20 mr-4">
            {book.coverImage?.url ? (
              <img
                className="w-full h-24 object-cover rounded"
                src={book.coverImage.url}
                alt={`Cover of ${book.title}`}
              />
            ) : (
              <div className="w-full h-24 bg-gray-200 flex items-center justify-center rounded">
                <FaImage className="text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-lg text-gray-800">{book.title}</h3>
            <p className="text-gray-600 text-sm">By {book.author}</p>
            <div className="mt-2">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  !book.availability
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {!book.availability ? "Not available" : "Available"}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 flex justify-end space-x-2">
          {isUser && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-700 border-blue-200 hover:text-white hover:bg-blue-700"
                >
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] w-[95vw] mx-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    {book.title}
                  </DialogTitle>
                  <DialogDescription>
                    Complete details about this book
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <FaUser className="h-4 w-4 text-blue-800" />
                    <span className="font-medium">Author:</span>
                    <span>{book.author}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaBookmark className="h-4 w-4 text-blue-800" />
                    <span className="font-medium">Genre:</span>
                    <span>{book.genre}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <BsFileRichtextFill className="h-4 w-4 text-blue-800" />
                      <span className="font-medium">Description:</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed pl-6">
                      {book.description}
                    </p>
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <DialogClose asChild>
                    <Button
                      size="sm"
                      className="bg-blue-800 text-white hover:bg-blue-700 hover:text-white"
                    >
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {isAdmin && (
            <>
              {/* Assign Book Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-700 border-blue-200 hover:text-white hover:bg-blue-700"
                  >
                    Assign
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] w-[95vw] mx-auto">
                  <DialogHeader>
                    <DialogTitle>Assign Book</DialogTitle>
                    <DialogDescription>
                      Enter the email of the student you want to assign this
                      book to
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="flex items-center gap-2">
                      <Input
                        id="email"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        placeholder="student@example.com"
                        type="email"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      onClick={() => recordBook(book._id)}
                      disabled={loading}
                      className="bg-blue-700 hover:bg-blue-800 text-white"
                    >
                      {loading ? (
                        <>
                          <span className="mr-2">Assigning</span>
                          <span className="animate-pulse">...</span>
                        </>
                      ) : (
                        "Assign Book"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Edit Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(book)}
                className="text-blue-700 border-blue-200 hover:text-white hover:bg-blue-700"
              >
                Edit
              </Button>

              {/* Delete Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => openDeleteConfirmation(book._id)}
                className="text-red-600 border-red-200 hover:text-white hover:bg-red-500"
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl text-blue-800 font-medium mb-4">
        Books
      </h1>

      {/* Header with search and add button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <div className="relative w-full sm:w-auto" ref={searchContainerRef}>
          <Input
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full sm:w-60 pl-9 h-10 bg-gray-100 transition-all duration-300 ${
              openSearch || searchTerm
                ? "opacity-100"
                : "sm:opacity-0 sm:w-0 sm:pl-0"
            }`}
          />
          <button
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 ${
              openSearch || searchTerm ? "" : "sm:left-0"
            }`}
            onClick={() => setOpenSearch(!openSearch)}
          >
            <FaSearch />
          </button>
        </div>

        {isAdmin && (
          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="w-full sm:w-auto text-white bg-blue-800 hover:bg-blue-700"
                onClick={() => setIsEditMode(false)}
              >
                Add Book
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto w-[95vw] max-w-lg mx-auto">
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? "Edit Book" : "Add a new Book"}
                </DialogTitle>
                <DialogDescription>
                  {isEditMode
                    ? "Update the book information below."
                    : "Fill in the details to add a new book to the library."}
                </DialogDescription>
              </DialogHeader>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  {error}
                </div>
              )}

              <form onSubmit={submitHandler}>
                <div className="grid gap-4 py-4">
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter the title"
                  />
                  <Input
                    placeholder="Enter the author"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                  />
                  <Textarea
                    placeholder="Enter the description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="min-h-[100px]"
                  />
                  <Input
                    placeholder="Enter the genre"
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                  />
                  <Input
                    type="number"
                    placeholder="Total copies available"
                    name="totalCopies"
                    value={formData.totalCopies}
                    onChange={handleChange}
                  />

                  <div className="flex justify-center">
                    <div className="rounded-md border border-blue-800 bg-gray-50 p-4 shadow-md max-w-xs">
                      <label
                        htmlFor="upload"
                        className="flex flex-col items-center gap-2 cursor-pointer"
                      >
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Book cover preview"
                            className="h-32 w-auto object-contain"
                          />
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-10 w-10 fill-white stroke-blue-800"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <span className="text-gray-600 font-medium">
                              {isEditMode
                                ? "Change Cover Image"
                                : "Cover Image"}
                            </span>
                          </>
                        )}
                      </label>
                      <input
                        id="upload"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </div>
                  </div>

                  <DialogFooter className="mt-4">
                    <Button
                      type="submit"
                      className="text-white bg-blue-800 hover:bg-blue-700 w-full sm:w-auto"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <span className="mr-2">
                            {isEditMode ? "Updating" : "Adding"}
                          </span>
                          <span className="animate-pulse">...</span>
                        </span>
                      ) : isEditMode ? (
                        "Update"
                      ) : (
                        "Add"
                      )}
                    </Button>
                  </DialogFooter>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {loading && !books.length ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          {/* Mobile view - Card layout */}
          <div className="md:hidden">
            {filteredBooks.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                {searchTerm
                  ? "No books matching your search"
                  : "No books available"}
              </div>
            ) : (
              filteredBooks.map((book) => renderBookCard(book))
            )}
          </div>

          {/* Desktop view - Table layout */}
          <div className="hidden md:block">
            <div className="overflow-x-auto rounded-lg shadow">
              <Table>
                <TableHeader>
                  <TableRow className="text-lg bg-gray-200">
                    <TableHead></TableHead>
                    <TableHead className="column-sm">Books</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Availability</TableHead>
                    {isAdmin && (
                      <TableHead className="text-center">Actions</TableHead>
                    )}
                    {isUser && <TableHead className="w-[30px]">View</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBooks.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={
                          user && user.role
                            ? user.role === "Admin"
                              ? 6
                              : 5
                            : 4
                        }
                        className="text-center py-8 text-gray-500"
                      >
                        {searchTerm
                          ? "No books matching your search"
                          : "No books available"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBooks.map((item) => (
                      <TableRow key={item._id} className="text-base">
                        <TableCell>
                          {item.coverImage?.url ? (
                            <img
                              className="w-16 h-18 object-cover"
                              src={item.coverImage.url}
                              alt={`Cover of ${item.title}`}
                            />
                          ) : (
                            <div className="w-16 h-18 bg-gray-200 flex items-center justify-center">
                              <FaImage className="text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[180px]">
                          {item.title}
                        </TableCell>
                        <TableCell>{item.author}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              !item.availability
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {!item.availability ? "Not available" : "Available"}
                          </span>
                        </TableCell>

                        {isAdmin && (
                          <TableCell>
                            <div className="flex items-center justify-center space-x-2">
                              {/* Assign Book Dialog */}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-blue-700 hover:text-blue-800 hover:bg-blue-50"
                                  >
                                    <MdAssignment className="h-7 w-7 " />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>Assign Book</DialogTitle>
                                    <DialogDescription>
                                      Enter the email of the student you want to
                                      assign this book to
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="py-4">
                                    <div className="flex items-center gap-2">
                                      <Input
                                        id="email"
                                        value={studentEmail}
                                        onChange={(e) =>
                                          setStudentEmail(e.target.value)
                                        }
                                        placeholder="student@example.com"
                                        type="email"
                                        className="flex-1"
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      type="button"
                                      onClick={() => recordBook(item._id)}
                                      disabled={loading}
                                      className="bg-blue-700 hover:bg-blue-800 text-white"
                                    >
                                      {loading ? (
                                        <>
                                          <span className="mr-2">
                                            Assigning
                                          </span>
                                          <span className="animate-pulse">
                                            ...
                                          </span>
                                        </>
                                      ) : (
                                        "Assign Book"
                                      )}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>

                              {/* Edit Button */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(item)}
                                className="text-blue-700 border-blue-200 hover:text-white hover:bg-blue-700"
                              >
                                Edit
                              </Button>

                              {/* Delete Button */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openDeleteConfirmation(item._id)}
                                className="text-red-600 border-red-200 hover:text-white hover:bg-red-500"
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        )}
                        {isUser && (
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-blue-800"
                                >
                                  <MdPreview className="h-5 w-5" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                  <DialogTitle className="text-xl font-semibold">
                                    {item.title}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Complete details about this book
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="mt-4 space-y-4">
                                  <div className="flex items-center gap-2">
                                    <FaUser className="h-4 w-4 text-blue-800" />
                                    <span className="font-medium">Author:</span>
                                    <span>{item.author}</span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <FaBookmark className="h-4 w-4 text-blue-800" />
                                    <span className="font-medium">Genre:</span>
                                    <span>{item.genre}</span>
                                  </div>

                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <BsFileRichtextFill className="h-4 w-4 text-blue-800" />
                                      <span className="font-medium">
                                        Description:
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed pl-6">
                                      {item.description}
                                    </p>
                                  </div>
                                </div>
                                <DialogFooter className="mt-6">
                                  <DialogClose asChild>
                                    <Button
                                      size="sm"
                                      className="bg-blue-800 text-white hover:bg-blue-700 hover:text-white"
                                    >
                                      Close
                                    </Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="w-[95vw] max-w-md mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this book?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              book from the library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Books;
