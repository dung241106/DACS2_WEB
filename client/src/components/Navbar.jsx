/*  import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
      <Link to="/">
        <svg
          viewBox="0 0 600 120"
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-auto"
        >
          <defs>
            <linearGradient
              id="redGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#FF385C", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#E31C5F", stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>

          <text
            x="20"
            y="70"
            style={{
              fontSize: "70px",
              fontWeight: 700,
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            <tspan fill="url(#redGradient)">C</tspan>
            <tspan fill="white">inemaShow</tspan>
          </text>
        </svg>
      </Link>
    </div>
  );
};

export default Navbar; */
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { MenuIcon, Search, SearchIcon, TicketPlus, XIcon } from "lucide-react";
import { useState } from "react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

/*  Tạo 1 navbar bao gồm
logo , menu item , searchIcon , clerkLogin */
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // theo doi trang thai mo/ dong cua menu tren di dong
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
      <Link
        to="/"
        onClick={() => {
          scrollTo(0, 0);
          setIsOpen(false);
        }}
      >
        <img src={assets.logo} alt=" " className="h-auto w-36" />
      </Link>
      <div
        className={` max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium
max-md:text-lg z-50 flex flex-col md:flex-row items-center
max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen
min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border
border-gray-300/20 overflow-hidden transition-[width] duration-300    ${
          isOpen ? "max-md:w-full" : " max-md:w-0"
        }`}
      >
        <XIcon
          className="md:hidden absolute top-6 right-6 w-6 h-6  cursor-pointer   "
          onClick={() => setIsOpen(!isOpen)}
        />
        <Link
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/"
        >
          Home
        </Link>
        <Link
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/movies"
        >
          Movies
        </Link>
        <Link
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/"
        >
          Theaters
        </Link>
        <Link
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/"
        >
          Release
        </Link>
        <Link
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/favorite"
        >
          Farovites
        </Link>
      </div>
      {/* login */}
      <div className="flex items-center gap-8">
        <SearchIcon className="max-md:hidden   w-6 h-6 cursor-pointer" />
        {!user ? (
          <button
            onClick={() => openSignIn()}
            className="px-4 py-1 sm:py sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer "
          >
            Login
          </button>
        ) : (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Bookings"
                labelIcon={<TicketPlus width={15} />}
                onClick={() => navigate("/my-bookings")}
              />
            </UserButton.MenuItems>
          </UserButton>
        )}
      </div>
      <MenuIcon
        className="max-md:m1-4 md:hidden w-8 h-8 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      />
    </div>
  );
};
export default Navbar;

/*  chức năng chính của code này là tạo ra thanh điều hướng cố định ở đấu trang có responsive */
