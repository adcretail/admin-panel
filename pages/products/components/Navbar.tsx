"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { auth } from '../firebase'; // Import firebase config
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [user, setUser] = useState<null | User>(null); // Initialize with null | User
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Now the type is compatible
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/Signin');
    } catch (error) {
      console.error('Sign out error', error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-blue-200 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Link href="/" className="text-3xl font-bold text-gray-700">
          Logo
        </Link>
      </div>
      <form action="/search" className="flex items-center ml-4 hidden md:flex">
        <input
          type="search"
          placeholder="Search..."
          className="p-2 text-sm text-gray-600 focus:outline-none focus:border-orange-500"
        />
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded ml-2"
        >
          Search
        </button>
      </form>
      <div className="flex items-center ml-4 gap-4">
        {user ? (
          <>
            <div className="relative">
              <Link href="/account">
              <button
                onClick={toggleDropdown}
                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
              >
                Account
              </button>
              </Link>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                  <Link href="/order">
                    <span className="block px-4 py-2 text-gray-700 hover:bg-gray-200">Orders</span>
                  </Link>
                  <Link href="/cart">
                    <span className="block px-4 py-2 text-gray-700 hover:bg-gray-200">Cart</span>
                  </Link>
                  <Link href="/returns">
                    <span className="block px-4 py-2 text-gray-700 hover:bg-gray-200">Returns</span>
                  </Link>
                </div>
              )}
            </div>
            <button
              onClick={handleSignOut}
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded ml-2"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login">
            <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;