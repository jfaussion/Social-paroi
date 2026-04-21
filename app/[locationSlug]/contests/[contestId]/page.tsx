import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import Image from 'next/image';
import placeholderImage from "@/public/bouldering-placeholder.jpeg";
import ContestDetails from "@/components/contests/ContestDetails";
import { redirect } from "next/navigation";
import { getContestDetails } from "@/lib/contests/actions/getContestDetails";
import { checkUserLocationRole } from "@/lib/locations/actions/checkUserLocationRole";
import { LocationRole } from "@/domain/LocationRole.enum";

export const dynamic = 'force-dynamic';

export default async function ContestDetailsPage({ params }: { params: { locationSlug: string; contestId: string } }) {
  const session = await auth();
  const userId = session?.user?.id ?? "";
  const contest = await getContestDetails(parseInt(params.contestId), userId);

  if (!contest) {
    console.log('No contest found, redirecting to contests list');
    redirect(`/${params.locationSlug}/contests`);
  }

  const isOpener = userId
    ? await checkUserLocationRole(userId, contest?.locationId ?? 0, LocationRole.opener)
    : false;

  return (
    <SessionProvider session={session}>
      {contest ? (
        <ContestDetails key={contest.id} {...contest} isOpener={isOpener} />
      ) : (
        <div>
          <h1>Contest not found</h1>
          <Image src={placeholderImage} alt="Contest - place holder" fill sizes='(max-width: 200px)' />
        </div>
      )}
    </SessionProvider>
  );
}