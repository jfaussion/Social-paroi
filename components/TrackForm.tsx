'use client'
import { useState } from "react";
import Image from 'next/image';


type TrackFromProps = {
  userId: string | undefined;
};

const TrackForm: React.FC<TrackFromProps> = ({ userId }) => {

  const [track, setTrack] = useState({
    name: '',
    difficulty: '',
    holdColor: '',
    zone: '',
    points: '',
    photo: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTrack(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setTrack(prev => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g., via API call
    console.log(track);
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
        <option value="EASY">Easy</option>
        <option value="MEDIUM">Medium</option>
        <option value="HARD">Hard</option>
      </select>
      <select
        name="holdColor"
        value={track.holdColor}
        onChange={handleInputChange}
        className="p-2 bg-gray-700">
        <option value="">Select Hold Color</option>
        <option value="red">Red</option>
        <option value="blue">Blue</option>
        <option value="green">Green</option>
      </select>
      <select
        name="zone"
        value={track.zone}
        onChange={handleInputChange}
        className="p-2 bg-gray-700">
        <option value="">Select Zone</option>
        <option value="north">North</option>
        <option value="south">South</option>
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
      <button type="submit" className="px-4 py-2 bg-blue-500 hover:bg-blue-700">Submit</button>
    </form>
  );

}

export default TrackForm;
