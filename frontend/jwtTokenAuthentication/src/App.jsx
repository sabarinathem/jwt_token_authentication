import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import ProductsGrid from "./components/ProductsGrid/ProductsGrid";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import RegisterComponent from "./components/Regiter/RegisterComponent";
import ResetPassword from "./components/ForgotPassword/ResetPassword";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "./components/Admin/AdminLayout/AdminLayout";
import AdminDashBoard from "./components/Admin/AdminDashBoard/AdminDashBoard";
import AdminProductsList from "./components/Admin/AdminProductsList/AdminProductsList";
import AdminOrderList from "./components/Admin/AdminOrderList/AdminOrderList";
import AdminUserList from "./components/Admin/AdminUserList/AdminUserList";
import AdminCoupons from "./components/Admin/AdminCoupons/AdminCoupons";
import AdminCategory from "./components/Admin/AdminCategory/AdminCategory";
import AdminBanner from "./components/Admin/AdminBanner/AdminBanner";
import AdminOffers from "./components/Admin/AdminOffers/AdminOffers";
import AdminSettings from "./components/Admin/AdminSettings/AdminSettings";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/products" element={<Layout />}>
            <Route path="" element={<ProductsGrid />} />
            <Route path="product/:id" element={<ProductDetails />} />
          </Route>

          <Route path="/admin" element={<AdminLayout/>}>
            <Route path="dashboard" element={<AdminDashBoard/>} />
            <Route path="products" element={<AdminProductsList/>} />
            <Route path="orders" element={<AdminOrderList/>} />
            <Route path="users" element={<AdminUserList/>} />
            <Route path="coupons" element={<AdminCoupons/>} />
            <Route path="category" element={<AdminCategory/>} />
            <Route path="banners" element={<AdminBanner/>} />
            <Route path="offers" element={<AdminOffers/>} />
            <Route path="settings" element={<AdminSettings/>} />
          </Route>

          <Route path="/register1" element={<RegisterComponent/>} />
          <Route path="/reset-password" element={<ResetPassword/>} />
          <Route path="/admin-layout" element={<AdminLayout/>}/>
        </Routes>
      </Router>

       {/* ✅ Add ToastContainer at the root level */}
       <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
