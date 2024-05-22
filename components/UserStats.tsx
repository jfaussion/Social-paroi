"use client";
import { useFetchUserStats } from "@/lib/useFetchUserStats";
import DonutChart from "./ui/DonutChart";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { DifficultyType } from "@/domain/Difficulty.enum";
import { getBgColorForDifficulty } from "@/utils/difficulty.utils";
import { TrackStats } from "@/domain/TrackStats.schema";
import { StatsPlaceHolder } from "./ui/StatsPlaceholder";

const UserStats = () => {
  const { fetchStats, isLoading, error } = useFetchUserStats();
  const session = useSession();
  const [userStats, setUserStats] = useState<TrackStats[]>([]);


  useEffect(() => {
    let isMounted = true;

    const getStats = async () => {
      if (session.data?.user?.id) {
        const stats = await fetchStats(session.data.user.id);
        if (isMounted) {
          setUserStats(stats);
        }
      }
    };

    getStats();

    return () => {
      isMounted = false;
    };
  }, [session.data?.user?.id]);

  if (!session.data?.user?.id) return null;

  return (
    <>
      {isLoading && (
        <div className='h-full w-full sm:m-4 sm:mt-0 space-y-2'>
          <StatsPlaceHolder />
        </div>
      )}
      {!isLoading && userStats?.length > 0 && (
        <>
          <div className='p-4 w-full border border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900 sm:m-4 sm:mt-0 space-y-2'>
            <div className="flex flex-col p-2 sm:p-4 space-y-2">
              <span className="text-xl w-full pt-0 font-medium">By difficulty</span>
              <div className="flex justify-between mb-3">
                <span className="text-sm font-medium"></span>
                <div className="flex justify-self-end space-x-2">
                  <span className="text-sm w-[4rem] sm:w-[8rem] text-center font-semibold">Current</span>
                  <span className="text-sm w-[4rem] sm:w-[8rem] text-end font-semibold">All time</span>
                </div>
              </div>
              {userStats.map(({ level, mountedDone, totalDone, totalMounted }: TrackStats) => (
                <div key={level}>
                  <div className="flex justify-between mb-3" >
                    <div className="flex items-center mb-10 space-x-2">
                      <span className={`h-3 w-3 rounded-full ${getBgColorForDifficulty(level as DifficultyType)}`}></span>
                      <span className="text-sm font-medium">{level}</span>
                    </div>
                    <div className="flex justify-self-end space-x-2">
                      <div className="flex flex-col justify-items-center text-sm w-[4rem] sm:w-[8rem] text-center">
                        <div className="mx-auto">
                          <DonutChart percentage={totalMounted ? 100 * mountedDone / totalMounted : 0} bgColorClass="bg-gray-100 dark:bg-gray-900" />
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
          </div>
        </>
      )}

    </>
  );

}

export default UserStats;