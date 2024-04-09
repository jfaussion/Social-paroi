import ZoneFilter from "./ZoneFilter";
import DifficultyFilter from "./DifficultyFilter";
import ShowRemovedFilter from "./ShowRemovedFilter";

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
  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
      <ZoneFilter selectedFilters={selectedZones} onChange={onZoneChange} />
      <DifficultyFilter selectedFilters={selectedDifficulties} onChange={onDifficultyChange} />
      <ShowRemovedFilter selectedFilters={selectedShowRemoved} onChange={onShowRemovedChange} />
    </div>
  );
};

export default TrackFilters;
