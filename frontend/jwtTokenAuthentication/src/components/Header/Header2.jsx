"use client"

import { useState } from "react"
import { Search, User, ShoppingCart, Heart, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import Link from "next/link"
import { Link } from "react-router-dom"

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="w-full bg-[#F5F5F5] border-b">
      <div className="container px-4 mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between py-4">
          {/* Mobile menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium hover:text-gray-600 transition-colors"
                >
                  Contact Us
                </Link>
                <Link
                  to="/men"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium hover:text-gray-600 transition-colors"
                >
                  Men
                </Link>
                <Link
                  href="/women"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium hover:text-gray-600 transition-colors"
                >
                  Women
                </Link>
                <Link
                  href="/kids"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium hover:text-gray-600 transition-colors"
                >
                  Kids
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Desktop navigation - left */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link href="/contact" className="text-sm hover:text-gray-600 transition-colors">
              Contact Us
            </Link>
            <Link href="/men" className="text-sm hover:text-gray-600 transition-colors">
              Men
            </Link>
          </nav>

          {/* Logo - center */}
          <div className="flex-1 lg:flex-none text-center">
            <Link href="/" className="text-xl font-serif inline-block">
              ELEGANT WARDROBE★
            </Link>
          </div>

          {/* Right side icons and search */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block relative w-64">
              <Input type="search" placeholder="Search anything..." className="bg-pink-50/50 border-none pl-8" />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Button variant="ghost" size="icon" className="hover:text-gray-600">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>
            <Button variant="ghost" size="icon" className="hover:text-gray-600">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Button>
            <Button variant="ghost" size="icon" className="hover:text-gray-600">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Wishlist</span>
            </Button>
            <Link href="/kids" className="hidden lg:block text-sm hover:text-gray-600 transition-colors">
              Kids
            </Link>
          </div>
        </div>

        {/* Bottom navigation */}
        <nav className="flex justify-center py-2">
          <Link href="/women" className="text-sm hover:text-gray-600 transition-colors">
            Women
          </Link>
        </nav>
      </div>
    </header>
  )
}

