import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "react-hot-toast";

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <main style={{ height: "auto" }}>{children}</main>
      <Toaster />
      <Footer />
    </div>
  );
};

export default Layout;
