import React from 'react';
import { createRoot } from 'react-dom/client';
import { OrderDetail } from './pages/OrderDetail';


function App(){
  return <OrderDetail/>;
}
createRoot(document.getElementById('root')!).render(<App/>);