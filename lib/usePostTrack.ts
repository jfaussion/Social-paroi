import { useState } from "react";
import { postNewTrack } from "./actions";
import { Track } from "@/domain/Track.schema";

export const usePostTracks = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function postTrack(track: Track, photo: any): Promise<Track | null> {
    setIsLoading(true);
    setError(null);
    console.log('postTrack track:', track);
    try {
      const formData = new FormData();
      formData.append('photo', photo);
      formData.append('name', track.name);
      formData.append('level', track.level);
      formData.append('holdColor', track.holdColor);
      formData.append('zone', track.zone.toString());
      formData.append('points', track.points.toString());
      formData.append('date', track.date.toString());
      formData.append('removed', track.removed.toString());

      const newTrack = await postNewTrack(formData) as Track;
      setIsLoading(false);
      return newTrack;
    } catch (err) {
      setError('An error occurred while posting the new tracks');
      setIsLoading(false);
      return null;
    }
  };

  return { postTrack, isLoading, error };
};