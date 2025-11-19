import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomePage from "../pages/Home";

function RoutesComponent() {


  return (
      <>
      <ToastContainer autoClose={15000}  />
      <Routes>
          <Route path="/*" element={<HomePage />} />
       
      </Routes>
      </>
  );
}

export default RoutesComponent;