import { useState } from "react";
import { postNewTrack, postPhoto } from "./actions";
import { Track } from "@/domain/Track.schema";

export const usePostTracks = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function postTrack(track: Track, photo: any): Promise<Track | null> {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('id', track.id?.toString());
      formData.append('name', track.name);
      formData.append('date', track.date.toString());
      formData.append('imageUrl', track.imageUrl?.toString() ?? '');
      formData.append('holdColor', track.holdColor);
      formData.append('level', track.level);
      formData.append('zone', track.zone.toString());
      formData.append('points', track.points.toString());
      formData.append('removed', track.removed.toString());
      formData.append('photo', photo);

      if (photo) {
        setLoadingMessage('Uploading image...');
        const photoUrl = await postPhoto(formData);
        formData.set('imageUrl', photoUrl);
      }
      setLoadingMessage('Posting block...');
      const newTrack = await postNewTrack(track.id, formData) as Track;
      setIsLoading(false);
      return newTrack;
    } catch (err) {
      setError('An error occurred while posting the new block');
      setIsLoading(false);
      return null;
    }
  };

  return { postTrack, isLoading, error, loadingMessage };
};