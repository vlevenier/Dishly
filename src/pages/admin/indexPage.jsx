
import React from 'react';
import Layout from '../../components/LayoutComponent';
import CategoriesAdmin from '../../components/ADMCategories';
import ProductsAdmin from '../../components/ADMProducts';
import ADMOrders from '../../components/ADMOrders';

const IndexPage = () => {
  return (
     
     <Layout>
      
        <ADMOrders/>
     </Layout>
  );
};

export default IndexPage;