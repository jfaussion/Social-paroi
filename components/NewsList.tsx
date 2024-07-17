'use client'
import { News } from "@/domain/News.schema";
import { useFetchNews } from "@/lib/useFetchNews";
import { useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { useSession } from "next-auth/react";
import { isAdmin } from "@/utils/session.utils";
import NewsForm from "./NewsForm";
import { usePostNews } from "@/lib/usePostNews";


function NewsList() {

  const { fetchNews, isLoading, error } = useFetchNews();
  const [newsList, setNewsList] = useState<News[]>([]);
  const session = useSession();  
  const [isPopinOpen, setPopinOpen] = useState(false);
  
  const {isLoading: isPostLoading, error: errorPosting, postNewsData} = usePostNews();

  const handleCreateNews = () => {
    setPopinOpen(true);
  }
  const postNews = (news: News) =>  {
    postNewsData(news);
    setPopinOpen(false);
  }

  useEffect(() => {
    const fetch = async () => {
      const news = await fetchNews();
      setNewsList(news);
    };
    fetch();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!newsList || newsList.length === 0) {
    return <p>Nothing new today...</p>;
  }

  return (
    <div className="space-y-4 w-full max-w-3xl flex flex-col items-center">
      {newsList.map((news: News) => (
        <div key={news.id} className="w-full bg-gradient-to-r from-slate-300 to-slate-200 dark:from-gray-700 dark:to-gray-900 border border-gray-600 rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-bold">{news.title}</h2>
          <pre className="whitespace-pre-wrap font-normal font-sans">{news.content}</pre>
          <p className="text-sm text-gray-500">{new Date(news.date).toLocaleDateString()}</p>
        </div>
      ))}
      {isAdmin(session.data) && (
        <Button 
          onClick={handleCreateNews} 
          className="mb-4 p-2 w-full sm:w-auto bg-blue-500 text-white rounded">
          Post News
        </Button>
      )}
      <NewsForm 
        isOpen={isPopinOpen} 
        onCancel={() => setPopinOpen(false)} 
        onConfirm={postNews} 
        news={null}></NewsForm>
    </div>
  );
};

export default NewsList;