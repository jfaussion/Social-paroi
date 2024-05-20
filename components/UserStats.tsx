"use client";
import { useFetchUserStats } from "@/lib/useFetchUserStats";
import DonutChart from "./ui/DonutChart";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { DifficultyType } from "@/domain/Difficulty.enum";
import { getBgColorForDifficulty } from "@/utils/difficulty.utils";
import { TrackStats } from "@/domain/TrackStats.schema";

const UserStats = () => {
  const { fetchStats, isLoading, error } = useFetchUserStats();
  const session = useSession();
  const [userStats, setUserStats] = useState<TrackStats[]>([]);


  if (!session.data?.user?.id) return null;
  const userId = session.data.user.id;


  useEffect(() => {
    const getStats = async () => {
      const stats = await fetchStats(userId);
      setUserStats(stats);
      console.log(stats);
    };
    getStats();
  }, [userId]);

  return (
    <>
      <div className='p-4 w-full border border-gray-600 rounded-lg dark:bg-gray-900 sm:m-4 sm:mt-0 space-y-2'>
        <div className="flex flex-col p-2 sm:p-4 space-y-2">
          <span className="text-xl w-full pt-0">By difficulty</span>
          <div className="flex justify-between mb-3">
            <span className="text-sm font-medium"></span>
            <div className="flex justify-self-end space-x-2">
              <span className="text-sm w-[4rem] sm:w-[8rem] text-center font-semibold">Current</span>
              <span className="text-sm w-[4rem] sm:w-[8rem] text-end font-semibold">All time</span>
            </div>
          </div>
          { isLoading && <span>Loading...</span>}
           {!isLoading && userStats.map(({ level, mountedDone, totalDone, totalMounted }: TrackStats) => (
            <div key={level}>
              <div  className="flex justify-between mb-3" >
                <div className="flex items-center mb-10 space-x-2">
                  <span className={`h-3 w-3 rounded-full ${getBgColorForDifficulty(level as DifficultyType)}`}></span>
                  <span className="text-sm font-medium">{level}</span>
                </div>
                <div className="flex justify-self-end space-x-2">
                  <div className="flex flex-col justify-items-center text-sm w-[4rem] sm:w-[8rem] text-center">
                    <div className="mx-auto">
                      <DonutChart percentage={totalMounted ? 100 * mountedDone / totalMounted : 0} bgColorClass="bg-gray-50 dark:bg-gray-900" />
                    </div>
                    <span className="text-sm ">
                      {totalMounted ? (100 * mountedDone / totalMounted).toFixed(0) : '0'}%
                    </span>
                    <span className="text-sm">{mountedDone}/{totalMounted}</span>
                  </div>
                  <div className="flex justify-end text-sm w-[4rem] sm:w-[8rem] space-x-2 text-end items-center mb-10">
                    <span className="text-sm">{totalDone}</span>
                  </div>
                </div>
              </div>
            </div>
          ))} 
        </div>
      </div >

      <div className='p-4 w-full border border-gray-600 rounded-lg dark:bg-gray-900 sm:m-4 sm:mt-0 space-y-2 mt-4'>
        <div className="flex flex-col p-2 sm:p-4 space-y-2">
          <span className="text-xl w-full pt-0">This month</span>
          <div className="flex justify-between mb-3">
            <span className="text-sm font-medium"></span>
            <div className="flex justify-self-end space-x-2">
              <span className="text-sm w-[4rem] sm:w-[8rem] text-end font-semibold">Current</span>
              <span className="text-sm w-[4rem] sm:w-[8rem] text-end font-semibold">Best</span>
            </div>
          </div>
          { /* Stats blue */}
          <div className="flex justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className={`h-3 w-3 rounded-full bg-blue-500`}></span>
              <span className="text-sm font-medium">Intermediate</span>
            </div>
            <div className="flex justify-self-end space-x-2">
              <div className="flex-wrap text-sm w-[4rem] sm:w-[8rem] space-x-2 text-end">
                <span className="text-sm ">10</span>
              </div>
              <div className="flex-wrap text-sm w-[4rem] sm:w-[8rem] space-x-2 text-end">
                <span className="text-sm ">25</span>
              </div>
            </div>
          </div>
          { /* Stats red */}
          <div className="flex justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className={`h-3 w-3 rounded-full bg-red-500`}></span>
              <span className="text-sm font-medium">Difficult</span>
            </div>
            <div className="flex justify-self-end space-x-2">
              <div className="flex-wrap text-sm w-[4rem] sm:w-[8rem] space-x-2 text-end">
                <span className="text-sm ">5</span>
              </div>
              <div className="flex-wrap text-sm w-[4rem] sm:w-[8rem] space-x-2 text-end">
                <span className="text-sm ">10</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

}

export default UserStats;