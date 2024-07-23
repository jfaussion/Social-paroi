import React, { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import Popin from '../ui/Popin';
import { News } from '@/domain/News.schema';
import Loader from '../ui/Loader';


type ConfirmProps = {
  isOpen: boolean;
  news: News | null;
  onConfirm: (formData: News) => void;
  onCancel: () => void;
  error?: string;
  isLoading: boolean;
};

const NewsForm: React.FC<ConfirmProps> = ({ isOpen, news, onCancel, onConfirm, error, isLoading }) => {

  const [formData, setFormData] = useState(
      {
        id: news?.id,
        title: news?.title ?? '',
        content: news?.content ?? ''
      }
    );

  useEffect(() => {
    if (news) {
      setFormData({...news});
    } else {
      setFormData({
        id: undefined,
        title: '',
        content: ''
      });
    }
  }, [news]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value } as News));
  };

  return (
    <Popin isOpen={isOpen} onClose={onCancel} title="Post News">
      <form onSubmit={() => onConfirm(formData as News)} className="flex flex-col space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="p-2 border border-gray-500 rounded dark:bg-gray-800"
          required
        />
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Content"
          className="p-2 border border-gray-500 rounded dark:bg-gray-800 resize-y"
          rows={4}
          required
        />
        <Loader isLoading={isLoading} text="Posting news..." />
        {error && <p className="text-red-500">Error: {error}</p>}

        <Button type="submit">
          Submit
        </Button>
      </form>
    </Popin>
  );
};

export default NewsForm;