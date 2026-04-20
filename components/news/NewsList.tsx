'use client'
import { News } from "@/domain/News.schema";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { usePostNews } from "@/lib/news/hooks/usePostNews";
import ConfirmationDialog from "../ui/ConfirmDialog";
import { useDeleteNews } from "@/lib/news/hooks/useDeleteNews";
import NewsCard from "./NewsCard";
import { useFetchNews } from "@/lib/news/hooks/useFetchNews";
import { NewsPlaceHolder } from "./NewsPlacehorlder";
import { NewsForm } from "./NewsForm";


function NewsList({ locationId, isOpener }: { locationId: number; isOpener: boolean }) {

  const { fetchNews, isLoading, error } = useFetchNews();
  const [newsList, setNewsList] = useState<News[]>([]);
  const [hasLoadedDateOnce, setHasLoadedDateOnce] = useState<boolean>(false); // Pour éviter l'effet de clignotement à l'ouverture de la page
  const [isPopinOpen, setIsPopinOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);

  const {isLoading: isPostLoading, error: errorPosting, postNewsData} = usePostNews();
  const {isLoading: isLoadingDelete, error: errorDelete, deleteNews, reset: resetDeleteConrfimation} = useDeleteNews();

  const handleCreateNews = () => {
    setSelectedNews(null);
    setIsPopinOpen(true);
  }

  const handleEditNews = (news : News) => {
    setSelectedNews(news);
    setIsPopinOpen(true);
  }

  const handleDeleteNews = (news : News) => {
    resetDeleteConrfimation();
    setSelectedNews(news);
    setIsDeleteDialogOpen(true);
  }

  const deleteNewsAndRefresh = async () => {
    const {success} = await deleteNews(selectedNews?.id ?? 0, locationId);
    if (success) {
      setIsDeleteDialogOpen(false);
      setNewsList(newsList.filter(news => news.id !== selectedNews?.id));
    }
  }

  const postNews = async (news: News) =>  {
    const uploadedNews = await postNewsData(news, locationId);
    if (uploadedNews) {
      setIsPopinOpen(false);
      setNewsList([...newsList, uploadedNews]);
    }
  }

  useEffect(() => {
    const fetch = async () => {
      const news = await fetchNews(locationId);
      setHasLoadedDateOnce(true);
      setNewsList(news);
    };
    fetch();
  }, [locationId]);

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

  return (
    <div className="space-y-4 w-full max-w-3xl flex flex-col items-center">
      {newsList.length === 0 && <p>Nothing new today...</p>}
      {newsList.map((news: News) => (
        <NewsCard key={news.id} news={news} isOpener={isOpener} editNews={handleEditNews} deleteNews={handleDeleteNews}/>
      ))}
      {isOpener && (
        <Button
          onClick={handleCreateNews}
          className="w-full sm:w-auto"
          btnType="secondary">
          Post News
        </Button>
      )}
      <NewsForm
        isOpen={isPopinOpen}
        onCancel={() => setIsPopinOpen(false)}
        onConfirm={postNews}
        news={selectedNews}
        isLoading={isPostLoading}
        error={errorPosting ?? undefined}/>
      <ConfirmationDialog isOpen={isDeleteDialogOpen} title='Delete news'
        text='Are you sure you want to delete this news ?'
        onCancel={() => setIsDeleteDialogOpen(false)} onConfirm={deleteNewsAndRefresh}
        error={errorDelete ?? undefined} isLoading={isLoadingDelete}/>
    </div>
  );
};

export default NewsList;