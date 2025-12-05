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
import PrivateRoute from "./PrivateRoute";
import LoginPage from "../pages/auth/login";
import ADMCombos from "./ADMCombos";

function RoutesComponent() {


  return (
      <>
      <ToastContainer autoClose={15000}  />
      <Routes>
          {/* <Route path="/*" element={<ClientKiosk />} /> */}
                    <Route path="/*" element={<LoginPage />} />

                  <Route path="/login" element={<LoginPage />} /> {/* Ruta para login */}

          <Route path="/admin" element={ <PrivateRoute requiredRole="admin"><IndexPage /></PrivateRoute> } >
            <Route path="orders" element={ <PrivateRoute requiredRole="admin"> <ADMOrders/> </PrivateRoute> }></Route>
            <Route path="products" element={ <PrivateRoute requiredRole="admin"><ProductsAdmin/></PrivateRoute>}></Route>
            <Route path="ingredients" element={<PrivateRoute requiredRole="admin"><ADMIngredients/></PrivateRoute>}></Route>
            <Route path="categories" element={<PrivateRoute requiredRole="admin"><CategoriesAdmin/></PrivateRoute>}></Route> 
            <Route path="invoices" element={<PrivateRoute requiredRole="admin"><ADMInvoices/></PrivateRoute>}></Route>  
            <Route path="combos" element={<ADMCombos/>}></Route>
             <Route
                  path="kiosk"
                  element={
                    <PrivateRoute requiredRole="admin">
                      <ClientKiosk />
                    </PrivateRoute>
              }
            />
          </Route>


              <Route
                  path="/kiosk"
                  element={
                    <PrivateRoute requiredRole="kiosk">
                      <ClientKiosk />
                    </PrivateRoute>
              }
            />
      </Routes>
      </>
  );
}

export default RoutesComponent;