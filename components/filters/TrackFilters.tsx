import ZoneFilter from "./ZoneFilter";
import DifficultyFilter from "./DifficultyFilter";
import ShowRemovedFilter from "./ShowRemovedFilter";
import { useEffect, useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import HoldColorFilter from "./HoldColorFilter";

type TrackFiltersProps = {
  zones: Array<{ id: number; name: string }>;
  selectedZones: number[];
  selectedDifficulties: number[];
  selectedShowRemoved: string | undefined;
  selectedHoldColor: string | undefined;
  locationId: number;
  onZoneChange: (selectedOptions: { value: any }[]) => void;
  onDifficultyChange: (selectedOptions: { value: any }[]) => void;
  onShowRemovedChange: (selectedOptions: any) => void;
  onHoldColorChange: (selectedOption: { value: any }) => void;
};

const TrackFilters: React.FC<TrackFiltersProps> = ({
  zones,
  selectedZones,
  selectedDifficulties,
  selectedShowRemoved,
  selectedHoldColor,
  locationId,
  onZoneChange,
  onDifficultyChange,
  onShowRemovedChange,
  onHoldColorChange
}) => {

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    if (selectedShowRemoved !== undefined || selectedHoldColor !== undefined) {
      setShowAdvancedFilters(true);
    } else {
      setShowAdvancedFilters(false);
    }
  }, [selectedShowRemoved, selectedHoldColor]);

  const toggleFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
        <ZoneFilter zones={zones} selectedFilters={selectedZones} onChange={onZoneChange} />
        <div className="flex inline sm:w-100 sm:space-x-2">
          <div className="grow">
            <DifficultyFilter selectedFilters={selectedDifficulties} onChange={onDifficultyChange} locationId={locationId} />
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
          <HoldColorFilter selectedFilter={selectedHoldColor} onChange={onHoldColorChange} />
        </div>
      )}

    </div>
  );
};

export default TrackFilters;
