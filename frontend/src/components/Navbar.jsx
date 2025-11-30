import { Link, useLocation } from "react-router";
import {
 ShieldCheck,
  Sun,
  Moon,
  LogIn,
  UserRoundPlus,
} from "lucide-react";
import { useEffect, useState } from "react";

function Navbar() {
  const [theme, setTheme] = useState("light");
  const location = useLocation();

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  // Toggle Theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-base-100/80 backdrop-blur-sm border-b border-base-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-5 py-3 flex justify-between items-center">

        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-3 group hover:scale-[1.03] transition"
        >
          <div className="size-10 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent flex items-center justify-center shadow-md">
            <ShieldCheck className="size-6 text-white" />
          </div>

          <div>
            <p className="font-black text-lg bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent tracking-wide">
              Fluent
            </p>
            <p className="text-xs text-base-content/60 -mt-1">
              Speak2gether
            </p>
          </div>
        </Link>

        {/* NAV BUTTONS */}
        <div className="flex items-center gap-2">

          {/* Login */}
          <Link
            to="/login"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${
                isActive("/login")
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }
            `}
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Login</span>
          </Link>

          {/* Signup */}
          <Link
            to="/signup"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${
                isActive("/signup")
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }
            `}
          >
            <UserRoundPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Up</span>
          </Link>

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition hover:scale-105 hover:bg-base-200 dark:hover:bg-base-300"
          >
            {theme === "light" ? (
              <>
                <Moon className="w-4 h-4" />
                <span className="hidden sm:inline">Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4" />
                <span className="hidden sm:inline">Light</span>
              </>
            )}
          </button>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
