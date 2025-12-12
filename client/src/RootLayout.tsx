// import React from 'react'

import { Outlet } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import Widgets from "./components/Widgets"
import Navbar from "./components/Navbar"

const RootLayout = () => {
  return (
    <>
      <Navbar />
      <main className="main">
        <div className="container main__container">
          <Sidebar />
          <div className="main__content">
            <Outlet />
          </div>
          {/* <Outlet /> */}
          <Widgets />
        </div>
      </main>
    </>
  )
}

export default RootLayout
