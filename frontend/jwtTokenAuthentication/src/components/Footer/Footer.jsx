import { Link } from "react-router-dom"
import { Instagram, Facebook, Youtube, TwitterIcon as TikTok, PinIcon as Pinterest } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-300 px-4 py-8 md:py-12">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Shop Section */}
          <div>
            <h3 className="mb-4 font-semibold uppercase">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/ladies" className="hover:underline">
                  Ladies
                </Link>
              </li>
              <li>
                <Link to="/men" className="hover:underline">
                  Men
                </Link>
              </li>
              <li>
                <Link to="/kids" className="hover:underline">
                  Kids
                </Link>
              </li>
              <li>
                <Link to="/home" className="hover:underline">
                  Home
                </Link>
              </li>
            </ul>
          </div>

          {/* Corporate Info Section */}
          <div>
            <h3 className="mb-4 font-semibold uppercase">Corporate Info</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/careers" className="hover:underline">
                  Career at Elegant Wardrobe ★
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:underline">
                  About Elegant Wardrobe ★
                </Link>
              </li>
              <li>
                <Link to="/investor" className="hover:underline">
                  Investor relation
                </Link>
              </li>
              <li>
                <Link to="/governance" className="hover:underline">
                  Corporate Governance
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Section */}
          <div>
            <h3 className="mb-4 font-semibold uppercase">Help</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/customer-service" className="hover:underline">
                  Customer Service
                </Link>
              </li>
              <li>
                <Link to="/legal" className="hover:underline">
                  Legal & Privacy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/report" className="hover:underline">
                  Report a Scam
                </Link>
              </li>
              <li>
                <Link to="/cookie-settings" className="hover:underline">
                  Cookie Settings
                </Link>
              </li>
              <li>
                <Link to="/cookie-notice" className="hover:underline">
                  Cookie Notice
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="mb-4 text-sm">
              Sign up now and be the first to know exclusive offers, latest fasion news and style tips !
            </h3>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-12 flex justify-center space-x-6">
          <Link to="https://instagram.com" className="hover:text-gray-600">
            <Instagram className="h-6 w-6" />
            <span className="sr-only">Instagram</span>
          </Link>
          <Link to="https://tiktok.com" className="hover:text-gray-600">
            <TikTok className="h-6 w-6" />
            <span className="sr-only">TikTok</span>
          </Link>
          <Link to="https://youtube.com" className="hover:text-gray-600">
            <Youtube className="h-6 w-6" />
            <span className="sr-only">YouTube</span>
          </Link>
          <Link to="https://pinterest.com" className="hover:text-gray-600">
            <Pinterest className="h-6 w-6" />
            <span className="sr-only">Pinterest</span>
          </Link>
          <Link to="https://facebook.com" className="hover:text-gray-600">
            <Facebook className="h-6 w-6" />
            <span className="sr-only">Facebook</span>
          </Link>
        </div>

        {/* About Us Link */}
        <div className="mt-8 text-center">
          <Link to="/about-us" className="hover:underline">
            About us
          </Link>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-sm">
          <p>The content in this site is copyright protected and is the property of Elegant Wardrobe ★</p>
          <p className="mt-2">Elegant Wardrobe ★</p>
        </div>
      </div>
    </footer>
  )
}