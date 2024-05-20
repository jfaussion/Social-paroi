import DonutChart from "./ui/DonutChart";

const UserStats = () => {

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
          { /* Stats blue */}
          <div className="flex justify-between mb-3">
            <div className="flex items-center mb-10 space-x-2">
              <span className={`h-3 w-3 rounded-full bg-blue-500`}></span>
              <span className="text-sm font-medium">Intermediate</span>
            </div>
            <div className="flex justify-self-end space-x-2">
              <div className="flex flex-col justify-items-center text-sm w-[4rem] sm:w-[8rem] text-center">
                <div className="mx-auto">
                  <DonutChart percentage={75} bgColorClass="bg-gray-50 dark:bg-gray-900" />
                </div>
                <span className="text-sm ">75%</span>
                <span className="text-sm">10/20</span>
              </div>
              <div className="flex justify-end text-sm w-[4rem] sm:w-[8rem] space-x-2 text-end items-center mb-10">
                <span className="text-sm">35</span>
              </div>
            </div>
          </div>
          { /* Stats red */}
          <div className="flex justify-between mb-3">
            <div className="flex items-center mb-10 space-x-2">
              <span className={`h-3 w-3 rounded-full bg-red-500`}></span>
              <span className="text-sm font-medium">Difficult</span>
            </div>
            <div className="flex justify-self-end space-x-2">
              <div className="flex flex-col justify-items-center text-sm w-[4rem] sm:w-[8rem] text-center">
                <div className="mx-auto">
                  <DonutChart percentage={25} bgColorClass="bg-gray-50 dark:bg-gray-900" />
                </div>
                <span className="text-sm ">50%</span>
                <span className="text-sm">10/20</span>
              </div>
              <div className="flex justify-end text-sm w-[4rem] sm:w-[8rem] space-x-2 text-end items-center mb-10">
                <span className="text-sm">35</span>
              </div>
            </div>
          </div>
        </div>
      </div>

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