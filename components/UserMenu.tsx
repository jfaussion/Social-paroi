"use client"

import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/Button";
import Image from 'next/image';
import { useEffect, useRef, useState } from "react";
import DefaultAvatarImage from '@/public/default-avatar.svg';

export default function UserMenu() {
  const { data: session, status } = useSession()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !(dropdownRef.current as HTMLElement).contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); 

  function handleSignOut() {
    signOut()
  }

  return (
    <div ref={dropdownRef} className="relative cursor-pointer">

      {session ? (
        <div className="relative">
          {/* User avatar button */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="block h-10 w-10 rounded-full overflow-hidden border-2 border-gray-600 focus:outline-none focus:border-white"
          >
            <Image src={session.user?.image ?? './default-avatar.svg'}
              alt="Your avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
          </button>

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 py-2 w-max bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-xl max-w-max-content">
              <div className="block px-4 py-2 text-sm">
                {session.user?.name}
                <div className="text-gray-600 dark:text-gray-400">{session.user?.email}</div>
              </div>
              <div className="flex justify-center mt-2 w-full px-4 py-2">
                <Button className="w-full" btnStyle="secondary" onClick={handleSignOut}>Sign Out</Button>
              </div>
            </div>
          )}
        </div>

      ) : (
        <Image src={DefaultAvatarImage}
              alt="Default avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
      )}
    </div>
  );
};
