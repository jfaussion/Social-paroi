import TrackForm from "@/components/tracks/TrackForm";

export default function OpenerPage() {

  return (
    <div className="w-full max-w-2xl items-center ">
      <div className="flex flex-col items-center">
        <span className="text-xl font-semibold w-full p-4 pt-0">
          Create a new block
        </span>
        <TrackForm />
      </div>
    </div>
  );
}