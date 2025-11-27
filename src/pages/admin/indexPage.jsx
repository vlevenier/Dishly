
import React from 'react';
import Layout from '../../components/LayoutComponent';
import CategoriesAdmin from '../../components/ADMCategories';
import ProductsAdmin from '../../components/ADMProducts';
import ADMOrders from '../../components/ADMOrders';
import ADMInvoices from '../../components/ADMInvoices';
import GoogleSignInButton from '../../components/GoogleSignInButton';
import LogoutButton from '../../components/Logout';
import { useAuth } from '../../auth/useAuth';

const IndexPage = () => {

   const {user} = useAuth();
  return (
     
     <Layout>
        {/* <ADMOrders/> */}
        {JSON.stringify(user)}
        <GoogleSignInButton/>

        <LogoutButton></LogoutButton>
        <ADMInvoices/>
     </Layout>
  );
};

export default IndexPage;