'use client'
import { ChangeEvent, useEffect, useId, useRef, useState } from "react";
import Image from 'next/image';
import { usePostTracks } from "@/lib/tracks/hooks/usePostTrack";
import { Track } from "@/domain/Track.schema";
import { DifficultyEnum } from "@/domain/Difficulty.enum";
import { HoldColorEnum } from "@/domain/HoldColor.enum";
import { useFetchDifficultyLevels, DifficultyLevel } from "@/lib/locations/hooks/useFetchDifficultyLevels";
import Select from 'react-select';
import { usePathname, useRouter } from "next/navigation";
import { holdColorCustomSelectClass } from "@/utils/hold.utils";
import { CldImage } from "next-cloudinary";
import { Button } from "../ui/Button";
import customSelectClassName from "../ui/customSelectClassName";
import Loader from "../ui/Loader";
import { Zone } from "../Zone";


type TrackFromProps = {
  initialTrack?: Track;
  zones?: Array<{ id: number; name: string; miniMapUrl?: string | null }>;
  locationId?: number;
};

const TrackForm: React.FC<TrackFromProps> = ({ initialTrack, zones, locationId }) => {
  const isEditMode = Boolean(initialTrack);
  const defaultZone = initialTrack?.zone ?? zones?.[0]?.id ?? 1;
  const [track, setTrack] = useState({
    ...initialTrack,
    name: initialTrack?.name || '',
    difficultyLevelId: initialTrack?.difficultyLevelId || undefined as number | undefined,
    difficulty: initialTrack?.level || '',
    holdColor: initialTrack?.holdColor || '',
    zone: defaultZone,
    points: initialTrack?.points || 0,
    photo: null as File | null,
  });

  const [dynamicDifficultyLevels, setDynamicDifficultyLevels] = useState<DifficultyLevel[]>([]);
  const { fetchDifficultyLevels } = useFetchDifficultyLevels();

  useEffect(() => {
    if (locationId) {
      fetchDifficultyLevels(locationId).then(setDynamicDifficultyLevels);
    }
  }, [locationId, fetchDifficultyLevels]);

  useEffect(() => {
    if (initialTrack) {
      setTrack({
        ...initialTrack,
        difficultyLevelId: initialTrack.difficultyLevelId ?? undefined,
        difficulty: initialTrack.level,
        photo: null
      });
    }
  }, [initialTrack]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const locationSlug = pathname.split('/')[1] ?? '';

  const { postTrack, isLoading, error, loadingMessage } = usePostTracks();
  const [newTrack, setNewTrack] = useState<Track | null>(null);

  const handleInputChange = (name: string, value: any) => {
    setTrack(prev => ({ ...prev, [name]: value }));
  };

  const handleDifficultyChange = (selectedOption: any) => {
    const selectedLevel = dynamicDifficultyLevels.find(l => l.name === selectedOption?.value);
    if (selectedLevel) {
      setTrack(prev => ({
        ...prev,
        difficulty: selectedLevel.name,
        difficultyLevelId: selectedLevel.id,
        points: selectedLevel.points
      }));
    } else {
      setTrack(prev => ({ ...prev, difficulty: selectedOption?.value || '', difficultyLevelId: undefined as number | undefined }));
    }
  }

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
      difficultyLevelId: undefined,
      holdColor: HoldColorEnum.Enum.Unknown as string,
      zone: zones?.[0]?.id ?? 1,
      points: 0,
      photo: null as File | null,
    });
  }

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const trackToPost = {
      name: track.name,
      level: track.difficulty,
      holdColor: track.holdColor,
      zone: track.zone,
      points: track.points,
      removed: false,
      date: new Date(),
      imageUrl: '',
      difficultyLevelId: track.difficultyLevelId,
    } as unknown as Track;

    if (isEditMode && initialTrack) {
      trackToPost.id = initialTrack.id;
      const uploadedTrack = await postTrack(trackToPost, track.photo);
      router.back();
      router.refresh();
    } else {
      setNewTrack(null);
      const uploadedTrack = await postTrack(trackToPost, track.photo);
      setNewTrack(uploadedTrack);
      clearForm();
    }


  };

  // Preparing options for react-select
  const difficultyOptions = dynamicDifficultyLevels.length > 0
    ? dynamicDifficultyLevels.map(level => ({
        value: level.name,
        label: level.name,
        color: level.color
      }))
    : Object.values(DifficultyEnum.Enum).map(difficulty => ({
        value: difficulty,
        label: difficulty,
        color: null
      }));

  const formatDifficultyOptionLabel = (option: any) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      {option.color && (
        <span
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: option.color,
            flexShrink: 0,
          }}
        />
      )}
      <span>{option.label}</span>
    </div>
  );

  const holdColorOptions = Object.values(HoldColorEnum.Enum).map(holdColor => ({
    value: holdColor,
    label: holdColor
  }));

  const zoneOptions = zones
    ? zones.map(z => ({ value: z.id, label: z.name }))
    : Array.from({ length: 10 }, (_, i) => i + 1).map(zone => ({ value: zone, label: `Zone ${zone}` }));

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 bg-gray-100 dark:bg-gray-800 text-white flex flex-col w-full rounded">
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
        isSearchable={false}
        value={difficultyOptions.find(option => option.value === track.difficulty)}
        onChange={option => handleDifficultyChange(option)}
        options={difficultyOptions}
        classNames={customSelectClassName}
        unstyled={true}
        placeholder="Select a difficulty"
        formatOptionLabel={formatDifficultyOptionLabel}
        required
      />
      <Select
        instanceId={useId()}
        name="holdColor"
        isSearchable={false}
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
        isSearchable={false}
        value={zoneOptions.find(option => option.value === track.zone)}
        onChange={option => handleInputChange('zone', option?.value)}
        options={zoneOptions}
        classNames={customSelectClassName}
        unstyled={true}
        placeholder="Select a zone"
        required
      />
      {!!track.zone && (
        <div className="flex justify-center sm:justify-start items-center p-2 mb-3">
          <Zone
            miniMapUrl={
              zones
                ? zones.find(z => z.id === track.zone)?.miniMapUrl
                : initialTrack?.zoneRef?.miniMapUrl
            }
            zoneName={zones ? zones.find(z => z.id === track.zone)?.name : initialTrack?.zoneRef?.name}
            width={200}
            height={100}
          />
        </div>
      )}

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
      />
      {track.photo &&
        <div className="relative w-32 h-32">
          <Image src={track.photo ? URL.createObjectURL(track.photo) : ''} alt="Track Preview" fill sizes='(max-width: 40px)' />
        </div>
      }

      {track?.imageUrl && !track.photo && (
        track.imageUrl.split(' ').map((url, index) => (
          <div key={index} className="snap-center w-full shrink-0">
            <CldImage
              width={800}
              height={800}
              crop="fill"
              gravity="center"
              improve="indoor"
              src={url}
              alt="Climbing Track"
              className="mx-auto sm:rounded" />
          </div>
        ))
      )}

      <Loader isLoading={isLoading} text={loadingMessage} />
      {error && <p className="text-red-500">Error: {error}</p>}

      <Button type="submit" className="py-2" btnType='secondary' disabled={isLoading}>Submit</Button>

      {!isLoading && newTrack && (
        <Button className="py-2" btnType='primary'
          onClick={() => router.push(`/${locationSlug}/tracks/track/${newTrack.id}`)}>View new block
        </Button>
      )}

    </form>
  );

}

export default TrackForm;
