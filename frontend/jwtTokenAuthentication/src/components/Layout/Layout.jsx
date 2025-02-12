import { Outlet } from "react-router-dom";
import Header3 from "../Header/Header3";
import Footer from "../Footer/Footer";


const Layout = () => {
  return (
    <div>
      <Header3 />
      <main>
        <Outlet />  {/* This will render the page content dynamically */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
