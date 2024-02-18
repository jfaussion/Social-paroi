import { sql } from "@vercel/postgres";
import ClimbingTrackCard from "../../components/climbingTrack-card";
import { Track, TrackSchema } from "../../domain/TrackSchema";

export default async function Tracks(): Promise<JSX.Element> {
  const { rows } = await sql`SELECT * from climbing_track order by date desc`;
  let trackList: Track[] = rows.map((row: any) => TrackSchema.parse(row));

  return (
    <div className="space-y-4">
        {(trackList).map((track) => (
          <ClimbingTrackCard key={track.id} {...track} ></ClimbingTrackCard>
        ))}
      </div>
  );
}