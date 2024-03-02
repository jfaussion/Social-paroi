'use server';
import { Track, TrackSchema } from '@/domain/TrackSchema';
import { sql } from '@vercel/postgres';


export async function updateTrackStatusForUser(
  trackId: number,
  userId: number,
  newStatus: Track['status'],
) {
  try {
    await sql`
        INSERT INTO user_track_progress (user_id, track_id, status)
        VALUES (${userId}, ${trackId}, ${newStatus})
        ON CONFLICT (user_id, track_id)
        DO UPDATE SET status = EXCLUDED.status
        `;
    return true;
  } catch (err) {
    console.error('Error updating the track for user', err)
    return false;
  }
};

export async function getAllTracksForUser(
  userId: number,
) {
  const { rows } = await sql`
    SELECT
      t.id,
      t.name,
      t.date,
      t.level,
      t."imageUrl",
      t."holdColor",
      utp.status,
      utp.date_completed
    FROM
      tracks t
    LEFT JOIN user_track_progress utp ON t.id = utp.track_id AND utp.user_id = ${userId}
    ORDER BY
      t.date desc;
    `
    try{
      let trackList: Track[] = rows.map((row: any) => TrackSchema.parse(row));
      return trackList;
    } catch (err) {
      console.error('Error parsing tracks', err)
      return [];
    }
}

export async function getTrackDetails(
  trackId: number,
  userId: number,
): Promise<Track | undefined> {
  console.log('trackId', trackId, "userId", userId);

  const { rows } = await sql`
    SELECT
      t.id,
      t.name,
      t.date,
      t.level,
      t."imageUrl",
      t."holdColor",
      utp.status,
      utp.date_completed
    FROM
      tracks t
    LEFT JOIN user_track_progress utp ON t.id = utp.track_id AND utp.user_id = ${userId}
    WHERE t.id = ${trackId}
    ORDER BY
      t.date desc;
    `
    try{
      console.log(rows);
      let track: Track = rows.map((row: any) => TrackSchema.parse(row))[0];
      // TODO redirect to error page if track is undefined : 404 ?
      return track;
    } catch (err) {
      console.error('Error parsing tracks', err)
      return undefined;
    }
}