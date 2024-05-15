"use client";

import { isOpener } from '@/utils/session.utils';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { LuMenu } from 'react-icons/lu';
import Image from 'next/image';
import Logo from '@/public/social-paroi.png';

const Drawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => setIsOpen(!isOpen);

  const router = useRouter();
  const session = useSession();

  const navigate = (path: string) => {
    router.push(path);
    toggleDrawer();
  };


  return (
    <div>
      {/* Toggle button */}
      <button onClick={toggleDrawer} className='mt-2 active:border-0'>
        {isOpen ? <IoClose className="h-6 w-6 hover:bg-gray-300 hover:dark:bg-gray-700 rounded-md" />
          : <LuMenu className="h-6 w-6 hover:bg-gray-300 hover:dark:bg-gray-700 rounded-md" />
        }
      </button>
      {/* Drawer */}
      <div className={`fixed z-30 top-0 left-0 h-full w-full sm:w-[15rem] bg-gray-200 dark:bg-gray-800  border-r border-gray-400 dark:border-gray-600 rounded-md transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className='flex flex-col'>

          {/* Drawer header */}
          <div className='flex justify-between px-5 pt-5'>
            <Image src={Logo} alt="Social Paroi app logo" width={40} height={40} />
            <button onClick={toggleDrawer}>
              {isOpen && <IoClose className="h-6 w-6 hover:bg-gray-300 hover:dark:bg-gray-700 rounded-md" />}
            </button>
          </div>

          {/* Navigation links */}
          <div className="p-5 space-y-3">
            <div className="cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700 p-2 rounded-md" onClick={() => navigate('/dashboard')}>Dashboard</div>
            {isOpener(session.data) && (
              <>
                <hr className="border-t border-gray-400 dark:border-gray-600" />
                <div className="cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700 p-2 rounded-md" onClick={() => navigate('/opener')}>Create new bloc</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
