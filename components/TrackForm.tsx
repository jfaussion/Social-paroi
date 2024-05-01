'use client'
import { ChangeEvent, useState } from "react";
import Image from 'next/image';
import { usePostTracks } from "@/lib/usePostTrack";
import { Track } from "@/domain/Track.schema";
import { DifficultyEnum } from "@/domain/Difficulty.enum";
import { HoldColorEnum } from "@/domain/HoldColor.enum";
import { Button } from "./ui/Button";


type TrackFromProps = {
  userId: string | undefined;
};

const TrackForm: React.FC<TrackFromProps> = ({ userId }) => {

  const [track, setTrack] = useState({
    name: '',
    difficulty: DifficultyEnum.Enum.Unknown,
    holdColor: HoldColorEnum.Enum.Unknown,
    zone: 1,
    points: 0,
    photo: null as File | null,
  });

  const { postTrack, isLoading, error } = usePostTracks();


  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setTrack(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setTrack(prev => ({ ...prev, photo: files[0] }));
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Handle form submission, e.g., via API call
    console.log('handle submit ', track);
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
    console.log('trackToPost:', trackToPost);
    const newTrack = await postTrack(trackToPost, track.photo);
    console.log(newTrack);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 bg-gray-800 text-white">
      <input
        type="text"
        name="name"
        placeholder="Track Name"
        value={track.name}
        onChange={handleInputChange}
        className="p-2 bg-gray-700"
      />
      <select
        name="difficulty"
        value={track.difficulty}
        onChange={handleInputChange}
        className="p-2 bg-gray-700">
        {/* Enum options should be dynamically generated */}
        <option value="">Select Difficulty</option>
        {Object.values(DifficultyEnum.Enum).map((difficulty) => (
          <option key={difficulty} value={difficulty}>{difficulty}</option>
        ))}
      </select>
      <select
        name="holdColor"
        value={track.holdColor}
        onChange={handleInputChange}
        className="p-2 bg-gray-700">
        <option value="">Select Hold Color</option>
        {Object.values(HoldColorEnum.Enum).map((holdColor) => (
          <option key={holdColor} value={holdColor}>{holdColor}</option>
        ))}
      </select>
      <select
        name="zone"
        value={track.zone}
        onChange={handleInputChange}
        className="p-2 bg-gray-700">
        <option value="">Select Zone</option>
        {Array.from({ length: 11 }, (_, i) => i + 1).map((zone) => (
          <option key={zone} value={zone}>Zone {zone}</option>
        ))}
      </select>
      <input
        type="number"
        name="points"
        placeholder="Points"
        value={track.points}
        onChange={handleInputChange}
        className="p-2 bg-gray-700"
      />
      <input
        type="file"
        name="photo"
        onChange={handleFileChange}
        className="p-2 bg-gray-700"
      />
      {track.photo &&
        <div className="relative w-32 h-32">
          <Image src={track.photo ? URL.createObjectURL(track.photo) : ''} alt="Track Preview" fill sizes='(max-width: 40px)' />
        </div>
      }
      <Button type="submit" className="py-2" btnStyle='secondary'>Submit</Button>
    </form>
  );

}

export default TrackForm;
