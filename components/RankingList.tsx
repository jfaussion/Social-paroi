"use client";
import { useSession } from "next-auth/react";
import UserRanking from "./UserRanking";
import { useFetchRanking } from "@/lib/useFetchRanking";
import { useEffect, useState } from "react";


const RankingList: React.FC<any> = ({ initialTrack }) => {
  const session = useSession();
  const {fetchRanking, isLoading, error} = useFetchRanking();
  const [ranking, setRanking] = useState<any[]>([]);

  useEffect(() => {
    const getRanking = async () => {
      const ranking = await fetchRanking();
      setRanking(ranking);
    };
    getRanking();
  }, []);


  return (
    <div className='w-full border border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900 sm:m-4 sm:mt-0 space-y-2'>
      <div className="flex flex-col sm:p-4">
        <span className="text-md p-4 w-full font-medium">Based on mounted blocs only</span>
        <div className="flex justify-between mb-3">
          <span className="text-sm font-medium"></span>
          <div className="flex justify-self-end space-x-2">
            <span className="text-sm w-[4rem] sm:w-[8rem] text-center font-semibold">Score</span>
          </div>
        </div>
        {ranking.map((user, index) => (
          <UserRanking
            key={user.id}
            rank={index + 1}
            profilePicture={user.image}
            name={user.name}
            score={user.score}
            isCurrentUser={user.id === session.data?.user?.id}
          />
        ))}
      </div>
    </div>
  );
}

export default RankingList;