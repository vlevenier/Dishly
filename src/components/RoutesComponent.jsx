import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomePage from "../pages/Home";
import IndexPage from "../pages/admin/indexPage";

function RoutesComponent() {


  return (
      <>
      <ToastContainer autoClose={15000}  />
      <Routes>
          <Route path="/*" element={<HomePage />} />
          <Route path="/admin" element={<IndexPage />} />
       
      </Routes>
      </>
  );
}

export default RoutesComponent;