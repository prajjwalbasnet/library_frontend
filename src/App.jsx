import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import VerifyEmail from "./pages/VerifyEmail";
import Books from "./pages/Books";
import Catalog from "./pages/Catalog";
import Users from "./pages/Users";
import MyBorrowedBooks from "./pages/MyBorrowedBooks";

function App() {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify_email" element={<VerifyEmail />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/users" element={<Users />} />
        <Route path="/myBorrowedBooks" element={<MyBorrowedBooks />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
