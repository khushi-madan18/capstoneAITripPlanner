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
import Viewtrip from "./view-trip/[tripId]/index.jsx";
import MyTrips from "./my-trips";
const router = createBrowserRouter([
  {
    path:'/',
    element:<App/>
  },
  {
    path:'/create-trip',
    element: <CreateTrip/>
  },
  {
    path:'/view-trip/:tripId',
    element: <Viewtrip />
  },
  {
    path:'/my-trips',
    element: <MyTrips/>
  }
])
ReactDOM.createRoot(document.getElementById('root')).render(
  
  <React.StrictMode>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLENT_ID} redirectUri="http://localhost:5173">
      <Header />
      <Toaster />
      <RouterProvider router={router}/>
     </GoogleOAuthProvider>
  </React.StrictMode>
)