import React from "react";
import ReactDOM from 'react-dom/client';
import App from "./App";
import './index.css'
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router";
import CreateTrip from "./create-trip";
import Header from "./components/custom/Header";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
const router = createBrowserRouter([
  {
    path:'/',
    element:<App/>
  },
  {
    path:'/create-trip',
    element: <CreateTrip/>
  }
])
ReactDOM.createRoot(document.getElementById('root')).render(
  
  <React.StrictMode>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLENT_ID}>
      <Header />
      <Toaster />
      <RouterProvider router={router}/>
     </GoogleOAuthProvider>;
  </React.StrictMode>
)