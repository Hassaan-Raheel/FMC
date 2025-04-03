import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '../src/Pages/ECommerce/dataTableStyle.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SwatchProvider } from '../src/Context/ComponentContext/SwatchContext';
import { VariationProvider } from './Context/ComponentContext/VariationContext';
import { ActiveSaleProvider } from './Context/active-sale-context/ActiveSaleContext';
import { ActiveFinanceProvider } from './Context/ActiveFinanceContext/ActiveFinanceContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ActiveSaleProvider>
      <ActiveFinanceProvider>
    <VariationProvider>
    <SwatchProvider>
    <App />
    </SwatchProvider>
    </VariationProvider>
    </ActiveFinanceProvider>
    </ActiveSaleProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();