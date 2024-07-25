'use client'
import { News } from "@/domain/News.schema";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { useSession } from "next-auth/react";
import { usePostNews } from "@/lib/news/hooks/usePostNews";
import ConfirmationDialog from "../ui/ConfirmDialog";
import { useDeleteNews } from "@/lib/news/hooks/useDeleteNews";
import NewsCard from "./NewsCard";
import { useFetchNews } from "@/lib/news/hooks/useFetchNews";
import { NewsPlaceHolder } from "./NewsPlacehorlder";
import { NewsForm } from "./NewsForm";
import { isOpener } from "@/utils/session.utils";


function NewsList() {

  const { fetchNews, isLoading, error } = useFetchNews();
  const [newsList, setNewsList] = useState<News[]>([]);
  const [hasLoadedDateOnce, setHasLoadedDateOnce] = useState<boolean>(false); // Pour éviter l'effet de clignotement à l'ouverture de la page
  const session = useSession();  
  const [isPopinOpen, setPopinOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);  

  const {isLoading: isPostLoading, error: errorPosting, postNewsData} = usePostNews();
  const {isLoading: isLoadingDelete, error: errorDelete, deleteNews, reset: resetDeleteConrfimation} = useDeleteNews();

  const handleCreateNews = () => {
    setSelectedNews(null);
    setPopinOpen(true);
  }

  const handleEditNews = (news : News) => {
    setSelectedNews(news);
    setPopinOpen(true);
  }

  const handleDeleteNews = (news : News) => {
    resetDeleteConrfimation();
    setSelectedNews(news);
    setDeleteDialogOpen(true);
  }

  const deleteNewsAndRefresh = async () => {
    const {success} = await deleteNews(selectedNews?.id ?? 0);
    if (success) {
      setDeleteDialogOpen(false);
      setNewsList(newsList.filter(news => news.id !== selectedNews?.id));
    }
  }

  const postNews = async (news: News) =>  {
    const uploadedNews = await postNewsData(news);
    if (uploadedNews) {
      setPopinOpen(false);
      setNewsList([...newsList, uploadedNews]);
    }
  }

  useEffect(() => {
    const fetch = async () => {
      const news = await fetchNews();
      setHasLoadedDateOnce(true);
      setNewsList(news);
    };
    fetch();
  }, []);

  if (error && !isLoading) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!hasLoadedDateOnce || isLoading) {
    return <div className="w-full space-y-4">
      <NewsPlaceHolder />
      <NewsPlaceHolder />
      <NewsPlaceHolder />
      </div>;
  }

  if (newsList.length === 0) {
    return <p>Nothing new today...</p>;
  }

  return (
    <div className="space-y-4 w-full max-w-3xl flex flex-col items-center">
      {newsList.map((news: News) => (
        <NewsCard key={news.id} news={news} editNews={handleEditNews} deleteNews={handleDeleteNews}/>
      ))}
      {isOpener(session.data) && (
        <Button 
          onClick={handleCreateNews} 
          className="w-full sm:w-auto"
          btnStyle="secondary">
          Post News
        </Button>
      )}
      <NewsForm 
        isOpen={isPopinOpen} 
        onCancel={() => setPopinOpen(false)}
        onConfirm={postNews} 
        news={selectedNews}
        isLoading={isPostLoading}
        error={errorPosting ?? undefined}/>
      <ConfirmationDialog isOpen={isDeleteDialogOpen} title='Delete news' 
        text='Are you sure you want to delete this news ?'
        onCancel={() => setDeleteDialogOpen(false)} onConfirm={deleteNewsAndRefresh}
        error={errorDelete ?? undefined} isLoading={isLoadingDelete}/>
    </div>
  );
};

export default NewsList;