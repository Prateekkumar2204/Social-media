import React from 'react'
import ReactDOM from 'react-dom/client'


import {
  RouterProvider,
} from "react-router-dom";
import {router} from './Routes'
import './index.css'
import { AuthProvider } from './store/Auth';
ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
  <React.StrictMode>
   <RouterProvider router={router} />
  </React.StrictMode>
  </AuthProvider>
)
