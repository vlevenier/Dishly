


import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/useAuth';
import OrderClientView from '../../components/client/OrdersFood';
import { getMenu } from '../../services/Menu';

const ClientKiosk = () => {
     const {user} = useAuth();
     const [menu, setMenu] = useState([]);

      useEffect(() => {
        loadMenu();
      }, []);


     const loadMenu = async () => {
        const menuList = await getMenu(); 
        setMenu(menuList);
     }
  
  return (
    <>
    
       <OrderClientView menu={menu}/>
    
     </>
  );
};

export default ClientKiosk;