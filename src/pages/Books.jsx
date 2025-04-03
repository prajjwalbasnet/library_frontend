import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Navbar from '../components/Navbar'
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
} from "@/components/ui/alert-dialog"
import axios from 'axios'
import { FaEdit } from "react-icons/fa";
import { RiDeleteBinFill } from "react-icons/ri";
import { FaImage } from "react-icons/fa6";
import { toast } from 'react-toastify'

const Books = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentBookId, setCurrentBookId] = useState(null)
  const [deleteBookId, setDeleteBookId] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [books, setBooks] = useState([])

  const [coverImage, setCoverImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)


  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    totalCopies: '',
  })

  const API_URL = import.meta.env.VITE_BACKEND_URL

  const fetchBooks = async () => {
    try {
        setLoading(true)
        setError(null)
        const response = await axios.get(`${API_URL}/api/book/getAll`)
        setBooks(response.data.data)
        setLoading(false)
    } catch (error) {
        setError('Failed to fetch books. Please try again later.');
        setLoading(false);
        console.error('Error fetching books:', error);
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    if (error) setError(null);
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]

    if(file) {
      setCoverImage(file)

      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)

      if (error) setError(null);
    }
  }

  const handleDialogOpen = (open) => {
    setIsDialogOpen(open);
    
    // Reset form when dialog closes
    if (!open) {
      setFormData({
        title: '',
        author: '',
        description: '',
        genre: '',
        totalCopies: '',
      });
      setCoverImage(null);
      setImagePreview(null);
      setError(null);
    }
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required')
      return false
    }
    
    if (!formData.author.trim()) {
      setError('Author is required')
      return false
    }
    
    if (!formData.genre.trim()) {
      setError('Genre is required')
      return false
    }
    
    if (!formData.totalCopies || isNaN(formData.totalCopies) || parseInt(formData.totalCopies) < 1) {
      setError('Valid number of copies is required')
      return false
    }

    return true
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    if(!validateForm()){
      setError('Author is required')
      return false
    }

    try {
      setLoading(true);
      setError(null);

      const bookFormData = new FormData()

      bookFormData.append('title', formData.title)
      bookFormData.append('author', formData.author)
      bookFormData.append('description', formData.description)
      bookFormData.append('genre', formData.genre)
      bookFormData.append('totalCopies', formData.totalCopies)

      if(coverImage){
        bookFormData.append('coverImage', coverImage)
      }

      let response

      if(isEditMode){

        response = await axios.put(
          `${API_URL}/api/book/update/${currentBookId}`,
          bookFormData, {
            headers: {
              'Content-Type': 'multipart/form_data'
            }
          }
        )

        if (response.data.success){
          toast.success('Book updated successfully')
        }
      }

      else{
        response = await axios.post(
          `${API_URL}/api/book/addBook`, 
          bookFormData,
          {
            headers: {
              'Content-Type': 'multipart/form_data'
            }
          }
        )
        if (response.data.success) {
          toast.success('Book added successfully!')
        }

      }

      

      if (response.data.success) {
        // Reset form data
        setFormData({
          title: '',
          author: '',
          description: '',
          genre: '',
          totalCopies: '',
        })
        
        // Reset file state
        setCoverImage(null);
        setImagePreview(null);
        
        // Close dialog
        setIsDialogOpen(false);
        
        // Refresh book list
        fetchBooks();

      }
    } catch (error) {
      console.error('Error adding book:', error);
      setError(error.response?.data?.message || 'An error occurred while adding the book');
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async() => {
    if(!deleteBookId){
      toast.error("Book Id missing")
    }

    try {
      setLoading(true)
      const response = await axios.delete(`${API_URL}/api/book/delete/${deleteBookId}`)

      if(response.data.success){
        toast.success('Book deleted successfully')
        fetchBooks()
      } else {
        toast.error(response.data.message || 'Failed to delete book')
      }
    } catch (error) {
      console.error('Error deleting book:', error)
      toast.error(error.response?.data?.message || 'An error occurred while deleting the book')
    } finally{
      setLoading(false)
    }
  }

  const openDeleteConfirmation = (bookId) => {
    setDeleteBookId(bookId)
    setIsDeleteDialogOpen(true)
  }


  const handleEdit = async (book) => {

    setIsEditMode(true)
    setCurrentBookId(book._id)

    setFormData({
      title: book.title || '',
      author: book.author || '',
      description: book.description || '',
      genre: book.genre || '',
      totalCopies: book.totalCopies || '',
    })
    
    if (book.coverImage && book.coverImage.url) {
      setImagePreview(book.coverImage.url)
    }

    setIsDialogOpen(true)

  }

  return (
    <div className='flex h-screen w-screen overflow-hidden'>
        {/* ------Sidebar------- */}
      <Sidebar/>

        <div className='flex flex-col flex-1 overflow-hidden'>
            <Navbar/>

            {/* -----Main content------ */}
            <div className='mx-2 my-5'>
                <h1 className='text-3xl text-blue-800 font-medium mb-5'>Books</h1>

                <div className='flex justify-end pr-3'>
                  <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className='text-white bg-blue-800 hover:bg-blue-700'
                        onClick={()=>setIsEditMode(false)}
                        >Add Book</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>{isEditMode? 'Edit Book':'Add a new Book'}</DialogTitle>
                        <DialogDescription>
                          {isEditMode 
                          ? 'Update the book information below.' 
                          : 'Fill in the details to add a new book to the library.'}
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
                            type='text'
                            name='title'
                            value={formData.title}
                            onChange={handleChange} 
                            placeholder='Enter the title' 
                            className="col-span-3"/>
                          <Input 
                            placeholder='Enter the author' 
                            name='author'
                            value={formData.author}
                            onChange={handleChange} 
                            className="col-span-3" />
                          <Textarea 
                            placeholder='Enter the description'  
                            name='description'
                            value={formData.description}
                            onChange={handleChange} 
                            className="col-span-3" />
                          <Input 
                            placeholder='Enter the genre' 
                            name='genre'
                            value={formData.genre}
                            onChange={handleChange} 
                            className="col-span-3" />
                          <Input type='number' 
                            placeholder='Total copies available'
                            name='totalCopies'
                            value={formData.totalCopies}
                            onChange={handleChange}  
                            className="col-span-3" />
                          <div className="rounded-md border border-blue-800 bg-gray-50 p-2 shadow-md w-30">
                            <label htmlFor="upload" className="flex flex-col items-center gap-2 cursor-pointer">
                              {imagePreview ? (
                                <img
                                  src={imagePreview}
                                  alt="Book cover preview"
                                  className='h-32 w-auto object-contain'
                                />
                              ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 fill-white stroke-blue-800" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  <span className="text-gray-600 font-medium">
                                    {isEditMode ? 'Change Cover Image' : 'Cover Image'}
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
                        
                          <DialogFooter>
                            <Button 
                              type="submit" 
                              className='text-white bg-blue-800 hover:bg-blue-700 w-20'
                              disabled={loading}        
                            >
                              {isEditMode ? 'Update' : 'Add'}
                            </Button>
                          </DialogFooter>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                {
                  loading && !books.length ? (
                    <div className="flex justify-center items-center py-10">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                    </div>
                  ) : (
                    <div>
                      <Table>
                        <TableHeader>
                          <TableRow className='text-lg'>
                            <TableHead></TableHead>
                            <TableHead>Books</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Availability</TableHead>
                            <TableHead className='w-[30px]'></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {books.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                No books available
                              </TableCell>
                            </TableRow>
                          ) : (
                            books.map((item) => (
                              <TableRow 
                                key={item._id}
                                className='text-base'>
                                <TableCell>
                                  {item.coverImage?.url ? (
                                    <img className='w-16 h-18 object-cover' src={item.coverImage.url} alt={`Cover of ${item.title}`} />
                                  ) : (
                                    <div className='w-16 h-18 bg-gray-200 flex items-center justify-center'>
                                      <FaImage className="text-gray-400" />
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell>{item.title}</TableCell>
                                <TableCell>{item.author}</TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs ${!item.availability ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                    {!item.availability ? 'Not available' : 'Available'}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <div className='flex gap-5 items-center justify-center'>
                                    <FaEdit 
                                      className='text-2xl text-gray-500 hover:text-gray-400 cursor-pointer'
                                      onClick={()=>handleEdit(item)}/>
                                    <RiDeleteBinFill className='text-2xl text-orange-700 hover:text-orange-800 cursor-pointer'
                                    onClick={()=> openDeleteConfirmation(item._id)}/>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )
                }
            </div>

             {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to delete this book?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the book from the library.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
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
    </div>
  )
}

export default Books