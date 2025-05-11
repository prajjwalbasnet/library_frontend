import React, { useEffect, useState } from "react";
import {
  PiUsersThreeLight,
  PiBookOpenTextLight,
  PiUserGearLight,
  PiBookmarksLight,
} from "react-icons/pi";
import {
  FaBook,
  FaUserPlus,
  FaExchangeAlt,
  FaChartPie,
  FaChartLine,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import bg from "../assets/bg.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminHero = () => {
  const { getAllUsers, userList, isAdmin, isUser } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthlyBorrowData, setMonthlyBorrowData] = useState([]);
  const [genreData, setGenreData] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0,
  });

  // Function to generate the monthly borrowing data from actual borrow records
  const generateMonthlyBorrowData = (borrowedBooks) => {
    // Create an array of the last 6 months
    const months = [];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthIndex = month.getMonth();
      const year = month.getFullYear();
      months.push({
        name: monthNames[monthIndex],
        month: monthIndex,
        year: year,
        books: 0, // Initialize count to 0
      });
    }

    // Count borrowed books for each month
    if (borrowedBooks && borrowedBooks.length > 0) {
      borrowedBooks.forEach((borrow) => {
        const borrowDate = new Date(borrow.createdAt);
        const borrowMonth = borrowDate.getMonth();
        const borrowYear = borrowDate.getFullYear();

        // Find the matching month in our array
        const monthData = months.find(
          (m) => m.month === borrowMonth && m.year === borrowYear
        );
        if (monthData) {
          monthData.books += 1;
        }
      });
    }

    return months;
  };

  // Function to generate genre distribution data from actual books
  const generateGenreData = (books) => {
    // Count books by genre
    const genreCounts = {};
    let totalBooks = 0;

    if (books && books.length > 0) {
      // Count occurrences of each genre
      books.forEach((book) => {
        // Use a default genre name if none exists
        const genre = book.genre ? book.genre.trim() : "Uncategorized";

        if (!genreCounts[genre]) {
          genreCounts[genre] = 0;
        }
        genreCounts[genre]++;
        totalBooks++;
      });
    }

    // Convert to percentage and format
    const colors = [
      "#0088FE",
      "#00C49F",
      "#FFBB28",
      "#FF8042",
      "#8884d8",
      "#82ca9d",
    ];
    const data = Object.keys(genreCounts).map((genre, index) => {
      return {
        name: genre,
        value: Math.round((genreCounts[genre] / totalBooks) * 100),
        color: colors[index % colors.length],
      };
    });

    // Sort by highest percentage first and limit to top 5 plus "Other"
    data.sort((a, b) => b.value - a.value);

    // If we have more than 5 genres, combine the rest into "Other"
    if (data.length > 5) {
      const topGenres = data.slice(0, 5);
      const otherGenres = data.slice(5);

      const otherValue = otherGenres.reduce(
        (total, genre) => total + genre.value,
        0
      );

      if (otherValue > 0) {
        topGenres.push({
          name: "Other",
          value: otherValue,
          color: "#A0A0A0", // Gray color for "Other"
        });
      }

      return topGenres;
    }

    return data;
  };

  // Generate recent activities from API data
  const generateRecentActivities = (books, borrowedBooks) => {
    const activities = [];

    // Add book activities (newest books first)
    if (books && books.length > 0) {
      // Sort books by creation date (newest first)
      const sortedBooks = [...books].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );

      sortedBooks.slice(0, 3).forEach((book) => {
        activities.push({
          id: `book-${book._id}`,
          type: "book_added",
          title: `New book added: ${book.title}`,
          description: `${book.author} - ${book.genre || "Uncategorized"}`,
          time: new Date(book.createdAt || Date.now()).toLocaleString(),
          icon: <FaBook className="text-blue-800" />,
          timestamp: new Date(book.createdAt || 0).getTime(),
        });
      });
    }

    // Add user activities (newest users first)
    if (userList && userList.length > 0) {
      // Sort users by creation date (newest first)
      const sortedUsers = [...userList].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );

      sortedUsers.slice(0, 3).forEach((user) => {
        activities.push({
          id: `user-${user._id}`,
          type: "user_registered",
          title: `New user registered: ${user.name}`,
          description: `${user.email}`,
          time: new Date(user.createdAt || Date.now()).toLocaleString(),
          icon: <FaUserPlus className="text-green-600" />,
          timestamp: new Date(user.createdAt || 0).getTime(),
        });
      });
    }

    // Add borrow activities (newest borrows first)
    if (borrowedBooks && borrowedBooks.length > 0) {
      // Sort borrows by creation date (newest first)
      const sortedBorrows = [...borrowedBooks].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );

      sortedBorrows.slice(0, 5).forEach((borrow) => {
        activities.push({
          id: `borrow-${borrow._id}`,
          type: "book_borrowed",
          title: `Book borrowed: ${borrow.book.title}`,
          description: `By ${borrow.user.name || borrow.user.email}`,
          time: new Date(borrow.createdAt || Date.now()).toLocaleString(),
          icon: <FaExchangeAlt className="text-orange-500" />,
          timestamp: new Date(borrow.createdAt || 0).getTime(),
        });
      });
    }

    // Sort by timestamp (newest first) and limit to 8
    activities.sort((a, b) => b.timestamp - a.timestamp);
    return activities.slice(0, 8);
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch users
        await getAllUsers();

        // Fetch books
        const API_URL = import.meta.env.VITE_BACKEND_URL;
        const booksResponse = await axios.get(`${API_URL}/api/book/getAll`);
        const booksData = booksResponse.data.data || [];
        setBooks(booksData);

        // Fetch borrowed books
        const borrowedResponse = await axios.get(
          `${API_URL}/api/borrow/borrowed-books-by-users`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
          }
        );
        const borrowedData = borrowedResponse.data.borrowedBooks || [];
        setBorrowedBooks(borrowedData);

        // Generate data for charts and activities
        setMonthlyBorrowData(generateMonthlyBorrowData(borrowedData));
        setGenreData(generateGenreData(booksData));
        setRecentActivities(generateRecentActivities(booksData, borrowedData));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update stats when data changes
  useEffect(() => {
    if (userList && books) {
      setStats({
        totalUsers: userList.filter((user) => user.role === "User").length || 0,
        totalAdmins:
          userList.filter((user) => user.role === "Admin").length || 0,
        totalBooks: books.length || 0,
        availableBooks: books.filter((book) => book.availability).length || 0,
        borrowedBooks: books.filter((book) => !book.availability).length || 0,
      });
    }
  }, [userList, books]);

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl md:text-3xl text-blue-800 font-medium mb-6">
        Dashboard Overview
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {/* Total Users */}
        <div className="flex flex-col sm:flex-row items-center p-6 border border-gray-100 shadow-lg rounded-2xl bg-white hover:shadow-xl transition-shadow">
          <div className="p-3 bg-blue-100 rounded-full mb-2 sm:mb-0 sm:mr-4">
            <PiUsersThreeLight className="text-2xl md:text-4xl text-blue-700" />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-500">Total Users</p>
            <h1 className="text-2xl md:text-3xl font-semibold text-blue-700">
              {stats.totalUsers}
            </h1>
          </div>
        </div>

        {/* Total Admins */}
        <div className="flex flex-col sm:flex-row items-center p-6 border border-gray-100 shadow-lg rounded-2xl bg-white hover:shadow-xl transition-shadow">
          <div className="p-3 bg-purple-100 rounded-full mb-2 sm:mb-0 sm:mr-4">
            <PiUserGearLight className="text-2xl md:text-4xl text-purple-700" />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-500">Total Admins</p>
            <h1 className="text-2xl md:text-3xl font-semibold text-purple-700">
              {stats.totalAdmins}
            </h1>
          </div>
        </div>

        {/* Total Books */}
        <div className="flex flex-col sm:flex-row items-center p-6 border border-gray-100 shadow-lg rounded-2xl bg-white hover:shadow-xl transition-shadow">
          <div className="p-3 bg-green-100 rounded-full mb-2 sm:mb-0 sm:mr-4">
            <PiBookOpenTextLight className="text-2xl md:text-4xl text-green-700" />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-500">Total Books</p>
            <h1 className="text-2xl md:text-3xl font-semibold text-green-700">
              {stats.totalBooks}
            </h1>
          </div>
        </div>

        {/* Available Books */}
        <div className="flex flex-col sm:flex-row items-center p-6 border border-gray-100 shadow-lg rounded-2xl bg-white hover:shadow-xl transition-shadow">
          <div className="p-3 bg-yellow-100 rounded-full mb-2 sm:mb-0 sm:mr-4">
            <PiBookOpenTextLight className="text-2xl md:text-4xl text-yellow-700" />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-500">Available Books</p>
            <h1 className="text-2xl md:text-3xl font-semibold text-yellow-700">
              {stats.availableBooks}
            </h1>
          </div>
        </div>

        {/* Borrowed Books */}
        <div className="flex flex-col sm:flex-row items-center p-6 border border-gray-100 shadow-lg rounded-2xl bg-white hover:shadow-xl transition-shadow">
          <div className="p-3 bg-red-100 rounded-full mb-2 sm:mb-0 sm:mr-4">
            <PiBookmarksLight className="text-2xl md:text-4xl text-red-700" />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-500">Borrowed Books</p>
            <h1 className="text-2xl md:text-3xl font-semibold text-red-700">
              {stats.borrowedBooks}
            </h1>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Borrowing Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FaChartLine className="mr-2 text-blue-700" />
              Monthly Book Borrowing Trends
            </h2>
            <p className="text-sm text-gray-500">
              Number of books borrowed in the last 6 months
            </p>
          </div>

          {/* Simple Bar Chart */}
          <div className="h-72 flex items-end space-x-4 mt-6 border-b border-l border-gray-200 relative">
            {/* Y-axis labels */}
            <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
              {(() => {
                // Calculate Y-axis labels based on data
                const maxBooks = Math.max(
                  ...monthlyBorrowData.map((d) => d.books),
                  1
                );
                const yAxisMax = Math.ceil(maxBooks / 5) * 5; // Round up to nearest 5
                const labels = [];
                for (let i = 5; i >= 0; i--) {
                  labels.push(Math.round((yAxisMax * i) / 5));
                }
                return labels.map((value, index) => (
                  <span key={index}>{value}</span>
                ));
              })()}
            </div>

            {/* Bars */}
            <div className="flex-1 flex items-end justify-around h-full pt-4 pl-6">
              {monthlyBorrowData.map((item, index) => {
                const maxBooks = Math.max(
                  ...monthlyBorrowData.map((d) => d.books),
                  1
                );
                const heightPercent = (item.books / maxBooks) * 100;

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center group relative"
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.books} book{item.books !== 1 ? "s" : ""}
                    </div>

                    <div
                      className="w-12 rounded-t transition-all duration-500"
                      style={{
                        height: heightPercent ? `${heightPercent}%` : "2px", // Minimum height for empty months
                        backgroundColor: `rgba(30, 64, 175, ${
                          0.5 + index * 0.1
                        })`,
                      }}
                    ></div>
                    <span className="mt-2 text-xs text-gray-600">
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Genre Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FaChartPie className="mr-2 text-blue-700" />
              Books by Genre
            </h2>
            <p className="text-sm text-gray-500">
              Distribution of books across different genres
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
            </div>
          ) : genreData.length === 0 ? (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No genre data available
            </div>
          ) : (
            <div className="space-y-6 mt-8">
              {genreData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {item.name}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {item.value}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 group relative">
                    <div
                      className="h-2.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${item.value}%`,
                        backgroundColor: item.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-md mb-8">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">
            Recent Activities
          </h2>
          <p className="text-sm text-gray-500">
            Latest actions in the library system
          </p>
        </div>

        <div className="p-0">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
            </div>
          ) : recentActivities.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              No recent activities found
            </div>
          ) : (
            <div className="max-h-96 overflow-auto">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="bg-gray-100 p-2 rounded-full">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">
                      {activity.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {activity.description}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">{activity.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100">
          <Button
            className="w-full text-blue-700 border border-blue-200 bg-white hover:bg-blue-50"
            onClick={() => navigate("/catalog")}
          >
            View All Activities
          </Button>
        </div>
      </div>

      {/* User Section (Conditional UI for regular users) */}
      {isUser && (
        <div className="relative w-full h-[600px] mt-8 rounded-lg overflow-hidden">
          {/* Background Image with Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${bg})`,
            }}
          />
          <div className="relative z-10 flex flex-col px-4 py-6">
            <h1 className="text-blue-800 font-semibold text-4xl">
              Discover Worlds Within Pages
            </h1>
            <p className="text-xl text-gray-600 w-full sm:w-1/2 lg:w-1/3 my-4">
              Your journey of knowledge and imagination begins here, where every
              book opens a door to new possibilities.
            </p>
            <Button
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 text-lg rounded-md transition-all duration-300 font-medium flex items-center justify-center cursor-pointer w-40 mt-3"
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
      )}
    </div>
  );
};

export default AdminHero;
