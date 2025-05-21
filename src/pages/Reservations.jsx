import React, { useEffect, useState, useRef } from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { MdPreview } from "react-icons/md";
import {
  FaBookOpen,
  FaCalendarAlt,
  FaCheck,
  FaTimes,
  FaClock,
  FaSearch,
} from "react-icons/fa";
import { RiReservedLine } from "react-icons/ri";
import { toast } from "react-toastify";

const MyReservations = () => {
  const { user, isAdmin, API_URL } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [currentReservationId, setCurrentReservationId] = useState(null);
  const [openSearch, setOpenSearch] = useState(false);
  const [userFilter, setUserFilter] = useState("");
  const searchContainerRef = useRef(null);

  // Handle click outside search container
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

  // Fetch reservations - different endpoints for admin vs regular user
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        // Use different endpoints based on user role
        const endpoint = isAdmin
          ? `${API_URL}/api/reservation/allReservations`
          : `${API_URL}/api/reservation/userReservations`;

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });
        setReservations(response.data.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        toast.error("Failed to load reservations");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReservations();
    }
  }, [user, isAdmin, API_URL]);

  // Open cancel confirmation dialog
  const openCancelConfirmation = (reservationId) => {
    setCurrentReservationId(reservationId);
    setIsCancelDialogOpen(true);
  };

  // Handle reservation cancellation
  const handleCancelReservation = async () => {
    if (!currentReservationId) {
      toast.error("Reservation ID missing");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.delete(
        `${API_URL}/api/reservation/cancelReservation/${currentReservationId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Reservation cancelled successfully");
        // Update the local state to reflect the cancellation
        setReservations((prevReservations) =>
          prevReservations.map((reservation) =>
            reservation._id === currentReservationId
              ? { ...reservation, status: "Cancelled" }
              : reservation
          )
        );
      } else {
        toast.error(response.data.message || "Failed to cancel reservation");
      }
    } catch (error) {
      console.error("Error cancelling reservation:", error);

      if (error.response) {
        toast.error(
          error.response.data.message || "Failed to cancel reservation"
        );
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
      setIsCancelDialogOpen(false);
    }
  };

  // Filter reservations based on search term, status, and user filter (admin only)
  const getFilteredReservations = (status) => {
    if (!reservations) return [];

    let filtered = reservations.filter((reservation) =>
      status === "Cancelled"
        ? reservation.status === "Cancelled" || reservation.status === "Expired"
        : reservation.status === status
    );

    // Apply book title search filter
    if (searchTerm) {
      filtered = filtered.filter((reservation) =>
        reservation.book?.title
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    // Apply user filter (admin only)
    if (isAdmin && userFilter) {
      filtered = filtered.filter(
        (reservation) =>
          reservation.user?.name
            ?.toLowerCase()
            .includes(userFilter.toLowerCase()) ||
          reservation.user?.email
            ?.toLowerCase()
            .includes(userFilter.toLowerCase()) ||
          reservation.user?.studentId
            ?.toLowerCase()
            .includes(userFilter.toLowerCase())
      );
    }

    return filtered;
  };

  // Card view for mobile
  const renderReservationCard = (reservation) => {
    const isExpiring =
      new Date(reservation.expirationDate) <
      new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    const isActive = reservation.status === "Active";

    return (
      <div
        key={reservation._id}
        className="bg-white rounded-lg shadow-md p-4 mb-4"
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex">
            <div className="flex-shrink-0 w-16 mr-3">
              {reservation.book?.coverImage?.url ? (
                <img
                  className="w-full h-20 object-cover rounded"
                  src={reservation.book.coverImage.url}
                  alt={`Cover of ${reservation.book.title}`}
                />
              ) : (
                <div className="w-full h-20 bg-gray-200 flex items-center justify-center rounded">
                  <FaBookOpen className="text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">
                {reservation.book?.title}
              </h3>
              {isAdmin && (
                <p className="text-sm text-gray-600">
                  {reservation.user?.name} (
                  {reservation.user?.studentId || "No ID"})
                </p>
              )}
            </div>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              reservation.status === "Fulfilled"
                ? "bg-green-100 text-green-800"
                : reservation.status === "Cancelled" ||
                  reservation.status === "Expired"
                ? "bg-red-100 text-red-800"
                : isExpiring
                ? "bg-orange-100 text-orange-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {reservation.status === "Active" && isExpiring
              ? "Expiring Soon"
              : reservation.status}
          </span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <RiReservedLine className="mr-2 text-blue-800" />
            <span className="font-medium mr-2">Reserved On:</span>
            <span>
              {new Date(reservation.reservationDate).toLocaleDateString(
                "en-GB"
              )}
            </span>
          </div>

          <div className="flex items-center">
            <FaClock className="mr-2 text-blue-800" />
            <span className="font-medium mr-2">Expires On:</span>
            <span
              className={
                isExpiring && isActive ? "text-orange-500 font-medium" : ""
              }
            >
              {new Date(reservation.expirationDate).toLocaleDateString("en-GB")}
            </span>
          </div>

          <div className="flex items-center">
            {reservation.status === "Fulfilled" ? (
              <FaCheck className="mr-2 text-green-600" />
            ) : reservation.status === "Expired" ||
              reservation.status === "Cancelled" ? (
              <FaTimes className="mr-2 text-red-600" />
            ) : (
              <FaCalendarAlt className="mr-2 text-blue-600" />
            )}
            <span className="font-medium mr-2">Status:</span>
            <span>{reservation.status}</span>
          </div>
        </div>

        <div className="mt-4">
          {reservation.status === "Active" && (
            <Button
              variant="outline"
              size="sm"
              className="w-full text-red-700 border-red-200 hover:text-white hover:bg-red-700"
              onClick={() => openCancelConfirmation(reservation._id)}
            >
              Cancel Reservation
            </Button>
          )}

          {reservation.status !== "Active" && (
            <Button
              variant="outline"
              size="sm"
              className="w-full text-blue-700 border-blue-200 hover:text-white hover:bg-blue-700"
              disabled
            >
              {reservation.status === "Fulfilled" ? "Fulfilled" : "Cancelled"}
            </Button>
          )}
        </div>
      </div>
    );
  };

  // Helper function to render appropriate table content
  const renderReservationsTable = (status) => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={isAdmin ? 6 : 5} className="text-center py-4">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (!reservations || reservations.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={isAdmin ? 6 : 5} className="text-center py-4">
            No reservations data available
          </TableCell>
        </TableRow>
      );
    }

    const filteredReservations = getFilteredReservations(status);

    if (filteredReservations.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={isAdmin ? 6 : 5} className="text-center py-4">
            {searchTerm
              ? "No reservations matching your search"
              : `No ${status.toLowerCase()} reservations`}
          </TableCell>
        </TableRow>
      );
    }

    return filteredReservations.map((item) => {
      const isExpiring =
        new Date(item.expirationDate) <
        new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

      return (
        <TableRow key={item._id}>
          <TableCell>
            <div className="flex items-center">
              {item.book?.coverImage?.url ? (
                <img
                  className="w-12 h-16 object-cover mr-3 rounded"
                  src={item.book.coverImage.url}
                  alt={`Cover of ${item.book.title}`}
                />
              ) : (
                <div className="w-12 h-16 bg-gray-200 flex items-center justify-center mr-3 rounded">
                  <FaBookOpen className="text-gray-400" />
                </div>
              )}
              <span className="font-medium">{item.book?.title}</span>
            </div>
          </TableCell>
          {isAdmin && (
            <TableCell>
              <div className="flex flex-col">
                <span>{item.user?.name}</span>
                <span className="text-xs text-gray-500">
                  {item.user?.email}
                </span>
                {item.user?.studentId && (
                  <span className="text-xs text-gray-500">
                    ID: {item.user.studentId}
                  </span>
                )}
              </div>
            </TableCell>
          )}
          <TableCell>
            {new Date(item.reservationDate).toLocaleDateString("en-GB")}
          </TableCell>
          <TableCell
            className={
              isExpiring && item.status === "Active"
                ? "text-orange-500 font-medium"
                : ""
            }
          >
            {new Date(item.expirationDate).toLocaleDateString("en-GB")}
          </TableCell>
          <TableCell>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                item.status === "Fulfilled"
                  ? "bg-green-100 text-green-800"
                  : item.status === "Cancelled" || item.status === "Expired"
                  ? "bg-red-100 text-red-800"
                  : isExpiring
                  ? "bg-orange-100 text-orange-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {item.status === "Active" && isExpiring
                ? "Expiring Soon"
                : item.status}
            </span>
          </TableCell>
          <TableCell>
            {item.status === "Active" ? (
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:text-white hover:bg-red-500"
                onClick={() => openCancelConfirmation(item._id)}
              >
                Cancel
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="text-gray-400 border-gray-200 cursor-not-allowed"
                disabled
              >
                {item.status === "Fulfilled" ? "Fulfilled" : "Cancelled"}
              </Button>
            )}
          </TableCell>
        </TableRow>
      );
    });
  };

  // Render mobile card lists
  const renderReservationsCards = (status) => {
    if (loading) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      );
    }

    if (!reservations || reservations.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
          No reservations data available
        </div>
      );
    }

    const filteredReservations = getFilteredReservations(status);

    if (filteredReservations.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
          {searchTerm
            ? "No reservations matching your search"
            : `No ${status.toLowerCase()} reservations`}
        </div>
      );
    }

    return filteredReservations.map((reservation) =>
      renderReservationCard(reservation)
    );
  };

  return (
    <div className="p-3 md:p-5">
      <h1 className="text-2xl md:text-3xl text-blue-800 font-medium mb-4">
        {isAdmin ? "All Reservations" : "My Reservations"}
      </h1>

      {/* Header with search */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <div className="relative w-full sm:w-auto" ref={searchContainerRef}>
          <Input
            placeholder="Search book titles..."
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

        {/* Admin-only user filter */}
        {isAdmin && (
          <div className="w-full sm:w-auto">
            <Input
              placeholder="Filter by user name/email/ID"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full sm:w-64 h-10 bg-gray-100"
            />
          </div>
        )}
      </div>

      <div className="mt-4">
        <Tabs defaultValue="Active" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-flex mb-4">
            <TabsTrigger
              className="data-[state=active]:bg-blue-900 data-[state=active]:text-white"
              value="Active"
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-blue-900 data-[state=active]:text-white"
              value="Fulfilled"
            >
              Fulfilled
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-blue-900 data-[state=active]:text-white"
              value="Cancelled"
            >
              Cancelled/Expired
            </TabsTrigger>
          </TabsList>

          {["Active", "Fulfilled", "Cancelled"].map((status) => (
            <TabsContent key={status} value={status}>
              {/* Mobile card view */}
              <div className="md:hidden space-y-4">
                {renderReservationsCards(status)}
              </div>

              {/* Desktop table view */}
              <div className="hidden md:block">
                <div className="rounded-lg overflow-hidden shadow-md">
                  <Table>
                    <TableHeader className="bg-gray-200">
                      <TableRow>
                        <TableHead>Book</TableHead>
                        {isAdmin && <TableHead>User</TableHead>}
                        <TableHead>Reserved On</TableHead>
                        <TableHead>Expires On</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>{renderReservationsTable(status)}</TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
      >
        <AlertDialogContent className="w-[95vw] max-w-md mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel This Reservation?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Once cancelled, you'll need to make
              a new reservation if you want this book again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="mt-0">
              Keep Reservation
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelReservation}
              className="bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? "Cancelling..." : "Yes, Cancel"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyReservations;
