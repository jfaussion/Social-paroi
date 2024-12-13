"use client";
import { useSession } from "next-auth/react";
import UserCard from "./UserCard";
import { useFetchRanking } from "@/lib/stats/hooks/useFetchRanking";
import { useEffect, useState } from "react";
import { RankingPlaceholder } from "./RankingPlaceholder";


const RankingList: React.FC = () => {
  const session = useSession();
  const { fetchRanking, isLoading, error } = useFetchRanking();
  const [ranking, setRanking] = useState<any[]>([]);

  useEffect(() => {
    const getRanking = async () => {
      const ranking = await fetchRanking();
      setRanking(ranking);
    };
    getRanking();
  }, []);

  return (
    <>
      {error && (
        <div className='w-full border border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900 sm:m-4 sm:mt-0 space-y-2'>
          <div className="flex p-4 sm:p-8">
            An error occurred while fetching the ranking
          </div>
        </div>
      )}
      {isLoading && (
        <div className='h-full w-full sm:m-4 sm:mt-0 space-y-2'>
          <RankingPlaceholder />
        </div>
      )}
      {!isLoading && ranking?.length > 0 && (
        <div className='w-full border border-gray-600 rounded-lg bg-gradient-to-r from-slate-300 to-slate-100 dark:from-gray-700 dark:to-gray-900 sm:m-4 sm:mt-0 space-y-2'>
          <div className="flex flex-col sm:p-4">
            <span className="text-md p-4 w-full font-medium">Based on mounted blocs only</span>
            <div className="flex justify-between mb-3">
              <span className="text-sm font-medium"></span>
              <div className="flex justify-self-end pr-4 space-x-2">
                <span className="text-lg w-[4rem] sm:w-[8rem] text-end font-semibold">Score</span>
              </div>
            </div>
            {ranking.map((user, index) => (
              <UserCard
                key={user.id}
                rank={index + 1}
                profilePicture={user.image}
                name={user.name}
                score={user.score}
                isCurrentUser={user.id === session.data?.user?.id}
                isAddable={false}
                isRemovable={false}
                containerClass={"px-4"}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default RankingList;