"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiUser, FiEdit2, FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function PublicationHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: "LATEST", path: "/latest" },
    { 
      name: "TOPICS", 
      path: "/topics",
      dropdown: [
        { name: "Data Science", path: "/topics/data-science" },
        { name: "Machine Learning", path: "/topics/ml" },
        { name: "AI", path: "/topics/ai" },
        { name: "Data Engineering", path: "/topics/data-engineering" },
      ]
    },
    { name: "EDITORS' PICKS", path: "/picks" },
    { 
      name: "RESOURCES", 
      path: "/resources",
      dropdown: [
        { name: "Tutorials", path: "/resources/tutorials" },
        { name: "Courses", path: "/resources/courses" },
        { name: "Books", path: "/resources/books" },
        { name: "Cheat Sheets", path: "/resources/cheatsheets" },
      ]
    },
    { name: "NEWSLETTER", path: "/newsletter" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setSearchOpen(false);
      toast.success(`Searching for "${searchQuery}"`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  return (
    <header className="bg-gray-950 border-b border-gray-800 shadow-sm sticky top-0 z-50">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-center py-2 px-4 text-sm">
        <p>
          Towards Data Science is now independent. <Link href="/about" className="font-semibold underline hover:no-underline">Learn more →</Link>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navigation */}
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="flex flex-col"
            >
              <h1 className="text-3xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                towards
              </h1>
              <h2 className="text-2xl font-light text-gray-300 group-hover:text-indigo-300 transition-colors -mt-1">
                data science
              </h2>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <div 
                key={item.name}
                className="relative"
                ref={item.dropdown ? dropdownRef : null}
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
                onMouseLeave={() => item.dropdown && setActiveDropdown(null)}
              >
                <Link
                  href={item.path}
                  className={`flex items-center px-4 py-3 rounded-md text-sm font-medium ${
                    activeDropdown === item.name 
                      ? "text-indigo-400 bg-gray-800" 
                      : "text-gray-300 hover:text-indigo-400 hover:bg-gray-800"
                  } transition-colors`}
                  onClick={() => setActiveDropdown(null)}
                >
                  {item.name}
                  {item.dropdown && (
                    <FiChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                      activeDropdown === item.name ? "rotate-180" : ""
                    }`} />
                  )}
                </Link>

                {/* Dropdown Menu */}
                {item.dropdown && (
                  <AnimatePresence>
                    {activeDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-1 w-56 bg-gray-900 rounded-lg shadow-xl ring-1 ring-gray-800 focus:outline-none z-50"
                      >
                        <div className="py-1">
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.path}
                              className="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-indigo-400 transition-colors"
                              onClick={() => setActiveDropdown(null)}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setSearchOpen(!searchOpen);
                setMobileMenuOpen(false);
              }}
              className="p-2 rounded-full text-gray-300 hover:text-indigo-400 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              aria-label="Search"
            >
              <FiSearch className="h-5 w-5" />
            </button>

            <div className="hidden md:flex items-center space-x-3">
              <Link
                href="/signin"
                className="px-4 py-2.5 rounded-md text-sm font-medium text-gray-300 hover:text-indigo-400 hover:bg-gray-800 transition-colors flex items-center"
              >
                <FiUser className="mr-2 h-4 w-4" />
                Sign In
              </Link>
              <Link
                href="/contribute"
                className="px-4 py-2.5 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center shadow-sm hover:shadow-md"
              >
                <FiEdit2 className="mr-2 h-4 w-4" />
                Contribute
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-300 hover:text-indigo-400 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-2 pb-4 space-y-1">
                {navItems.map((item) => (
                  <div key={item.name} className="border-b border-gray-800 last:border-0">
                    <Link
                      href={item.path}
                      className="block px-4 py-4 text-base font-medium text-gray-300 hover:text-indigo-400 hover:bg-gray-800 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="flex justify-between items-center">
                        {item.name}
                        {item.dropdown && (
                          <FiChevronDown className={`h-5 w-5 transition-transform ${
                            activeDropdown === item.name ? "rotate-180" : ""
                          }`} />
                        )}
                      </div>
                    </Link>
                    {item.dropdown && (
                      <div className={`pl-6 pb-2 ${activeDropdown === item.name ? 'block' : 'hidden'}`}>
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.path}
                            className="block px-4 py-3 text-sm text-gray-400 hover:text-indigo-400 hover:bg-gray-800 transition-colors rounded-md"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="px-4 pt-4 space-y-3">
                  <Link
                    href="/signin"
                    className="block w-full px-4 py-3 text-center text-base font-medium text-gray-300 hover:text-indigo-400 hover:bg-gray-800 transition-colors rounded-md border border-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiUser className="inline mr-2 h-5 w-5" />
                    Sign In
                  </Link>
                  <Link
                    href="/contribute"
                    className="block w-full px-4 py-3 text-center text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-md shadow-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiEdit2 className="inline mr-2 h-5 w-5" />
                    Contribute
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleSearch} className="px-2 py-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-800 rounded-lg leading-5 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Search articles, tutorials, and more..."
                    aria-label="Search"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <FiX className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}