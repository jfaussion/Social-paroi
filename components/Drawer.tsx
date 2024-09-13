"use client";

import { isOpener } from '@/utils/session.utils';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { LuMenu } from 'react-icons/lu';
import Image from 'next/image';
import Logo from '@/public/social-paroi.png';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa6';

const Drawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => setIsOpen(!isOpen);
  const pathname = usePathname()
  const session = useSession();
  const router = useRouter();

  const showBackButtonInsteadOfMenu = () => pathname.startsWith('/dashboard/track/');

  return (
    <div>
      {showBackButtonInsteadOfMenu() ?
        <>
          { /* Back button */}
          <FaArrowLeft className="h-6 w-6 hover:bg-gray-300 hover:dark:bg-gray-700 rounded-md" onClick={router.back} />
        </>
        :
        <>
          {/* Toggle button */}
          <button onClick={toggleDrawer} className='mt-2 active:border-0'>
            {isOpen ? <IoClose className="h-6 w-6 hover:bg-gray-300 hover:dark:bg-gray-700 rounded-md" />
              : <LuMenu className="h-6 w-6 hover:bg-gray-300 hover:dark:bg-gray-700 rounded-md" />
            }
          </button>
        </>
      }

      {/* Drawer */}
      <div className={`fixed z-30 top-0 left-0 h-full w-full sm:w-[15rem] bg-gray-200 dark:bg-gray-800  border-r border-gray-400 dark:border-gray-600 rounded-md transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className='flex flex-col h-full'>

          {/* Drawer header */}
          <div className='flex justify-between px-5 pt-5'>
            <Image src={Logo} alt="Social Paroi app logo" width={40} height={40} />
            <button onClick={toggleDrawer} className="mb-5">
              {isOpen && <IoClose className="h-6 w-6 hover:bg-gray-300 hover:dark:bg-gray-700 rounded-md" />}
            </button>
          </div>

          {/* Navigation links */}
          <ul className="p-5 space-y-3 flex-grow">
            <li>
              <Link className="block cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700 p-2 rounded-md" href="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link className="block cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700 p-2 rounded-md" href="/news">News</Link>
            </li>
            <li>
              <Link className="block cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700 p-2 rounded-md" href="/stats">My stats</Link>
            </li>
            <li>
              <Link className="block cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700 p-2 rounded-md" href="/ranking">Ranking</Link>
            </li>
            {isOpener(session.data) && (
              <>
                <hr className="border-t border-gray-400 dark:border-gray-600" />
                <li>
                  <Link className="block cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700 p-2 rounded-md" href="/opener/create">Create new block</Link>
                </li>
              </>
            )}
          </ul>

          {/* Footer links */}
          <div className="mt-auto p-5 flex flex-wrap justify-start text-xs text-blue-500 font-mono space-x-1">
            <Link className="hover:underline" href="/privacy">Privacy policy</Link><span>|</span>
            <Link className="hover:underline" href={`${process.env.NEXT_PUBLIC_FEEDBACK_FORM}`}>Feedback</Link><span>|</span>
            <Link className="hover:underline" href="https://www.picetparoi.fr/">Pic & Paroi</Link><span>|</span>
            <Link className="hover:underline" href={`mailto:${process.env.NEXT_PUBLIC_CONTACT}`}>Contact</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
