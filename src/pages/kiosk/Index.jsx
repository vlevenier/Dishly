


import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/useAuth';
import OrderClientView from '../../components/client/OrdersFood';
import { getMenu } from '../../services/Menu';
import OrderClientViewMain from '../../components/client/OrdersFoodMain';

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
    
       <OrderClientViewMain menu={menu}/>
    
     </>
  );
};

export default ClientKiosk;