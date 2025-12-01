import React from 'react';
import Layout from '../components/LayoutComponent';
import { useAuth } from '../auth/useAuth';
import GoogleSignInButton from '../components/GoogleSignInButton';
import LogoutButton from '../components/Logout';
import OrderClientView from '../components/client/OrdersFood';

const HomePage = () => {
     const {user} = useAuth();
  
  return (
    <>
 
    <Layout>
     
    {/* <GoogleSignInButton/> 
       <LogoutButton></LogoutButton>  */}
       <OrderClientView />
    </Layout>
     </>
  );
};

export default HomePage;