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
import Layout from "./components/Layout"; // Import the new Layout component

function App() {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public routes without the layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/verify_email" element={<VerifyEmail />} />

        {/* Protected routes with the layout */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/books"
          element={
            <Layout>
              <Books />
            </Layout>
          }
        />
        <Route
          path="/catalog"
          element={
            <Layout>
              <Catalog />
            </Layout>
          }
        />
        <Route
          path="/users"
          element={
            <Layout>
              <Users />
            </Layout>
          }
        />
        <Route
          path="/myBorrowedBooks"
          element={
            <Layout>
              <MyBorrowedBooks />
            </Layout>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
