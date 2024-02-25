'use server';
import { signIn } from '@/auth';
import { Track, TrackSchema } from '@/domain/TrackSchema';
import { sql } from '@vercel/postgres';
import { AuthError } from 'next-auth';


export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    console.log('formData', formData);
    await signIn('github', formData); // TODO: change to use the github provider
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

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
    console.log('Error updating the track for user', err)
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
  let trackList: Track[] = rows.map((row: any) => TrackSchema.parse(row));
  return trackList;
}