'use client'
import { ChangeEvent, useEffect, useId, useRef, useState } from "react";
import Image from 'next/image';
import { usePostTracks } from "@/lib/tracks/hooks/usePostTrack";
import { Track } from "@/domain/Track.schema";
import Select from 'react-select';
import { usePathname, useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { Button } from "../ui/Button";
import customSelectClassName from "../ui/customSelectClassName";
import Loader from "../ui/Loader";
import { Zone } from "../Zone";
import { toast } from "sonner";

export type HoldColorOption = {
  id: number;
  name: string;
  color: string;
};

export type DifficultyLevel = {
  id: number;
  name: string;
  color: string | null;
  points: number;
  order: number;
};

type TrackFromProps = {
  initialTrack?: Track;
  zones?: Array<{ id: number; name: string; miniMapUrl?: string | null }>;
  locationId?: number;
  holdColors?: HoldColorOption[];
  difficultyLevels?: DifficultyLevel[];
};

const TrackForm: React.FC<TrackFromProps> = ({ initialTrack, zones, locationId, holdColors = [], difficultyLevels = [] }) => {
  const isEditMode = Boolean(initialTrack);
  const defaultZoneId = initialTrack?.zoneId ?? zones?.[0]?.id ?? 1;
  const [track, setTrack] = useState({
    ...initialTrack,
    name: initialTrack?.name || '',
    difficultyLevelId: initialTrack?.difficultyLevelId || undefined as number | undefined,
    difficulty: initialTrack?.difficultyLevelId?.toString() || '',
    holdColorId: initialTrack?.holdColorId || null as number | null,
    zoneId: defaultZoneId,
    points: initialTrack?.points || 0,
    photo: null as File | null,
  });

  useEffect(() => {
    if (initialTrack) {
      setTrack(prev => ({
        ...prev,
        difficultyLevelId: initialTrack.difficultyLevelId ?? undefined,
        difficulty: initialTrack.difficultyLevelId?.toString() ?? '',
        holdColorId: initialTrack.holdColorId ?? null,
        zoneId: initialTrack.zoneId ?? defaultZoneId,
        photo: null
      }));
    }
  }, [initialTrack]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const locationSlug = pathname.split('/')[1] ?? '';

  const difficultySelectId = useId();
  const holdColorSelectId = useId();
  const zoneSelectId = useId();

  const { postTrack, isLoading, error, loadingMessage } = usePostTracks(locationId ?? 1);
  const [newTrack, setNewTrack] = useState<Track | null>(null);

  const handleInputChange = (name: string, value: any) => {
    setTrack(prev => ({ ...prev, [name]: value }));
  };

  const handleDifficultyChange = (selectedOption: any) => {
    const selectedLevel = difficultyLevels.find(l => l.id === selectedOption?.value);
    if (selectedLevel) {
      setTrack(prev => ({
        ...prev,
        difficulty: selectedLevel.name,
        difficultyLevelId: selectedLevel.id,
        points: selectedLevel.points
      }));
    } else {
      setTrack(prev => ({ ...prev, difficulty: '', difficultyLevelId: undefined as number | undefined }));
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

  const isFormValid = () => track.name && track.difficulty && track.zoneId && track.holdColorId !== null;

  const clearForm = () => {
    clearFileInput();
    setTrack({
      name: '',
      difficulty: '',
      difficultyLevelId: undefined,
      holdColorId: null,
      zoneId: zones?.[0]?.id ?? 1,
      points: 0,
      photo: null as File | null,
    });
  }

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const trackToPost = {
      name: track.name,
      holdColorId: track.holdColorId,
      zoneId: track.zoneId,
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
      toast.success('Track created successfully');
    }


  };

  // Preparing options for react-select
  const difficultyOptions = difficultyLevels.map(level => ({
    value: level.id,
    label: level.name,
    color: level.color
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

  const holdColorOptions = holdColors.map(hc => ({
    value: hc.id,
    label: hc.name,
    color: hc.color,
  }));

  const formatHoldColorOptionLabel = (option: { value: number; label: string; color: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: option.color,
          flexShrink: 0,
        }}
      />
      <span>{option.label}</span>
    </div>
  );

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
        instanceId={difficultySelectId}
        name="difficulty"
        isSearchable={false}
        value={difficultyOptions.find(option => option.value === track.difficultyLevelId)}
        onChange={option => handleDifficultyChange(option)}
        options={difficultyOptions}
        classNames={customSelectClassName}
        unstyled={true}
        placeholder="Select a difficulty"
        formatOptionLabel={formatDifficultyOptionLabel}
        required
      />
      <Select
        instanceId={holdColorSelectId}
        name="holdColorId"
        isSearchable={false}
        value={holdColorOptions.find(option => option.value === track.holdColorId) ?? null}
        onChange={option => handleInputChange('holdColorId', option?.value ?? null)}
        options={holdColorOptions}
        classNames={customSelectClassName}
        unstyled={true}
        placeholder="Select a hold color"
        formatOptionLabel={formatHoldColorOptionLabel}
      />
      <Select
        instanceId={zoneSelectId}
        name="zoneId"
        isSearchable={false}
        value={zoneOptions.find(option => option.value === track.zoneId)}
        onChange={option => handleInputChange('zoneId', option?.value)}
        options={zoneOptions}
        classNames={customSelectClassName}
        unstyled={true}
        placeholder="Select a zone"
        required
      />
      {!!track.zoneId && (
        <div className="flex justify-center sm:justify-start items-center p-2 mb-3">
          <Zone
            miniMapUrl={
              zones
                ? zones.find(z => z.id === track.zoneId)?.miniMapUrl
                : initialTrack?.zoneRef?.miniMapUrl
            }
            zoneName={zones ? zones.find(z => z.id === track.zoneId)?.name : initialTrack?.zoneRef?.name}
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

      <Button type="submit" className="py-2" btnType='secondary'
      disabled={isLoading || !isFormValid()}>Submit</Button>

      {!isLoading && newTrack && (
        <Button className="py-2" btnType='primary'
          onClick={() => router.push(`/${locationSlug}/tracks/track/${newTrack.id}`)}>View new block
        </Button>
      )}

    </form>
  );

}

export default TrackForm;
