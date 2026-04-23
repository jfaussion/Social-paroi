import { useState } from "react";
import { Track } from "@/domain/Track.schema";
import { postNewTrack } from "../actions/postTrack";
import { deletePreviousTrackImage } from "../actions/deletePreviousTrackImage";
import { compressImage, directUploadToCloudinary } from "@/utils/clientUpload";

export const usePostTracks = (locationId: number) => {
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
      if (track.holdColorId != null) {
        formData.append('holdColorId', track.holdColorId?.toString());
      }
      formData.append('zoneId', track.zoneId?.toString() ?? '');
      formData.append('points', track.points.toString());
      formData.append('removed', track.removed.toString());
      if (track.difficultyLevelId) {
        formData.append('difficultyLevelId', track.difficultyLevelId.toString());
      }
      // direct upload flow (client -> Cloudinary)
      if (photo) {
        setLoadingMessage('Compressing image...');
        const compressed = await compressImage(photo, { maxWidth: 1600, quality: 0.8, type: 'image/webp' });
        setLoadingMessage('Uploading image...');
        const result = await directUploadToCloudinary(compressed, 'Tracks', locationId);
        // result.publicId is what backend expects (we store public_id)
        // send oldImageUrl for deletion if present
        const oldImageUrl = track.imageUrl?.toString() ?? '';
        const imageUrl = result.publicId;
        const imageForm = new FormData();
        imageForm.append('imageUrl', imageUrl);
        if (oldImageUrl) imageForm.append('oldImageUrl', oldImageUrl);
        imageForm.append('locationId', locationId.toString());
        await deletePreviousTrackImage(imageForm);
        formData.set('imageUrl', imageUrl);
      }
      setLoadingMessage('Posting block...');
      const prismaTrack = await postNewTrack(track.id, formData, locationId);
      if (!prismaTrack) return null;
      return prismaTrack as unknown as Track;
    } catch (err) {
      setError('An error occurred while posting the new block');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { postTrack, isLoading, error, loadingMessage };
};
