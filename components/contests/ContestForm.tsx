'use client'
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Button } from "../ui/Button";
import Loader from "../ui/Loader";
import { Contest } from "@/domain/Contest.schema";
import { CldImage } from "next-cloudinary";
import Popin from "../ui/Popin";
import { ContestStatusEnum } from "@/domain/ContestStatus.enum";

type ContestFormProps = {
  isOpen: boolean;
  contest: Contest | null;
  onConfirm: (formData: Contest, coverImage: File | null) => void;
  onCancel: () => void;
  error?: string;
  isLoading: boolean;
};

const ContestForm: React.FC<ContestFormProps> = ({ isOpen, contest, onCancel, onConfirm, error, isLoading }) => {
  const [formData, setFormData] = useState<Contest>({
    id: contest?.id ?? 0,
    name: contest?.name ?? '',
    date: contest?.date ?? new Date(),
    coverImage: contest?.coverImage ?? '',
    status: contest?.status ?? ContestStatusEnum.Enum.Created,
    users: contest?.users ?? [],
    activities: contest?.activities ?? [],
    tracks: contest?.tracks ?? [],
  });

  const [coverImageFile, setCoverImageFile] = useState<File | null>(null); // State for the cover image file
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (contest) {
      setFormData({ ...contest });
      setCoverImageFile(null); // Reset cover image file when contest is loaded
    } else {
      setFormData({
        id: 0,
        name: '',
        date: new Date(),
        coverImage: '',
        users: [],
        activities: [],
        tracks: [],
        status: ContestStatusEnum.Enum.Created,
      });
    }
  }, [contest]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'date' ? new Date(value) : value,
    } as Contest));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setCoverImageFile(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(formData, coverImageFile);
  };

  return (
    <Popin isOpen={isOpen} onClose={onCancel} title={contest ? 'Edit Contest' : 'Create Contest'}>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Contest Name"
          className="p-2 text-black dark:text-white bg-gray-200 dark:bg-gray-800 rounded-md border border-gray-800 dark:border-gray-600"
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date.toISOString().split('T')[0]} // Convert Date to string in YYYY-MM-DD format
          onChange={handleChange}
          className="p-2 text-black dark:text-white bg-gray-200 dark:bg-gray-800 rounded-md border border-gray-800 dark:border-gray-600"
          required
        />
        <input
          ref={fileInputRef}
          type="file"
          name="coverImage"
          onChange={handleFileChange}
          className="w-full p-2 text-black dark:text-white bg-transparent
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-100 file:text-violet-700 hover:file:bg-violet-100
            dark:file:bg-slate-800 dark:file:text-violet-300 dark:hover:file:bg-slate-950"
        />
        {coverImageFile && ( // Use coverImageFile for preview
          <div className="relative w-32 h-32">
            <CldImage
              width={400}
              height={400}
              src={URL.createObjectURL(coverImageFile)}
              alt="Contest Cover Preview"
              className="mx-auto"
            />
          </div>
        )}
        <Loader isLoading={isLoading} text="Submitting..." />
        {error && <p className="text-red-500">Error: {error}</p>}
        <Button type="submit" disabled={isLoading}>
          Submit
        </Button>
      </form>
    </Popin>
  );
};

export default ContestForm;