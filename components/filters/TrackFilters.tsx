import ZoneFilter from "./ZoneFilter";
import DifficultyFilter from "./DifficultyFilter";
import ShowRemovedFilter from "./ShowRemovedFilter";
import { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

type TrackFiltersProps = {
  selectedZones: number[];
  selectedDifficulties: string[];
  selectedShowRemoved: string | undefined;
  onZoneChange: (selectedOptions: { value: any }[]) => void;
  onDifficultyChange: (selectedOptions: { value: any }[]) => void;
  onShowRemovedChange: (selectedOptions: any) => void;
};

const TrackFilters: React.FC<TrackFiltersProps> = ({
  selectedZones,
  selectedDifficulties,
  selectedShowRemoved,
  onZoneChange,
  onDifficultyChange,
  onShowRemovedChange,
}) => {

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const toggleFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
        <ZoneFilter selectedFilters={selectedZones} onChange={onZoneChange} />
        <div className="flex inline sm:w-100 sm:space-x-2">
          <div className="grow">
            <DifficultyFilter selectedFilters={selectedDifficulties} onChange={onDifficultyChange} />
          </div>
          <button
            className="p-2 flex-end rounded hover:bg-gray-300 hover:dark:bg-gray-700 transition duration-300"
            onClick={toggleFilters}
            aria-label="Toggle advanced filters"
          >
            {showAdvancedFilters ?
              (<IoIosArrowUp size={24} />)
              : (<IoIosArrowDown size={24} />)
            }
          </button>
        </div>
      </div>
      {showAdvancedFilters && (
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
          <ShowRemovedFilter selectedFilters={selectedShowRemoved} onChange={onShowRemovedChange} />
        </div>
      )}

    </div>
  );
};

export default TrackFilters;
