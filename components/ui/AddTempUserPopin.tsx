import React, { useId, useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import Popin from '../ui/Popin';
import Select from 'react-select';
import { GenderType, GenderEnum } from '@/domain/ContestUser.schema';
import customSelectClassName from './customSelectClassName';

interface AddTempUserPopinProps {
  isOpen: boolean;
  name?: string;
  gender?: GenderType;
  onClose: () => void;
  addTempUser: (name: string, gender: GenderType) => void;
}

const AddTempUserPopin: React.FC<AddTempUserPopinProps> = ({ isOpen, name, gender, onClose, addTempUser }) => {
  const [tempName, setTempName] = useState<string>(name || '');
  const [tempGender, setTempGender] = useState<GenderType>(gender || GenderEnum.Enum.Man);

  // Create gender options from the GenderEnum
  const genderOptions = Object.values(GenderEnum.Enum).map(gender => ({
    value: gender,
    label: gender,
  }));

  useEffect(() => {
    setTempName(name || '');
    setTempGender(gender || GenderEnum.Enum.Man);
  }, [name, gender]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTempUser(tempName, tempGender);
    onClose();
  };

  return (
    <Popin isOpen={isOpen} onClose={onClose} title="Add Temporary User">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            name="name"
            placeholder="Participant's name..."
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            maxLength={100}
            required
            className="p-2 text-black dark:text-white bg-gray-200 dark:bg-gray-800 rounded-md border border-gray-800 dark:border-gray-600 w-full"
          />
          <Select
            name="gender"
            instanceId={useId()}
            options={genderOptions}
            value={genderOptions.find(option => option.value === tempGender) ?? genderOptions[0]}
            onChange={(selectedOption) => setTempGender(selectedOption?.value as GenderType)}
            placeholder="Select a gender"
            isClearable={false}
            isSearchable={false}
            required
            classNames={customSelectClassName}
            unstyled={true}
            className="w-full"
          />
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button type="submit" btnStyle="primary">Add Temp User</Button>
        </div>
      </form>
    </Popin>
  );
};

export default AddTempUserPopin; 