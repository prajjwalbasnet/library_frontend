import React, { useEffect, useState } from "react";
import {
  FaBook,
  FaCalendarAlt,
  FaHistory,
  FaBookReader,
  FaClock,
} from "react-icons/fa";
import { PiBookOpenTextLight, PiBookmarksLight } from "react-icons/pi";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import bg from "../assets/bg.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserHero = () => {
  const { user, loadUserFromToken } = useAuth();
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    totalBorrowed: 0,
    currentlyBorrowed: 0,
    returned: 0,
    overdue: 0,
  });
  const [recentBorrows, setRecentBorrows] = useState([]);
  const [topGenres, setTopGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [borrowHistory, setBorrowHistory] = useState([]);

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        await loadUserFromToken();
      }
    };

    fetchData();
  }, []);

  // Process user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const API_URL = import.meta.env.VITE_BACKEND_URL;

        // Get all books data
        const booksResponse = await axios.get(`${API_URL}/api/book/getAll`);
        const books = booksResponse.data.data || [];

        // Process user's borrowed books
        if (user.borrowedBooks && user.borrowedBooks.length > 0) {
          const now = new Date();
          const borrowed = user.borrowedBooks;

          // Count statistics
          const currentlyBorrowed = borrowed.filter((book) => !book.returned);
          const returned = borrowed.filter((book) => book.returned);
          const overdue = borrowed.filter(
            (book) => !book.returned && new Date(book.dueDate) < now
          );

          setUserStats({
            totalBorrowed: borrowed.length,
            currentlyBorrowed: currentlyBorrowed.length,
            returned: returned.length,
            overdue: overdue.length,
          });

          // Set borrow history (sorted by date, newest first)
          const history = borrowed.map((book) => ({
            ...book,
            timestamp: new Date(book.borrowedDate).getTime(),
          }));
          history.sort((a, b) => b.timestamp - a.timestamp);
          setBorrowHistory(history);

          // Get recent borrows for the display
          setRecentBorrows(history.slice(0, 3));

          // Calculate user's top genres based on borrowed books
          const genreCounts = {};
          borrowed.forEach((borrow) => {
            // Find the full book details in the books array
            const bookDetails = books.find(
              (book) => book._id === borrow.bookId
            );
            if (bookDetails && bookDetails.genre) {
              const genre = bookDetails.genre.trim();
              if (!genreCounts[genre]) {
                genreCounts[genre] = 0;
              }
              genreCounts[genre]++;
            }
          });

          // Convert to array and sort
          const genreArray = Object.keys(genreCounts).map((genre) => ({
            name: genre,
            count: genreCounts[genre],
          }));
          genreArray.sort((a, b) => b.count - a.count);
          setTopGenres(genreArray.slice(0, 3)); // Top 3 genres

          // Generate recommended books based on user's reading history
          // (Simple algorithm: recommend books from user's top genres that they haven't borrowed yet)
          if (genreArray.length > 0) {
            const recommendable = books.filter((book) => {
              // Check if book is available
              if (!book.availability) return false;

              // Check if user has already borrowed this book
              const alreadyBorrowed = borrowed.some(
                (item) => item.bookId === book._id
              );
              if (alreadyBorrowed) return false;

              // Check if book is in user's top genres
              return genreArray.some((genre) => book.genre === genre.name);
            });

            // Take random 3 books from recommendable ones
            const shuffled = [...recommendable].sort(() => 0.5 - Math.random());
            setRecommendedBooks(shuffled.slice(0, 3));
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Format date in a nicer way
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if a book is overdue
  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="w-full p-4">
      {/* Welcome Banner */}
      <div className="relative w-full h-[250px] md:h-[300px] rounded-lg overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-white-200 to-blue-800" />
        <div className="relative z-10 flex flex-col h-full justify-center px-6 md:px-10">
          <h1 className="text-2xl md:text-4xl text-blue-800 font-semibold mb-2">
            Welcome back, {user?.name || "Reader"}!
          </h1>
          <p className="text-base md:text-xl text-gray-700 max-w-lg mb-4">
            Your journey of knowledge and imagination begins here, where every
            book opens a door to new possibilities.
          </p>
          <Button
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 text-base md:text-lg rounded-md transition-all duration-300 font-medium flex items-center justify-center w-40 cursor-pointer"
            onClick={() => navigate("/books")}
          >
            Explore Books
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Books Borrowed */}
        <div className="flex flex-col sm:flex-row items-center p-6 border border-gray-100 shadow-lg rounded-2xl bg-white hover:shadow-xl transition-shadow cursor-pointer">
          <div className="p-3 bg-blue-100 rounded-full mb-2 sm:mb-0 sm:mr-4">
            <PiBookOpenTextLight className="text-2xl md:text-4xl text-blue-700" />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-500">Books Borrowed</p>
            <h1 className="text-2xl md:text-3xl font-semibold text-blue-700">
              {userStats.totalBorrowed}
            </h1>
          </div>
        </div>

        {/* Currently Borrowed */}
        <div className="flex flex-col sm:flex-row items-center p-6 border border-gray-100 shadow-lg rounded-2xl bg-white hover:shadow-xl transition-shadow cursor-pointer">
          <div className="p-3 bg-green-100 rounded-full mb-2 sm:mb-0 sm:mr-4">
            <PiBookmarksLight className="text-2xl md:text-4xl text-green-700" />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-500">Currently Borrowed</p>
            <h1 className="text-2xl md:text-3xl font-semibold text-green-700">
              {userStats.currentlyBorrowed}
            </h1>
          </div>
        </div>

        {/* Returned Books */}
        <div className="flex flex-col sm:flex-row items-center p-6 border border-gray-100 shadow-lg rounded-2xl cursor-pointer bg-white hover:shadow-xl transition-shadow">
          <div className="p-3 bg-purple-100 rounded-full mb-2 sm:mb-0 sm:mr-4">
            <FaHistory className="text-2xl md:text-4xl text-purple-700" />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-500">Returned Books</p>
            <h1 className="text-2xl md:text-3xl font-semibold text-purple-700">
              {userStats.returned}
            </h1>
          </div>
        </div>

        {/* Overdue Books */}
        <div className="flex flex-col sm:flex-row items-center p-6 border border-gray-100 shadow-lg cursor-pointer rounded-2xl bg-white hover:shadow-xl transition-shadow">
          <div className="p-3 bg-red-100 rounded-full mb-2 sm:mb-0 sm:mr-4">
            <FaClock className="text-2xl md:text-4xl text-red-700" />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-500">Overdue Books</p>
            <h1 className="text-2xl md:text-3xl font-semibold text-red-700">
              {userStats.overdue}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Currently Borrowed Books */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FaBookReader className="mr-2 text-blue-700" />
              Currently Borrowed Books
            </h2>
            <p className="text-sm text-gray-500">
              Books you currently have checked out
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
            </div>
          ) : (
            <div>
              {borrowHistory.filter((book) => !book.returned).length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                  You don't have any borrowed books currently
                </div>
              ) : (
                <div className="space-y-4">
                  {borrowHistory
                    .filter((book) => !book.returned)
                    .slice(0, 4)
                    .map((book, index) => (
                      <div
                        key={index}
                        className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-lg">
                            {book.bookTitle}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              isOverdue(book.dueDate)
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {isOverdue(book.dueDate) ? "Overdue" : "Active"}
                          </span>
                        </div>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <p className="flex items-center">
                            <FaCalendarAlt className="mr-2 text-blue-600" />
                            Borrowed: {formatDate(book.borrowedDate)}
                          </p>
                          <p className="flex items-center">
                            <FaClock
                              className={`mr-2 ${
                                isOverdue(book.dueDate)
                                  ? "text-red-600"
                                  : "text-blue-600"
                              }`}
                            />
                            Due: {formatDate(book.dueDate)}
                          </p>
                        </div>
                      </div>
                    ))}

                  {borrowHistory.filter((book) => !book.returned).length >
                    4 && (
                    <div className="text-center mt-4">
                      <Button
                        className="text-blue-700 hover:bg-blue-50 border border-blue-200"
                        onClick={() => navigate("/myBorrowedBooks")}
                      >
                        View All Borrowed Books
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Book Recommendations */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FaBook className="mr-2 text-blue-700" />
              Recommended For You
            </h2>
            <p className="text-sm text-gray-500">
              Based on your reading history
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
            </div>
          ) : (
            <div>
              {recommendedBooks.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                  Borrow more books to get personalized recommendations
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendedBooks.map((book, index) => (
                    <div
                      key={index}
                      className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex">
                        <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center mr-4">
                          {book.coverImage?.url ? (
                            <img
                              src={book.coverImage.url}
                              alt={book.title}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <FaBook className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{book.title}</h3>
                          <p className="text-sm text-gray-600">{book.author}</p>
                          <p className="text-xs text-gray-500">{book.genre}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="text-center mt-4">
                    <Button
                      className="text-blue-700 hover:bg-blue-50 border border-blue-200"
                      onClick={() => navigate("/books")}
                    >
                      Discover More Books
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Your Reading Habits */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Your Reading Habits
          </h2>
          <p className="text-sm text-gray-500">
            Insights into your reading patterns
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Favorite Genres */}
            <div className="border border-gray-100 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-4">
                Your Top Genres
              </h3>

              {topGenres.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No genre data available yet
                </p>
              ) : (
                <div className="space-y-4">
                  {topGenres.map((genre, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {genre.name}
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {genre.count} books
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full transition-all duration-500 bg-blue-600"
                          style={{
                            width: `${
                              (genre.count / userStats.totalBorrowed) * 100
                            }%`,
                            opacity: 1 - index * 0.2,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reading Status */}
            <div className="border border-gray-100 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-4">Reading Status</h3>

              {userStats.totalBorrowed === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No reading data available yet
                </p>
              ) : (
                <div className="flex justify-center">
                  <div className="relative w-36 h-36">
                    {/* Circular progress background */}
                    <div className="w-full h-full rounded-full bg-gray-200"></div>

                    {/* Circular progress indicator */}
                    <div
                      className="absolute top-0 left-0 w-full h-full rounded-full"
                      style={{
                        background: `conic-gradient(#3b82f6 ${
                          (userStats.returned / userStats.totalBorrowed) * 100
                        }%, transparent 0)`,
                      }}
                    ></div>

                    {/* Inner circle/text */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-white rounded-full flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-blue-600">
                        {Math.round(
                          (userStats.returned / userStats.totalBorrowed) * 100
                        )}
                        %
                      </span>
                      <span className="text-xs text-gray-500">Completed</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Activity Summary */}
            <div className="border border-gray-100 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-4">
                Recent Activity
              </h3>

              {recentBorrows.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No recent activity
                </p>
              ) : (
                <div className="space-y-3">
                  {recentBorrows.map((borrow, index) => (
                    <div key={index} className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-full mr-3">
                        <FaBook className="text-blue-700" />
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">
                          {borrow.returned ? "Returned" : "Borrowed"}:{" "}
                          {borrow.bookTitle}
                        </p>
                        <p className="text-gray-500">
                          {formatDate(borrow.borrowedDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHero;
