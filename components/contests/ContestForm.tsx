'use client'
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Button } from "../ui/Button";
import Loader from "../ui/Loader";
import { Contest } from "@/domain/Contest.schema";
import { usePostContest } from "@/lib/contests/hooks/usePostContest";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";

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
    id: contest?.id || 0,
    name: contest?.name || '',
    date: contest?.date || new Date(),
    coverImage: contest?.coverImage || '',
  });

  const [coverImageFile, setCoverImageFile] = useState<File | null>(null); // State for the cover image file
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { postContest, isLoading: isPosting, error: postError } = usePostContest();

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
      setCoverImageFile(files[0]); // Set the cover image file
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const uploadedContest = await postContest(formData, coverImageFile); // Pass the cover image file
    if (uploadedContest) {
      onConfirm(uploadedContest, coverImageFile); // Pass the uploaded contest and cover image file
      router.push(`/dashboard/contest/${uploadedContest.id}`);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">{contest ? 'Edit Contest' : 'Create Contest'}</h2>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Contest Name"
              className="p-2 border border-gray-500 rounded"
              required
            />
            <input
              type="date"
              name="date"
              value={formData.date.toISOString().split('T')[0]} // Convert Date to string in YYYY-MM-DD format
              onChange={handleChange}
              className="p-2 border border-gray-500 rounded"
              required
            />
            <input
              ref={fileInputRef}
              type="file"
              name="coverImage"
              onChange={handleFileChange}
              className="p-2 border border-gray-500 rounded"
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
            <Loader isLoading={isLoading || isPosting} text="Submitting..." />
            {error && <p className="text-red-500">Error: {error}</p>}
            {postError && <p className="text-red-500">Error: {postError}</p>}
            <Button type="submit" disabled={isLoading || isPosting}>
              Submit
            </Button>
            <Button type="button" onClick={onCancel}>
              Cancel
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContestForm;