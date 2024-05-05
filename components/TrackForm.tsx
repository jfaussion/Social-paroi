'use client'
import { ChangeEvent, useId, useRef, useState } from "react";
import Image from 'next/image';
import { usePostTracks } from "@/lib/usePostTrack";
import { Track } from "@/domain/Track.schema";
import { DifficultyEnum } from "@/domain/Difficulty.enum";
import { HoldColorEnum } from "@/domain/HoldColor.enum";
import { difficultyCustomSelectClass } from "@/utils/difficulty.utils";
import Select from 'react-select';
import customSelectClassName from "./ui/customSelectClassName";
import { Button } from "./ui/Button";
import Loader from "./ui/Loader";
import { useRouter } from "next/navigation";
import { holdColorCustomSelectClass } from "@/utils/hold.utils";


type TrackFromProps = {
  userId: string | undefined;
};

const TrackForm: React.FC<TrackFromProps> = ({ userId }) => {

  const [track, setTrack] = useState({
    name: '',
    difficulty: '',
    holdColor: '',
    zone: 1,
    points: 0,
    photo: null as File | null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { postTrack, isLoading, error } = usePostTracks();
  const [newTrack, setNewTrack] = useState<Track | null>(null);

  const handleInputChange = (name: string, value: any) => {
    setTrack(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setTrack(prev => ({ ...prev, photo: files[0] }));
    }
  };

  const clearFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      setTrack({ ...track, photo: null });
    }
  };

  const clearForm = () => {
    clearFileInput();
    setTrack({
      name: '',
      difficulty: DifficultyEnum.Enum.Unknown as string,
      holdColor: HoldColorEnum.Enum.Unknown as string,
      zone: 1,
      points: 0,
      photo: null as File | null,
    });
  }

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setNewTrack(null);
    const trackToPost = {
      name: track.name,
      level: track.difficulty,
      holdColor: track.holdColor,
      zone: track.zone,
      points: track.points,
      removed: false,
      date: new Date(),
      imageUrl: '',
    } as unknown as Track;
    const uploadedTrack = await postTrack(trackToPost, track.photo);
    setNewTrack(uploadedTrack);
    clearForm();
  };

  // Preparing options for react-select
  const difficultyOptions = Object.values(DifficultyEnum.Enum).map(difficulty => ({
    value: difficulty,
    label: difficulty
  }));

  const holdColorOptions = Object.values(HoldColorEnum.Enum).map(holdColor => ({
    value: holdColor,
    label: holdColor
  }));

  const zoneOptions = Array.from({ length: 11 }, (_, i) => i + 1).map(zone => ({
    value: zone,
    label: `Zone ${zone}`
  }));

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 bg-slate-300 dark:bg-gray-800 text-white flex flex-col w-full rounded">
      <input
        type="text"
        name="name"
        placeholder="Block's name..."
        value={track.name}
        onChange={e => handleInputChange('name', e.target.value)}
        maxLength={100}
        required
        className="p-2 text-black dark:text-white bg-gray-200 dark:bg-gray-800 rounded-md border border-gray-800 dark:border-gray-600"
      />
      <Select
        instanceId={useId()}
        name="difficulty"
        value={difficultyOptions.find(option => option.value === track.difficulty)}
        onChange={option => handleInputChange('difficulty', option?.value)}
        options={difficultyOptions}
        classNames={difficultyCustomSelectClass}
        unstyled={true}
        placeholder="Select a difficulty"
        required
      />
      <Select
        instanceId={useId()}
        name="holdColor"
        value={holdColorOptions.find(option => option.value === track.holdColor)}
        onChange={option => handleInputChange('holdColor', option?.value)}
        options={holdColorOptions}
        classNames={holdColorCustomSelectClass}
        unstyled={true}
        placeholder="Select a hold color"
        required
      />
      <Select
        instanceId={useId()}
        name="zone"
        value={zoneOptions.find(option => option.value === track.zone)}
        onChange={option => handleInputChange('zone', option?.value)}
        options={zoneOptions}
        classNames={customSelectClassName}
        unstyled={true}
        placeholder="Select a zone"
        required
      />
      <input
        type="number"
        name="points"
        placeholder="Points"
        value={track.points}
        onChange={e => handleInputChange('points', e.target.value)}
        className="p-2 text-black dark:text-white bg-gray-200 dark:bg-gray-800 rounded-md border border-gray-800 dark:border-gray-600"
        required
      />
      <input
        ref={fileInputRef}
        type="file"
        name="photo"
        onChange={handleFileChange}
        className="p-2 text-black dark:text-white bg-transparent
        file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100
        dark:file:bg-slate-900 dark:file:text-violet-300 dark:hover:file:bg-slate-950"
        required
      />
      {track.photo &&
        <div className="relative w-32 h-32">
          <Image src={track.photo ? URL.createObjectURL(track.photo) : ''} alt="Track Preview" fill sizes='(max-width: 40px)' />
        </div>
      }

      <Button type="submit" className="py-2" btnStyle='secondary' disabled={isLoading}>Submit</Button>

      {!isLoading && newTrack && (
        <Button className="py-2" btnStyle='primary'
          onClick={() => router.push(`dashboard/track/${newTrack.id}`)}>View new block
        </Button>
      )}

      <Loader isLoading={isLoading} text="Posting new block..." />

      {error && <p className="text-red-500">Error: {error}</p>}

    </form>
  );

}

export default TrackForm;
