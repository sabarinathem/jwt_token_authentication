import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header3 from "./components/Header/Header3";
import Footer from "./components/Footer/Footer";
import Sample from "./components/Sample";

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
 

        </Routes>
      </Router>
    </>
  );
}

export default App;
