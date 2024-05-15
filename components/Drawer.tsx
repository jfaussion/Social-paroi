"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { LuMenu } from 'react-icons/lu';

const Drawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => setIsOpen(!isOpen);

  const router = useRouter();

  const navigate = (path: string) => {
    router.push(path);
    toggleDrawer();
  };


  return (
    <div>
      {/* Toggle button */}
      <div>
        <button onClick={toggleDrawer} className='mt-2 active:border-0'>
          {isOpen ? <IoClose className="h-6 w-6 hover:bg-gray-300 hover:dark:bg-gray-700 rounded-md" /> 
                  : <LuMenu className="h-6 w-6 hover:bg-gray-300 hover:dark:bg-gray-700 rounded-md" />
          }
        </button>
      </div>
      {/* Drawer */}
      <div className={`fixed z-30 top-0 left-0 h-full w-full sm:w-[15rem] bg-gray-200 dark:bg-gray-800 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className='flex flex-col'>
          <div className='flex justify-end pr-5 pt-5'>
            <button onClick={toggleDrawer}>
              {isOpen && <IoClose className="h-6 w-6 hover:bg-gray-300 hover:dark:bg-gray-700 rounded-md" />}
            </button>
          </div>
          <div className="p-5 space-y-4">
            <div className="cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700 p-2 rounded-md" onClick={() => navigate('/dashboard')}>Dashboard</div>
            <div className="cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700 p-2 rounded-md" onClick={() => navigate('/stats')}>My stats</div>
            <div className="cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700 p-2 rounded-md" onClick={() => navigate('/ranking')}>Ranking</div>
            <div className="cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700 p-2 rounded-md" onClick={() => navigate('/opener')}>Opener</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
