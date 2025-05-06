import React from "react";
import ReactDOM from 'react-dom/client';
import App from "./App";
import './index.css'
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router";
import CreateTrip from "./create-trip";
import Header from "./components/custom/Header";

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
    <Header/>
    
    <RouterProvider router={router}/>
  </React.StrictMode>
)