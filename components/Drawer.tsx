"use client";

import { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { LuMenu } from 'react-icons/lu';
import Image from 'next/image';
import Logo from '@/public/social-paroi.png';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa6';
import { useSession } from 'next-auth/react';
import { UserRoleEnum } from '@/domain/UserRole.enum';
import { AdapterUserCustom } from '@/lib/users/AdapterUserCustom';

const Drawer = ({ isLocationAdmin = false }: { isLocationAdmin?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const isSuperAdmin = (session?.user as AdapterUserCustom)?.role === UserRoleEnum.Enum.super_admin;
  const toggleDrawer = () => setIsOpen(!isOpen);
  const pathname = usePathname()
  const router = useRouter();

  const goBackOrToList = () => {
    const lastTrackListUrl = localStorage.getItem("lastTrackListUrl");
    if (lastTrackListUrl) {
      // Go back to the list page
      router.push(lastTrackListUrl); 
      localStorage.removeItem("lastTrackListUrl");
    } else {
      // Default go back
      router.back(); 
    }
  };

  const locationSlug = pathname.split('/')[1] ?? '';

  useEffect(() => {
    if (locationSlug) {
      document.cookie = `last-location=${locationSlug}; path=/; max-age=2592000; SameSite=Lax`;
    }
  }, [locationSlug]);

  const showBackButtonInsteadOfMenu = () =>
    pathname.includes('/tracks/track/') || pathname.includes('/opener/create');

  return (
    <div>
      {showBackButtonInsteadOfMenu() ?
        <>
          { /* Back button */}
          <FaArrowLeft className="h-6 w-6 hover:bg-gray-300 hover:dark:bg-gray-700 rounded-md" onClick={goBackOrToList} />
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
              <Link className="block cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700 p-2 rounded-md" href={`/${locationSlug}/tracks`} onClick={() => setIsOpen(false)}>Tracks</Link>
            </li>
            <li>
              <Link className="block cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700 p-2 rounded-md" href={`/${locationSlug}/news`} onClick={() => setIsOpen(false)}>News</Link>
            </li>
            <li>
              <Link className="block cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700 p-2 rounded-md" href={`/${locationSlug}/stats`} onClick={() => setIsOpen(false)}>My stats</Link>
            </li>
            <li>
              <Link className="block cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700 p-2 rounded-md" href={`/${locationSlug}/ranking`} onClick={() => setIsOpen(false)}>Ranking</Link>
            </li>
            <li>
              <Link className="block cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700 p-2 rounded-md" href={`/${locationSlug}/contests`} onClick={() => setIsOpen(false)}>Contests</Link>
            </li>
            <li className="pt-3 mt-3 border-t border-gray-400 dark:border-gray-600">
              <Link className="block cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700 p-2 rounded-md text-blue-500" href="/locations" onClick={() => setIsOpen(false)}>Change location</Link>
            </li>
            {isLocationAdmin && (
              <li className="pt-3 mt-3 border-t border-gray-400 dark:border-gray-600">
                <Link className="block cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700 p-2 rounded-md" href={`/${locationSlug}/admin`} onClick={() => setIsOpen(false)}>Admin</Link>
              </li>
            )}
            {isSuperAdmin && (
              <li>
                <Link className="block cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700 p-2 rounded-md text-violet-500" href="/admin" onClick={() => setIsOpen(false)}>Super Admin</Link>
              </li>
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
