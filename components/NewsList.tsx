'use client'
import { News } from "@/domain/News.schema";
import { useFetchNews } from "@/lib/useFetchNews";
import { useEffect, useState } from "react";


function NewsList() {

  const { fetchNews, isLoading, error } = useFetchNews();
  const [newsList, setNewsList] = useState<News[]>([]);

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
    <div className="space-y-4 w-full max-w-3xl flex justify-center">
      {newsList.map((news: News) => (
        <div key={news.id} className="mb-4 w-full bg-gradient-to-r from-slate-300 to-slate-200 dark:from-gray-700 dark:to-gray-900 border border-gray-600 rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-bold">{news.title}</h2>
          <p>{news.content}</p>
          <p className="text-sm text-gray-500">{new Date(news.date).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default NewsList;