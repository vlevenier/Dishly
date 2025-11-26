
import React from 'react';
import Layout from '../../components/LayoutComponent';
import CategoriesAdmin from '../../components/ADMCategories';
import ProductsAdmin from '../../components/ADMProducts';
import ADMOrders from '../../components/ADMOrders';
import ADMInvoices from '../../components/ADMInvoices';

const IndexPage = () => {
  return (
     
     <Layout>
      
        <ADMInvoices/>
     </Layout>
  );
};

export default IndexPage;