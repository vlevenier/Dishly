import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomePage from "../pages/Home";
import IndexPage from "../pages/admin/indexPage";
import ADMOrders from "./ADMOrders";
import ADMIngredients from "./ADMIngredients";
import ProductsAdmin from "./ADMProducts";
import CategoriesAdmin from "./ADMCategories";
import ADMInvoices from "./ADMInvoices";
import ClientKiosk from "../pages/kiosk/Index";

function RoutesComponent() {


  return (
      <>
      <ToastContainer autoClose={15000}  />
      <Routes>
          <Route path="/*" element={<ClientKiosk />} />
          <Route path="/admin" element={<IndexPage />} >
            <Route path="orders" element={<ADMOrders/>}></Route>
            <Route path="products" element={<ProductsAdmin/>}></Route>
            <Route path="ingredients" element={<ADMIngredients/>}></Route>
            <Route path="categories" element={<CategoriesAdmin/>}></Route> 
            <Route path="invoices" element={<ADMInvoices/>}></Route>  
          </Route>
       
      </Routes>
      </>
  );
}

export default RoutesComponent;