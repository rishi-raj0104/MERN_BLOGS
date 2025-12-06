import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { MdLogin } from "react-icons/md";
import SearchBox from "./SearchBox";
import {
  RouteBlogAdd,
  RouteIndex,
  RouteProfile,
  RouteSignIn,
} from "@/helpers/RouteName";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import usericon from "@/assets/images/user.png";

import { FaRegUser } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { IoLogOutOutline } from "react-icons/io5";
import { FiSearch, FiMenu, FiSun, FiMoon, FiX } from "react-icons/fi";
import { BiPen } from "react-icons/bi";
import { removeUser } from "@/redux/user/user.slice";
import { showToast } from "@/helpers/showToast";
import { getEnv } from "@/helpers/getEnv";
import { useSidebar } from "./ui/sidebar";

const Topbar = () => {
  const { toggleSidebar } = useSidebar();
  const [showSearch, setShowSearch] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/auth/logout`,
        {
          method: "get",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return showToast("error", data.message);
      }
      dispatch(removeUser());
      navigate(RouteIndex);
      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.message);
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass-strong shadow-soft border-b border-border/50"
            : "bg-background/80 backdrop-blur-sm"
        }`}
      >
        <div className="flex justify-between items-center h-16 px-4 md:px-6">
          {/* Left Section - Menu & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              type="button"
              aria-label="Toggle menu"
            >
              <FiMenu className="w-5 h-5 text-foreground" />
            </button>

            <Link to={RouteIndex} className="flex items-center gap-2.5 group">
              <div className="p-1.5 bg-gradient-primary rounded-lg shadow-soft group-hover:shadow-medium transition-shadow">
                <BiPen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-foreground hidden sm:block">
                BlogVerse
              </span>
            </Link>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <SearchBox />
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Toggle */}
            <button
              onClick={toggleSearch}
              type="button"
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Search"
            >
              {showSearch ? (
                <FiX className="w-5 h-5 text-foreground" />
              ) : (
                <FiSearch className="w-5 h-5 text-foreground" />
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <FiSun className="w-5 h-5 text-foreground" />
              ) : (
                <FiMoon className="w-5 h-5 text-foreground" />
              )}
            </button>

            {!user.isLoggedIn ? (
              <Button
                asChild
                className="bg-gradient-primary hover:opacity-90 text-white rounded-full h-9 px-4 font-medium shadow-soft"
              >
                <Link to={RouteSignIn}>
                  <MdLogin className="w-4 h-4 mr-1.5" />
                  Sign In
                </Link>
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <Avatar className="w-9 h-9 ring-2 ring-primary/20 hover:ring-primary/40 transition-all cursor-pointer">
                    <AvatarImage src={user.user.avatar || usericon} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {user.user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2">
                  <DropdownMenuLabel className="pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.user.avatar || usericon} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {user.user.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">
                          {user.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.user.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer py-2.5 px-3 rounded-lg"
                  >
                    <Link to={RouteProfile} className="flex items-center gap-3">
                      <FaRegUser className="w-4 h-4 text-muted-foreground" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer py-2.5 px-3 rounded-lg"
                  >
                    <Link to={RouteBlogAdd} className="flex items-center gap-3">
                      <FaPlus className="w-4 h-4 text-muted-foreground" />
                      <span>Create Blog</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer py-2.5 px-3 rounded-lg text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <IoLogOutOutline className="w-4 h-4 mr-3" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            showSearch ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pb-4">
            <SearchBox />
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16"></div>
    </>
  );
};

export default Topbar;
