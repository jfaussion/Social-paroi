import TrackForm from "@/components/tracks/TrackForm";
import { getLocationBySlug } from "@/lib/locations/actions/getLocationBySlug";
import { getZonesByLocation } from "@/lib/locations/actions/getZonesByLocation";
import { notFound } from "next/navigation";

export default async function OpenerPage({
  params,
}: {
  params: Promise<{ locationSlug: string }>;
}) {
  const { locationSlug } = await params;
  const location = await getLocationBySlug(locationSlug);
  if (!location) notFound();

  const zones = await getZonesByLocation(location.id);

  return (
    <div className="w-full max-w-2xl items-center ">
      <div className="flex flex-col items-center">
        <span className="text-xl font-semibold w-full p-4 pt-0">
          Create a new block
        </span>
        <TrackForm zones={zones} locationId={location.id} />
      </div>
    </div>
  );
}
