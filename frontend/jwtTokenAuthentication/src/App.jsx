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
          <Route path="/register1" element={<RegisterComponent/>} />
          <Route path="/reset-password" element={<ResetPassword/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
