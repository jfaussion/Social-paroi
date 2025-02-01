"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import { Track } from "../../domain/Track.schema";
import placeholderImage from "@/public/bouldering-placeholder.jpeg";
import { useRouter } from "next/navigation";
import ToggleButton from "../ui/ToggleButton";
import RemovedLabel from "../ui/RemovedLabel";
import { getBorderColorForDifficulty } from "@/utils/difficulty.utils";
import { Zone } from "../Zone";
import { TrackStatusHandler } from "@/domain/TrackStatusHandler.type";

interface TrackCardProps extends Track {
  statusHandler?: TrackStatusHandler;
  disableNavigation?: boolean;
  hideToggleButton?: boolean;
}

const TrackCard: React.FC<TrackCardProps> = ({
  statusHandler,
  disableNavigation = false,
  hideToggleButton = false,
  ...propTrack
}) => {
  const [track, setTrack] = useState<Track>(propTrack);
  const levelBorderColor = getBorderColorForDifficulty(track.level);
  const router = useRouter();
  const prevPropTrackRef = useRef<Track | null>(propTrack);

  useEffect(() => {
    if (hasTrackChanged(propTrack, prevPropTrackRef.current)) {
      setTrack(propTrack);
      prevPropTrackRef.current = propTrack;
    }
  }, [propTrack]);

  const hasTrackChanged = (newTrack: Track, prevTrack: Track | null) => {
    return Object.keys(newTrack).some(
      (key) => newTrack[key as keyof Track] !== prevTrack?.[key as keyof Track]
    );
  };

  const openTrackDetails = () => {
    if (disableNavigation) return;
    router.push(`/dashboard/track/${track.id}`);
  };

  return (
    <div
      onClick={openTrackDetails}
      className={`flex items-stretch bg-gradient-to-r from-slate-300 to-slate-200 dark:from-gray-700 dark:to-gray-900 border border-gray-600 rounded-lg shadow-lg overflow-hidden ${
        !disableNavigation ? "cursor-pointer" : ""
      }`}
    >
      {/* Left side - Large Image */}
      <div className="w-1/3 relative">
        {track.imageUrl?.split(" ")[0] ? (
          <CldImage
            width="600"
            height="600"
            src={track.imageUrl?.split(" ")[0]}
            crop="fill"
            improve="indoor"
            gravity="center"
            alt="Climbing Track"
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            src={placeholderImage}
            alt="Climbing Track - place holder"
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Right side - Content */}
      <div className={`w-2/3 flex flex-col justify-between p-4 border-r-8 ${levelBorderColor}`}>
        <h4 className="text-md font-semibold dark:text-white">{track.name}</h4>

        <div className="flex justify-between items-center mt-2">
          <div className="inline-flex items-center space-x-2">
            <Zone zone={track.zone} width={60} height={50} />
            {track.removed && <RemovedLabel />}
          </div>
          {statusHandler && !hideToggleButton && (
            <span onClick={(e) => e.stopPropagation()}>
              <ToggleButton
                isActive={statusHandler.isCompleted}
                isDisabled={statusHandler.isDisabled ?? false}
                onChange={statusHandler.onStatusChange}
                style="small"
              />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
