'use client';
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Button } from "../ui/Button";
import Loader from "../ui/Loader";
import { CldImage } from "next-cloudinary";
import { ContestActivity } from "@/domain/ContestActivity.schema";
import Popin from "../ui/Popin";

type ActivityFormProps = {
  isOpen: boolean;
  activity: ContestActivity | null;
  onConfirm: (formData: Omit<ContestActivity, 'contestId'>, imageFile: File | null) => void;
  onCancel: () => void;
  error?: string;
  isLoading: boolean;
  loadingMessage?: string;
};

const ActivityForm: React.FC<ActivityFormProps> = ({ 
  isOpen, 
  onCancel, 
  onConfirm, 
  error, 
  isLoading,
  loadingMessage,
  activity
}) => {
  const [formData, setFormData] = useState<Omit<ContestActivity, 'contestId'>>({
    id: activity?.id ?? 0,
    name: activity?.name ?? '',
    description: activity?.description ?? '',
    image: activity?.image ?? '',
  });

  useEffect(() => {
    if (activity) {
      setFormData({
        id: activity.id,
        name: activity.name,
        description: activity.description ?? '',
        image: activity.image ?? '',
      });
    } else {
      setFormData({
        id: 0,
        name: '',
        description: '',
        image: '',
      });
    }
  }, [activity]);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImageFile(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(formData, imageFile);
  };

  return (
    <Popin isOpen={isOpen} onClose={onCancel} title={activity ? 'Edit Activity' : 'Create Activity'}>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Activity Name"
          className="p-2 text-black dark:text-white bg-gray-200 dark:bg-gray-800 rounded-md border border-gray-800 dark:border-gray-600"
          required
        />
        
        <textarea
          name="description"
          value={formData.description ?? ''}
          onChange={handleChange}
          placeholder="Activity Description"
          className="p-2 text-black dark:text-white bg-gray-200 dark:bg-gray-800 rounded-md border border-gray-800 dark:border-gray-600 min-h-[100px]"
        />

        <input
          ref={fileInputRef}
          type="file"
          name="image"
          onChange={handleFileChange}
          accept="image/*"
          className="w-full p-2 text-black dark:text-white bg-transparent
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-100 file:text-violet-700 hover:file:bg-violet-100
            dark:file:bg-slate-800 dark:file:text-violet-300 dark:hover:file:bg-slate-950"
        />

        <div className="flex flex-wrap gap-4">
          {activity?.image && !imageFile && (
            <div className="relative w-32 h-32">
              <CldImage
                width={400}
                height={400}
                src={activity.image}
                alt="Current Activity Image"
                className="mx-auto rounded-lg object-cover"
              />
              <p className="text-sm text-gray-500 mt-1 text-center">Current image</p>
            </div>
          )}

          {imageFile && (
            <div className="relative w-32 h-32">
              <CldImage
                width={400}
                height={400}
                src={URL.createObjectURL(imageFile)}
                alt="New Activity Image Preview"
                className="mx-auto rounded-lg object-cover"
              />
              <p className="text-sm text-gray-500 mt-1 text-center">New image</p>
            </div>
          )}
        </div>

        <Loader isLoading={isLoading} text={loadingMessage ?? "Creating activity..."} />
        
        {error && (
          <p className="text-red-500">Error: {error}</p>
        )}

        <div className="flex justify-end space-x-2">
        <Button 
            btnStyle="secondary"
            type="submit" 
            disabled={isLoading}
          >
            {activity ? 'Save' : 'Create'}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Popin>
  );
};

export default ActivityForm; 