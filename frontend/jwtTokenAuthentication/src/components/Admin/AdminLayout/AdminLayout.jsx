"use client"

import { useState } from "react"
import { Link, Outlet } from "react-router-dom"

export default function AdminLayout() {
  const [selectedMenu, setSelectedMenu] = useState("Dashboard")

  const menuItems = ["Dashboard", "Products", "Orders", "Users", "Coupons", "Category", "Banners", "Offers"]

 

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 text-xl font-bold text-center border-b">ELEGANT WARDROBE ★</div>
        <nav className="p-4">
          {menuItems.map((item) => (
            <Link to={`${item.toLowerCase()}`}><button
              key={item}
              onClick={() => setSelectedMenu(item)}
              className={`w-full text-left p-3 rounded-lg mb-1 ${
                selectedMenu === item ? "bg-black text-white" : "hover:bg-gray-100"
              }`}
            >
              {item}
            </button>
            </Link>
          ))}
          <div className="border-t mt-4 pt-4">
            <Link to="settings"><button className="w-full text-left p-3 hover:bg-gray-100 rounded-lg">Settings</button></Link>
            <button className="w-full text-left p-3 hover:bg-gray-100 rounded-lg">Log out</button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
     <div className="page-content">
        <Outlet/>
     </div>
    </div>
  )
}


