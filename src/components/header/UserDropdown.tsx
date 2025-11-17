import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { User } from "../../types/User";
import env from "../../config/env";

// Env
const API_URL = env.API_URL;
const USER_FE_URL = env.USER_FE_URL;

export default function UserDropdownWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Load user từ localStorage khi component mount
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        const parsed: User = JSON.parse(raw);
        setUser(parsed);
      } catch {
        console.error("Invalid user data in localStorage");
      }
    }
  }, []);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);

  // Logout function
  const logout = () => {
    // Xóa localStorage / sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Xóa cookie client-side
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=; Max-Age=0; path=/`;
    });

    // Gọi API logout bằng sendBeacon để đảm bảo gửi request khi unload
    navigator.sendBeacon(`${API_URL}/api/auth/logout`);

    // Redirect sang trang user
    window.location.href = USER_FE_URL;
  };

  // Full name
  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : "User";

  // Nếu chưa login => show nút Login
  if (!user) {
    return (
      <Link
        to="/signin"
        className="px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        Login
      </Link>
    );
  }

  // Nếu đã login => show dropdown
  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        {/* Avatar */}
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <img
            src={user?.avatarUrl || "./images/user/owner.jpg"}
            alt="User"
            className="object-cover w-full h-full"
          />
        </span>

        {/* Full name */}
        <span className="mr-1 font-medium text-theme-sm">{fullName}</span>

        {/* Arrow icon */}
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] w-[260px] rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        {/* User info */}
        <div className="pb-3 border-b border-gray-200 dark:border-gray-800">
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {fullName}
          </span>
          <span className="text-theme-xs text-gray-500 dark:text-gray-400">
            {user?.email || ""}
          </span>
        </div>

        {/* Logout button */}
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-white/5 text-theme-sm"
        >
          Sign out
        </button>
      </Dropdown>
    </div>
  );
}
