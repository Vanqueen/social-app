// RootLayout.tsx

import { Outlet } from "react-router-dom"
import Sidebar from "./components/Sidebar"
// import Widgets from "./components/Widgets"
import Navbar from "./components/Navbar"
import ThemeModal from "./components/ThemeModal"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import type { AppState } from "./types/app-state.types"

const RootLayout = () => {
  const { themeModalIsOpen } = useSelector((state: AppState) => state?.ui);
  const {primaryColor, backgroundColor} = useSelector((state: AppState) => state?.ui?.theme);

  useEffect(() => {
    const body = document.body;
    body.className = `${primaryColor} ${backgroundColor}`;
  }, [primaryColor, backgroundColor])

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
          {/* <Widgets /> */}
          {themeModalIsOpen && <ThemeModal />}
        </div>
      </main>
    </>
  )
}

export default RootLayout
